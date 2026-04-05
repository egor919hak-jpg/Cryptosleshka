document.addEventListener('DOMContentLoaded', () => {
  // переменные для цен
  let price_btc = document.querySelector('#price-btc');

  // переменные для вычитывания прибыли 
  let change_btc = document.querySelector('#change-btc');

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

    const changeEl = change_btc;
    changeEl.textContent = changePercent + '%';

    if (changePercent >= 0) {
      changeEl.classList.add('price-up');
      changeEl.classList.remove('price-down');
    } else {

      changeEl.classList.add('price-down');
      changeEl.classList.remove('price-up');
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