const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const utilityNav = document.querySelector(".utility-nav");

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
