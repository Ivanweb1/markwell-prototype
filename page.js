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

function openTabFor(id) {
  const target = id ? document.getElementById(id) : null;
  const panel = target?.closest('[role="tabpanel"]');
  const tab = panel && tabs.find((item) => item.getAttribute('aria-controls') === panel.id);
  if (!tab) return false;
  activateTab(tab);
  (target === panel ? tab.parentElement : target).scrollIntoView({ block: 'start' });
  return true;
}
if (tabs.length) {
  openTabFor(location.hash.slice(1));
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !openTabFor(link.getAttribute('href').slice(1))) return;
    event.preventDefault();
    history.replaceState(null, '', link.getAttribute('href'));
  });
}

const partnerForm = document.querySelector('[data-partner-form]');
if (partnerForm) {
  const role = partnerForm.elements.role;
  const phone = partnerForm.elements.phone;
  const scaleField = partnerForm.querySelector('[data-scale-field]');
  const scaleLabel = partnerForm.querySelector('[data-scale-label]');
  const scaleLabels = {
    'Частный мастер': 'Размер аудитории / количество учеников',
    'Салон / студия': 'Количество рабочих мест',
    'Школа / обучающий центр': 'Количество учебных мест / учеников',
  };

  const syncScale = () => {
    const label = scaleLabels[role.value];
    scaleField.hidden = !label;
    if (label) scaleLabel.textContent = label;
  };
  role.addEventListener('change', syncScale);

  document.querySelectorAll('[data-partner-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const type = link.dataset.partnerType;
      if (type) {
        role.value = type;
        syncScale();
        setError(role, '');
      }
      document.getElementById('application').scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#application');
    });
  });

  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '');
    if (!digits) { phone.value = ''; return; }
    if (digits[0] === '8') digits = '7' + digits.slice(1);
    if (digits[0] !== '7') digits = '7' + digits;
    digits = digits.slice(0, 11);
    const d = digits.slice(1);
    let out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length > 3) out += ') ' + d.slice(3, 6);
    if (d.length > 6) out += '-' + d.slice(6, 8);
    if (d.length > 8) out += '-' + d.slice(8, 10);
    phone.value = out;
  });

  function setError(control, message) {
    const field = control.closest('.field');
    field.classList.toggle('is-invalid', Boolean(message));
    field.querySelector('.field__error').textContent = message;
    control.setAttribute('aria-invalid', String(Boolean(message)));
  }

  function validate(control) {
    if (control.type === 'checkbox') return control.checked ? '' : 'Нужно согласие на обработку персональных данных';
    const value = control.value.trim();
    if (control.required && !value) return control.tagName === 'SELECT' ? 'Выберите вариант' : 'Заполните поле';
    if (control.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Проверьте формат email';
    if (control.name === 'phone' && value && value.replace(/\D/g, '').length !== 11) return 'Введите номер полностью';
    return '';
  }

  const controls = [...partnerForm.querySelectorAll('input, select, textarea')].filter((control) => control.closest('.field')?.querySelector('.field__error'));
  controls.forEach((control) => {
    const event = control.tagName === 'SELECT' || control.type === 'checkbox' ? 'change' : 'blur';
    control.addEventListener(event, () => setError(control, validate(control)));
    control.addEventListener('input', () => {
      if (control.closest('.field').classList.contains('is-invalid')) setError(control, validate(control));
    });
  });

  partnerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = controls.filter((control) => {
      const message = validate(control);
      setError(control, message);
      return message;
    });
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    partnerForm.hidden = true;
    const success = partnerForm.parentElement.querySelector('.partner-success');
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
