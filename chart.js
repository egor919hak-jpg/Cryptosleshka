const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol") || "BTCUSDT";

document.getElementById("title").textContent = symbol + " Chart";

let chart;
let currentInterval = "1h";

async function loadChart(interval = "1h") {
    currentInterval = interval;

    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    const data = await res.json();

    const series = data.map(candle => ({
        x: new Date(candle[0]),
        y: [
            parseFloat(candle[1]),
            parseFloat(candle[2]),
            parseFloat(candle[3]),
            parseFloat(candle[4])
        ]
    }));

    if (chart) chart.destroy();

    chart = new ApexCharts(document.querySelector("#chart"), {
        chart: {
            type: 'candlestick',
            height: 500
        },
        series: [{ data: series }],
        theme: { mode: 'dark' }
    });

    chart.render();
}

async function getPrice() {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    const data = await res.json();

    const price = parseFloat(data.lastPrice).toFixed(2);
    const change = parseFloat(data.priceChangePercent).toFixed(2);

    document.getElementById("price").textContent = price + " USD";

    const changeEl = document.getElementById("change");
    changeEl.textContent = (change >= 0 ? "+" : "") + change + "%";

    changeEl.className = "change " + (change >= 0 ? "up" : "down");
}

getPrice()
setInterval(getPrice, 5000);
loadChart();

document.querySelectorAll(".time-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".time-buttons button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const interval = btn.getAttribute("data-interval");
        loadChart(interval);
    });
});