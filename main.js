// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const switchBtns = document.querySelectorAll('.switch-btn');
  const prices = document.querySelectorAll('.price');

  const saved = localStorage.getItem('mysterymail_currency') || 'intl';
  setCurrency(saved);

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.dataset.currency;
      setCurrency(currency);
      localStorage.setItem('mysterymail_currency', currency);
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function setCurrency(currency) {
    prices.forEach(price => {
      const intl = price.querySelector('.intl');
      const inPrice = price.querySelector('.in');
      if (currency === 'in') {
        intl.classList.remove('active'); intl.classList.add('hidden');
        inPrice.classList.remove('hidden'); inPrice.classList.add('active');
      } else {
        inPrice.classList.remove('active'); inPrice.classList.add('hidden');
        intl.classList.remove('hidden'); intl.classList.add('active');
      }
    });
  }

  // Navbar scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
});