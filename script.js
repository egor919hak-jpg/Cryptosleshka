document.addEventListener('DOMContentLoaded', () => {
const toggle = document.querySelector('.accordion-toggle');
const content = document.querySelector('.accordion-content');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  content.classList.toggle('open');
});
});