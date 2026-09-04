// FisioFit — carrusel de alimentación. Un slide por día (NUTRITION_PLAN,
// data/nutrition-content.js), avance automático lento para dar tiempo a
// leer, con pausa en hover/foco/toque y controles manuales (tabs de día,
// flechas, puntos, play/pausa). Sigue el mismo patrón de script clásico
// sin build step que el resto de la app.

const NUTRITION_AUTOPLAY_MS = 9000;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Push/Pull/Legs quedan sin traducir (términos de gimnasio ya universales
// en inglés, igual que en groupLabel() de muscle-content-panel.js);
// "Descanso" sí se traduce vía i18n.js.
function nutritionGroupLabel(grupo) {
  if (grupo === "push") return "Push";
  if (grupo === "pull") return "Pull";
  if (grupo === "legs") return "Legs";
  return window.FisioFitI18n.t("nutrition.group.rest");
}

// Iconos de comida — mismo estilo de trazo (stroke, currentColor) que
// SECTION_ICONS en muscle-content-panel.js, a mayor tamaño para funcionar
// como imagen protagonista de cada tarjeta.
const MEAL_ICONS = {
  desayuno:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="24" cy="27" r="15" opacity="0.9" />' +
    '<ellipse cx="24" cy="28" rx="9" ry="6.5" fill="currentColor" opacity="0.16" stroke="none" />' +
    '<circle cx="24" cy="28" r="4" fill="currentColor" opacity="0.55" stroke="none" />' +
    '<path d="M15 11c1-2 3-3 3-5M22 11c1-2 2-3 2-5M29 11c1-2 3-3 3-5" opacity="0.7" />' +
    "</svg>",
  almuerzo:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="24" cy="27" r="15" opacity="0.9" />' +
    '<path d="M16 31c1.5-6 5-9 8-9s6.5 3 8 9" fill="currentColor" opacity="0.16" stroke="none" />' +
    '<circle cx="19" cy="25" r="2.4" fill="currentColor" opacity="0.4" stroke="none" />' +
    '<path d="M6 8v11M6 8c-1.7 0-2.8 1.3-2.8 3.5S4.3 15 6 15M9.5 8v6.5c0 2-1.6 3.5-3.5 3.5v18" />' +
    '<path d="M40 8c-2.2 0-3.5 2.2-3.5 5.5S37.8 19 40 19v14" />' +
    "</svg>",
  merienda:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="16" y="15" width="16" height="23" rx="4" opacity="0.9" />' +
    '<path d="M16 22h16" />' +
    '<rect x="16" y="15" width="16" height="7" rx="4" fill="currentColor" opacity="0.16" stroke="none" />' +
    '<path d="M22 9l2-3 2 3" /><path d="M24 9v6" />' +
    '<path d="M34 30c4.5-1.2 6.5-6 4-11" opacity="0.7" />' +
    "</svg>",
  cena:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="24" cy="27" r="15" opacity="0.9" />' +
    '<path d="M14 27c4.5-4.5 11-4.5 15.5 0-4.5 4.5-11 4.5-15.5 0Z" fill="currentColor" opacity="0.16" stroke="none" />' +
    '<path d="M29.5 27l6-4.3v8.6l-6-4.3Z" fill="currentColor" opacity="0.3" stroke="none" />' +
    '<circle cx="17.5" cy="26" r="0.9" fill="currentColor" stroke="none" />' +
    '<path d="M19 35c3.2 0 5.5-1.2 7-3.6" opacity="0.7" />' +
    "</svg>",
};

// data/nutrition-content.js: los campos traducibles (dia/foco/nota/tipo/
// nombre/alimentos/descripcion) son objetos keyed por idioma — se resuelven
// acá con window.FisioFitI18n.pick() al idioma actual, con fallback a "es".
const pick = (field) => window.FisioFitI18n.pick(field);

function buildMealCard(meal) {
  const alimentos = meal.alimentos.map((item) => `<li>${pick(item)}</li>`).join("");

  return `
    <article class="meal-card">
      <div class="meal-card__icon">${MEAL_ICONS[meal.icono] || ""}</div>
      <div class="meal-card__body">
        <header class="meal-card__header">
          <span class="meal-card__type">${pick(meal.tipo)} · ${meal.hora}</span>
          <span class="meal-card__kcal">${meal.calorias} kcal</span>
        </header>
        <h4 class="meal-card__name">${pick(meal.nombre)}</h4>
        <ul class="meal-card__foods">${alimentos}</ul>
        <p class="meal-card__desc">${pick(meal.descripcion)}</p>
      </div>
    </article>
  `;
}

function buildDaySlide(day, index) {
  const meals = day.comidas.map(buildMealCard).join("");
  const kcalText = window.FisioFitI18n.t("nutrition.kcalApprox", {
    value: `<strong>${day.totalCalorias}</strong>`,
  });
  const proteinText = window.FisioFitI18n.t("nutrition.proteinApprox", {
    value: `<strong>${day.proteinaAprox} g</strong>`,
  });

  return `
    <div class="nutrition-slide" role="tabpanel" id="nutrition-panel-${day.id}"
      aria-labelledby="nutrition-tab-${day.id}" data-index="${index}" data-grupo="${day.grupo}">
      <header class="nutrition-slide__header">
        <div class="nutrition-slide__title-row">
          <h3 class="nutrition-slide__day">${pick(day.dia)}</h3>
          <span class="nutrition-slide__badge nutrition-slide__badge--${day.grupo}">${nutritionGroupLabel(day.grupo)}</span>
        </div>
        <p class="nutrition-slide__foco">${pick(day.foco)}</p>
        <p class="nutrition-slide__nota">${pick(day.nota)}</p>
        <div class="nutrition-slide__stats">
          <span class="nutrition-slide__stat">${kcalText}</span>
          <span class="nutrition-slide__stat">${proteinText}</span>
        </div>
      </header>
      <div class="meal-grid">${meals}</div>
    </div>
  `;
}

function buildTabs() {
  return NUTRITION_PLAN.map((day, index) => {
    return `
      <button
        class="nutrition-tab"
        type="button"
        role="tab"
        id="nutrition-tab-${day.id}"
        aria-controls="nutrition-panel-${day.id}"
        aria-selected="false"
        data-index="${index}"
        data-grupo="${day.grupo}"
      >
        <span class="nutrition-tab__day">${pick(day.dia).slice(0, 3)}</span>
        <span class="nutrition-tab__foco">${nutritionGroupLabel(day.grupo)}</span>
      </button>
    `;
  }).join("");
}

function buildDots() {
  return NUTRITION_PLAN.map((day, index) => {
    return `
      <button
        class="nutrition-dot"
        type="button"
        data-index="${index}"
        aria-label="${window.FisioFitI18n.t("nutrition.goToDay", { day: pick(day.dia) })}"
      ></button>
    `;
  }).join("");
}

function renderNutritionIntro() {
  const titleEl = document.getElementById("nutrition-intro-title");
  const textEl = document.getElementById("nutrition-intro-text");
  if (!titleEl || !textEl) return;
  titleEl.textContent = pick(NUTRITION_INTRO.titulo);
  textEl.textContent = pick(NUTRITION_INTRO.texto);
}

function setupNutritionCarousel() {
  const root = document.getElementById("nutrition-carousel");
  if (!root) return;

  const track = root.querySelector(".nutrition-carousel__track");
  const tabsEl = root.querySelector(".nutrition-carousel__tabs");
  const dotsEl = root.querySelector(".nutrition-carousel__dots");
  const prevBtn = root.querySelector(".nutrition-carousel__arrow--prev");
  const nextBtn = root.querySelector(".nutrition-carousel__arrow--next");
  const playBtn = root.querySelector(".nutrition-carousel__playpause");
  const progressBar = root.querySelector(".nutrition-carousel__progress-bar");
  const announcer = root.querySelector(".nutrition-carousel__announcer");
  const viewport = root.querySelector(".nutrition-carousel__viewport");

  const slideCount = NUTRITION_PLAN.length;
  // Arranca en el día de la semana actual: getDay() usa 0=domingo..6=sábado;
  // NUTRITION_PLAN empieza en lunes (índice 0), de ahí el corrimiento +6 %7.
  let currentIndex = (new Date().getDay() + 6) % 7;
  let autoplayTimer = null;
  let isHovering = false;
  let isPausedByUser = false;
  let tabButtons = [];
  let dotButtons = [];

  function updateTrackPosition() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function updateActiveStates() {
    tabButtons.forEach((btn, i) => {
      const active = i === currentIndex;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    dotButtons.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === currentIndex);
    });
    if (announcer) {
      const day = NUTRITION_PLAN[currentIndex];
      announcer.textContent = `${pick(day.dia)}: ${pick(day.foco)}`;
    }
  }

  // Reconstruye el contenido traducible del carrusel (slides, tabs, dots)
  // sin perder el día actualmente seleccionado. Se usa tanto en el render
  // inicial como al cambiar de idioma ("languageChanged").
  function renderContent() {
    track.innerHTML = NUTRITION_PLAN.map(buildDaySlide).join("");
    tabsEl.innerHTML = buildTabs();
    dotsEl.innerHTML = buildDots();
    tabButtons = Array.from(tabsEl.querySelectorAll(".nutrition-tab"));
    dotButtons = Array.from(dotsEl.querySelectorAll(".nutrition-dot"));
    updateTrackPosition();
    updateActiveStates();
  }

  function restartProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = "none";
    progressBar.style.width = "0%";
    // Reflow forzado para que el próximo cambio de width vuelva a animarse
    // (mismo truco que SWAP_OUT_MS en muscle-content-panel.js).
    void progressBar.offsetWidth;
    const playing = !isHovering && !isPausedByUser && !prefersReducedMotion;
    if (playing) {
      progressBar.style.transition = `width ${NUTRITION_AUTOPLAY_MS}ms linear`;
      progressBar.style.width = "100%";
    }
  }

  function goToSlide(index) {
    currentIndex = ((index % slideCount) + slideCount) % slideCount;
    updateTrackPosition();
    updateActiveStates();
    restartProgressBar();
  }

  function next() {
    goToSlide(currentIndex + 1);
  }

  function prev() {
    goToSlide(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (prefersReducedMotion || isHovering || isPausedByUser) return;
    autoplayTimer = window.setInterval(next, NUTRITION_AUTOPLAY_MS);
    restartProgressBar();
  }

  function setPausedByUser(paused) {
    isPausedByUser = paused;
    if (playBtn) {
      playBtn.setAttribute("aria-pressed", String(paused));
      playBtn.setAttribute(
        "aria-label",
        window.FisioFitI18n.t(paused ? "nutrition.resume" : "nutrition.pause")
      );
      playBtn.classList.toggle("is-paused", paused);
    }
    if (paused) {
      stopAutoplay();
      if (progressBar) progressBar.style.transition = "none";
    } else {
      startAutoplay();
    }
  }

  tabsEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".nutrition-tab");
    if (!btn) return;
    goToSlide(Number(btn.dataset.index));
    startAutoplay();
  });

  dotsEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".nutrition-dot");
    if (!btn) return;
    goToSlide(Number(btn.dataset.index));
    startAutoplay();
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prev();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      next();
      startAutoplay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => setPausedByUser(!isPausedByUser));
  }

  // Pausa en hover/foco para leer con calma; retoma al salir (salvo que el
  // usuario haya pausado explícitamente con el botón).
  root.addEventListener("pointerenter", () => {
    isHovering = true;
    stopAutoplay();
    if (progressBar) progressBar.style.transition = "none";
  });

  root.addEventListener("pointerleave", () => {
    isHovering = false;
    startAutoplay();
  });

  root.addEventListener("focusin", () => {
    isHovering = true;
    stopAutoplay();
    if (progressBar) progressBar.style.transition = "none";
  });

  root.addEventListener("focusout", (event) => {
    if (root.contains(event.relatedTarget)) return;
    isHovering = false;
    startAutoplay();
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
      startAutoplay();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
      startAutoplay();
    } else if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
      startAutoplay();
    } else if (event.key === "End") {
      event.preventDefault();
      goToSlide(slideCount - 1);
      startAutoplay();
    }
  });

  // Deslizar en pantallas táctiles.
  let touchStartX = null;
  let touchStartY = null;

  viewport.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      if (touchStartX === null) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;

      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) next();
      else prev();
      startAutoplay();
    },
    { passive: true }
  );

  renderContent();
  startAutoplay();

  // Re-renderiza el contenido traducible del carrusel al cambiar de idioma.
  // En la práctica el selector de idioma recarga la página (ver
  // ui-controls.js), pero este listener mantiene el mismo patrón que
  // muscle-content-panel.js por si el idioma cambia sin recarga.
  document.addEventListener("languageChanged", () => {
    renderContent();
    restartProgressBar();
  });
}

renderNutritionIntro();
document.addEventListener("languageChanged", renderNutritionIntro);

setupNutritionCarousel();
