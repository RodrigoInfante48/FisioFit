// FisioFit — lógica de la pantalla de login (login.html). Usa el SDK
// compat de Firebase Auth (cargado antes vía <script>, ver login.html) con
// email + PIN numérico como password. Ver CLAUDE.md "Acceso —
// autenticación (Firebase Auth)" para el contexto de por qué el acceso es
// manual (sin auto-registro).
(function () {
  const REDIRECT_KEY = "fisiofit-redirect-after-login";
  const DEFAULT_REDIRECT = "index.html";

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const pinInput = document.getElementById("login-pin");
  const errorEl = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-submit");

  const ERROR_MESSAGES = {
    "auth/invalid-email": "Ese email no parece válido.",
    "auth/user-not-found": "No encontramos una cuenta con ese email.",
    "auth/wrong-password": "El código de acceso no es correcto.",
    "auth/invalid-credential": "Email o código de acceso incorrectos.",
    "auth/too-many-requests":
      "Demasiados intentos. Esperá un momento y volvé a intentar.",
    "auth/user-disabled": "Esta cuenta está deshabilitada. Escribinos por WhatsApp.",
  };

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function redirectAfterLogin() {
    let target = DEFAULT_REDIRECT;
    try {
      const saved = sessionStorage.getItem(REDIRECT_KEY);
      if (saved && saved !== "login.html") target = saved;
      sessionStorage.removeItem(REDIRECT_KEY);
    } catch (e) {
      // sessionStorage no disponible: seguimos con el destino por defecto.
    }
    location.replace(target);
  }

  // Si ya hay sesión activa, no tiene sentido mostrar el login.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) redirectAfterLogin();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const email = emailInput.value.trim();
    const pin = pinInput.value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando…";

    firebase
      .auth()
      .signInWithEmailAndPassword(email, pin)
      .then(redirectAfterLogin)
      .catch((error) => {
        showError(
          ERROR_MESSAGES[error.code] ||
            "No se pudo iniciar sesión. Probá de nuevo en un momento."
        );
        submitBtn.disabled = false;
        submitBtn.textContent = "Entrar";
      });
  });
})();
