// FisioFit — configuración de Firebase (Auth). Ver CLAUDE.md "Acceso —
// autenticación (Firebase Auth)" para el contexto completo.
//
// TODO: reemplazar estos valores por los reales de un proyecto Firebase
// dedicado a FisioFit (Firebase Console → crear proyecto nuevo → Configuración
// del proyecto → "Tus apps" → app web → copiar este objeto). No reutilizar
// el proyecto "Daily Duty Institute": es de otro producto.
//
// Es seguro que esta clave quede pública en el repo/GitHub Pages: la
// apiKey de Firebase identifica el proyecto pero no es secreta ni autoriza
// nada por sí sola. La seguridad real la da que las cuentas se crean a
// mano desde la consola (sin auto-registro habilitado) y las reglas del
// proyecto — no la privacidad de este archivo.
const FIREBASE_CONFIG = {
  apiKey: "TODO_API_KEY",
  authDomain: "TODO_PROJECT_ID.firebaseapp.com",
  projectId: "TODO_PROJECT_ID",
};

firebase.initializeApp(FIREBASE_CONFIG);
