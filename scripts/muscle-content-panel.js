// FisioFit — panel inferior de contenido (Ejercicio / Estiramiento /
// Recuperación). Fuente principal: evento "muscleSelected" (músculo
// individual). Fallback: "workoutGroupChanged" cuando no hay músculo
// seleccionado, mostrando el resumen del grupo completo armado a partir de
// los mismos datos de cada músculo en data/muscle-content.js.

const GROUP_LABELS = { push: "Push", pull: "Pull", legs: "Legs" };

// Orden de músculos por grupo — coincide con el mapeo de CLAUDE.md.
const GROUP_MUSCLES = {
  push: ["pecho", "deltoide-anterior", "deltoide-lateral", "triceps"],
  pull: [
    "dorsal-ancho",
    "espalda-media",
    "biceps",
    "deltoide-posterior",
    "trapecio",
  ],
  legs: ["cuadriceps", "gluteos", "isquiotibiales", "gemelos"],
};

const SECTION_ICONS = {
  ejercicio:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 6.5 4 4M17.5 6.5 20 4M6.5 17.5 4 20M17.5 17.5 20 20" /><rect x="7" y="7" width="10" height="10" rx="2" /></svg>',
  estiramiento:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8" /><path d="M12 8v6M12 8 6 12M12 8l6 4M12 14l-4 6M12 14l4 6" /></svg>',
  recuperacion:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>',
};

const SWAP_OUT_MS = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches
  ? 0
  : 220;

let panelEl = null;
let scrollEl = null;
// Prefijo "panel" para no colisionar con "selectedMuscle"/"selectedGroup",
// ya declarados como top-level let en muscle-figure.js y main.js: los
// scripts clásicos comparten un mismo ámbito léxico global, así que
// redeclarar el mismo nombre con let/const lanza un SyntaxError en tiempo
// de ejecución y rompe todos los scripts cargados después.
let panelSelectedMuscle = null;
let panelSelectedGroup = null;

function buildEmptyState() {
  return `
    <div class="content-panel__empty">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="7" r="3.2" />
        <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      </svg>
      <p>Elegí un patrón de movimiento (Push, Pull o Legs) o tocá un
      músculo en la figura para ver cómo entrenarlo, estirarlo y
      recuperarlo.</p>
    </div>
  `;
}

function buildSection(title, iconKey, text) {
  return `
    <section class="content-panel__section">
      <h3 class="content-panel__section-title">
        ${SECTION_ICONS[iconKey]}<span>${title}</span>
      </h3>
      <p class="content-panel__text">${text}</p>
    </section>
  `;
}

function buildSectionList(title, iconKey, muscleIds, field) {
  const items = muscleIds
    .map((id) => {
      const data = MUSCLE_CONTENT[id];
      return `<li><strong>${data.nombre}:</strong> ${data[field]}</li>`;
    })
    .join("");

  return `
    <section class="content-panel__section">
      <h3 class="content-panel__section-title">
        ${SECTION_ICONS[iconKey]}<span>${title}</span>
      </h3>
      <ul class="content-panel__list">${items}</ul>
    </section>
  `;
}

function buildMuscleBody(muscleId) {
  const data = MUSCLE_CONTENT[muscleId];

  return `
    <div class="content-panel__body">
      <header class="content-panel__header">
        <h2 class="content-panel__title">${data.nombre}</h2>
        <span class="content-panel__badge content-panel__badge--${data.grupo}">${GROUP_LABELS[data.grupo]}</span>
      </header>
      <div class="content-panel__sections">
        ${buildSection("Ejercicio", "ejercicio", data.ejercicio)}
        ${buildSection("Estiramiento", "estiramiento", data.estiramiento)}
        ${buildSection("Recuperación", "recuperacion", data.recuperacion)}
      </div>
    </div>
  `;
}

function buildGroupBody(group) {
  const muscleIds = GROUP_MUSCLES[group];

  return `
    <div class="content-panel__body">
      <header class="content-panel__header">
        <h2 class="content-panel__title">${GROUP_LABELS[group]}</h2>
        <span class="content-panel__badge content-panel__badge--${group}">Grupo completo</span>
      </header>
      <div class="content-panel__sections">
        ${buildSectionList("Ejercicio", "ejercicio", muscleIds, "ejercicio")}
        ${buildSectionList("Estiramiento", "estiramiento", muscleIds, "estiramiento")}
        ${buildSectionList("Recuperación", "recuperacion", muscleIds, "recuperacion")}
      </div>
    </div>
  `;
}

function currentMarkup() {
  if (panelSelectedMuscle) return buildMuscleBody(panelSelectedMuscle);
  if (panelSelectedGroup) return buildGroupBody(panelSelectedGroup);
  return buildEmptyState();
}

// Indica con un fade en el borde superior/inferior que hay más contenido
// oculto hacia ese lado, en vez de cortar el texto en seco contra el borde
// del panel al hacer scroll (ver .info-panel__scroll en main.css).
const FADE_EDGE_THRESHOLD_PX = 4;

function updateScrollFade() {
  if (!scrollEl) return;
  const { scrollTop, scrollHeight, clientHeight } = scrollEl;
  scrollEl.classList.toggle("has-fade-top", scrollTop > FADE_EDGE_THRESHOLD_PX);
  scrollEl.classList.toggle(
    "has-fade-bottom",
    scrollTop < scrollHeight - clientHeight - FADE_EDGE_THRESHOLD_PX
  );
}

// Fade/slide al cambiar de contenido: la clase "is-swapping" desvanece el
// contenido saliente (ver info-panel.css); una vez transcurrida esa
// transición se reemplaza el markup y se retira la clase para que el
// contenido entrante haga la transición inversa.
function renderPanel() {
  if (!panelEl) return;

  panelEl.classList.add("is-swapping");

  window.setTimeout(() => {
    panelEl.innerHTML = currentMarkup();
    void panelEl.offsetWidth; // fuerza reflow antes de re-habilitar la transición de entrada
    panelEl.classList.remove("is-swapping");
    // El contenido nuevo arranca siempre desde arriba: si quedara el
    // scrollTop del músculo/grupo anterior, se vería recortado a mitad de
    // párrafo apenas cambia la selección. behavior:"auto" fuerza el salto
    // instantáneo sin importar scroll-behavior heredado.
    if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "auto" });
    updateScrollFade();
  }, SWAP_OUT_MS);
}

function setupContentPanel() {
  const infoPanel = document.querySelector(".info-panel");
  if (!infoPanel) return;

  scrollEl = document.createElement("div");
  scrollEl.className = "info-panel__scroll";

  panelEl = document.createElement("div");
  panelEl.className = "content-panel";
  panelEl.innerHTML = currentMarkup();

  scrollEl.appendChild(panelEl);
  infoPanel.appendChild(scrollEl);

  scrollEl.addEventListener("scroll", updateScrollFade, { passive: true });
  window.addEventListener("resize", updateScrollFade);
  updateScrollFade();
}

setupContentPanel();

document.addEventListener("muscleSelected", (event) => {
  panelSelectedMuscle = event.detail.muscle;
  renderPanel();
});

document.addEventListener("workoutGroupChanged", (event) => {
  panelSelectedGroup = event.detail.group;
  // Un músculo seleccionado de un grupo anterior no debe sobrevivir al
  // cambio de patrón de movimiento (ver mismo reset en muscle-figure.js).
  panelSelectedMuscle = null;
  renderPanel();
});
