const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol") || "BTCUSDT";

/* ===== Названия монет ===== */
const names = {
    BTCUSDT: "Bitcoin",
    ETHUSDT: "Ethereum",
    BNBUSDT: "BNB",
    XRPUSDT: "XRP",
    ADAUSDT: "Cardano",
    DOGEUSDT: "Dogecoin",
    TRXUSDT: "TRON",
    BCHUSDT: "Bitcoin Cash",
    WBTCUSDT: "Wrapped Bitcoin"
};

/* ===== Заголовок ===== */
const coinName = names[symbol] || symbol.replace("USDT", "");

document.getElementById("title").textContent =
    `${coinName} Market`;

/* ===== График ===== */
let chart;
let currentInterval = "1h";

async function loadChart(interval = "1h") {
    currentInterval = interval;

    const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
    );

    const data = await res.json();

    const series = data.map(candle => ({
        x: new Date(candle[0]),
        y: [
            parseFloat(candle[1]), // open
            parseFloat(candle[2]), // high
            parseFloat(candle[3]), // low
            parseFloat(candle[4])  // close
        ]
    }));

    if (chart) chart.destroy();

    chart = new ApexCharts(document.querySelector("#chart"), {
        chart: {
            type: "candlestick",
            height: 500,
            background: "transparent"
        },
        theme: {
            mode: "dark"
        },
        series: [{
            data: series
        }],
        xaxis: {
            type: "datetime"
        }
    });

    chart.render();
}

/* ===== Цена + изменение ===== */
async function loadPrice() {
    const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const data = await res.json();

    const price = parseFloat(data.lastPrice).toFixed(2);
    const change = parseFloat(data.priceChangePercent).toFixed(2);

    // Цена
    document.getElementById("price").textContent = `$${price}`;

    // Изменение %
    const changeEl = document.getElementById("change");
    changeEl.textContent = (change >= 0 ? "+" : "") + change + "%";

    changeEl.className = "change " + (change >= 0 ? "up" : "down");
}

/* ===== Таймфреймы ===== */
document.querySelectorAll(".time-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
        document
            .querySelectorAll(".time-buttons button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        const interval = btn.getAttribute("data-interval");
        loadChart(interval);
    });
});

loadPrice();
setInterval(loadPrice, 5000);

loadChart();