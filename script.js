document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.accordion-toggle');
  const content = document.querySelector('.accordion-content');

  // цены
  let price_btc = document.querySelector('#price-btc');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    content.classList.toggle('open');
  });

  async function loadBTCPrice() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
      const data = await res.json()

      let price = Number(data.price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      price_btc.textContent = '$' + price + ' USD';
    } catch (err) {
      console.error(err);
    }
  }

  loadBTCPrice();
  setInterval(loadBTCPrice, 5000);
});