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

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (ES6+).
- Sin frameworks, sin build step, sin dependencias externas.
- Debe funcionar directo en GitHub Pages sirviendo desde `/` con
  `index.html` en la raíz del repo.
