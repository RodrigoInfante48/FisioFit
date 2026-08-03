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
let tiltEl = null;
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

// Tilt (arrastre vertical) — inclinación de cámara acotada, ver
// applyTilt/settleTilt más abajo y el comentario de diseño en
// muscle-figure.css sobre .figure-tilt / .depth-torso / .depth-limbs.
const TILT_MAX_DEG = 12; // tope de inclinación en cada sentido (rotateX)
const TILT_FULL_DISTANCE_PX = 120; // px arrastrados en vertical para |tilt| = TILT_MAX_DEG
// Mitad de ROTATE_TRANSITION_MS (900ms), no un número suelto: el resorte de
// vuelta a 0° es un gesto más corto e interactivo que el giro/zoom, pero
// derivado de la misma base para que las tres animaciones (rotación, tilt,
// zoom) se sientan parte de un mismo sistema de timing en vez de tres
// velocidades ajustadas por separado. Debe coincidir con la transición CSS
// de .figure-tilt / .depth-torso / .depth-limbs.
const TILT_SETTLE_MS = ROTATE_TRANSITION_MS / 2;
const DRAG_AXIS_LOCK_PX = 6; // px de movimiento antes de fijar el eje dominante del gesto

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const rotateTransitionMs = prefersReducedMotion ? 0 : ROTATE_TRANSITION_MS;
const tiltSettleMs = prefersReducedMotion ? 0 : TILT_SETTLE_MS;

// activeFace: la cara actualmente de frente (t=0, opacidad 1).
// inactiveFace: la otra, en reposo fuera de vista (opacidad 0).
let activeFace = null;
let inactiveFace = null;
let isBackView = false;
let isAnimating = false;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragAxis = null; // null (sin fijar) | "x" (rotación) | "y" (tilt)

// Estado de zoom — mismo motivo que activeFace más arriba: setupRotationControls()
// asigna zoomResetButton de forma síncrona (antes de cualquier await), así que su
// "let" no puede vivir más abajo, junto al resto de la lógica de zoom, sin
// disparar un ReferenceError por temporal dead zone.
let frontZoomLayer = null;
let backZoomLayer = null;
let zoomResetButton = null;
let zoomActive = false;

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

  const tilt = document.createElement("div");
  tilt.className = "figure-tilt";
  tilt.style.setProperty("--tilt-settle-ms", `${tiltSettleMs}ms`);
  tiltEl = tilt;

  const frontFace = document.createElement("div");
  frontFace.className = "figure-face figure-face--front";
  frontFaceEl = frontFace;

  const backFace = document.createElement("div");
  backFace.className = "figure-face figure-face--back";
  backFaceEl = backFace;

  tilt.append(frontFace, backFace);
  perspective.appendChild(tilt);
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

    frontZoomLayer = createZoomLayer(frontFace.querySelector("svg.muscle-figure"));
    backZoomLayer = createZoomLayer(backFace.querySelector("svg.muscle-figure"));

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
    updateFaceInteractivity();
  }

  window.setTimeout(() => {
    isAnimating = false;
  }, rotateTransitionMs);
}

// La cara inactiva (opacity 0, ver .figure-face--back en el CSS) sigue
// ocupando el mismo rectángulo que la activa y queda por encima suyo en el
// orden del DOM: sin esto, sus <path data-muscle> — invisibles pero
// pintados/enfocables igual — interceptan clicks y el Tab destinados a la
// cara realmente visible (confirmado: clickear el pecho de frente podía
// seleccionar "dorsal-ancho" de la espalda). "inert" saca a la cara
// inactiva del hit-testing, del orden de tabulación y del árbol de
// accesibilidad de una sola vez.
function updateFaceInteractivity() {
  activeFace.inert = false;
  activeFace.removeAttribute("aria-hidden");
  inactiveFace.inert = true;
  inactiveFace.setAttribute("aria-hidden", "true");
}

function rotateToOppositeView() {
  if (isAnimating || isDragging || !figureReady) return;

  // Un músculo seleccionado no sobrevive al cambio de vista: la mayoría de
  // los data-muscle sólo existen de un lado (ver assets/muscle-*.svg), así
  // que el zoom se reinicia limpio antes de girar, igual que al cambiar de
  // grupo de movimiento (workoutGroupChanged, más abajo).
  clearMuscleSelection();

  settleRotation(1, { freshStart: true });
}

function setupRotationControls() {
  activeFace = frontFaceEl;
  inactiveFace = backFaceEl;
  updateFaceInteractivity();

  shellEl.addEventListener("pointerdown", onPointerDown);

  const rotateButton = document.getElementById("rotate-figure-btn");
  rotateButton?.addEventListener("click", rotateToOppositeView);

  zoomResetButton = document.getElementById("zoom-reset-btn");
  zoomResetButton?.addEventListener("click", clearMuscleSelection);
}

// Mientras hay un músculo seleccionado (zoom activo) el arrastre para
// rotar/inclinar se desactiva: pelear el gesto de zoom (que no arrastra)
// contra el de rotación/tilt (que sí) se sentía confuso al probarlo. Para
// volver a arrastrar hay que salir del zoom primero (re-click, click vacío
// o el botón "volver").
let dragPointerId = null;

function onPointerDown(event) {
  if (isAnimating || !figureReady || selectedMuscle !== null) return;
  if (event.button !== undefined && event.button !== 0) return;

  isDragging = true;
  dragAxis = null;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragPointerId = event.pointerId;

  // OJO: capturar el puntero (o marcar "is-dragging") acá, en pointerdown,
  // retargetea el "click" sintético subsiguiente al elemento con la
  // captura (shellEl) en vez del <path> bajo el cursor — rompiendo por
  // completo la selección de músculo por click (nunca llega a
  // event.target.closest(".muscle-path")). Por eso ambas cosas se difieren
  // a onPointerMove, una vez que el gesto realmente fija un eje de arrastre
  // (dragAxis) — un click simple, sin movimiento, nunca llega a ese punto.
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
}

// El gesto fija su eje dominante (horizontal = rotación, vertical = tilt)
// apenas el arrastre supera un pequeño umbral (DRAG_AXIS_LOCK_PX), y no
// vuelve a cambiar durante el resto del gesto — así un drag no puede
// disparar rotación y tilt a la vez.
function onPointerMove(event) {
  if (!isDragging) return;

  const dx = event.clientX - dragStartX;
  const dy = event.clientY - dragStartY;

  if (
    dragAxis === null &&
    Math.max(Math.abs(dx), Math.abs(dy)) >= DRAG_AXIS_LOCK_PX
  ) {
    dragAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
    shellEl.classList.add("is-dragging");
    shellEl.setPointerCapture?.(dragPointerId);
  }
  if (dragAxis === null) return;

  if (dragAxis === "x") {
    const t = dx / DRAG_FULL_DISTANCE_PX;
    applyFaceProgress(activeFace, inactiveFace, t);
  } else {
    applyTilt(dy);
  }
}

// Si dragAxis nunca se fijó (el puntero no se movió más allá del umbral),
// el gesto fue un click/tap simple, no un arrastre: no hay rotación ni tilt
// que resolver, y no tocar isAnimating dejar el "click" subsiguiente (que
// maneja la selección de músculo, ver el listener de "click" más abajo)
// libre para llegar sin que un settleRotation(0) de sobra bloquee el
// siguiente gesto por los próximos ROTATE_TRANSITION_MS.
function onPointerUp(event) {
  if (!isDragging) return;
  isDragging = false;
  shellEl.classList.remove("is-dragging");

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);

  if (dragAxis === "y") {
    settleTilt();
  } else if (dragAxis === "x") {
    const t = (event.clientX - dragStartX) / DRAG_FULL_DISTANCE_PX;
    const committed = Math.abs(t) >= DRAG_COMMIT_T;
    const targetT = committed ? Math.sign(t) : 0;
    settleRotation(targetT);
  }

  dragAxis = null;
  dragPointerId = null;
}

// Inclina la figura (rotateX acotado) siguiendo el dedo/mouse 1:1, sin
// transición (ver .figure-shell.is-dragging en el CSS). El signo invierte
// dy porque arrastrar hacia abajo debe inclinar la figura "hacia atrás"
// (como si la cámara bajara), igual que orbitar un objeto con el mouse.
function applyTilt(dy) {
  const t = Math.max(-1, Math.min(1, -dy / TILT_FULL_DISTANCE_PX));
  tiltEl.style.setProperty("--tilt-deg", String(t * TILT_MAX_DEG));
}

// El tilt nunca queda "trabado": siempre vuelve a 0° al soltar, con la
// transición spring/ease-out declarada en CSS para .figure-tilt (y
// sincronizada en .depth-torso/.depth-limbs, que comparten --tilt-deg).
function settleTilt() {
  tiltEl.style.setProperty("--tilt-deg", "0");
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

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  return [h * 60, s, l];
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  }

  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    hue < 60 ? [c, x, 0] :
    hue < 120 ? [x, c, 0] :
    hue < 180 ? [0, c, x] :
    hue < 240 ? [0, x, c] :
    hue < 300 ? [x, 0, c] : [c, 0, x];

  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

// Piso de saturación para el resultado del heatmap — ver comentario en
// intensityToColor.
const MIN_HEATMAP_SATURATION = 0.5;

function intensityToColor(intensity) {
  const stops = getHeatmapStops();
  const clamped = Math.min(1, Math.max(0, intensity));
  const segment = Math.min(3, Math.floor(clamped / 0.25));
  const localT = (clamped - segment * 0.25) / 0.25;

  const [r1, g1, b1, a1] = stops[segment];
  const [r2, g2, b2, a2] = stops[segment + 1];

  const r = lerp(r1, r2, localT);
  const g = lerp(g1, g2, localT);
  const b = lerp(b1, b2, localT);
  const a = Number(lerp(a1, a2, localT).toFixed(3));

  // Un lerp directo en RGB ya ubica el tono (hue) correcto en cada punto de
  // la escala, pero entre stops casi complementarios (azul -> amarillo, ver
  // --heatmap-stop-1/2 en tokens.css) la saturación se hunde a mitad de
  // camino — se notaba como el trapecio (intensidad 0.4 en Pull, ver
  // CLAUDE.md) luciendo gris/sucio en vez de parte de una escala viva. Se
  // corrige con un piso de saturación en HSL, sin tocar el hue (que ya es
  // el correcto) ni la luminosidad.
  const [h, s, l] = rgbToHsl(r, g, b);
  const [rBoosted, gBoosted, bBoosted] = hslToRgb(
    h,
    Math.max(s, MIN_HEATMAP_SATURATION),
    l
  );

  return `rgba(${rBoosted}, ${gBoosted}, ${bBoosted}, ${a})`;
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

  // Cambiar de patrón de movimiento reemplaza el contexto por completo:
  // una selección individual de un grupo anterior (ej. trapecio en Pull) ya
  // no tiene sentido al pasar a Legs, así que se limpia para que la figura
  // y el panel inferior queden coherentes con el nuevo grupo activo.
  if (selectedMuscle !== null) {
    selectedMuscle = null;
    applySelection();
    resetZoom();
  }
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

// ============================================================================
// Zoom de encuadre — al seleccionar un músculo, la vista activa (frontal o
// posterior) se acerca a su getBBox() (coordenadas del <svg>, no de pantalla)
// con margen; al deseleccionar vuelve al encuadre completo. Se anima un <g>
// contenedor (.muscle-zoom-layer, envuelve TODO el contenido del <svg>
// activo, ver createZoomLayer) en vez de reescribir el viewBox por frame:
// así la transición corre por CSS, con la misma familia de easing/duración
// que la rotación (ROTATE_TRANSITION_MS), sin requerir un rAF propio.
//
// Si el músculo tiene sub-paths bilaterales (izq/der), ambos viven en el
// MISMO <path data-muscle> — un solo `d` con dos subcaminos "M...Z M...Z"
// (ver assets/muscle-*.svg) — así que getBBox() ya cubre ambos lados sin
// tratamiento especial.
// ============================================================================

const ZOOM_TRANSITION_MS = ROTATE_TRANSITION_MS; // misma familia de easing/duración que el giro
const ZOOM_PADDING_FRACTION = 0.35; // margen proporcional al tamaño propio del músculo
const ZOOM_MIN_PADDING = 14; // margen mínimo (unidades del viewBox) para músculos muy chicos
const ZOOM_MAX_SCALE = 3.5; // tope de acercamiento, para no romper el encuadre en músculos finos
const zoomTransitionMs = prefersReducedMotion ? 0 : ZOOM_TRANSITION_MS;

// Mueve todo el contenido del <svg> (defs + grupos de profundidad) dentro de
// un <g> nuevo — ese <g> es el que se anima; el <svg> y su viewBox quedan
// intactos, así que el heatmap/tilt existentes (que operan sobre los <path>
// y los grupos depth-*) no se ven afectados por este wrapping extra.
function createZoomLayer(svg) {
  if (!svg) return null;

  const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  layer.setAttribute("class", "muscle-zoom-layer");
  layer.style.setProperty("--zoom-transition-ms", `${zoomTransitionMs}ms`);

  while (svg.firstChild) {
    layer.appendChild(svg.firstChild);
  }
  svg.appendChild(layer);

  return layer;
}

function zoomLayerForActiveFace() {
  return activeFace === frontFaceEl ? frontZoomLayer : backZoomLayer;
}

// Encuadra el <path data-muscle> seleccionado de la vista ACTIVA en ese
// momento. Si el músculo no existe en esa vista (no es visible desde ese
// lado), no hay nada para encuadrar y se restablece el encuadre completo.
function applyZoomToMuscle(muscle) {
  const layer = zoomLayerForActiveFace();
  const path = activeFace?.querySelector(
    `.muscle-path[data-muscle="${muscle}"]`
  );
  const svg = activeFace?.querySelector("svg.muscle-figure");
  const viewBox = svg?.viewBox?.baseVal;

  if (!layer || !path || !viewBox) {
    resetZoom();
    return;
  }

  const bbox = path.getBBox();
  // El margen se basa en el lado MENOR del bbox, no el mayor: los músculos
  // bilaterales (ej. deltoide-lateral, trapecio) dan un bbox ancho y bajo
  // al cubrir ambos lados (ver comentario de esta sección), y basar el
  // margen en su lado más largo terminaba ensanchando el encuadre más allá
  // del viewBox — anulando el zoom por completo en esos casos.
  const pad = Math.max(
    ZOOM_MIN_PADDING,
    Math.min(bbox.width, bbox.height) * ZOOM_PADDING_FRACTION
  );
  const paddedWidth = bbox.width + pad * 2;
  const paddedHeight = bbox.height + pad * 2;

  const rawScale = Math.min(
    viewBox.width / paddedWidth,
    viewBox.height / paddedHeight
  );
  const scale = Math.min(ZOOM_MAX_SCALE, Math.max(1, rawScale));

  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;
  const viewBoxCenterX = viewBox.x + viewBox.width / 2;
  const viewBoxCenterY = viewBox.y + viewBox.height / 2;

  // transform-origin de .muscle-zoom-layer es 0 0 (ver CSS), así que el
  // offset ya incluye el corrimiento necesario para que el centro del bbox
  // (multiplicado por scale) caiga en el centro del viewBox.
  const offsetX = viewBoxCenterX - scale * centerX;
  const offsetY = viewBoxCenterY - scale * centerY;

  layer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

  zoomActive = true;
  updateZoomUi();
}

function resetZoom() {
  if (frontZoomLayer) frontZoomLayer.style.transform = "";
  if (backZoomLayer) backZoomLayer.style.transform = "";

  zoomActive = false;
  updateZoomUi();
}

function updateZoomUi() {
  shellEl?.classList.toggle("is-zoomed", zoomActive);

  if (!zoomResetButton) return;
  zoomResetButton.classList.toggle("is-visible", zoomActive);
  zoomResetButton.setAttribute("aria-hidden", String(!zoomActive));
  zoomResetButton.tabIndex = zoomActive ? 0 : -1;
}

function selectMuscle(muscle) {
  selectedMuscle = selectedMuscle === muscle ? null : muscle;
  applySelection();

  if (selectedMuscle) {
    applyZoomToMuscle(selectedMuscle);
  } else {
    resetZoom();
  }

  const muscleSelected = new CustomEvent("muscleSelected", {
    detail: { muscle: selectedMuscle },
  });
  document.dispatchEvent(muscleSelected);
  console.log("muscleSelected", muscleSelected.detail);
}

// Deselecciona el músculo activo (si hay uno) desde un disparador que no es
// "clickear el mismo músculo de nuevo": click en zona vacía del stage, botón
// "volver", o cambio de vista. Dispara "muscleSelected" con muscle:null
// (igual que el toggle en selectMuscle) para que el panel de texto también
// vuelva al resumen del grupo o al estado vacío.
function clearMuscleSelection() {
  if (selectedMuscle === null) return;

  selectedMuscle = null;
  applySelection();
  resetZoom();

  const muscleSelected = new CustomEvent("muscleSelected", {
    detail: { muscle: null },
  });
  document.dispatchEvent(muscleSelected);
}

document.addEventListener("click", (event) => {
  const path = event.target.closest(".muscle-path[data-muscle]");
  if (path) {
    selectMuscle(path.dataset.muscle);
    return;
  }

  // Salir del zoom sin tener que re-clickear el músculo exacto: cualquier
  // click en una zona vacía del stage (fuera de un músculo) deselecciona.
  if (selectedMuscle !== null && event.target.closest(".stage")) {
    clearMuscleSelection();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  const path = event.target.closest(".muscle-path[data-muscle]");
  if (!path) return;

  event.preventDefault(); // evita el scroll de página que dispara la barra espaciadora
  selectMuscle(path.dataset.muscle);
});
