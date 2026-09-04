// FisioFit — traducciones de la interfaz ("chrome": header, menú, textos
// fijos del panel inferior). El contenido específico de cada músculo
// (data/muscle-content.js: ejercicio/estiramiento/recuperación por músculo,
// filosofía Heavy Duty) queda en español por ahora — traducir esas ~19
// fichas con precisión técnica/médica a 8 idiomas es un trabajo aparte,
// más grande que este selector de idioma.
//
// Declarado como `const`/`window.FisioFitI18n` de script clásico (no ES
// module, sin build step): scripts/ui-controls.js y
// scripts/muscle-content-panel.js lo consumen cargándose después de este.

const I18N_LANG_KEY = "fisiofit-lang";
const I18N_DEFAULT_LANG = "es";
const I18N_SUPPORTED_LANGS = ["es", "en", "pt", "de", "fr", "zh", "ru", "ja"];

const I18N_STRINGS = {
  "app.tagline": {
    es: "Acceso exclusivo por paquete",
    en: "Exclusive access with your package",
    pt: "Acesso exclusivo por pacote",
    de: "Exklusiver Zugang mit Paket",
    fr: "Accès exclusif avec votre forfait",
    zh: "购买套餐后专享访问",
    ru: "Эксклюзивный доступ по пакету",
    ja: "パッケージ購入者限定アクセス",
  },
  "nav.openMenu": {
    es: "Abrir menú",
    en: "Open menu",
    pt: "Abrir menu",
    de: "Menü öffnen",
    fr: "Ouvrir le menu",
    zh: "打开菜单",
    ru: "Открыть меню",
    ja: "メニューを開く",
  },
  "nav.movementPattern": {
    es: "Patrón de movimiento",
    en: "Movement pattern",
    pt: "Padrão de movimento",
    de: "Bewegungsmuster",
    fr: "Schéma de mouvement",
    zh: "训练模式",
    ru: "Паттерн движения",
    ja: "動作パターン",
  },
  "nav.nutrition": {
    es: "Alimentación",
    en: "Nutrition",
    pt: "Alimentação",
    de: "Ernährung",
    fr: "Alimentation",
    zh: "营养",
    ru: "Питание",
    ja: "栄養",
  },
  "nav.training": {
    es: "Entrenamiento",
    en: "Training",
    pt: "Treino",
    de: "Training",
    fr: "Entraînement",
    zh: "训练",
    ru: "Тренировка",
    ja: "トレーニング",
  },
  "nav.theme": {
    es: "Tema",
    en: "Theme",
    pt: "Tema",
    de: "Design",
    fr: "Thème",
    zh: "主题",
    ru: "Тема",
    ja: "テーマ",
  },
  "theme.toDark": {
    es: "Cambiar a tema oscuro",
    en: "Switch to dark theme",
    pt: "Mudar para tema escuro",
    de: "Zum dunklen Design wechseln",
    fr: "Passer au thème sombre",
    zh: "切换到深色主题",
    ru: "Переключить на тёмную тему",
    ja: "ダークテーマに切り替える",
  },
  "theme.toLight": {
    es: "Cambiar a tema claro",
    en: "Switch to light theme",
    pt: "Mudar para tema claro",
    de: "Zum hellen Design wechseln",
    fr: "Passer au thème clair",
    zh: "切换到浅色主题",
    ru: "Переключить на светлую тему",
    ja: "ライトテーマに切り替える",
  },
  "nav.language": {
    es: "Idioma",
    en: "Language",
    pt: "Idioma",
    de: "Sprache",
    fr: "Langue",
    zh: "语言",
    ru: "Язык",
    ja: "言語",
  },
  "nav.languageList": {
    es: "Idiomas disponibles",
    en: "Available languages",
    pt: "Idiomas disponíveis",
    de: "Verfügbare Sprachen",
    fr: "Langues disponibles",
    zh: "可选语言",
    ru: "Доступные языки",
    ja: "利用可能な言語",
  },
  "nav.logout": {
    es: "Salir",
    en: "Log out",
    pt: "Sair",
    de: "Abmelden",
    fr: "Se déconnecter",
    zh: "退出登录",
    ru: "Выйти",
    ja: "ログアウト",
  },
  "panel.empty": {
    es: "Elegí un patrón de movimiento (Push, Pull o Legs) o tocá un músculo en la figura para ver cómo entrenarlo, estirarlo y recuperarlo.",
    en: "Choose a movement pattern (Push, Pull or Legs) or tap a muscle on the figure to see how to train, stretch and recover it.",
    pt: "Escolha um padrão de movimento (Push, Pull ou Legs) ou toque em um músculo na figura para ver como treiná-lo, alongá-lo e recuperá-lo.",
    de: "Wähle ein Bewegungsmuster (Push, Pull oder Legs) oder tippe auf einen Muskel in der Figur, um zu sehen, wie man ihn trainiert, dehnt und erholt.",
    fr: "Choisissez un schéma de mouvement (Push, Pull ou Legs) ou touchez un muscle sur la figure pour voir comment l'entraîner, l'étirer et le récupérer.",
    zh: "选择一种训练模式（推、拉或腿），或点击人体图上的肌肉，查看如何训练、拉伸和恢复它。",
    ru: "Выберите паттерн движения (Push, Pull или Legs) или коснитесь мышцы на фигуре, чтобы узнать, как её тренировать, растягивать и восстанавливать.",
    ja: "動作パターン（Push・Pull・Legs）を選ぶか、図の筋肉をタップして、鍛え方・ストレッチ・回復方法を確認しましょう。",
  },
  "panel.section.exercise": {
    es: "Ejercicio",
    en: "Exercise",
    pt: "Exercício",
    de: "Übung",
    fr: "Exercice",
    zh: "训练动作",
    ru: "Упражнение",
    ja: "エクササイズ",
  },
  "panel.section.stretch": {
    es: "Estiramiento",
    en: "Stretching",
    pt: "Alongamento",
    de: "Dehnung",
    fr: "Étirement",
    zh: "拉伸",
    ru: "Растяжка",
    ja: "ストレッチ",
  },
  "panel.section.recovery": {
    es: "Recuperación",
    en: "Recovery",
    pt: "Recuperação",
    de: "Erholung",
    fr: "Récupération",
    zh: "恢复",
    ru: "Восстановление",
    ja: "回復",
  },
  "panel.fullGroup": {
    es: "Grupo completo",
    en: "Full group",
    pt: "Grupo completo",
    de: "Ganze Gruppe",
    fr: "Groupe complet",
    zh: "完整分组",
    ru: "Вся группа",
    ja: "グループ全体",
  },
  "group.core": {
    es: "Core",
    en: "Core",
    pt: "Core",
    de: "Rumpf",
    fr: "Gainage",
    zh: "核心",
    ru: "Кор",
    ja: "体幹",
  },
  "group.forearms": {
    es: "Antebrazos",
    en: "Forearms",
    pt: "Antebraços",
    de: "Unterarme",
    fr: "Avant-bras",
    zh: "前臂",
    ru: "Предплечья",
    ja: "前腕",
  },
  "group.back": {
    es: "Espalda",
    en: "Back",
    pt: "Costas",
    de: "Rücken",
    fr: "Dos",
    zh: "背部",
    ru: "Спина",
    ja: "背中",
  },
  "cta.title": {
    es: "Acelerá esta recuperación",
    en: "Speed up this recovery",
    pt: "Acelere essa recuperação",
    de: "Diese Erholung beschleunigen",
    fr: "Accélérez cette récupération",
    zh: "加速这次恢复",
    ru: "Ускорь это восстановление",
    ja: "この回復を早めよう",
  },
  "cta.subtitle": {
    es: "Agendá una sesión de ventosas o fisioterapia con Cami o Pipe — por WhatsApp",
    en: "Book a cupping or physiotherapy session with Cami or Pipe — via WhatsApp",
    pt: "Agende uma sessão de ventosas ou fisioterapia com Cami ou Pipe — pelo WhatsApp",
    de: "Vereinbare eine Schröpf- oder Physiotherapie-Sitzung mit Cami oder Pipe — über WhatsApp",
    fr: "Réservez une séance de ventouses ou de kinésithérapie avec Cami ou Pipe — via WhatsApp",
    zh: "通过 WhatsApp 与 Cami 或 Pipe 预约拔罐或理疗 — ",
    ru: "Запишись на баночный массаж или физиотерапию к Cami или Pipe — через WhatsApp",
    ja: "WhatsAppでCamiまたはPipeにカッピングや理学療法のセッションを予約しよう",
  },
  "nutrition.group.rest": {
    es: "Descanso",
    en: "Rest",
    pt: "Descanso",
    de: "Ruhetag",
    fr: "Repos",
    zh: "休息",
    ru: "Отдых",
    ja: "休養",
  },
  "nutrition.carouselLabel": {
    es: "Plan de comidas por día",
    en: "Meal plan by day",
    pt: "Plano de refeições por dia",
    de: "Essensplan nach Tag",
    fr: "Plan de repas par jour",
    zh: "按日查看饮食计划",
    ru: "План питания по дням",
    ja: "曜日別ミールプラン",
  },
  "nutrition.dayPickerLabel": {
    es: "Elegir día de la semana",
    en: "Choose day of the week",
    pt: "Escolher dia da semana",
    de: "Wochentag auswählen",
    fr: "Choisir le jour de la semaine",
    zh: "选择星期几",
    ru: "Выбрать день недели",
    ja: "曜日を選択",
  },
  "nutrition.goToDay": {
    es: "Ir a {day}",
    en: "Go to {day}",
    pt: "Ir para {day}",
    de: "Zu {day} wechseln",
    fr: "Aller à {day}",
    zh: "转到{day}",
    ru: "Перейти к {day}",
    ja: "{day}へ移動",
  },
  "nutrition.dayPrev": {
    es: "Día anterior",
    en: "Previous day",
    pt: "Dia anterior",
    de: "Vorheriger Tag",
    fr: "Jour précédent",
    zh: "前一天",
    ru: "Предыдущий день",
    ja: "前の日",
  },
  "nutrition.dayNext": {
    es: "Día siguiente",
    en: "Next day",
    pt: "Próximo dia",
    de: "Nächster Tag",
    fr: "Jour suivant",
    zh: "后一天",
    ru: "Следующий день",
    ja: "次の日",
  },
  "nutrition.pause": {
    es: "Pausar avance automático",
    en: "Pause automatic advance",
    pt: "Pausar avanço automático",
    de: "Automatischen Wechsel pausieren",
    fr: "Mettre en pause le défilement automatique",
    zh: "暂停自动切换",
    ru: "Приостановить автопрокрутку",
    ja: "自動送りを一時停止",
  },
  "nutrition.resume": {
    es: "Reanudar avance automático",
    en: "Resume automatic advance",
    pt: "Retomar avanço automático",
    de: "Automatischen Wechsel fortsetzen",
    fr: "Reprendre le défilement automatique",
    zh: "恢复自动切换",
    ru: "Возобновить автопрокрутку",
    ja: "自動送りを再開",
  },
  "nutrition.kcalApprox": {
    es: "{value} kcal aprox.",
    en: "approx. {value} kcal",
    pt: "{value} kcal aprox.",
    de: "ca. {value} kcal",
    fr: "{value} kcal environ",
    zh: "约{value}千卡",
    ru: "≈{value} ккал",
    ja: "約{value} kcal",
  },
  "nutrition.proteinApprox": {
    es: "{value} proteína aprox.",
    en: "approx. {value} protein",
    pt: "{value} de proteína aprox.",
    de: "ca. {value} Protein",
    fr: "{value} de protéines environ",
    zh: "约{value}蛋白质",
    ru: "≈{value} белка",
    ja: "約{value}のたんぱく質",
  },
  "cta.waMessage": {
    es: "Hola! Estuve viendo en la app FisioFit la recuperación de {context} y quiero agendar una sesión de ventosas / fisioterapia. ¿Tenés disponibilidad?",
    en: "Hi! I was looking at the recovery info for {context} in the FisioFit app and I'd like to book a cupping / physiotherapy session. Do you have availability?",
    pt: "Oi! Estava vendo no app FisioFit a recuperação de {context} e quero agendar uma sessão de ventosas / fisioterapia. Você tem disponibilidade?",
    de: "Hallo! Ich habe mir in der FisioFit-App die Erholung von {context} angesehen und möchte eine Schröpf-/Physiotherapie-Sitzung vereinbaren. Hast du einen freien Termin?",
    fr: "Salut ! J'ai vu dans l'app FisioFit la récupération de {context} et je veux réserver une séance de ventouses / kinésithérapie. As-tu de la disponibilité ?",
    zh: "你好！我在 FisioFit 应用里看了{context}的恢复信息，想预约一次拔罐/理疗。你有空吗？",
    ru: "Привет! Я смотрел(а) в приложении FisioFit восстановление для {context} и хочу записаться на баночный массаж / физиотерапию. Есть свободное время?",
    ja: "こんにちは！FisioFitアプリで{context}の回復方法を見ていて、カッピング／理学療法のセッションを予約したいです。空きはありますか？",
  },
};

function i18nGetLang() {
  try {
    var stored = localStorage.getItem(I18N_LANG_KEY);
    if (stored && I18N_SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;
  } catch (e) {
    // localStorage no disponible — usa el idioma por defecto sin persistir.
  }
  return I18N_DEFAULT_LANG;
}

function i18nSetLang(lang) {
  if (I18N_SUPPORTED_LANGS.indexOf(lang) === -1) return;
  try {
    localStorage.setItem(I18N_LANG_KEY, lang);
  } catch (e) {
    // localStorage no disponible — el idioma no persiste entre visitas.
  }
  document.documentElement.setAttribute("lang", lang);
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: lang } }));
}

// t("cta.waMessage", { context: "Pecho" }) reemplaza "{context}" en el
// string — el único placeholder que usan las traducciones de arriba.
function i18nT(key, vars) {
  var entry = I18N_STRINGS[key];
  var lang = i18nGetLang();
  var text = (entry && (entry[lang] || entry[I18N_DEFAULT_LANG])) || key;
  if (vars) {
    Object.keys(vars).forEach(function (varName) {
      text = text.replace("{" + varName + "}", vars[varName]);
    });
  }
  return text;
}

// Resuelve un campo de contenido keyed por idioma (mismo patrón que
// I18N_STRINGS) — usado por data/muscle-content.js y
// data/nutrition-content.js, donde cada campo traducible es un objeto
// { es, en, pt, de, fr, zh, ru, ja } en vez de un string plano. Falla hacia
// "es" si falta la traducción para el idioma actual (ver CLAUDE.md: el
// contenido en español es la fuente de verdad).
function i18nPick(field) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  var lang = i18nGetLang();
  return field[lang] || field[I18N_DEFAULT_LANG] || "";
}

// Aplica las traducciones a todo el DOM ya presente: texto (data-i18n) y
// atributos como aria-label (data-i18n-aria-label).
function i18nApplyToDocument() {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = i18nT(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
    el.setAttribute("aria-label", i18nT(el.getAttribute("data-i18n-aria-label")));
  });
}

window.FisioFitI18n = {
  SUPPORTED_LANGS: I18N_SUPPORTED_LANGS,
  getLang: i18nGetLang,
  setLang: i18nSetLang,
  t: i18nT,
  pick: i18nPick,
  applyToDocument: i18nApplyToDocument,
};

// Aplica el idioma guardado apenas el DOM está listo, antes de que corran
// ui-controls.js / muscle-content-panel.js (evita el "flash" de textos en
// español si el usuario ya había elegido otro idioma).
document.documentElement.setAttribute("lang", i18nGetLang());
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", i18nApplyToDocument);
} else {
  i18nApplyToDocument();
}
