# FisioFit — Contexto del proyecto

Prototipo web de gimnasio + fisioterapia. **HTML5 + CSS3 + JavaScript vanilla
(ES6+), sin frameworks, sin build step.** Debe funcionar sirviendo directo
desde GitHub Pages con `index.html` en la raíz del repo.

## Concepto

La app tiene 3 bloques verticales:

1. **Menú superior**: botones `Push` / `Pull` / `Legs`.
2. **Centro**: figura humana "sin piel" (muscular), que flota/suspende y se
   puede rotar entre vista frontal y posterior. Al presionar un botón del
   menú se resaltan (heatmap) los músculos involucrados en ese patrón de
   movimiento. Al hacer click en un músculo individual, este se selecciona.
3. **Abajo**: panel de texto que explica cómo se ejercita, estira y
   recupera el músculo seleccionado (o el grupo completo si no hay
   selección individual).

## Filosofía de entrenamiento (Mike Mentzer / Heavy Duty / HIT)

Todo el contenido textual sobre ejercicio debe reflejar este enfoque:

- Bajo volumen, alta intensidad, entrenar **al fallo muscular**.
- Priorizar **ejercicios compuestos** sobre aislamiento.
- Recuperación **larga** entre sesiones del mismo grupo muscular (varios
  días, nunca "todos los días").
- Pocas series, técnica estricta, al fallo.
- **Nunca** recomendar alto volumen ni entrenar el mismo grupo muscular con
  alta frecuencia.

## Mapeo músculo → botón (intensidad para heatmap, escala 0.0–1.0)

**Push**
- Pecho: 1.0
- Deltoide anterior/lateral: 0.7
- Tríceps: 0.6

**Pull**
- Dorsal ancho / espalda media: 1.0
- Bíceps: 0.6
- Deltoide posterior: 0.5
- Trapecio: 0.4

**Legs**
- Cuádriceps: 1.0
- Glúteos: 0.9
- Isquiotibiales: 0.8
- Gemelos: 0.5

## Diseño visual — "Liquid Glass" + Heatmap

- Estética de vidrio líquido: paneles translúcidos (`backdrop-filter: blur`),
  bordes con gradiente sutil que simula refracción de luz, sombras suaves
  flotantes, leve distorsión/brillo especular en hover.
- No es glassmorphism plano genérico: debe sentirse premium.
- Fondo oscuro (dark mode), con acentos de color vivos solo en elementos
  interactivos.
- Heatmap: los músculos no son on/off, tienen intensidad continua. El color
  interpola de un tono frío/transparente (inactivo) a rojo-naranja intenso
  (máxima intensidad) según el valor 0.0–1.0 de cada músculo.
- **Navegación del header**: SIEMPRE vive detrás de un botón de hamburguesa
  en la esquina superior izquierda, que abre un panel lateral deslizante
  desde la derecha (angosto, ~260-320px, translúcido tipo Liquid Glass,
  nunca pantalla completa ni muy opaco). Este patrón es IDÉNTICO en mobile
  y en desktop — no existe una versión de header con botones en fila para
  pantallas grandes. Web y mobile deben coincidir siempre.

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (ES6+).
- Sin frameworks, sin build step. Única dependencia externa real: Firebase
  Auth (ver abajo), cargada vía `<script>` desde su CDN — no rompe el "sin
  build step", sí rompe el "sin dependencias externas" original.
- Debe funcionar directo en GitHub Pages sirviendo desde `/` con
  `index.html` en la raíz del repo.

## Acceso — autenticación (Firebase Auth)

La app **no es pública**: está gateada con login (`login.html`). Solo
entran quienes ya compraron un paquete FisioFit (ver "Modelo de negocio"
abajo) — el acceso es en sí mismo parte del producto que se vende.

- **Fase actual (manual)**: no hay auto-registro. Las cuentas se crean a
  mano desde Firebase Console → Authentication → Users → *Add user*, con
  el email del cliente y un código de acceso de **6 dígitos numéricos**
  (mínimo que exige Firebase Auth para password; no 4, como pediría un PIN
  de débito real, pero se comporta igual desde la experiencia del
  usuario). Rodrigo genera y entrega ese código al confirmar el pago del
  paquete. **Importante para evitar el loop de reset/keyboard-mismatch que
  ya pasó una vez**: Firebase Auth no impone máximo de largo ni restringe
  el password a dígitos — "6 dígitos numéricos" es una convención nuestra,
  no algo que Firebase valide. Por eso el input de `login.html` **no**
  fuerza `maxlength="6"` ni teclado numérico (`inputmode="numeric"`): si el
  código real que quedó seteado en Firebase Console tiene más de 6
  caracteres o incluye letras, el usuario igual tiene que poder tipearlo
  completo y ver lo que escribió (toggle de "mostrar código"). Si Rodrigo
  necesita generar un código a mano, que sea efectivamente 6 dígitos
  numéricos para mantener la convención — pero el login no debe asumirlo
  ni bloquear otra cosa.
- **Fase futura (opcional, cuando haya volumen)**: automatizar la creación
  de cuenta + email de bienvenida al confirmarse el pago (Cloud Function
  disparada por el medio de pago, o Make/Zapier).
- `scripts/firebase-config.js` trae valores placeholder
  (`TODO_API_KEY`, `TODO_PROJECT_ID`) — hay que crear un proyecto Firebase
  **nuevo y dedicado a FisioFit** (no reusar "Daily Duty Institute", que es
  otro producto) y pegar ahí su config real. Es seguro que esa config
  quede pública en el repo: la `apiKey` de Firebase no es secreta, la
  seguridad la dan las cuentas creadas a mano (sin auto-registro
  habilitado) y las reglas del proyecto.
- `scripts/auth-guard.js` protege `index.html` y `nutricion.html`:
  redirige a `login.html` si no hay sesión activa, y revela `.auth-gated`
  recién cuando Firebase confirma la sesión (evita flash de contenido
  protegido).
- `login.html` + `scripts/login.js`: pantalla de acceso con email + código
  de acceso. Incluye toggle de "mostrar código" (para verificar en el
  teclado del celular qué se tipeó antes de enviar) y un link de "¿Olvidaste
  tu código de acceso?" que dispara `sendPasswordResetEmail` de Firebase —
  autoservicio para que el cliente elija su propio código sin depender de
  que Rodrigo lo resetee a mano cada vez. También incluye una CTA de
  WhatsApp para quien todavía no compró el paquete y llega sin
  credenciales.

## Modelo de negocio y estrategia

FisioFit-app **no es el producto**: es el bono de valor agregado del
ticket real, que es el paquete físico (sesión de ventosas + fisioterapia,
con Camila y su pareja como fisioterapeutas). El objetivo de negocio de
esta app es subir el valor percibido de ese ticket y dar una razón
concreta para que el cliente vuelva a agendar. Cualquier decisión técnica
sobre este repo debería evaluarse contra los tres objetivos de la última
sección, no contra "qué es más interesante de construir".

**Cómo se conecta la pieza tech con la pieza de negocio:**

1. **Acceso como incentivo de compra.** Comprar un paquete FisioFit da,
   como bono, usuario y contraseña de esta app. Refuerza que el paquete no
   es "solo una sesión", es una experiencia con seguimiento post-sesión.
2. **La app como herramienta de autoconocimiento.** Dejar que el cliente
   explore qué músculos trabajó, cómo entrenarlos/estirarlos bajo el
   enfoque Heavy Duty, y cuándo puede volver a entrenarlos sin
   sobreentrenar, construye la percepción de que el negocio entiende su
   cuerpo a nivel experto. Esa percepción es la que después vende la
   sesión de recuperación.
3. **CTA de recuperación → agenda.** Cada bloque de "Recuperación" (por
   músculo individual y por grupo Push/Pull/Legs, en
   `scripts/muscle-content-panel.js` → `buildRecoveryCTA`) incluye una
   card que invita a agendar sesión de ventosas/fisioterapia con Cami o
   Pipe, con link directo a WhatsApp y mensaje prearmado mencionando qué
   trabajó el cliente. Hoy apunta al WhatsApp de Rodrigo
   (`+57 320 997 4750`) — es el punto de conversión real de la app, todo
   lo demás es la excusa para que el cliente llegue hasta ahí.
4. **Roadmap de agenda.** Por ahora el flujo de reserva es manual:
   WhatsApp → cobro → coordinación a mano. Cuando haya volumen suficiente,
   conectar el cobro con Google Calendar (Calendar API o Make/Zapier) para
   que al confirmarse el pago se cree automáticamente el evento con
   invitado(s) y ubicación, sin intervención manual de Rodrigo.
5. **Pipeline de contenido / marketing.** La app misma es fuente de
   contenido para redes: cada patrón (Push/Pull/Legs), cada músculo y su
   ficha de recuperación es una pieza de contenido potencial — reels
   educativos ("qué músculos trabajaste hoy"), mitos de recuperación, por
   qué Heavy Duty necesita más descanso que el entrenamiento de alto
   volumen, testimonios de clientes que usaron la app y después agendaron
   ventosas. Documentar sesiones reales de clientes (antes/después, dudas
   frecuentes que surgen al mirar el panel de recuperación) es insumo
   directo de contenido, y ese contenido alimenta el funnel que trae más
   gente a comprar el ticket con el bono FisioFit incluido.

**Objetivo de negocio de esta integración**: (a) subir el ticket promedio
con la sesión de ventosas/fisioterapia, (b) dar una razón de
retención/recompra semanal, (c) generar contenido orgánico recurrente para
redes a partir de datos reales de clientes. Alta conversión semanal se
mide en agendas de ventosas/fisioterapia generadas desde la CTA de la app,
no en usuarios activos de la app por sí sola.
