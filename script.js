document.addEventListener('DOMContentLoaded', () => {
    const coins = [
        { id: 'btc', symbol: 'BTCUSDT', priceId: 'price-btc', changeId: 'change-btc' },
        { id: 'eth', symbol: 'ETHUSDT', priceId: 'price-eth', changeId: 'change-eth' },
        { id: 'xrp', symbol: 'XRPUSDT', priceId: 'price-xrp', changeId: 'change-xrp' },
        { id: 'bnb', symbol: 'BNBUSDT', priceId: 'price-bnb', changeId: 'change-bnb'},
        { id: 'doge', symbol: 'DOGEUSDT', priceId: 'price-dog', changeId: 'change-dog'},
    ];

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
    
    loadAllPrices();
    setInterval(loadAllPrices, 5000);
});