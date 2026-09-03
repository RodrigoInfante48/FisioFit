// FisioFit — panel inferior de contenido (Ejercicio / Estiramiento /
// Recuperación). Fuente principal: evento "muscleSelected" (músculo
// individual). Fallback: "workoutGroupChanged" cuando no hay músculo
// seleccionado, mostrando el resumen del grupo completo armado a partir de
// los mismos datos de cada músculo en data/muscle-content.js.

// "core", "antebrazos" y "espalda" no son patrones de movimiento de
// CLAUDE.md (Push/Pull/Legs): son los grupos asignados a
// abdominales/oblicuos, antebrazo-flexor/antebrazo-extensor y
// romboides/erectores-espinales respectivamente, seleccionables
// individualmente en la figura pero sin heatmap propio ni entrada en
// GROUP_MUSCLES (nunca aparecen en el resumen de un grupo, sólo en su
// propia ficha).
// Push/Pull/Legs quedan sin traducir en los 8 idiomas del selector: son
// términos de gimnasio ya universales en inglés. Core/Antebrazos/Espalda
// sí son palabras comunes en español y se traducen vía i18n.js.
function groupLabel(group) {
  if (group === "push") return "Push";
  if (group === "pull") return "Pull";
  if (group === "legs") return "Legs";
  if (group === "core") return window.FisioFitI18n.t("group.core");
  if (group === "antebrazos") return window.FisioFitI18n.t("group.forearms");
  if (group === "espalda") return window.FisioFitI18n.t("group.back");
  return group;
}

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
      <p>${window.FisioFitI18n.t("panel.empty")}</p>
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

// Número de WhatsApp de Rodrigo para agendar sesiones de ventosas /
// fisioterapia (fase manual — ver CLAUDE.md "Modelo de negocio y
// estrategia"). Formato wa.me: código de país + número, sin "+" ni espacios.
const WHATSAPP_NUMBER = "573209974750";

function buildRecoveryCTA(contextLabel) {
  const message = encodeURIComponent(
    window.FisioFitI18n.t("cta.waMessage", { context: contextLabel })
  );

  return `
    <a
      class="content-panel__cta"
      href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="content-panel__cta-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.92C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
        </svg>
      </span>
      <span class="content-panel__cta-text">
        <strong>${window.FisioFitI18n.t("cta.title")}</strong>
        ${window.FisioFitI18n.t("cta.subtitle")}
      </span>
      <svg class="content-panel__cta-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </a>
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
        <span class="content-panel__badge content-panel__badge--${data.grupo}">${groupLabel(data.grupo)}</span>
      </header>
      <div class="content-panel__sections">
        ${buildSection(window.FisioFitI18n.t("panel.section.exercise"), "ejercicio", data.ejercicio)}
        ${buildSection(window.FisioFitI18n.t("panel.section.stretch"), "estiramiento", data.estiramiento)}
        ${buildSection(window.FisioFitI18n.t("panel.section.recovery"), "recuperacion", data.recuperacion)}
      </div>
      ${buildRecoveryCTA(data.nombre)}
    </div>
  `;
}

function buildGroupBody(group) {
  const muscleIds = GROUP_MUSCLES[group];

  return `
    <div class="content-panel__body">
      <header class="content-panel__header">
        <h2 class="content-panel__title">${groupLabel(group)}</h2>
        <span class="content-panel__badge content-panel__badge--${group}">${window.FisioFitI18n.t("panel.fullGroup")}</span>
      </header>
      <div class="content-panel__sections">
        ${buildSectionList(window.FisioFitI18n.t("panel.section.exercise"), "ejercicio", muscleIds, "ejercicio")}
        ${buildSectionList(window.FisioFitI18n.t("panel.section.stretch"), "estiramiento", muscleIds, "estiramiento")}
        ${buildSectionList(window.FisioFitI18n.t("panel.section.recovery"), "recuperacion", muscleIds, "recuperacion")}
      </div>
      ${buildRecoveryCTA(groupLabel(group))}
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

// Re-renderiza los textos fijos (títulos de sección, estado vacío, CTA)
// en el nuevo idioma. El contenido propio de cada músculo
// (ejercicio/estiramiento/recuperación) sigue en español — ver i18n.js.
document.addEventListener("languageChanged", renderPanel);
