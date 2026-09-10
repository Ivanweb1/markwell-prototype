document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const nav = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls'));
    if (panel) panel.hidden = !active;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

document.querySelectorAll('[data-pending-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[role="status"]');
    if (status) status.textContent = 'Отправка будет подключена после согласования CRM и канала получения заявок.';
  });
});
