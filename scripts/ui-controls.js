// FisioFit — menú hamburguesa (móvil) + toggle de tema claro/oscuro.
// Requiere que el <head> de la página ya haya aplicado data-theme (ver
// snippet inline anti-flash) antes de que corra este script.

(function () {
  var THEME_KEY = "fisiofit-theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function initThemeToggle() {
    var btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;

    function syncLabel() {
      var isLight = currentTheme() === "light";
      btn.setAttribute("aria-pressed", String(isLight));
      btn.setAttribute("aria-label", window.FisioFitI18n.t(isLight ? "theme.toDark" : "theme.toLight"));
    }

    syncLabel();
    document.addEventListener("languageChanged", syncLabel);

    btn.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        // localStorage no disponible (modo privado, etc.) — el tema no persiste.
      }
      syncLabel();
    });
  }

  function initLanguageSelector() {
    var toggleBtn = document.getElementById("lang-toggle-btn");
    var list = document.getElementById("lang-list");
    var currentCode = document.getElementById("lang-current-code");
    if (!toggleBtn || !list || !currentCode) return;

    function setListOpen(open) {
      list.hidden = !open;
      toggleBtn.setAttribute("aria-expanded", String(open));
    }

    function syncSelected() {
      var lang = window.FisioFitI18n.getLang();
      currentCode.textContent = lang.toUpperCase();
      list.querySelectorAll(".lang-option").forEach(function (option) {
        option.setAttribute("aria-selected", String(option.getAttribute("data-lang") === lang));
      });
    }

    syncSelected();

    toggleBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      setListOpen(list.hidden);
    });

    list.addEventListener("click", function (event) {
      var option = event.target.closest(".lang-option");
      if (!option) return;
      window.FisioFitI18n.setLang(option.getAttribute("data-lang"));
      syncSelected();
      setListOpen(false);
    });

    // Cierra la lista de idiomas al tocar fuera, sin cerrar todo el drawer
    // (el listener de #app-nav sólo cierra el drawer al elegir un idioma
    // real desde la lista, nunca al abrir/cerrarla).
    document.addEventListener("click", function (event) {
      if (list.hidden) return;
      if (list.contains(event.target) || toggleBtn.contains(event.target)) return;
      setListOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !list.hidden) {
        setListOpen(false);
        toggleBtn.focus();
      }
    });
  }

  function initHamburgerMenu() {
    var toggleBtn = document.getElementById("hamburger-btn");
    var nav = document.getElementById("app-nav");
    if (!toggleBtn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggleBtn.classList.toggle("is-active", open);
      toggleBtn.setAttribute("aria-expanded", String(open));
    }

    toggleBtn.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggleBtn.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggleBtn.focus();
      }
    });

    // Cierra el panel al elegir un patrón de movimiento o navegar a otra
    // sección — pero no al tocar el toggle de tema, para que se pueda ver
    // el cambio de inmediato sin que el panel se cierre solo.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a, button[data-movement], #logout-btn")) {
        setOpen(false);
      }
    });
  }

  initThemeToggle();
  initHamburgerMenu();
  initLanguageSelector();
})();
