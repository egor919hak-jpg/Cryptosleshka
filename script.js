document.addEventListener('DOMContentLoaded', () => {
  // переменные для цен
  const price_btc = document.querySelector('#price-btc');

  //переменные для изменения прибыли
  const change_btc = document.querySelector('#change-btc');

  async function loadBTCPrice() {
    try {
      const resPrice = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const dataPrice = await resPrice.json();
      const price = Number(dataPrice.price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      price_btc.textContent = price + ' USD';

      const res24h = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
      const data24h = await res24h.json();
      const changePercent = Number(data24h.priceChangePercent).toFixed(2);

      if (changePercent >= 0) {
        change_btc.textContent = '+' + changePercent + '%';
        change_btc.classList.add('price-up');
        change_btc.classList.remove('price-down');
      } else {
        change_btc.textContent = changePercent + '%';
        change_btc.classList.add('price-down');
        change_btc.classList.remove('price-up');
      }

    } catch (err) {
      console.error(err);
      price_btc.textContent = 'Error';
      change_btc.textContent = '';
    }
  }

  loadBTCPrice();
  setInterval(loadBTCPrice, 5000);
});