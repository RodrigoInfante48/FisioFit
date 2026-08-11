// FisioFit — plan nutricional semanal, pensado como complemento del
// entrenamiento HIT (Heavy Duty): pocas sesiones por semana, pero muy
// intensas, con varios días completos de recuperación entre ellas. La
// nutrición tiene que sostener esa recuperación (proteína suficiente,
// calorías estables) sin caer en volumen de comida innecesario ni en
// déficits agresivos que compitan con la ganancia de masa muscular.
//
// Las calorías y gramos de proteína son aproximados (alimentos reales,
// porciones caseras): sirven como referencia y punto de partida, no como
// prescripción exacta — se ajustan según peso corporal y objetivo de
// cada persona.
//
// Declarado como `const` de script clásico (no ES module, sin build step):
// queda disponible para los scripts que se cargan después en nutricion.html.
const NUTRITION_INTRO = {
  titulo: "Comer para recuperar, no para llenar",
  texto:
    "En Heavy Duty entrenás poco pero al fallo: el estímulo es breve e " +
    "intenso, y la mejora real pasa en los días de descanso, cuando el " +
    "músculo se repara y crece. Eso no pasa solo — necesita materia prima. " +
    "La proteína suficiente (repartida en varias comidas) y un nivel " +
    "calórico estable son los que sostienen esa recuperación. Nada de " +
    "volumen de comida porque sí, ni déficits agresivos que compitan con " +
    "la ganancia de masa muscular: el objetivo es aumentar músculo " +
    "mientras la grasa corporal se mantiene estable o baja apenas, de " +
    "forma sostenida. Los días de entrenamiento llevan algo más de " +
    "carbohidrato alrededor de la sesión; los de descanso bajan un poco " +
    "la energía total sin sacrificar proteína.",
};

const NUTRITION_PLAN = [
  {
    id: "lunes",
    dia: "Lunes",
    foco: "Push — pecho, hombros, tríceps",
    grupo: "push",
    totalCalorias: 2410,
    proteinaAprox: 156,
    nota:
      "Carbohidrato distribuido alrededor del entrenamiento para llegar con " +
      "energía a la sesión y arrancar la recuperación apenas termina.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "7:00",
        nombre: "Avena con huevos y banana",
        icono: "desayuno",
        alimentos: ["3 huevos enteros", "60 g de avena", "1 banana", "15 g de mantequilla de maní"],
        descripcion:
          "Carbohidrato de absorción lenta más proteína completa para arrancar " +
          "el día con energía estable, sin picos de glucosa.",
        calorias: 640,
      },
      {
        tipo: "Almuerzo",
        hora: "13:00",
        nombre: "Pollo con arroz integral y brócoli",
        icono: "almuerzo",
        alimentos: ["200 g de pechuga de pollo", "150 g de arroz integral cocido", "brócoli al vapor", "1 cda de aceite de oliva"],
        descripcion:
          "Base del día: proteína magra en cantidad más carbohidrato complejo " +
          "para reponer el glucógeno que vas a gastar en la sesión de Push.",
        calorias: 690,
      },
      {
        tipo: "Merienda",
        hora: "17:00",
        nombre: "Batido post-entreno",
        icono: "merienda",
        alimentos: ["1 scoop de proteína whey", "1 banana", "250 ml de leche", "20 g de avena"],
        descripcion:
          "Ventana post-entreno: proteína de rápida absorción más carbohidrato " +
          "para arrancar la recuperación del pecho, hombros y tríceps recién " +
          "trabajados.",
        calorias: 420,
      },
      {
        tipo: "Cena",
        hora: "21:00",
        nombre: "Salmón con batata y ensalada",
        icono: "cena",
        alimentos: ["180 g de salmón", "200 g de batata al horno", "ensalada verde", "1 cda de aceite de oliva"],
        descripcion:
          "Grasas buenas y proteína de calidad para sostener la síntesis " +
          "proteica durante la noche, cuando ocurre gran parte de la " +
          "recuperación.",
        calorias: 660,
      },
    ],
  },
  {
    id: "martes",
    dia: "Martes",
    foco: "Descanso — recuperación activa",
    grupo: "rest",
    totalCalorias: 2030,
    proteinaAprox: 144,
    nota:
      "Sin sesión directa: la energía total baja un poco, pero la proteína " +
      "se mantiene alta para seguir reparando el pecho, hombros y tríceps " +
      "trabajados el día anterior.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "7:30",
        nombre: "Yogur griego con frutos rojos y nueces",
        icono: "desayuno",
        alimentos: ["250 g de yogur griego natural", "1 taza de frutos rojos", "20 g de nueces", "1 cda de miel"],
        descripcion:
          "Proteína de rápida digestión y antioxidantes para arrancar un día " +
          "sin entrenamiento directo, mientras el cuerpo sigue reparando el " +
          "tejido del día anterior.",
        calorias: 450,
      },
      {
        tipo: "Almuerzo",
        hora: "13:00",
        nombre: "Ensalada de atún con garbanzos",
        icono: "almuerzo",
        alimentos: ["2 latas de atún al natural", "150 g de garbanzos cocidos", "tomate, pepino y hojas verdes", "1 cda de aceite de oliva"],
        descripcion:
          "Proteína magra y carbohidrato de bajo índice glucémico: energía " +
          "suficiente sin acumular excedente en una jornada de menor gasto.",
        calorias: 580,
      },
      {
        tipo: "Merienda",
        hora: "17:00",
        nombre: "Huevos duros y palta",
        icono: "merienda",
        alimentos: ["3 huevos duros", "1/2 palta", "1 rebanada de pan integral"],
        descripcion:
          "Grasas insaturadas y proteína completa para sostener la saciedad " +
          "hasta la cena.",
        calorias: 440,
      },
      {
        tipo: "Cena",
        hora: "20:30",
        nombre: "Pavo con quinoa y vegetales salteados",
        icono: "cena",
        alimentos: ["180 g de pechuga de pavo", "100 g de quinoa cocida", "vegetales salteados (zapallito, morrón, cebolla)"],
        descripcion:
          "Cierre alto en proteína y moderado en carbohidrato: favorece la " +
          "recuperación nocturna sin sumar calorías de más en un día de " +
          "descanso.",
        calorias: 560,
      },
    ],
  },
  {
    id: "miercoles",
    dia: "Miércoles",
    foco: "Pull — espalda, bíceps",
    grupo: "pull",
    totalCalorias: 2200,
    proteinaAprox: 144,
    nota:
      "Carbohidrato simple cerca del entrenamiento para tener glucógeno " +
      "disponible antes del trabajo de dorsal y espalda media.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "7:00",
        nombre: "Tostadas con huevo y palta",
        icono: "desayuno",
        alimentos: ["2 huevos enteros + 3 claras", "2 rebanadas de pan integral", "1/2 palta", "tomate"],
        descripcion:
          "Proteína completa y grasas buenas para sostener el entrenamiento " +
          "de espalda que viene más tarde, sin sobrecargar el estómago.",
        calorias: 520,
      },
      {
        tipo: "Almuerzo",
        hora: "13:00",
        nombre: "Carne magra con arroz y ensalada",
        icono: "almuerzo",
        alimentos: ["200 g de carne magra", "150 g de arroz blanco cocido", "ensalada mixta", "1 cda de aceite de oliva"],
        descripcion:
          "Hierro y proteína de alto valor biológico, con carbohidrato simple " +
          "para tener energía disponible antes de la sesión de Pull.",
        calorias: 720,
      },
      {
        tipo: "Merienda",
        hora: "17:30",
        nombre: "Batido post-entreno con arroz inflado",
        icono: "merienda",
        alimentos: ["1 scoop de proteína whey", "250 ml de leche descremada", "30 g de arroz inflado o cereal simple"],
        descripcion:
          "Reposición rápida después del trabajo de dorsal, bíceps y " +
          "trapecio: proteína de absorción veloz y carbohidrato de alto " +
          "índice glucémico.",
        calorias: 400,
      },
      {
        tipo: "Cena",
        hora: "21:00",
        nombre: "Merluza con puré de batata",
        icono: "cena",
        alimentos: ["200 g de merluza u otro pescado blanco", "200 g de batata en puré", "espinaca salteada"],
        descripcion:
          "Proteína magra y de fácil digestión para no interferir con el " +
          "sueño, con carbohidrato para terminar de reponer reservas.",
        calorias: 560,
      },
    ],
  },
  {
    id: "jueves",
    dia: "Jueves",
    foco: "Descanso — recuperación activa",
    grupo: "rest",
    totalCalorias: 1940,
    proteinaAprox: 129,
    nota:
      "Día más liviano en carbohidrato: sin sesión de entrenamiento no hace " +
      "falta reponer glucógeno de forma agresiva, pero la proteína sigue " +
      "firme.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "7:30",
        nombre: "Licuado de proteína con avena y almendras",
        icono: "desayuno",
        alimentos: ["1 scoop de proteína whey", "300 ml de leche", "40 g de avena", "10 g de almendras"],
        descripcion:
          "Desayuno rápido y denso en proteína, ideal para los días donde el " +
          "apetito es más bajo por no haber entrenado el día anterior.",
        calorias: 500,
      },
      {
        tipo: "Almuerzo",
        hora: "13:00",
        nombre: "Lentejas con pollo desmenuzado",
        icono: "almuerzo",
        alimentos: ["150 g de lentejas cocidas", "150 g de pechuga de pollo desmenuzada", "zanahoria, cebolla y morrón salteados"],
        descripcion:
          "Combinación de proteína animal y legumbre: fibra y micronutrientes " +
          "en un día de menor exigencia física.",
        calorias: 600,
      },
      {
        tipo: "Merienda",
        hora: "17:00",
        nombre: "Yogur con granola casera",
        icono: "merienda",
        alimentos: ["200 g de yogur natural", "30 g de granola sin azúcar añadida", "1 manzana"],
        descripcion:
          "Opción liviana para sostener la energía de la tarde sin acumular " +
          "excedente calórico.",
        calorias: 420,
      },
      {
        tipo: "Cena",
        hora: "20:30",
        nombre: "Tortilla de claras con vegetales y queso",
        icono: "cena",
        alimentos: ["5 claras + 1 huevo entero", "espinaca, champiñones y cebolla", "30 g de queso magro"],
        descripcion:
          "Cena alta en proteína y baja en carbohidrato: en un día sin " +
          "entrenamiento no hace falta reponer glucógeno de forma agresiva.",
        calorias: 420,
      },
    ],
  },
  {
    id: "viernes",
    dia: "Viernes",
    foco: "Legs — cuádriceps, glúteos, isquiotibiales, gemelos",
    grupo: "legs",
    totalCalorias: 2360,
    proteinaAprox: 155,
    nota:
      "Piernas es el grupo más grande: doble fuente de carbohidrato en el " +
      "almuerzo para llegar con buen nivel de energía a la sesión más " +
      "demandante de la semana.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "7:00",
        nombre: "Panqueques de avena y huevo con banana",
        icono: "desayuno",
        alimentos: ["3 huevos", "50 g de avena", "1 banana", "canela"],
        descripcion:
          "Carbohidrato de calidad y proteína completa: conviene llegar con " +
          "buena energía antes de trabajar el grupo muscular más grande.",
        calorias: 560,
      },
      {
        tipo: "Almuerzo",
        hora: "13:00",
        nombre: "Carne magra con arroz, porotos y ensalada",
        icono: "almuerzo",
        alimentos: ["200 g de carne magra", "120 g de arroz integral", "100 g de porotos negros", "ensalada de hojas verdes"],
        descripcion:
          "Doble fuente de carbohidrato (arroz y legumbre) para maximizar el " +
          "glucógeno disponible antes de sentadilla, peso muerto rumano y " +
          "prensa.",
        calorias: 760,
      },
      {
        tipo: "Merienda",
        hora: "16:30",
        nombre: "Batido pre-entreno",
        icono: "merienda",
        alimentos: ["1 banana", "1 scoop de proteína whey", "250 ml de leche", "1 cda de miel"],
        descripcion:
          "Energía rápida antes de la sesión: no conviene entrenar piernas en " +
          "ayunas si el objetivo es rendir bien hasta el fallo.",
        calorias: 420,
      },
      {
        tipo: "Cena",
        hora: "21:00",
        nombre: "Pollo con quinoa y vegetales asados",
        icono: "cena",
        alimentos: ["200 g de pechuga de pollo", "120 g de quinoa cocida", "zapallo, berenjena y morrón asados"],
        descripcion:
          "Cierre alto en proteína para la reparación de cuádriceps, glúteos, " +
          "isquiotibiales y gemelos, que van a necesitar varios días " +
          "completos antes de la próxima sesión de Legs.",
        calorias: 620,
      },
    ],
  },
  {
    id: "sabado",
    dia: "Sábado",
    foco: "Descanso — recuperación",
    grupo: "rest",
    totalCalorias: 1860,
    proteinaAprox: 125,
    nota:
      "Energía total más baja, acorde al menor gasto del fin de semana, sin " +
      "resignar proteína ni calidad de los alimentos.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "8:30",
        nombre: "Tostadas integrales con huevo pochado y palta",
        icono: "desayuno",
        alimentos: ["2 huevos pochados", "2 rebanadas de pan integral", "1/2 palta"],
        descripcion:
          "Desayuno completo y sin apuro: buen momento para sostener el " +
          "hábito sin la presión del horario de entrenamiento.",
        calorias: 460,
      },
      {
        tipo: "Almuerzo",
        hora: "13:30",
        nombre: "Pescado a la plancha con ensalada de quinoa",
        icono: "almuerzo",
        alimentos: ["200 g de pescado blanco", "100 g de quinoa cocida", "tomate, pepino y cebolla morada"],
        descripcion:
          "Proteína magra y carbohidrato moderado: mantiene el nivel " +
          "calórico estable en un día de menor gasto.",
        calorias: 540,
      },
      {
        tipo: "Merienda",
        hora: "17:30",
        nombre: "Fruta con yogur y semillas",
        icono: "merienda",
        alimentos: ["1 taza de frutillas o fruta de estación", "200 g de yogur natural", "10 g de semillas de chía"],
        descripcion:
          "Opción liviana, rica en fibra y micronutrientes, para sostener la " +
          "energía de la tarde.",
        calorias: 320,
      },
      {
        tipo: "Cena",
        hora: "21:00",
        nombre: "Guiso de lentejas con carne magra",
        icono: "cena",
        alimentos: ["150 g de carne magra picada", "150 g de lentejas cocidas", "zanahoria, apio y cebolla"],
        descripcion:
          "Plato único, alto en proteína y hierro, fácil de preparar en " +
          "cantidad para adelantar comidas de la semana siguiente.",
        calorias: 540,
      },
    ],
  },
  {
    id: "domingo",
    dia: "Domingo",
    foco: "Descanso — recarga de glucógeno",
    grupo: "rest",
    totalCalorias: 2180,
    proteinaAprox: 138,
    nota:
      "Un poco más de carbohidrato que el resto de los días de descanso: " +
      "ayuda a llegar con las reservas repuestas al Push del lunes. Sigue " +
      "siendo comida real, no una comida libre.",
    comidas: [
      {
        tipo: "Desayuno",
        hora: "9:00",
        nombre: "Panqueques de avena con fruta y miel",
        icono: "desayuno",
        alimentos: ["3 huevos", "60 g de avena", "1 banana", "1 cda de miel", "canela"],
        descripcion:
          "Domingo con algo más de carbohidrato: ayuda a reponer las " +
          "reservas de glucógeno antes de arrancar la semana con Push el " +
          "lunes.",
        calorias: 620,
      },
      {
        tipo: "Almuerzo",
        hora: "13:30",
        nombre: "Pasta integral con pollo y salsa de tomate natural",
        icono: "almuerzo",
        alimentos: ["100 g de pasta integral (peso seco)", "200 g de pechuga de pollo", "salsa de tomate casera", "queso rallado (opcional)"],
        descripcion:
          "Carbohidrato con más volumen que el resto de la semana, siempre " +
          "acompañado de una porción generosa de proteína.",
        calorias: 700,
      },
      {
        tipo: "Merienda",
        hora: "17:30",
        nombre: "Yogur griego con frutas y nueces",
        icono: "merienda",
        alimentos: ["200 g de yogur griego", "1 taza de fruta picada", "15 g de nueces"],
        descripcion: "Cierre liviano de la tarde antes de una cena moderada.",
        calorias: 380,
      },
      {
        tipo: "Cena",
        hora: "20:30",
        nombre: "Salmón con vegetales al vapor",
        icono: "cena",
        alimentos: ["180 g de salmón", "vegetales al vapor (brócoli, zanahoria, coliflor)", "1 cda de aceite de oliva"],
        descripcion:
          "Cena liviana en carbohidrato para cerrar bien la semana y llegar " +
          "descansado al Push del lunes.",
        calorias: 480,
      },
    ],
  },
];
