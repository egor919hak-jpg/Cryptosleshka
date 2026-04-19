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
document.getElementById("title").textContent = `${coinName} Market`;

/* ===== Переменные ===== */
let chart;
let currentInterval = "1h";

/* ===== Загрузка графика ===== */
async function loadChart(interval = "1h") {
    currentInterval = interval;

    try {
        const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
        );

        const data = await res.json();

        const candleSeries = data.map(candle => ({
            x: new Date(candle[0]),
            y: [
                parseFloat(candle[1]), // open
                parseFloat(candle[2]), // high
                parseFloat(candle[3]), // low
                parseFloat(candle[4])  // close
            ]
        }));

        const volumeSeries = data.map(candle => ({
            x: new Date(candle[0]),
            y: parseFloat(candle[5])
        }));

        /* ===== если график уже есть → обновляем ===== */
        if (chart) {
            chart.updateSeries([
                { data: candleSeries },
                { data: volumeSeries }
            ]);
            return;
        }

        /* ===== создаём график ===== */
        chart = new ApexCharts(document.querySelector("#chart"), {
            chart: {
                type: "candlestick",
                height: 500,
                background: "transparent",
                toolbar: { show: false },
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 400
                }
            },

            theme: {
                mode: "dark"
            },

            series: [
                {
                    name: "Candles",
                    data: candleSeries
                },
                {
                    name: "Volume",
                    type: "bar",
                    data: volumeSeries
                }
            ],

            plotOptions: {
                candlestick: {
                    colors: {
                        upward: "#00b894",
                        downward: "#d63031"
                    }
                },
                bar: {
                    columnWidth: "60%"
                }
            },

            grid: {
                borderColor: "rgba(255,255,255,0.05)",
                strokeDashArray: 4
            },

            xaxis: {
                type: "datetime",
                labels: {
                    style: {
                        colors: "#aaa"
                    }
                },
                axisBorder: {
                    color: "rgba(255,255,255,0.1)"
                },
                crosshairs: {
                    show: true,
                    stroke: {
                        color: "#f0b90b",
                        width: 1,
                        dashArray: 3
                    }
                }
            },

            yaxis: [
                {
                    tooltip: { enabled: true },
                    labels: {
                        style: {
                            colors: "#aaa"
                        }
                    }
                },
                {
                    opposite: true,
                    seriesName: "Volume",
                    labels: {
                        show: false
                    }
                }
            ],

            tooltip: {
                theme: "dark"
            }
        });

        chart.render();

    } catch (err) {
        console.error("Ошибка загрузки графика:", err);
    }
}

/* ===== Цена + изменение ===== */
async function loadPrice() {
    try {
        const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );

        const data = await res.json();

        const price = parseFloat(data.lastPrice).toFixed(2);
        const change = parseFloat(data.priceChangePercent).toFixed(2);

        document.getElementById("price").textContent = `$${price}`;

        const changeEl = document.getElementById("change");
        changeEl.textContent = (change >= 0 ? "+" : "") + change + "%";
        changeEl.className = "change " + (change >= 0 ? "up" : "down");

    } catch (err) {
        console.error("Ошибка загрузки цены:", err);
    }
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

/* ===== Запуск ===== */
loadPrice();
loadChart();

setInterval(loadPrice, 5000);
setInterval(() => loadChart(currentInterval), 10000);
