document.addEventListener('DOMContentLoaded', () => {

    const coins = [
        { id: 'btc', symbol: 'BTCUSDT', priceId: 'price-btc', changeId: 'change-btc' },
        { id: 'eth', symbol: 'ETHUSDT', priceId: 'price-eth', changeId: 'change-eth' },
        { id: 'xrp', symbol: 'XRPUSDT', priceId: 'price-xrp', changeId: 'change-xrp' },
        { id: 'bnb', symbol: 'BNBUSDT', priceId: 'price-bnb', changeId: 'change-bnb' },
        { id: 'trx', symbol: 'TRXUSDT', priceId: 'price-trx', changeId: 'change-trx' },
        { id: 'doge', symbol: 'DOGEUSDT', priceId: 'price-dog', changeId: 'change-dog' },
        { id: 'bch', symbol: 'BCHUSDT', priceId: 'price-bch', changeId: 'change-bch' },
        { id: 'ada', symbol: 'ADAUSDT', priceId: 'price-ada', changeId: 'change-ada' },
        { id: 'wbtc', symbol: 'WBTCUSDT', priceId: 'price-wbtc', changeId: 'change-wbtc' },
    ];

    let chart;

    async function openChart(symbol) {
        const modal = document.querySelector('#chartModal');
        modal.style.display = 'block';

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=50`);
        const data = await res.json();

        const prices = data.map(c => parseFloat(c[4]));
        const labels = data.map((_, i) => i);

        const ctx = document.getElementById('chartCanvas').getContext('2d');

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: symbol,
                    data: prices,
                    borderWidth: 2
                }]
            }
        });
    }

    async function loadCoinPrice(coin) {
        try {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin.symbol}`);
            const data = await res.json();

            const price = Number(data.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const priceElement = document.getElementById(coin.priceId);
            if (priceElement) priceElement.textContent = price + ' USD';

            const res24 = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coin.symbol}`);
            const data24 = await res24.json();

            const change = Number(data24.priceChangePercent).toFixed(2);

            const changeElement = document.getElementById(coin.changeId);
            if (changeElement) {
                changeElement.textContent = (change >= 0 ? '+' : '') + change + '%';
                changeElement.classList.remove('price-up', 'price-down');
                changeElement.classList.add(change >= 0 ? 'price-up' : 'price-down');
            }

        } catch (err) {}
    }

    async function loadAllPrices() {
        for (const coin of coins) {
            await loadCoinPrice(coin);
        }
    }

    document.querySelector('#closeModal').onclick = () => {
        document.querySelector('#chartModal').style.display = 'none';
    };

    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const symbol = coins[index].symbol;
            window.location.href = `chart.html?symbol=${symbol}`;
        });
    });

    loadAllPrices();
    setInterval(loadAllPrices, 5000);

    let balance = parseFloat(localStorage.getItem('balance')) || 10000;
    let portfolio = JSON.parse(localStorage.getItem('portfolio')) || {};

    function showNotification(text, type = "info") {
        const toast = document.querySelector('#toast');

        toast.textContent = text;
        toast.classList.remove('success', 'error', 'info');
        toast.classList.add(type);
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();

            const coin = btn.getAttribute('data-coin');
            const symbol = coin + 'USDT';

            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
            const data = await res.json();

            const price = parseFloat(data.price);
            const qty = 0.01;
            const cost = qty * price;

            if (balance < cost) {
                showNotification("Not enough balance!", "error");
                return;
            }

            balance -= cost;
            localStorage.setItem('balance', balance);

            portfolio[symbol] = (portfolio[symbol] || 0) + qty;
            localStorage.setItem("portfolio", JSON.stringify(portfolio));

            showNotification(`Bought ${qty} ${coin}`, "success");
        });
    });

});