document.addEventListener('DOMContentLoaded', () => {
  // переменные для цен
  const price_btc = document.querySelector('#price-btc');

  async function loadBTCPrice() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const data = await res.json();

      const price = Number(data.price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      price_btc.textContent = price + ' USD';
    } catch (err) {
      console.error('Ошибка загрузки цены BTC:', err);
      price_btc.textContent = 'Error';
    }
  }

  loadBTCPrice();
  setInterval(loadBTCPrice, 5000);
});