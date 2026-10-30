/* Lógica principal del sitio */

/* --- Render de productos --- */
const grid = document.getElementById("product-grid");

// Las tarjetas de producto son estáticas en el HTML.

/* --- Modal de producto --- */
const modal = document.createElement("div");
modal.className = "product-modal";
modal.setAttribute("aria-hidden", "true");
modal.innerHTML = `
  <div class="product-modal__backdrop"></div>
  <div class="product-modal__dialog" role="dialog" aria-modal="true">
    <button class="product-modal__close" type="button" aria-label="Cerrar">&times;</button>
    <img class="product-modal__img" src="" alt="">
    <h3 class="product-modal__title"></h3>
    <ul class="product-modal__specs"></ul>
    <a class="btn btn--primary btn--blue btn--arrow product-modal__cta" href="#" target="_blank" rel="noopener">Quiero alquilarlo</a>
  </div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector(".product-modal__img");
const modalTitle = modal.querySelector(".product-modal__title");
const modalSpecs = modal.querySelector(".product-modal__specs");
const modalCta = modal.querySelector(".product-modal__cta");
const modalClose = modal.querySelector(".product-modal__close");
const modalBackdrop = modal.querySelector(".product-modal__backdrop");

function openProductModal(product) {
  modalImg.src = product.image;
  modalImg.alt = product.name;
  modalTitle.textContent = product.name;
  modalSpecs.innerHTML = "";
  (product.specs || []).forEach((spec) => {
    const li = document.createElement("li");
    li.textContent = spec;
    modalSpecs.appendChild(li);
  });
  const message = encodeURIComponent(`Hola, quiero alquilar: ${product.name}`);
  modalCta.href = `https://wa.me/573000000000?text=${message}`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProductModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (grid) {
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-name]");
    if (!button) return;
    let specs = [];
    try { specs = JSON.parse(button.dataset.specs || "[]"); } catch (e) { specs = []; }
    openProductModal({ name: button.dataset.name, image: button.dataset.image, specs });
  });
}

modalClose.addEventListener("click", closeProductModal);
modalBackdrop.addEventListener("click", closeProductModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) closeProductModal();
});

/* --- Menú móvil --- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("main-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Cierra el menú al elegir una opción
  nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* --- Enlace activo según la sección visible --- */
const links = document.querySelectorAll(".main-nav__list a");
const sections = [...links]
  .map((link) => {
    const href = link.getAttribute("href") || "";
    const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
    return hash ? document.querySelector(hash) : null;
  })
  .filter(Boolean);

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const href = link.getAttribute("href") || "";
          const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
          link.classList.toggle("is-active", hash === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

/* --- Año del copyright --- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
