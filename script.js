const hero = document.querySelector(".hero");
const video = document.querySelector(".hero__video");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const utilityNav = document.querySelector(".utility-nav");

const showVideo = () => {
  hero.classList.add("is-ready");
};

if (video.readyState >= 3) {
  showVideo();
} else {
  video.addEventListener("canplay", showVideo, { once: true });
}

video.play().catch(() => {
  const resumePlayback = () => {
    video.muted = true;
    video.play().catch(() => {});
    window.removeEventListener("pointerdown", resumePlayback);
  };

  window.addEventListener("pointerdown", resumePlayback, { once: true });
});

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  utilityNav.classList.remove("is-open");
  document.body.style.overflow = "";
};

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  nav.classList.toggle("is-open", willOpen);
  utilityNav.classList.toggle("is-open", willOpen);
  document.body.style.overflow = willOpen ? "hidden" : "";
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const productDialog = document.querySelector('#product-dialog');
const productData = {
  'mw-one': {title:'MarkWell MW One', rows:[['Мощность двигателя','72 Вт'],['Максимальная скорость','4700 об/мин'],['Уровни мощности','10'],['Питание','AC 110–220 В'],['Входное напряжение двигателя','28 В'],['Мощность освещения','38 Вт'],['Цветовая температура','3000 / 4500 / 6000 К'],['Регулировка яркости','есть'],['Вес нетто','6 кг'],['Вес брутто','8,8 кг'],['Размер упаковки','50 × 43 × 31 см']], note:'Комплектация: головная часть, регулируемый кронштейн, струбцина, регулятор мощности, фильтр, шестигранные ключи, кисточки. Гарантия MW One — 24 месяца. Срок службы — 5 лет. Регулятор мощности и встроенная LED-подсветка — 12 месяцев. Сменный фильтр является расходным материалом.'},
  'replacement-filter': {title:'Сменный фильтр MW One',rows:[['Совместимость','MarkWell MW One'],['Фиксация','магнитная'],['Очистка','только сухая'],['Рекомендуемая очистка','ориентировочно каждые 20–25 процедур'],['Ориентировочная замена','около 2–3 месяцев']],note:'Срок замены зависит от интенсивности работы и состояния фильтра.'},
  'stand': {title:'Напольная стойка MarkWell',rows:[['Количество опор с колёсами','6'],['Центральная опора','3 составных модуля'],['Варианты высоты','сборка из 2 или 3 модулей'],['Максимальная нагрузка','6 кг'],['Гарантия','12 месяцев'],['Срок службы','3 года']],note:''}
};
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
  const product=productData[button.dataset.product];
  document.querySelector('#product-dialog-content').innerHTML=`<h2>${product.title}</h2><dl>${product.rows.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl><p>${product.note}</p><p class="draft-note">Макет: актуальные варианты покупки ещё не подключены.</p>`;
  productDialog.showModal();
}));
document.querySelector('.dialog-close')?.addEventListener('click',()=>productDialog.close());
const workVideos=[...document.querySelectorAll('.tz-videos video')];
workVideos.forEach(current=>{
  current.addEventListener('play',()=>{
    workVideos.forEach(other=>{if(other!==current)other.pause();});
    current.setAttribute('aria-label',current.getAttribute('aria-label').replace('Воспроизвести','Приостановить'));
  });
  current.addEventListener('pause',()=>{
    current.setAttribute('aria-label',current.getAttribute('aria-label').replace('Приостановить','Воспроизвести'));
  });
  current.addEventListener('click',()=>current.paused?current.play():current.pause());
  current.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();current.click();}
  });
});
const videoRail=document.querySelector('#real-work .tz-videos');
document.querySelectorAll('[data-video-scroll]').forEach(button=>button.addEventListener('click',()=>{
  if(!videoRail)return;
  const card=videoRail.querySelector('.tz-video-item');
  const gap=parseFloat(getComputedStyle(videoRail).columnGap)||0;
  const distance=(card?.getBoundingClientRect().width||videoRail.clientWidth*.7)+gap;
  videoRail.scrollBy({left:button.dataset.videoScroll==='next'?distance:-distance,behavior:'smooth'});
}));
