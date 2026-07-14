// Même projet Firebase que eps-suivi/fps-manager, données isolées sous le noeud "suivi-pp"
// Écrit de façon défensive : si Firebase ne charge pas (réseau, bloqueur, etc.),
// ROOT devient un objet "factice" qui ne plante pas le reste de l'app
// (fiches élèves, bulletins...) mais qui ne pourra simplement pas synchroniser.

let ROOT;

try {
  const firebaseConfig = {
    databaseURL: "https://eps-suivi-debfa-default-rtdb.europe-west1.firebasedatabase.app"
  };

  if (typeof firebase === 'undefined') {
    throw new Error('SDK Firebase non chargé (gstatic.com inaccessible ?)');
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  ROOT = db.ref('suivi-pp');
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
}
