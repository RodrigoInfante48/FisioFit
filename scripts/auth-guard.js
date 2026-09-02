// FisioFit — guardia de acceso. Se carga en index.html y nutricion.html,
// después de firebase-config.js. Verifica que haya una sesión de Firebase
// Auth activa antes de revelar el contenido de la página: si no hay
// sesión, redirige a login.html guardando la URL actual para volver acá
// después de iniciar sesión. Ver CLAUDE.md "Acceso — autenticación
// (Firebase Auth)".
(function () {
  const REDIRECT_KEY = "fisiofit-redirect-after-login";

  function revealApp(user) {
    document.documentElement.classList.add("auth-ready");

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.hidden = false;
      logoutBtn.addEventListener("click", () => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            location.replace("login.html");
          });
      });
    }

    const emailEl = document.getElementById("auth-user-email");
    if (emailEl && user.email) emailEl.textContent = user.email;
  }

  function goToLogin() {
    try {
      sessionStorage.setItem(
        REDIRECT_KEY,
        location.pathname.replace(/^\/+/, "") + location.search
      );
    } catch (e) {
      // sessionStorage puede fallar en navegación privada estricta; sin
      // redirect guardado simplemente se vuelve a index.html tras el login.
    }
    location.replace("login.html");
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      goToLogin();
      return;
    }
    revealApp(user);
  });
})();
