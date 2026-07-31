// FisioFit — carga e inyección de la figura muscular (SVG inline) + heatmap.
//
// Los SVG viven como archivos separados en assets/ y se cargan con fetch()
// para inyectarlos como markup inline dentro del DOM (no <img>). Esto es
// necesario porque el heatmap y la selección de músculo individual (features
// futuras) requieren manipular fill/stroke por <path> vía CSS/JS y escuchar
// clicks por data-muscle — algo que un <img src="..."> o <object> no permite
// sin cruzar el boundary de un documento externo. fetch() de un archivo local
// funciona sirviendo la app por HTTP (GitHub Pages, `python -m http.server`,
// etc.); si se abre index.html directo con file://, el navegador bloquea
// fetch por CORS y hay que servir con un servidor local.

const FRONT_VIEW_URL = "assets/muscle-front.svg";
const BACK_VIEW_URL = "assets/muscle-back.svg";

// Ambas vistas se cargan e inyectan a la vez (no sólo la activa): así el
// heatmap puede aplicarse una sola vez a los <path data-muscle> de las dos,
// y rotar es sólo un cambio de transform/opacity, sin más fetch/parseo.
let shellEl = null;
let frontFaceEl = null;
let backFaceEl = null;

// Estado de rotación — declarado aquí (y no junto al resto de la lógica más
// abajo) porque loadMuscleFigure() llama a setupRotationControls() de forma
// síncrona, antes de cualquier await: si "let activeFace" viviera más abajo
// en el archivo, esa llamada la referenciaría antes de su inicialización
// (temporal dead zone) y lanzaría un ReferenceError.
const ROTATE_TRANSITION_MS = 900; // debe coincidir con la transición CSS de .figure-face
const DRAG_FULL_DISTANCE_PX = 160; // px arrastrados para t = ±1 (giro completo)
const DRAG_COMMIT_T = 0.5; // progreso mínimo al soltar para completar el giro

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const rotateTransitionMs = prefersReducedMotion ? 0 : ROTATE_TRANSITION_MS;

// activeFace: la cara actualmente de frente (t=0, opacidad 1).
// inactiveFace: la otra, en reposo fuera de vista (opacidad 0).
let activeFace = null;
let inactiveFace = null;
let isBackView = false;
let isAnimating = false;
let isDragging = false;
let dragStartX = 0;

async function loadMuscleFigure() {
  const stage = document.querySelector(".stage");
  if (!stage) return;

  const shell = document.createElement("div");
  shell.className = "figure-shell";
  shellEl = shell;

  const float = document.createElement("div");
  float.className = "figure-float";

  const perspective = document.createElement("div");
  perspective.className = "figure-perspective";

  const frontFace = document.createElement("div");
  frontFace.className = "figure-face figure-face--front";
  frontFaceEl = frontFace;

  const backFace = document.createElement("div");
  backFace.className = "figure-face figure-face--back";
  backFaceEl = backFace;

  perspective.append(frontFace, backFace);
  float.appendChild(perspective);
  shell.appendChild(float);
  stage.appendChild(shell);

  setupRotationControls();

  try {
    const [frontResponse, backResponse] = await Promise.all([
      fetch(FRONT_VIEW_URL),
      fetch(BACK_VIEW_URL),
    ]);
    if (!frontResponse.ok) throw new Error(`HTTP ${frontResponse.status}`);
    if (!backResponse.ok) throw new Error(`HTTP ${backResponse.status}`);

    const [frontMarkup, backMarkup] = await Promise.all([
      frontResponse.text(),
      backResponse.text(),
    ]);
    frontFace.innerHTML = frontMarkup;
    backFace.innerHTML = backMarkup;

    enhanceMuscleAccessibility();
    figureReady = true;
    applyHeatmap(pendingGroup);
  } catch (error) {
    console.error("No se pudo cargar la figura muscular:", error);
    frontFace.textContent = "No se pudo cargar la figura.";
  }
}

loadMuscleFigure();

// ============================================================================
// Rotación — arrastre horizontal (mouse/touch) o botón "girar" alternan entre
// vista frontal y posterior. Vive en .figure-perspective, dentro de
// .figure-float, por lo que la flotación (Prompt 3) nunca se detiene, ni
// durante ni después del giro. El heatmap ya está aplicado a ambas caras
// (mismos data-muscle), así que rotar no requiere volver a calcularlo.
//
// Cada cara gira, como mucho, ±90° (nunca los 180° completos): la saliente
// pasa de 0° a 90° perdiendo opacidad, la entrante de -90°(u opuesto) a 0°
// ganándola, en paralelo — ver comentario de diseño en muscle-figure.css.
// Así "t" (progreso de -1 a 1) controla ambas caras a la vez, y en t=±0.5
// (mitad del giro) el crossfade está exactamente al 50/50.
// ============================================================================

function applyFaceProgress(outgoing, incoming, t) {
  const clamped = Math.max(-1, Math.min(1, t));
  const sign = clamped === 0 ? 1 : Math.sign(clamped);

  outgoing.style.transform = `rotateY(${90 * clamped}deg)`;
  outgoing.style.opacity = String(1 - Math.abs(clamped));

  incoming.style.transform = `rotateY(${90 * (clamped - sign)}deg)`;
  incoming.style.opacity = String(Math.abs(clamped));
}

// Lleva la rotación a su estado final (targetT = 0 cancela y vuelve al
// reposo, ±1 completa el giro). `freshStart` sólo hace falta cuando se
// arranca desde reposo (botón): reposiciona instantáneamente (sin
// transición, invisible porque su opacidad es 0) la cara entrante al lado
// correcto para que la transición subsiguiente la traiga girando en la
// misma dirección que la saliente.
function settleRotation(targetT, { freshStart = false } = {}) {
  const outgoing = activeFace;
  const incoming = inactiveFace;

  if (freshStart && targetT !== 0) {
    const sign = Math.sign(targetT);
    incoming.style.transition = "none";
    incoming.style.transform = `rotateY(${-90 * sign}deg)`;
    incoming.getBoundingClientRect(); // fuerza reflow antes de re-habilitar la transición
    incoming.style.transition = "";
  }

  isAnimating = true;
  applyFaceProgress(outgoing, incoming, targetT);

  if (targetT !== 0) {
    activeFace = incoming;
    inactiveFace = outgoing;
    isBackView = activeFace === backFaceEl;
  }

  window.setTimeout(() => {
    isAnimating = false;
  }, rotateTransitionMs);
}

function rotateToOppositeView() {
  if (isAnimating || isDragging || !figureReady) return;
  settleRotation(1, { freshStart: true });
}

function setupRotationControls() {
  activeFace = frontFaceEl;
  inactiveFace = backFaceEl;

  shellEl.addEventListener("pointerdown", onPointerDown);

  const rotateButton = document.getElementById("rotate-figure-btn");
  rotateButton?.addEventListener("click", rotateToOppositeView);
}

function onPointerDown(event) {
  if (isAnimating || !figureReady) return;
  if (event.button !== undefined && event.button !== 0) return;

  isDragging = true;
  dragStartX = event.clientX;

  shellEl.classList.add("is-dragging");
  shellEl.setPointerCapture?.(event.pointerId);

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
}

function onPointerMove(event) {
  if (!isDragging) return;
  const t = (event.clientX - dragStartX) / DRAG_FULL_DISTANCE_PX;
  applyFaceProgress(activeFace, inactiveFace, t);
}

function onPointerUp(event) {
  if (!isDragging) return;
  isDragging = false;
  shellEl.classList.remove("is-dragging");

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);

  const t = (event.clientX - dragStartX) / DRAG_FULL_DISTANCE_PX;
  const committed = Math.abs(t) >= DRAG_COMMIT_T;
  const targetT = committed ? Math.sign(t) : 0;

  settleRotation(targetT);
}

// ============================================================================
// Heatmap — conecta "workoutGroupChanged" (menú superior) con los <path> de
// músculo (data-muscle) de la figura, cargada en vista frontal o posterior.
// ============================================================================

// Intensidad 0.0–1.0 por músculo y grupo de movimiento (ver CLAUDE.md).
const MUSCLE_INTENSITY = {
  push: {
    pecho: 1.0,
    "deltoide-anterior": 0.7,
    "deltoide-lateral": 0.7,
    triceps: 0.6,
  },
  pull: {
    "dorsal-ancho": 1.0,
    "espalda-media": 1.0,
    biceps: 0.6,
    "deltoide-posterior": 0.5,
    trapecio: 0.4,
  },
  legs: {
    cuadriceps: 1.0,
    gluteos: 0.9,
    isquiotibiales: 0.8,
    gemelos: 0.5,
  },
};

// Intensidad a partir de la cual un músculo es "protagonista" (glow/pulse).
const HERO_THRESHOLD = 0.9;

let pendingGroup = null;
let figureReady = false;
let heatmapStopsCache = null;

function parseColorToRgba(value) {
  const str = value.trim();

  if (str.startsWith("#")) {
    let hex = str.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b, 1];
  }

  const match = str.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const [r, g, b, a = 1] = match[1].split(",").map((part) => parseFloat(part));
    return [r, g, b, a];
  }

  return [255, 255, 255, 1];
}

// Lee la escala de heatmap (tokens.css) una sola vez: --heatmap-stop-0..4,
// repartidos uniformemente en 0.00 / 0.25 / 0.50 / 0.75 / 1.00.
function getHeatmapStops() {
  if (heatmapStopsCache) return heatmapStopsCache;

  const rootStyles = getComputedStyle(document.documentElement);
  heatmapStopsCache = [0, 1, 2, 3, 4].map((i) =>
    parseColorToRgba(rootStyles.getPropertyValue(`--heatmap-stop-${i}`))
  );
  return heatmapStopsCache;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function intensityToColor(intensity) {
  const stops = getHeatmapStops();
  const clamped = Math.min(1, Math.max(0, intensity));
  const segment = Math.min(3, Math.floor(clamped / 0.25));
  const localT = (clamped - segment * 0.25) / 0.25;

  const [r1, g1, b1, a1] = stops[segment];
  const [r2, g2, b2, a2] = stops[segment + 1];

  const r = Math.round(lerp(r1, r2, localT));
  const g = Math.round(lerp(g1, g2, localT));
  const b = Math.round(lerp(b1, b2, localT));
  const a = Number(lerp(a1, a2, localT).toFixed(3));

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Aplica el heatmap a todos los <path data-muscle> presentes en el DOM
// (frontal o posterior, la vista activa en cada momento).
function applyHeatmap(group) {
  const paths = document.querySelectorAll(".muscle-path[data-muscle]");
  const activeMap = group ? MUSCLE_INTENSITY[group] : null;

  paths.forEach((path) => {
    if (!activeMap) {
      path.classList.remove("is-active", "is-dimmed", "is-hero");
      path.style.removeProperty("--muscle-color");
      return;
    }

    const intensity = activeMap[path.dataset.muscle];

    if (intensity === undefined) {
      path.classList.remove("is-active", "is-hero");
      path.classList.add("is-dimmed");
      path.style.removeProperty("--muscle-color");
    } else {
      path.classList.remove("is-dimmed");
      path.classList.add("is-active");
      path.classList.toggle("is-hero", intensity >= HERO_THRESHOLD);
      path.style.setProperty("--muscle-color", intensityToColor(intensity));
    }
  });
}

document.addEventListener("workoutGroupChanged", (event) => {
  pendingGroup = event.detail.group;
  if (figureReady) applyHeatmap(pendingGroup);
});

// ============================================================================
// Accesibilidad — cada <path data-muscle> se vuelve enfocable/operable por
// teclado (tabindex + role="button", como pide un elemento no nativo que
// responde a click). MUSCLE_CONTENT (data/muscle-content.js) ya está
// disponible acá: ese script corre de forma síncrona antes de que este
// await se resuelva (ver comentario de FRONT_VIEW_URL/BACK_VIEW_URL arriba).
// ============================================================================

function enhanceMuscleAccessibility() {
  document.querySelectorAll(".muscle-path[data-muscle]").forEach((path) => {
    const muscle = path.dataset.muscle;
    const label = typeof MUSCLE_CONTENT !== "undefined" && MUSCLE_CONTENT[muscle]
      ? MUSCLE_CONTENT[muscle].nombre
      : muscle;

    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    path.setAttribute("aria-pressed", "false");
    path.setAttribute("aria-label", label);
  });
}

// ============================================================================
// Selección individual — click o teclado (Enter/Espacio) en cualquier
// <path data-muscle>, esté o no resaltado por el heatmap actual. Sólo un
// músculo puede estar seleccionado a la vez (activarlo de nuevo lo
// deselecciona). La selección se marca en ambos <path> con el mismo
// data-muscle (frontal y posterior) para que sobreviva al rotar la figura,
// aunque el evento se dispare una sola vez por activación.
// ============================================================================

let selectedMuscle = null;

function applySelection() {
  document.querySelectorAll(".muscle-path[data-muscle]").forEach((path) => {
    const isSelected = path.dataset.muscle === selectedMuscle;
    path.classList.toggle("is-selected", isSelected);
    path.setAttribute("aria-pressed", String(isSelected));
  });
}

function selectMuscle(muscle) {
  selectedMuscle = selectedMuscle === muscle ? null : muscle;
  applySelection();

  const muscleSelected = new CustomEvent("muscleSelected", {
    detail: { muscle: selectedMuscle },
  });
  document.dispatchEvent(muscleSelected);
  console.log("muscleSelected", muscleSelected.detail);
}

document.addEventListener("click", (event) => {
  const path = event.target.closest(".muscle-path[data-muscle]");
  if (!path) return;

  selectMuscle(path.dataset.muscle);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  const path = event.target.closest(".muscle-path[data-muscle]");
  if (!path) return;

  event.preventDefault(); // evita el scroll de página que dispara la barra espaciadora
  selectMuscle(path.dataset.muscle);
});
