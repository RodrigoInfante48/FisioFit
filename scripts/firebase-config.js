// FisioFit — configuración de Firebase (Auth). Ver CLAUDE.md "Acceso —
// autenticación (Firebase Auth)" para el contexto completo.
//
// Config del proyecto Firebase dedicado a FisioFit ("fisiofit-cb2b8").
// No reutilizar el proyecto "Daily Duty Institute": es de otro producto.
//
// Es seguro que esta clave quede pública en el repo/GitHub Pages: la
// apiKey de Firebase identifica el proyecto pero no es secreta ni autoriza
// nada por sí sola. La seguridad real la da que las cuentas se crean a
// mano desde la consola (sin auto-registro habilitado) y las reglas del
// proyecto — no la privacidad de este archivo.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAI-Ef8WeuAEm3DN1wTGAfZ39j-_bHvFdw",
  authDomain: "fisiofit-cb2b8.firebaseapp.com",
  projectId: "fisiofit-cb2b8",
  storageBucket: "fisiofit-cb2b8.firebasestorage.app",
  messagingSenderId: "956160845750",
  appId: "1:956160845750:web:bb16a33687142b45e4c317",
  measurementId: "G-NCNJPEJ9LL",
};

firebase.initializeApp(FIREBASE_CONFIG);
