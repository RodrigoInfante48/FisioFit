// FisioFit — contenido textual por músculo (filosofía Mike Mentzer / Heavy
// Duty / HIT): bajo volumen, alta intensidad, al fallo, ejercicios compuestos
// priorizados sobre aislamiento, recuperación larga entre sesiones del mismo
// grupo. Nunca se sugiere alto volumen ni frecuencia alta sobre un músculo.
//
// Declarado como `const` de script clásico (no ES module, sin build step):
// queda disponible para los scripts que se cargan después en index.html.
const MUSCLE_CONTENT = {
  pecho: {
    nombre: "Pecho",
    grupo: "push",
    ejercicio:
      "Press de banca (barra o mancuernas) como movimiento compuesto " +
      "principal. Una sola serie de calentamiento progresivo y luego 1-2 " +
      "series de trabajo llevadas al fallo muscular positivo, técnica " +
      "estricta, sin rebote en el pecho ni ayuda de las piernas. Si al " +
      "terminar la serie sentís que podrías haber hecho una repetición " +
      "más con buena forma, no era el fallo real: el objetivo es la " +
      "última repetición imposible, no el volumen.",
    estiramiento:
      "Estiramiento de pectoral en marco de puerta o esquina: brazo a 90°, " +
      "antebrazo apoyado, el cuerpo avanza hasta sentir tensión (no dolor) " +
      "en el pecho y el hombro anterior. Mantener 20-30 segundos por lado, " +
      "respiración lenta, sin rebotar.",
    recuperacion:
      "El pecho necesita entre 5 y 7 días completos antes de volver a " +
      "recibir un estímulo directo de esta intensidad. Señales de que " +
      "todavía no recuperó: dolor residual al tacto, pérdida de fuerza " +
      "respecto a la sesión anterior o fatiga que persiste más allá de 48h. " +
      "Entrenarlo de nuevo antes de tiempo interrumpe la supercompensación " +
      "y frena el progreso real.",
  },
  "deltoide-anterior": {
    nombre: "Deltoide anterior",
    grupo: "push",
    ejercicio:
      "Recibe estímulo indirecto suficiente desde el press de banca y el " +
      "press militar; no hace falta aislarlo con ejercicios extra. Si se " +
      "entrena de forma directa, un solo ejercicio (press militar estricto " +
      "o press de hombro con mancuernas) con 1 serie al fallo alcanza y " +
      "sobra: agregar más series solo acumula fatiga sin acumular estímulo.",
    estiramiento:
      "Estiramiento cruzado de hombro (brazo estirado al frente del " +
      "cuerpo, sostenido con el otro brazo a la altura del codo) y " +
      "estiramiento de deltoide anterior en marco de puerta con el brazo " +
      "por debajo de la altura del hombro. 20-30 segundos por lado, sin " +
      "forzar la articulación.",
    recuperacion:
      "Al recibir carga en cada sesión de Push, respeta el mismo descanso " +
      "que el pecho: 5-7 días antes de la siguiente sesión de empuje. " +
      "Dolor en la parte frontal del hombro al levantar el brazo o " +
      "chasquidos dolorosos son señal de que necesita más días, no menos.",
  },
  "deltoide-lateral": {
    nombre: "Deltoide lateral",
    grupo: "push",
    ejercicio:
      "Elevaciones laterales estrictas como único ejercicio de aislamiento " +
      "para este haz, 1 serie al fallo con control total en la fase " +
      "negativa. Priorizá la técnica limpia sobre el peso: usar impulso o " +
      "balanceo le quita el estímulo directo al deltoide y se lo pasa a " +
      "trapecio, que no es el objetivo.",
    estiramiento:
      "Brazo cruzado al frente del pecho, sostenido con el otro brazo por " +
      "encima del codo, tirando suavemente hacia el hombro contrario. " +
      "20-30 segundos por lado, tensión suave y constante.",
    recuperacion:
      "5-7 días de descanso antes de volver a estimularlo directamente. " +
      "Si al levantar el brazo lateralmente sentís fatiga o molestia " +
      "residual de la sesión anterior, todavía no está listo para otra " +
      "serie al fallo.",
  },
  triceps: {
    nombre: "Tríceps",
    grupo: "push",
    ejercicio:
      "Fondos en paralelas o press francés como movimiento principal, " +
      "priorizado sobre extensiones de aislamiento. 1-2 series al fallo, " +
      "recorrido completo, bloqueo estricto de codo sin trabar la " +
      "articulación de golpe. El press de banca y el press militar ya lo " +
      "involucran fuerte, así que un solo ejercicio directo es suficiente.",
    estiramiento:
      "Brazo elevado, codo flexionado detrás de la cabeza, empujando " +
      "suavemente con la otra mano sobre el codo hacia abajo y atrás. " +
      "20-30 segundos por lado.",
    recuperacion:
      "5-7 días antes de la próxima sesión que lo involucre (Push " +
      "completo). Al ser un músculo pequeño que además recibe carga " +
      "indirecta del pecho y el hombro, es fácil sobreentrenarlo si se " +
      "impacienta la vuelta: respetá el descanso aunque \"se sienta " +
      "liviano\" antes de tiempo.",
  },
  "dorsal-ancho": {
    nombre: "Dorsal ancho",
    grupo: "pull",
    ejercicio:
      "Dominadas (o jalón al pecho si todavía no hay fuerza para " +
      "dominadas estrictas) como ejercicio compuesto principal de espalda. " +
      "1-2 series al fallo absoluto, tirando con el codo y no con la mano, " +
      "pausa breve en la contracción máxima, bajada controlada sin dejarse " +
      "caer.",
    estiramiento:
      "Colgado de una barra con los brazos extendidos, dejando que el " +
      "propio peso del cuerpo estire dorsal y espalda alta durante 20-30 " +
      "segundos, o alternativamente sentado con el brazo cruzado por " +
      "encima de la cabeza inclinando el torso hacia el lado contrario.",
    recuperacion:
      "El dorsal es un músculo grande que responde igual que el pecho: " +
      "5-7 días completos antes de volver a tirar con esta intensidad. " +
      "Pérdida de fuerza de agarre o de repeticiones respecto a la sesión " +
      "anterior es la señal más clara de que aún no recuperó del todo.",
  },
  "espalda-media": {
    nombre: "Espalda media",
    grupo: "pull",
    ejercicio:
      "Remo con barra o remo en máquina, torso fijo, tirando hacia el " +
      "abdomen con los codos pegados al cuerpo. 1-2 series al fallo, sin " +
      "usar impulso de cadera para completar repeticiones: si aparece el " +
      "balanceo, la serie terminó ahí, no antes con trampa.",
    estiramiento:
      "Sentado o de pie, brazos extendidos al frente sosteniendo un punto " +
      "fijo, dejando caer el peso del torso hacia atrás para abrir la " +
      "espalda media. 20-30 segundos, respiración profunda.",
    recuperacion:
      "5-7 días antes de la próxima sesión de Pull. Rigidez o dolor entre " +
      "los omóplatos al día siguiente de entrenar es normal a las 24-48h, " +
      "pero si persiste más allá de eso, esperá un día extra antes de " +
      "volver a cargarla.",
  },
  biceps: {
    nombre: "Bíceps",
    grupo: "pull",
    ejercicio:
      "Ya recibe trabajo indirecto considerable en dominadas y remo. Si se " +
      "aísla, un solo ejercicio (curl con barra o mancuernas, estricto, " +
      "sin balancear el torso) con 1 serie al fallo es más que suficiente: " +
      "es un músculo pequeño y se sobreentrena fácil si se le agregan " +
      "series extra \"porque sí\".",
    estiramiento:
      "Brazo extendido detrás del cuerpo con la palma hacia arriba, " +
      "apoyado contra una pared o marco, girando el torso levemente hacia " +
      "el lado contrario hasta sentir tensión en el bíceps. 20-30 " +
      "segundos por lado.",
    recuperacion:
      "5-7 días antes de volver a estimularlo de forma directa. Al recibir " +
      "carga indirecta en cada sesión de Pull, forzarlo de nuevo antes de " +
      "tiempo (por ejemplo agregando curls en días sueltos) es la forma " +
      "más común de estancarse por sobreentrenamiento de este músculo.",
  },
  "deltoide-posterior": {
    nombre: "Deltoide posterior",
    grupo: "pull",
    ejercicio:
      "Aperturas invertidas (pájaros) con mancuernas o en máquina peck-deck " +
      "invertido, torso inclinado, codos con leve flexión fija. 1 serie al " +
      "fallo, foco en apretar el omóplato al final del recorrido en lugar " +
      "de mover peso por moverlo.",
    estiramiento:
      "Brazo cruzado al frente del pecho a la altura del hombro, sostenido " +
      "con el otro brazo por debajo del codo, tirando suavemente hacia el " +
      "cuerpo. 20-30 segundos por lado.",
    recuperacion:
      "5-7 días antes de la próxima sesión de Pull. Es un haz pequeño que " +
      "se fatiga rápido pero también se recupera de forma pareja con el " +
      "resto del grupo: no hace falta ni conviene entrenarlo por separado " +
      "en días intermedios.",
  },
  trapecio: {
    nombre: "Trapecio",
    grupo: "pull",
    ejercicio:
      "Recibe estímulo directo del remo y la dominada; si se agrega " +
      "trabajo aislado, encogimientos de hombros (\"shrugs\") con barra o " +
      "mancuernas, 1 serie al fallo, subiendo recto sin rodar los hombros " +
      "hacia adelante ni atrás, pausa en la contracción máxima.",
    estiramiento:
      "Inclinar la cabeza hacia un lado acercando la oreja al hombro, con " +
      "una mano ayudando suavemente desde la sien, sin tirar del cuello " +
      "con fuerza. 20-30 segundos por lado.",
    recuperacion:
      "5-7 días antes de volver a cargarlo con series al fallo. El " +
      "trapecio tiende a acumular tensión general por estrés diario " +
      "además del entrenamiento: si sigue rígido pasado ese período, un " +
      "día extra de descanso rinde más que forzar la próxima sesión.",
  },
  cuadriceps: {
    nombre: "Cuádriceps",
    grupo: "legs",
    ejercicio:
      "Sentadilla (o prensa de piernas si la técnica de sentadilla libre " +
      "todavía no es sólida) como movimiento compuesto principal de la " +
      "sesión de piernas. 1-2 series al fallo, profundidad completa " +
      "controlada, sin rebotar en el punto más bajo. Es el ejercicio más " +
      "demandante de todo el entrenamiento: una sola serie bien hecha al " +
      "fallo ya es un estímulo enorme, no hacen falta series adicionales.",
    estiramiento:
      "De pie, sosteniendo el tobillo por detrás del cuerpo y llevando el " +
      "talón hacia el glúteo, rodillas juntas, cadera empujada levemente " +
      "hacia adelante. 20-30 segundos por lado, apoyándose de una pared si " +
      "hace falta equilibrio.",
    recuperacion:
      "El cuádriceps es el músculo que más tarda en recuperarse de todo el " +
      "cuerpo: 6-8 días completos antes de la siguiente sesión de piernas. " +
      "Dolor muscular (agujetas) que todavía se siente al bajar escaleras, " +
      "o piernas \"pesadas\" al caminar, son señal clara de que el cuerpo " +
      "sigue reconstruyendo tejido y necesita más días, nunca menos.",
  },
  gluteos: {
    nombre: "Glúteos",
    grupo: "legs",
    ejercicio:
      "Ya reciben una carga enorme desde la sentadilla; el peso muerto " +
      "rumano suma el segundo estímulo compuesto clave. 1-2 series al " +
      "fallo, cadera hacia atrás sin redondear la zona lumbar, apretando " +
      "fuerte el glúteo en la extensión final de cada repetición.",
    estiramiento:
      "Sentado, tobillo de una pierna apoyado sobre la rodilla contraria, " +
      "inclinando el torso hacia adelante manteniendo la espalda recta " +
      "hasta sentir el estiramiento en el glúteo. 20-30 segundos por lado.",
    recuperacion:
      "6-8 días antes de volver a someterlos a esta intensidad, igual que " +
      "el cuádriceps al compartir sesión. Molestia al sentarse o al subir " +
      "escalones más allá de las 48-72h indica que la recuperación todavía " +
      "no terminó.",
  },
  isquiotibiales: {
    nombre: "Isquiotibiales",
    grupo: "legs",
    ejercicio:
      "Peso muerto rumano como movimiento principal (compuesto, prioridad " +
      "sobre el curl femoral aislado), rodillas con flexión leve y fija, " +
      "bajando la barra pegada a las piernas hasta sentir el estiramiento, " +
      "sin redondear la espalda. 1-2 series al fallo, técnica estricta.",
    estiramiento:
      "Pierna extendida apoyada sobre un soporte a baja altura, espalda " +
      "recta, inclinando el torso desde la cadera hacia adelante hasta " +
      "sentir tensión detrás del muslo. 20-30 segundos por lado.",
    recuperacion:
      "6-8 días antes de la siguiente sesión de piernas. Los isquiotibiales " +
      "son propensos a molestias si se entrenan sin haber recuperado del " +
      "todo: cualquier tirantez residual al caminar o al flexionar el " +
      "torso es motivo suficiente para sumar un día más de descanso.",
  },
  gemelos: {
    nombre: "Gemelos",
    grupo: "legs",
    ejercicio:
      "Elevación de talones de pie o sentado, recorrido completo desde el " +
      "estiramiento máximo hasta la contracción máxima, con una pausa " +
      "breve arriba. 1-2 series al fallo: es un músculo acostumbrado al " +
      "esfuerzo diario (caminar, subir escaleras), así que el fallo real " +
      "suele tardar más en llegar y hay que ser estricto para no cortar la " +
      "serie antes de tiempo.",
    estiramiento:
      "De pie frente a una pared, un pie atrás con el talón apoyado en el " +
      "piso y la rodilla extendida, inclinando el cuerpo hacia la pared " +
      "hasta sentir el estiramiento en la pantorrilla. 20-30 segundos por " +
      "lado.",
    recuperacion:
      "5-6 días antes de volver a entrenarlos de forma directa. Al recibir " +
      "uso constante fuera del gimnasio, es tentador entrenarlos más " +
      "seguido pensando que \"aguantan más\" — pero sin descanso completo " +
      "el estímulo directo se diluye igual que en cualquier otro músculo.",
  },
};
