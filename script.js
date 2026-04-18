document.addEventListener('DOMContentLoaded', () => {
    const coins = [
        { id: 'btc', symbol: 'BTCUSDT', priceId: 'price-btc', changeId: 'change-btc' },
        { id: 'eth', symbol: 'ETHUSDT', priceId: 'price-eth', changeId: 'change-eth' },
        { id: 'xrp', symbol: 'XRPUSDT', priceId: 'price-xrp', changeId: 'change-xrp' },
        { id: 'bnb', symbol: 'BNBUSDT', priceId: 'price-bnb', changeId: 'change-bnb'},
        { id: 'trx', symbol: 'TRXUSDT', priceId: 'price-trx', changeId: 'change-trx'},
        { id: 'doge', symbol: 'DOGEUSDT', priceId: 'price-dog', changeId: 'change-dog'},
        { id: 'bch', symbol: 'BCHUSDT', priceId: 'price-bch', changeId: 'change-bch'},
        { id: 'ada', symbol: 'ADAUSDT', priceId: 'price-ada', changeId: 'change-ada'},
        { id: 'wbtc', symbol: 'WBTCUSDT', priceId: 'price-wbtc', changeId: 'change-wbtc'},
    ];

    let chart;

    async function openChart(symbol) {
        const modal = document.querySelector('#chartModal');
        modal.style.display = 'block';

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=50`);
        const data = await res.json();

        const prices = data.map(candle => parseFloat(candle[4]));
        const labels = data.map((_, i) => i);

        const ctx = document.getElementById('chartCanvas').getContext('2d');

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
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
            const resPrice = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin.symbol}`);
            const dataPrice = await resPrice.json();
            const price = Number(dataPrice.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            const priceElement = document.getElementById(coin.priceId);
            if (priceElement) priceElement.textContent = price + ' USD';
            
            const res24h = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coin.symbol}`);
            const data24h = await res24h.json();
            const changePercent = Number(data24h.priceChangePercent).toFixed(2);
            
            const changeElement = document.getElementById(coin.changeId);
            if (changeElement) {
                changeElement.textContent = (changePercent >= 0 ? '+' : '') + changePercent + '%';
                changeElement.classList.remove('price-up', 'price-down');
                changeElement.classList.add(changePercent >= 0 ? 'price-up' : 'price-down');
            }
        } catch (err) {
            console.error(`Ошибка загрузки ${coin.id}:`, err);
            const priceElement = document.getElementById(coin.priceId);
            if (priceElement) priceElement.textContent = 'Error';
        }
    }
    
    async function loadAllPrices() {
        for (const coin of coins) {
            await loadCoinPrice(coin);
        }
    }

    document.querySelector('#closeModal').onclick = () => {
        document.querySelector('#chartModal').style.display = 'none';
    }

    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const symbol = coins[index].symbol;
            window.location.href = `chart.html?symbol=${symbol}`;
        })
    })
    
    loadAllPrices();
    setInterval(loadAllPrices, 5000);
});