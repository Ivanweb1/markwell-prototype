document.querySelectorAll('.site-nav').forEach((nav) => {
  const homeLink = document.createElement('a');
  homeLink.href = document.querySelector('.site-header .brand')?.getAttribute('href') || 'index.html';
  homeLink.textContent = 'Главная';
  nav.prepend(homeLink);
});

document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const nav = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
});
