// Même projet Firebase que eps-suivi/fps-manager, données isolées sous le noeud "suivi-pp"
// et protégées par connexion anonyme (les règles Firebase exigent auth != null sur ce noeud).
// Écrit de façon défensive : si Firebase ne charge pas (réseau, bloqueur, etc.),
// ROOT devient un objet "factice" qui ne plante pas le reste de l'app
// (fiches élèves, bulletins...) mais qui ne pourra simplement pas synchroniser.

let ROOT;
let AUTH_READY;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyChXOB82mEoXCX1YU_4uC5FR9-FO0nk3f8",
    authDomain: "eps-suivi-debfa.firebaseapp.com",
    databaseURL: "https://eps-suivi-debfa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "eps-suivi-debfa",
    storageBucket: "eps-suivi-debfa.firebasestorage.app",
    messagingSenderId: "688408210698",
    appId: "1:688408210698:web:ab82bb1397a43336f01ef3"
  };

  if (typeof firebase === 'undefined') {
    throw new Error('SDK Firebase non chargé (gstatic.com inaccessible ?)');
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  ROOT = db.ref('suivi-pp');

  // Connexion anonyme silencieuse : aucun écran de connexion pour l'utilisateur,
  // mais un jeton d'authentification valide pour satisfaire les règles Firebase.
  AUTH_READY = new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) resolve(user);
    });
    firebase.auth().signInAnonymously().catch((err) => {
      console.error('Connexion anonyme Firebase impossible :', err);
      resolve(null);
    });
  });
} catch (err) {
  console.error('Firebase indisponible :', err);
  const fail = (cb) => { if (typeof cb === 'function') cb(new Error('Firebase indisponible')); return null; };
  const stub = {
    once: (event, cb) => { if (cb) cb({ val: () => null }); return Promise.resolve({ val: () => null }); },
    on: (event, cb) => { if (cb) cb({ val: () => null }); },
    set: (val, cb) => fail(cb),
    update: (val, cb) => fail(cb),
    child: () => stub
  };
  ROOT = stub;
  AUTH_READY = Promise.resolve(null);
}
