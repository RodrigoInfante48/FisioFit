// FisioFit — carga e inyección de la figura muscular (SVG inline).
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
  } catch (error) {
    console.error("No se pudo cargar la figura muscular:", error);
    float.textContent = "No se pudo cargar la figura.";
  }
}

loadMuscleFigure();
