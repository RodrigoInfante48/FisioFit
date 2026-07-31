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

async function loadMuscleFigure() {
  const stage = document.querySelector(".stage");
  if (!stage) return;

  const shell = document.createElement("div");
  shell.className = "figure-shell";

  const float = document.createElement("div");
  float.className = "figure-float";
  shell.appendChild(float);

  stage.appendChild(shell);

  try {
    const response = await fetch(FRONT_VIEW_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    float.innerHTML = await response.text();
    figureReady = true;
    applyHeatmap(pendingGroup);
  } catch (error) {
    console.error("No se pudo cargar la figura muscular:", error);
    float.textContent = "No se pudo cargar la figura.";
  }
}

loadMuscleFigure();

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
