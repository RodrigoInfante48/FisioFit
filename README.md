# FisioFit

Prototipo web de gimnasio + fisioterapia: una figura muscular interactiva que
se resalta (heatmap) según el patrón de movimiento (`Push` / `Pull` / `Legs`)
o el músculo seleccionado, junto con contenido sobre cómo ejercitarlo,
estirarlo y recuperarlo bajo el enfoque Heavy Duty / HIT (Mike Mentzer):
bajo volumen, alta intensidad, al fallo muscular.

Esta app no es un producto suelto: es el **bono de valor agregado** del
paquete FisioFit (sesión de ventosas + fisioterapia). El acceso está
gateado por login y cada panel de recuperación invita a agendar sesión por
WhatsApp. El razonamiento completo de negocio/marketing detrás de esta
decisión está en [`CLAUDE.md`](./CLAUDE.md) → "Modelo de negocio y
estrategia".

## Stack

HTML5 + CSS3 + JavaScript vanilla (ES6+). Sin frameworks, sin build step.
Dependencias externas: la fuente Rajdhani vía Google Fonts y el SDK de
**Firebase Auth** (cargado por `<script>` desde su CDN, sin npm/build step)
para el login.

## Acceso (login)

La app está gateada: `index.html` y `nutricion.html` redirigen a
`login.html` si no hay sesión de Firebase Auth activa. Las cuentas se crean
a mano desde Firebase Console (sin auto-registro) — ver el detalle completo
en [`CLAUDE.md`](./CLAUDE.md) → "Acceso — autenticación (Firebase Auth)".

Para que el login funcione hace falta:

1. Crear un proyecto Firebase nuevo (Spark/gratis alcanza) y habilitar
   **Authentication → Sign-in method → Email/Password**.
2. Copiar la config del proyecto (Configuración del proyecto → Tus apps →
   app web) en `scripts/firebase-config.js`, reemplazando los valores
   `TODO_*`.
3. Crear las cuentas de clientes a mano en Authentication → Users, con su
   email y un código de acceso de 6 dígitos.

Sin ese paso, `login.html` carga pero el sign-in falla (config placeholder).

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

Luego abrir `http://localhost:8000` (te va a redirigir a `login.html`).

## Estructura

```
index.html                    Entrenamiento — punto de entrada (raíz del repo)
login.html                    Pantalla de acceso (Firebase Auth)
nutricion.html                Sección de alimentación
styles/                       CSS (tokens, layout, figura, panel de info, login)
scripts/                      Lógica de la figura, heatmap, panel, auth
  firebase-config.js          Config de Firebase (placeholder, ver "Acceso")
  auth-guard.js                Gatea index.html / nutricion.html
  login.js                     Lógica de login.html
data/muscle-content.js        Contenido de ejercicio/estiramiento/recuperación por músculo
assets/                       SVGs de la figura (vista frontal y posterior)
CLAUDE.md                     Contexto de producto, filosofía de entrenamiento
                               y modelo de negocio/marketing
```

## Publicación en GitHub Pages

Este repo está listo para servirse tal cual desde GitHub Pages: `index.html`
está en la raíz y todas las rutas a `styles/`, `scripts/`, `data/` y `assets/`
son relativas, por lo que funcionan bajo cualquier subruta (por ejemplo
`https://rodrigoinfante48.github.io/FisioFit/`).
