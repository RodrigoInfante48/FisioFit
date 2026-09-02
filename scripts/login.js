// FisioFit — lógica de la pantalla de login (login.html). Usa el SDK
// compat de Firebase Auth (cargado antes vía <script>, ver login.html) con
// email + código de acceso como password (mínimo 6 caracteres, puede ser
// alfanumérico — no asumir que siempre es un PIN numérico de 6 dígitos: el
// código real es lo que haya quedado seteado en Firebase, a mano o vía
// reset). Ver CLAUDE.md "Acceso — autenticación (Firebase Auth)" para el
// contexto de por qué el acceso es manual (sin auto-registro).
(function () {
  const REDIRECT_KEY = "fisiofit-redirect-after-login";
  const DEFAULT_REDIRECT = "index.html";

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const pinInput = document.getElementById("login-pin");
  const pinToggle = document.getElementById("login-pin-toggle");
  const errorEl = document.getElementById("login-error");
  const infoEl = document.getElementById("login-info");
  const submitBtn = document.getElementById("login-submit");
  const forgotBtn = document.getElementById("login-forgot");

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
    infoEl.hidden = true;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
    infoEl.hidden = true;
    infoEl.textContent = "";
  }

  function showInfo(message) {
    clearError();
    infoEl.textContent = message;
    infoEl.hidden = false;
  }

  // Toggle para ver el código tal cual quedó tipeado: en mobile el teclado
  // no siempre deja confirmar a simple vista qué se escribió (autocorrect,
  // teclado numérico vs. alfanumérico), así que el usuario puede chequear
  // antes de enviar en vez de descubrir el error recién con el rechazo del
  // login.
  pinToggle.addEventListener("click", () => {
    const showing = pinInput.type === "text";
    pinInput.type = showing ? "password" : "text";
    pinToggle.setAttribute("aria-pressed", String(!showing));
    pinToggle.setAttribute(
      "aria-label",
      showing ? "Mostrar código de acceso" : "Ocultar código de acceso"
    );
  });

  // Reset de código autoservicio: evita depender de que Rodrigo reasigne un
  // código a mano cada vez que alguien lo olvida o lo tipea distinto a como
  // lo creó (ver CLAUDE.md "Acceso"). El usuario elige su propio código acá,
  // en el teclado de su propio dispositivo, así que no hay desajuste entre
  // el código real y lo que el teclado del celular permite tipear.
  forgotBtn.addEventListener("click", () => {
    clearError();
    const email = emailInput.value.trim();
    if (!email) {
      showError("Escribí tu email arriba y volvé a tocar este botón.");
      emailInput.focus();
      return;
    }

    forgotBtn.disabled = true;
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        showInfo(
          "Te enviamos un email a " +
            email +
            " con un link para elegir un nuevo código de acceso."
        );
      })
      .catch((error) => {
        showError(
          ERROR_MESSAGES[error.code] ||
            "No se pudo enviar el email de recuperación. Probá de nuevo en un momento."
        );
      })
      .finally(() => {
        forgotBtn.disabled = false;
      });
  });

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
