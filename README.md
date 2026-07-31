# FisioFit

Prototipo web de gimnasio + fisioterapia: una figura muscular interactiva que
se resalta (heatmap) según el patrón de movimiento (`Push` / `Pull` / `Legs`)
o el músculo seleccionado, junto con contenido sobre cómo ejercitarlo,
estirarlo y recuperarlo bajo el enfoque Heavy Duty / HIT (Mike Mentzer):
bajo volumen, alta intensidad, al fallo muscular.

## Stack

HTML5 + CSS3 + JavaScript vanilla (ES6+). Sin frameworks, sin build step,
sin dependencias externas (aparte de la fuente Rajdhani vía Google Fonts).

## Cómo correrlo localmente

Como el JS carga los SVG con `fetch()`, hace falta servir los archivos por
HTTP (abrir `index.html` con `file://` no funciona por CORS). Cualquier
servidor estático sirve:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Luego abrir `http://localhost:8000`.

## Estructura

```
index.html                    Punto de entrada (raíz del repo)
styles/                       CSS (tokens, layout, figura, panel de info)
scripts/                      Lógica de la figura, heatmap y panel
data/muscle-content.js        Contenido de ejercicio/estiramiento/recuperación por músculo
assets/                       SVGs de la figura (vista frontal y posterior)
```

## Publicación en GitHub Pages

Este repo está listo para servirse tal cual desde GitHub Pages: `index.html`
está en la raíz y todas las rutas a `styles/`, `scripts/`, `data/` y `assets/`
son relativas, por lo que funcionan bajo cualquier subruta (por ejemplo
`https://rodrigoinfante48.github.io/FisioFit/`).
