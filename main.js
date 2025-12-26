// ===========================================
//  nekoojisan-labo UI Update
//  Author: nekoojisan
//  Date: 2025-12-26
//============================================

// 【不ストイムントール Light/Dark Mode Toggle
const themeToggle = document.querySelector('iteme-theme') || document.querySelector('#theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('theme-dark', currentTheme === 'dark');
if (themeToggle) {
  themeToggle.textContent = currentTheme === 'dark' ? '🐙' : '🐔";
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    const newTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🐙' : '🐔";
  });
}

// ============================================
// （🐨アーーヸツ ジンフール
// ============================================
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('light-on');
      observer.unobserve(entry.target);
    }
  });
});
fadeElements.forEach(el => observer.observe(el));

// 😏 Mobile Menue Animation
const menuToggle = document.querySelector('.header__menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    mobileMenu.classList.toggle('is-active');
  });
}
