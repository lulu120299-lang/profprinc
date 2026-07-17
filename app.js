/* ============================================================
   SUIVI PP — logique application
   Stockage: localStorage (clé suivipp-data-v1)
   ============================================================ */

const STORAGE_KEY = 'suivipp-data-v1';
const TRIMESTRES = ['T1', 'T2', 'T3'];
const DEFAULT_MATIERES = ['Français','Mathématiques','Histoire-Géo-EMC','Anglais','LV2','SVT','Physique-Chimie','Technologie','EPS','Arts plastiques','Éducation musicale'];

const SUGGESTED_VDC = [
  { titre:"Jeux de connaissance et cohésion de groupe",
    consignes:"Séance d'accueil en début d'année pour que les élèves apprennent à se connaître et se sentent à l'aise dans leur nouvelle classe.",
    contenu:"Le collège change complètement les repères des élèves de 6e : nouveaux camarades, nouveaux professeurs, nouveaux lieux. Cette première heure de vie de classe sert à créer un climat de confiance avant d'aborder des sujets plus sérieux. Elle peut prendre la forme de jeux courts (bingo des prénoms, marché des compétences, points communs) suivis d'un temps d'échange libre sur les impressions de rentrée.",
    questions:["Qu'est-ce qui te plaît le plus dans le collège pour l'instant ?","Qu'est-ce qui t'inquiète ou te surprend ?","Trouve un point commun avec trois camarades que tu ne connaissais pas avant."] },
  { titre:"Découverte du collège : fonctionnement et adultes-ressources",
    consignes:"Présenter aux élèves les différents lieux et adultes du collège, et vers qui se tourner selon les situations.",
    contenu:"Contrairement à l'école primaire, un élève de 6e croise chaque jour de nombreux adultes aux rôles différents : professeurs, CPE, assistants d'éducation, infirmière, documentaliste, agents. Cette séance clarifie qui fait quoi et dédramatise le fait d'aller voir un adulte en cas de problème. Un plan du collège ou un trombinoscope facilite la mémorisation.",
    questions:["À qui t'adresses-tu si tu as un souci avec un camarade ?","À qui t'adresses-tu si tu es malade pendant la journée ?","Où se trouvent la vie scolaire, le CDI, l'infirmerie ?"] },
  { titre:"Le cartable et l'emploi du temps",
    consignes:"Aider les élèves à organiser matériellement leur semaine de collège.",
    contenu:"Beaucoup d'élèves de 6e arrivent avec un cartable trop lourd ou mal préparé, faute d'avoir intégré la logique de l'emploi du temps. La séance propose une méthode simple : préparer son sac la veille en suivant l'emploi du temps du lendemain, trier les classeurs par matière, vérifier le poids du sac. On peut prolonger avec une réflexion sur le rythme de la semaine (travail, loisirs, sommeil).",
    questions:["Prépares-tu ton sac le soir ou le matin ? Pourquoi ?","Combien de temps consacres-tu à tes devoirs chaque soir ?","Quel jour ton sac est-il le plus lourd ? Comment l'alléger ?"] },
  { titre:"Méthodologie : cahier, classeur, agenda, apprendre une leçon",
    consignes:"Donner des repères concrets pour tenir ses cahiers et apprendre efficacement une leçon.",
    contenu:"La méthodologie de travail est rarement enseignée explicitement alors qu'elle conditionne la réussite scolaire. Cette séance aborde la tenue propre des cahiers et classeurs, l'usage de l'agenda pour anticiper les devoirs, et une méthode simple pour apprendre une leçon (lire, reformuler, se tester). Elle peut s'appuyer sur des exemples concrets apportés par les élèves.",
    questions:["Comment t'y prends-tu pour apprendre une leçon par cœur ?","Utilises-tu ton agenda tous les jours ? Pour quoi faire ?","Que fais-tu si tu ne comprends pas un cours ?"] },
  { titre:"Élection des délégués : rôle, droits, devoirs",
    consignes:"Préparer et organiser l'élection des délégués de classe.",
    contenu:"Le délégué de classe représente ses camarades auprès de l'administration et participe au conseil de classe. Cette séance explique le rôle, les qualités attendues (écoute, discrétion, sens des responsabilités) et le déroulement du vote. Les candidats peuvent préparer une courte présentation avant l'élection à bulletin secret.",
    questions:["Quelles qualités un bon délégué doit-il avoir selon toi ?","Que peut faire un délégué si un camarade rencontre une difficulté ?","Souhaites-tu te présenter ? Pourquoi ?"] },
  { titre:"Fonctionnement du collège : notes, bulletins, conseil de classe",
    consignes:"Expliquer le système de notation et le déroulement d'un conseil de classe.",
    contenu:"Le passage au collège introduit des notions nouvelles pour les élèves de 6e : moyennes par matière, bulletins trimestriels, conseil de classe. Cette séance démystifie ces mécanismes en expliquant qui participe au conseil de classe, ce qui s'y décide, et le rôle du professeur principal dans la rédaction de l'appréciation générale.",
    questions:["Qui participe à un conseil de classe ?","Que se passe-t-il si tes résultats baissent d'un trimestre à l'autre ?","Pourquoi les délégués participent-ils au conseil de classe ?"] },
  { titre:"Règlement intérieur et sanctions",
    consignes:"Faire comprendre le sens des règles du collège, pas seulement les lister.",
    contenu:"Plutôt que de relire le règlement intérieur intégralement, cette séance fait réfléchir les élèves sur le pourquoi des règles : vivre ensemble suppose des limites communes. On peut partir de situations concrètes (retard, oubli de matériel, insultes) et faire discuter les élèves sur les conséquences possibles, avant de présenter l'échelle des sanctions du collège.",
    questions:["Pourquoi existe-t-il un règlement intérieur ?","Que se passe-t-il si une règle est ignorée plusieurs fois ?","Quelle règle te semble la plus importante à respecter ?"] },
  { titre:"Respect et harcèlement : repérer, réagir, en parler",
    consignes:"Sensibiliser au harcèlement scolaire et au cyberharcèlement, sans stigmatiser.",
    contenu:"Le harcèlement touche une part significative des élèves de 6e, période de transition propice aux tensions de groupe. Cette séance vise à définir clairement ce qu'est le harcèlement (répétition, intention de nuire, déséquilibre de pouvoir), à distinguer une moquerie isolée d'un harcèlement, et à donner des réflexes clairs : en parler à un adulte, ne pas rester spectateur passif. Elle peut s'appuyer sur les supports du programme pHARe (numéro 3018).",
    questions:["Quelle différence fais-tu entre une dispute et du harcèlement ?","Que peux-tu faire si tu es témoin d'une situation de harcèlement ?","Connais-tu un numéro ou un adulte à qui en parler ?"] },
  { titre:"Usage des écrans et réseaux sociaux",
    consignes:"Faire réfléchir les élèves à un usage raisonné des écrans et réseaux sociaux.",
    contenu:"De nombreux élèves de 6e possèdent déjà un smartphone et accèdent à des réseaux sociaux dont l'âge minimum légal (13 ans) n'est souvent pas respecté. Cette séance aborde le temps d'écran, les traces laissées en ligne, et les risques (contacts inconnus, contenus inadaptés, cyberharcèlement) sans diaboliser les usages numériques.",
    questions:["Combien de temps passes-tu sur les écrans en dehors de l'école ?","Que ferais-tu si un inconnu te contactait sur un réseau social ?","Une information partagée en ligne peut-elle être supprimée facilement ?"] },
  { titre:"Bilan à mi-année : la roue de la satisfaction",
    consignes:"Faire un point individuel et collectif sur le ressenti des élèves à mi-parcours.",
    contenu:"Cet outil simple consiste à faire colorier aux élèves une roue divisée en plusieurs domaines (résultats, ambiance de classe, relations avec les professeurs, vie au collège) selon une note sur 10. Le but n'est pas de comparer les élèves entre eux mais de leur donner un support pour verbaliser leur ressenti et suivre son évolution au fil de l'année.",
    questions:["Quel domaine de ta roue est le mieux coloré ? Pourquoi ?","Quel domaine aimerais-tu améliorer d'ici la fin d'année ?","Qu'est-ce qui t'aiderait à progresser sur ce point ?"] },
  { titre:"Préparation du conseil de classe",
    consignes:"Préparer collectivement ce que les délégués vont porter au conseil de classe.",
    contenu:"Avant chaque conseil de classe, un temps collectif permet aux délégués de recueillir l'avis de la classe : ce qui fonctionne bien, ce qui pose problème, les suggestions d'amélioration. Cette séance structure cet échange pour que les délégués puissent porter une parole représentative et constructive devant les professeurs.",
    questions:["Qu'est-ce qui s'est bien passé ce trimestre dans la classe ?","Qu'est-ce qui pourrait être amélioré ?","Quel message précis les délégués doivent-ils porter au conseil ?"] },
  { titre:"Découverte des métiers et premiers repères d'orientation",
    consignes:"Initier une première réflexion sur les métiers et les parcours possibles.",
    contenu:"Il est tôt pour parler d'orientation en 6e, mais c'est le bon moment pour élargir la culture des métiers et déconstruire certains stéréotypes (métiers « de filles »/« de garçons »). La séance peut s'appuyer sur les métiers des proches des élèves, un jeu d'association matières-métiers, ou une courte vidéo de présentation de métiers variés.",
    questions:["Quel métier exercent tes parents ou proches ? En quoi consiste-t-il ?","Quelle matière préfères-tu ? À quels métiers pourrait-elle être utile ?","Un métier peut-il être fait aussi bien par un homme que par une femme ? Donne un exemple."] },
  { titre:"Sécurité routière et gestes de premiers secours",
    consignes:"Sensibiliser aux règles de sécurité sur le trajet domicile-collège et aux gestes de premiers secours.",
    contenu:"De nombreux élèves de 6e commencent à se déplacer seuls (à pied, à vélo, en bus). Cette séance rappelle les règles de sécurité routière de base et peut être complétée par une initiation aux gestes qui sauvent (alerter, protéger, position latérale de sécurité) en lien avec l'infirmière scolaire ou les pompiers.",
    questions:["Comment te rends-tu au collège ? Quels dangers rencontres-tu sur le trajet ?","Que fais-tu si tu es témoin d'un accident ?","Connais-tu le numéro des secours ?"] },
  { titre:"Bilan de fin d'année et projection vers la 5e",
    consignes:"Faire un bilan de l'année de 6e et se projeter positivement vers la 5e.",
    contenu:"Cette dernière séance de l'année permet de revenir sur le chemin parcouru depuis la rentrée : ce qui a été difficile, ce qui a été appris, ce qui a changé. Elle prépare aussi les élèves au changement d'organisation en 5e (nouvelle langue vivante, éventuellement de nouveaux professeurs) pour aborder la suite sereinement.",
    questions:["Qu'as-tu appris cette année qui ne concerne pas une matière scolaire ?","Qu'est-ce qui a été le plus difficile pour toi en 6e ?","Qu'attends-tu de la 5e ?"] },
];

let state = {
  view: 'accueil',
  trimestre: 'T1',
  data: null,
  currentEleveId: null,
  eleveSubtab: 'infos',
};

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function defaultData(){
  return {
    classe: { nom:'', niveau:'Collège', anneeScolaire:'2026-2027', matieres: DEFAULT_MATIERES.slice() },
    eleves: [],
    cours: [],
    mappingTemplates: {}
  };
}

function normalizeData(parsed){
  if(!parsed || typeof parsed !== 'object') return defaultData();
  if(!parsed.classe) parsed.classe = defaultData().classe;
  if(!parsed.classe.matieres) parsed.classe.matieres = DEFAULT_MATIERES.slice();
  if(!parsed.eleves) parsed.eleves = [];
  if(!parsed.cours) parsed.cours = [];
  if(!parsed.mappingTemplates) parsed.mappingTemplates = {};
  parsed.eleves.forEach(e=>{
    if(!e.contacts) e.contacts = [];
    if(!e.viescolaire) e.viescolaire = [];
    if(!e.absences) e.absences = [];
    if(!e.dispositifs) e.dispositifs = [];
    if(!e.bulletins) e.bulletins = { T1:{}, T2:{}, T3:{} };
    TRIMESTRES.forEach(t=>{ if(!e.bulletins[t]) e.bulletins[t] = {}; });
    if(!e.orientation) e.orientation = { voeux:[], stages:[], notesOrientation:'' };
    if(!e.orientation.voeux) e.orientation.voeux = [];
    if(!e.orientation.stages) e.orientation.stages = [];
    if(!e.rdv) e.rdv = [];
    if(e.photo===undefined) e.photo = '';
  });
  parsed.cours.forEach(item=>{
    if(!item.questions) item.questions = [];
  });
  return parsed;
}

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultData();
    return normalizeData(JSON.parse(raw));
  }catch(e){ console.error('Erreur chargement données', e); return defaultData(); }
}

let saveTimer = null;
function saveData(){
  updateSaveStatus('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      pushToFirebase();
      updateSaveStatus('saved');
    }
    catch(e){ console.error('Erreur sauvegarde', e); updateSaveStatus('error'); }
  }, 350);
}
function saveNow(){
  clearTimeout(saveTimer);
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    pushToFirebase();
    updateSaveStatus('saved');
  }catch(e){ console.error('Erreur sauvegarde', e); updateSaveStatus('error'); }
}
function updateSaveStatus(mode){
  const el = document.getElementById('save-status');
  if(!el) return;
  el.classList.remove('saving');
  if(mode==='saving'){
    el.classList.add('saving');
    el.textContent = 'Enregistrement…';
  } else if(mode==='error'){
    el.textContent = "Échec de l'enregistrement";
  } else if(mode==='synced'){
    const now = new Date();
    el.textContent = '☁ Synchronisé à ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
  } else {
    const now = new Date();
    const cloud = firebaseSyncActive ? '☁ ' : '';
    el.textContent = cloud + 'Enregistré à ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
  }
}

/* ============================================================
   SYNCHRONISATION FIREBASE (multi-appareils)
   Nœud isolé "suivi-pp", protégé par connexion anonyme — voir
   firebase-config.js. Repli automatique sur localStorage seul
   si Firebase est indisponible (réseau, bloqueur, règles, etc.).
   ============================================================ */
let firebaseSyncActive = false;
let firebaseAuthed = false;

function firebaseAvailable(){
  return typeof ROOT !== 'undefined' && ROOT && typeof ROOT.set === 'function' && typeof ROOT.on === 'function';
}

function pushToFirebase(){
  if(!firebaseAvailable() || !firebaseAuthed) return;
  try{ ROOT.set(state.data); }catch(e){ console.error('Erreur synchro Firebase', e); }
}

function initFirebaseSync(){
  if(!firebaseAvailable()) return;
  const start = ()=>{
    firebaseAuthed = true;
    let firstSnapshot = true;
    ROOT.on('value', (snap)=>{
      firebaseSyncActive = true;
      const remote = snap.val();
      if(remote){
        const normalized = normalizeData(remote);
        if(JSON.stringify(normalized) !== JSON.stringify(state.data)){
          state.data = normalized;
          try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }catch(e){}
          updateSaveStatus('synced');
          try{ render(); }catch(err){ console.error('Erreur affichage après synchro', err); }
        } else {
          updateSaveStatus('synced');
        }
      } else if(firstSnapshot && state.data.eleves && state.data.eleves.length){
        // Rien sur Firebase pour l'instant mais des données locales existent déjà : on les publie.
        pushToFirebase();
      }
      firstSnapshot = false;
    }, (err)=>{ console.error('Erreur écoute Firebase (règles/auth ?)', err); });
  };
  if(typeof AUTH_READY !== 'undefined' && AUTH_READY && typeof AUTH_READY.then === 'function'){
    AUTH_READY.then((user)=>{ if(user) start(); else console.error('Connexion anonyme Firebase non établie, synchro désactivée.'); });
  } else {
    start();
  }
}

function getEleve(id){ return state.data.eleves.find(e=>e.id===id); }

function newEleve(nom, prenom){
  return {
    id: uid(), nom: nom||'', prenom: prenom||'', dateNaissance:'', sexe:'', photo:'',
    contacts: [],
    viescolaire: [],
    absences: [],
    dispositifs: [],
    bulletins: { T1:{}, T2:{}, T3:{} },
    orientation: { voeux: [], stages: [], notesOrientation:'' },
    rdv: []
  };
}

/* ---------------- Calculs ---------------- */
function moyenneMatiere(eleve, trimestre, matiere){
  const b = eleve.bulletins?.[trimestre]?.[matiere];
  if(!b || b.moyenne === '' || b.moyenne === undefined || b.moyenne === null) return null;
  const v = parseFloat(b.moyenne);
  return isNaN(v) ? null : v;
}
function moyenneGenerale(eleve, trimestre){
  const matieres = state.data.classe.matieres;
  const vals = matieres.map(m=>moyenneMatiere(eleve, trimestre, m)).filter(v=>v!==null);
  if(!vals.length) return null;
  return vals.reduce((a,b)=>a+b,0)/vals.length;
}
function absencesCount(eleve){ return eleve.absences?.length || 0; }
function absencesNonJustifiees(eleve){ return (eleve.absences||[]).filter(a=>!a.justifie).length; }
function incidentsCount(eleve){ return (eleve.viescolaire||[]).filter(v=>v.type==='incident').length; }

function alerteLevel(eleve){
  const moy = moyenneGenerale(eleve, state.trimestre);
  const abs = absencesNonJustifiees(eleve);
  const inc = incidentsCount(eleve);
  if((moy!==null && moy<8) || abs>=4 || inc>=3) return 'alerte';
  if((moy!==null && moy<11) || abs>=2 || inc>=1) return 'attention';
  return 'ok';
}

function moyClass(v){
  if(v===null) return '';
  if(v>=12) return 'moy-good';
  if(v>=10) return 'moy-mid';
  return 'moy-low';
}

function fmtDate(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  return d.toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric'});
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
function initiales(e){ return ((e.prenom||'?')[0]+(e.nom||'?')[0]).toUpperCase(); }

/* ============================================================
   NAVIGATION
   ============================================================ */
const VIEW_META = {
  accueil:    { title:'Accueil',            sub:"Vue d'ensemble de la classe" },
  eleves:     { title:'Élèves',             sub:'Fiches, notes de vie scolaire, absences' },
  bulletins:  { title:'Bulletins',          sub:'Suivi des moyennes par matière' },
  conseils:   { title:'Conseils de classe', sub:'Préparation et appréciations générales' },
  orientation:{ title:'Orientation',        sub:'Vœux, stages, affectation' },
  rdv:        { title:'Rendez-vous parents',sub:'Comptes-rendus des entretiens' },
  agenda:     { title:'Agenda',             sub:'Rendez-vous, renouvellements et échéances' },
  cours:      { title:'Cours & activités',  sub:'Fiches et exercices à donner aux élèves' },
};

function setView(view){
  state.view = view;
  state.currentEleveId = null;
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  document.getElementById('view-title').textContent = VIEW_META[view].title;
  document.getElementById('view-sub').textContent = VIEW_META[view].sub;
  document.getElementById('sidebar').classList.remove('open');
  render();
}

function render(){
  const c = document.getElementById('content');
  const actions = document.getElementById('topbar-actions');
  actions.innerHTML = '';
  document.getElementById('classe-nom-pill').textContent = state.data.classe.nom || 'Classe non définie';
  document.getElementById('classe-effectif-pill').textContent = state.data.eleves.length + (state.data.eleves.length>1 ? ' élèves' : ' élève');

  try{
    if(state.view==='accueil') return renderAccueil(c, actions);
    if(state.view==='eleves') return renderEleves(c, actions);
    if(state.view==='bulletins') return renderBulletins(c, actions);
    if(state.view==='conseils') return renderConseils(c, actions);
    if(state.view==='orientation') return renderOrientation(c, actions);
    if(state.view==='rdv') return renderRdv(c, actions);
    if(state.view==='agenda') return renderAgenda(c, actions);
    if(state.view==='cours') return renderCours(c, actions);
  }catch(err){
    console.error('Erreur affichage de la vue', state.view, err);
    c.innerHTML = `<div class="empty-state"><h3>Un problème est survenu sur cet écran</h3><p>Essaie de changer d'onglet puis de revenir, ou recharge la page. Tes données ne sont pas perdues.</p></div>`;
  }
}

/* ============================================================
   ACCUEIL
   ============================================================ */
/* ============================================================
   RAPPEL DE SAUVEGARDE
   Les données ne vivent que dans le navigateur (localStorage) : on
   rappelle régulièrement d'exporter un fichier de sauvegarde.
   ============================================================ */
const LAST_EXPORT_KEY = 'suivipp-last-export';
const BACKUP_SNOOZE_KEY = 'suivipp-backup-snooze';

function daysSince(iso){
  if(!iso) return Infinity;
  const d = new Date(iso);
  if(isNaN(d)) return Infinity;
  return (Date.now() - d.getTime()) / 86400000;
}

function shouldShowBackupBanner(){
  if(!state.data.eleves.length) return false;
  const snoozeUntil = localStorage.getItem(BACKUP_SNOOZE_KEY);
  if(snoozeUntil && new Date(snoozeUntil) > new Date()) return false;
  return daysSince(localStorage.getItem(LAST_EXPORT_KEY)) >= 14;
}

function backupBannerHTML(){
  const lastExport = localStorage.getItem(LAST_EXPORT_KEY);
  const msg = lastExport ? `Dernière sauvegarde le ${fmtDate(lastExport)}.` : "Tu n'as encore jamais exporté de sauvegarde.";
  return `
    <div class="backup-banner" id="backup-banner">
      <div><b>Pense à sauvegarder tes données.</b> ${msg} Elles ne vivent que sur cet appareil/navigateur : un export régulier évite de tout perdre.</div>
      <div class="bb-actions">
        <button class="btn btn-sm btn-primary" id="bb-export">Exporter maintenant</button>
        <button class="btn btn-sm btn-ghost" id="bb-snooze">Plus tard</button>
      </div>
    </div>`;
}
function bindBackupBanner(){
  const exp = document.getElementById('bb-export');
  const snz = document.getElementById('bb-snooze');
  if(exp) exp.onclick = openExportModal;
  if(snz) snz.onclick = ()=>{
    localStorage.setItem(BACKUP_SNOOZE_KEY, new Date(Date.now()+3*86400000).toISOString());
    const b = document.getElementById('backup-banner'); if(b) b.remove();
  };
}

function classAverageByTrimestre(eleves){
  return TRIMESTRES.map(t=>{
    const vals = eleves.map(e=>moyenneGenerale(e, t)).filter(v=>v!==null);
    return { t, val: vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null, n: vals.length };
  });
}

function classAverageChartHTML(eleves){
  if(!eleves.length) return '';
  const data = classAverageByTrimestre(eleves);
  if(!data.some(d=>d.val!==null)) return '';
  const max = 20;
  return `
    <div class="stat-card" style="margin-top:16px;">
      <div class="label" style="margin-bottom:14px;">Évolution de la moyenne de classe</div>
      <div class="chart-bars">
        ${data.map(d=>{
          const pct = d.val!==null ? Math.max(4, (d.val/max)*100) : 0;
          return `
            <div class="chart-bar-col">
              <div class="chart-bar-value">${d.val!==null ? d.val.toFixed(1) : '—'}</div>
              <div class="chart-bar-track"><div class="chart-bar-fill ${d.t===state.trimestre?'current':''}" style="height:${pct}%;"></div></div>
              <div class="chart-bar-label">${d.t}${d.n ? ` (${d.n})` : ''}</div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

function dispositifsRenouvellementHTML(eleves){
  const rows = [];
  eleves.forEach(e=>{
    (e.dispositifs||[]).forEach(d=>{
      const j = daysUntil(d.dateRenouvellement);
      if(j!==null && j<=45) rows.push({e, d, j});
    });
  });
  if(!rows.length) return '';
  rows.sort((a,b)=> a.j - b.j);
  return `
    <div class="section-title" style="margin-top:26px;">Renouvellements de dispositifs à venir</div>
    <div class="eleves-list" id="acc-disp-renouv">
      ${rows.map(({e,d,j})=>`
        <div class="eleve-card ${j<0?'alerte':'attention'}" data-id="${e.id}">
          <div class="eleve-avatar">${e.photo ? `<img src="${e.photo}" alt="">` : initiales(e)}</div>
          <div>
            <div class="eleve-name">${e.prenom} ${e.nom} — ${escHTML(d.type)}</div>
            <div class="eleve-meta">${j<0 ? `Renouvellement dépassé de ${Math.abs(j)} j` : `Dans ${j} j`} · ${fmtDate(d.dateRenouvellement)}</div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderAccueil(c, actions){
  const eleves = state.data.eleves;
  const nbAlertes = eleves.filter(e=>alerteLevel(e)==='alerte').length;
  const nbAttention = eleves.filter(e=>alerteLevel(e)==='attention').length;
  const totalAbs = eleves.reduce((a,e)=>a+absencesCount(e),0);
  const totalRdv = eleves.reduce((a,e)=>a+(e.rdv?.length||0),0);
  const moyClasse = (()=>{
    const vals = eleves.map(e=>moyenneGenerale(e, state.trimestre)).filter(v=>v!==null);
    if(!vals.length) return null;
    return (vals.reduce((a,b)=>a+b,0)/vals.length);
  })();

  if(!state.data.classe.nom){
    c.innerHTML = `
      <div class="empty-state">
        <h3>Configurons ta classe</h3>
        <p>Commence par renseigner le nom de ta classe pour démarrer le suivi.</p>
        <button class="btn btn-primary" id="btn-setup" style="margin-top:14px;">Configurer la classe</button>
      </div>`;
    document.getElementById('btn-setup').onclick = openSettingsModal;
    return;
  }

  c.innerHTML = `
    ${shouldShowBackupBanner() ? backupBannerHTML() : ''}
    <div class="grid-cards">
      <div class="stat-card">
        <div class="label">Effectif</div>
        <div class="value">${eleves.length}</div>
        <div class="hint">${state.data.classe.nom} · ${state.data.classe.niveau}</div>
      </div>
      <div class="stat-card">
        <div class="label">Moyenne classe · ${state.trimestre}</div>
        <div class="value">${moyClasse!==null ? moyClasse.toFixed(1) : '—'}</div>
        <div class="hint">${eleves.filter(e=>moyenneGenerale(e,state.trimestre)!==null).length} bulletins saisis</div>
      </div>
      <div class="stat-card">
        <div class="label">À surveiller</div>
        <div class="value" style="color:${nbAlertes?'var(--danger)':'var(--text)'}">${nbAlertes}</div>
        <div class="hint">${nbAttention} en vigilance</div>
      </div>
      <div class="stat-card">
        <div class="label">Absences enregistrées</div>
        <div class="value">${totalAbs}</div>
        <div class="hint">${eleves.reduce((a,e)=>a+absencesNonJustifiees(e),0)} non justifiées</div>
      </div>
      <div class="stat-card">
        <div class="label">Rendez-vous</div>
        <div class="value">${totalRdv}</div>
        <div class="hint">comptes-rendus enregistrés</div>
      </div>
    </div>

    ${classAverageChartHTML(eleves)}
    ${dispositifsRenouvellementHTML(eleves)}

    <div class="section-title" style="margin-top:26px;">Élèves à surveiller — ${state.trimestre}</div>
    <div class="eleves-list" id="acc-alertes"></div>
  `;

  const alertList = eleves
    .map(e=>({e, lvl:alerteLevel(e)}))
    .filter(x=>x.lvl!=='ok')
    .sort((a,b)=> (a.lvl==='alerte'?0:1) - (b.lvl==='alerte'?0:1));

  const wrap = document.getElementById('acc-alertes');
  if(!alertList.length){
    wrap.innerHTML = `<div class="empty-state" style="padding:30px;"><h3>Rien à signaler</h3><p>Aucun élève en alerte pour ${state.trimestre}.</p></div>`;
  } else {
    wrap.innerHTML = alertList.map(({e,lvl})=>eleveCardHTML(e,lvl)).join('');
    wrap.querySelectorAll('.eleve-card').forEach(card=>{
      card.onclick = ()=> openEleveFiche(card.dataset.id);
    });
  }
  bindBackupBanner();
  const renouvWrap = document.getElementById('acc-disp-renouv');
  if(renouvWrap){
    renouvWrap.querySelectorAll('.eleve-card').forEach(card=>{
      card.onclick = ()=> openEleveFiche(card.dataset.id);
    });
  }

  const tsw = trimestreSwitchHTML();
  actions.innerHTML = tsw;
  bindTrimestreSwitch(actions);
}

function eleveCardHTML(e, lvl){
  const moy = moyenneGenerale(e, state.trimestre);
  const abs = absencesNonJustifiees(e);
  const inc = incidentsCount(e);
  const tags = [];
  if(e.dispositifs && e.dispositifs.length){
    const types = [...new Set(e.dispositifs.map(d=>d.type))];
    const urgent = e.dispositifs.some(d=>{ const j = daysUntil(d.dateRenouvellement); return j!==null && j<=45; });
    tags.push(`<span class="tag ${urgent?'danger':''}" style="${urgent?'':'background:var(--accent-soft); color:var(--accent-hi);'}">${types.join(', ')}</span>`);
  }
  if(moy!==null) tags.push(`<span class="tag ${moy<10?'danger':moy<12?'warning':'success'}">moy. ${moy.toFixed(1)}</span>`);
  if(abs>0) tags.push(`<span class="tag ${abs>=4?'danger':'warning'}">${abs} abs. non just.</span>`);
  if(inc>0) tags.push(`<span class="tag danger">${inc} incident${inc>1?'s':''}</span>`);
  if(!tags.length) tags.push(`<span class="tag success">RAS</span>`);
  return `
    <div class="eleve-card ${lvl}" data-id="${e.id}">
      <div class="eleve-avatar">${e.photo ? `<img src="${e.photo}" alt="">` : initiales(e)}</div>
      <div>
        <div class="eleve-name">${e.prenom} ${e.nom}</div>
        <div class="eleve-meta">${e.contacts?.length||0} contact${(e.contacts?.length||0)>1?'s':''} enregistré${(e.contacts?.length||0)>1?'s':''}</div>
      </div>
      <div class="eleve-tags">${tags.join('')}</div>
    </div>`;
}

function trimestreSwitchHTML(){
  return `<div class="trimestre-switch">${TRIMESTRES.map(t=>`<button data-t="${t}" class="${state.trimestre===t?'active':''}">${t}</button>`).join('')}</div>`;
}
function bindTrimestreSwitch(container){
  container.querySelectorAll('.trimestre-switch button').forEach(b=>{
    b.onclick = ()=>{ state.trimestre = b.dataset.t; render(); };
  });
}

/* ============================================================
   ÉLÈVES — liste + fiche détail
   ============================================================ */
let eleveViewMode = 'liste';

function renderEleves(c, actions){
  actions.innerHTML = `
    <div class="trimestre-switch" id="eleve-view-switch">
      <button data-m="liste" class="${eleveViewMode==='liste'?'active':''}">Liste</button>
      <button data-m="photos" class="${eleveViewMode==='photos'?'active':''}">Photos</button>
    </div>
    <button class="btn btn-sm" id="btn-open-trombi" style="margin-left:10px;">📷 Importer trombinoscope</button>
    <button class="btn btn-primary" id="btn-add-eleve" style="margin-left:10px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Ajouter un élève</button>`;
  document.getElementById('btn-add-eleve').onclick = openAddEleveModal;
  document.getElementById('btn-open-trombi').onclick = openTrombinoscopeTool;
  document.getElementById('eleve-view-switch').querySelectorAll('button').forEach(b=>{
    b.onclick = ()=>{ eleveViewMode = b.dataset.m; renderEleves(c, actions); };
  });

  const eleves = [...state.data.eleves].sort((a,b)=> (a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  if(!eleves.length){
    c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute les élèves de ta classe pour commencer le suivi.</p></div>`;
    return;
  }

  if(eleveViewMode==='photos'){
    c.innerHTML = `<div class="trombi-grid">${eleves.map(trombiCardHTML).join('')}</div>`;
    c.querySelectorAll('.trombi-cell').forEach(cell=>{
      cell.addEventListener('click', (ev)=>{
        if(ev.target.closest('.trombi-del')) return;
        openEleveFiche(cell.dataset.id);
      });
    });
    c.querySelectorAll('.trombi-del').forEach(link=>{
      link.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const eid = link.dataset.eid;
        confirmModal('Supprimer cette photo ?', ()=>{
          const el = getEleve(eid);
          el.photo = '';
          saveNow();
          renderEleves(c, actions);
        });
      });
    });
    return;
  }

  c.innerHTML = `<div class="eleves-list">${eleves.map(e=>eleveCardHTML(e, alerteLevel(e))).join('')}</div>`;
  c.querySelectorAll('.eleve-card').forEach(card=>{
    card.onclick = ()=> openEleveFiche(card.dataset.id);
  });
}

function trombiCardHTML(e){
  return `
    <div class="trombi-cell" data-id="${e.id}">
      <div class="trombi-photo ${e.photo?'has-photo':'empty'}">${e.photo ? `<img src="${e.photo}" alt="">` : `<span>👤</span>`}</div>
      <div class="trombi-name">${escHTML(e.prenom)}<br>${escHTML(e.nom)}</div>
      ${e.photo ? `<span class="trombi-del" data-eid="${e.id}">Supprimer</span>` : ''}
    </div>`;
}

/* ============================================================
   TROMBINOSCOPE — import d'une photo/PDF de groupe + découpage
   manuel par élève (glisser un rectangle sur chaque visage).
   ============================================================ */
let trombiOrigImg = null;
let trombiSelectedEid = '';

function ensurePdfJs(){
  return new Promise((resolve, reject)=>{
    if(window.pdfjsLib) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = ()=>{
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve();
    };
    script.onerror = ()=> reject(new Error('pdf.js indisponible'));
    document.head.appendChild(script);
  });
}

function openTrombinoscopeTool(){
  trombiOrigImg = null;
  trombiSelectedEid = '';
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div id="trombi-tool" style="position:fixed; inset:0; background:var(--ink); z-index:9000; display:flex; flex-direction:column;">
      <div style="background:var(--surface); border-bottom:1px solid var(--hairline); padding:14px 20px; display:flex; align-items:center; gap:12px; flex:none;">
        <button class="btn btn-sm" id="btn-trombi-close">✕ Fermer</button>
        <div style="flex:1; text-align:center;">
          <div style="font-family:var(--font-brand); font-weight:800; font-size:16px;">Trombinoscope</div>
          <div class="eyebrow" id="trombi-sub" style="margin-top:2px;">Importer une photo ou un PDF de classe</div>
        </div>
        <label class="btn btn-sm btn-primary" style="cursor:pointer;">📷 Importer
          <input type="file" accept="image/*,application/pdf" id="trombi-file-input" style="display:none;">
        </label>
      </div>
      <div style="flex:1; overflow-y:auto; padding:18px;" id="trombi-body"></div>
    </div>
  `;
  document.getElementById('btn-trombi-close').onclick = closeTrombinoscopeTool;
  document.getElementById('trombi-file-input').addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if(file) loadTrombiFile(file);
  });
  renderTrombiImportZone();
}
function closeTrombinoscopeTool(){
  document.getElementById('modal-root').innerHTML = '';
  render();
}

function renderTrombiImportZone(){
  const body = document.getElementById('trombi-body');
  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  body.innerHTML = `
    <div style="text-align:center; padding:40px 20px; background:var(--surface); border:1.5px dashed var(--hairline-2); border-radius:16px; margin-bottom:20px;">
      <div style="font-size:2.6rem; margin-bottom:10px;">🖼️</div>
      <div style="font-weight:600; margin-bottom:6px;">Importer une photo ou un PDF de trombinoscope</div>
      <div class="muted" style="font-size:12.5px; margin-bottom:18px;">Photo de classe, export École Directe, liste scannée…</div>
      <label class="btn btn-primary" style="cursor:pointer;">Choisir un fichier
        <input type="file" accept="image/*,application/pdf" id="trombi-file-input-2" style="display:none;">
      </label>
      <div id="trombi-load-status" class="muted" style="font-size:12px; margin-top:10px;"></div>
    </div>
    <div class="trombi-grid">${eleves.map(trombiCardHTML).join('')}</div>
  `;
  document.getElementById('trombi-file-input-2').addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if(file) loadTrombiFile(file);
  });
  body.querySelectorAll('.trombi-del').forEach(link=>{
    link.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      const eid = link.dataset.eid;
      confirmModal('Supprimer cette photo ?', ()=>{
        getEleve(eid).photo = '';
        saveNow();
        renderTrombiImportZone();
      });
    });
  });
}

async function loadTrombiFile(file){
  const status = document.getElementById('trombi-load-status');
  try{
    let imgUrl;
    if(file.type === 'application/pdf'){
      if(status) status.textContent = 'Chargement du PDF…';
      await ensurePdfJs();
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({data:buf}).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({scale:2});
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({canvasContext:canvas.getContext('2d'), viewport}).promise;
      imgUrl = canvas.toDataURL('image/png');
      if(pdf.numPages > 1 && status) status.textContent = `Première page utilisée (le PDF en contient ${pdf.numPages}).`;
    } else {
      imgUrl = URL.createObjectURL(file);
    }
    const img = new Image();
    img.onload = ()=>{ trombiOrigImg = img; renderTrombiCropZone(imgUrl); };
    img.onerror = ()=>{ if(status) status.textContent = "Impossible de lire ce fichier."; };
    img.src = imgUrl;
  }catch(err){
    console.error(err);
    if(status) status.textContent = "Erreur lors du chargement (fichier invalide ou pdf.js indisponible).";
  }
}

function renderTrombiCropZone(imgUrl){
  document.getElementById('trombi-sub').textContent = 'Choisis un élève puis trace un rectangle sur son visage';
  const body = document.getElementById('trombi-body');
  body.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 300px; gap:18px; align-items:start;">
      <div>
        <p class="muted" style="font-size:12px; margin-bottom:8px;">Sélectionne l'élève à droite, puis trace un rectangle autour de son visage sur la photo.</p>
        <div id="trombi-img-wrap" style="position:relative; display:inline-block; cursor:crosshair; user-select:none; line-height:0; max-width:100%;">
          <img id="trombi-img-display" src="${imgUrl}" style="max-width:100%; border-radius:10px; display:block;" draggable="false">
          <div id="trombi-sel-box" style="display:none; position:absolute; border:2px solid var(--success); background:color-mix(in srgb, var(--success) 15%, transparent); pointer-events:none; box-sizing:border-box;"></div>
        </div>
      </div>
      <div>
        <div class="eyebrow" style="margin-bottom:10px;">Élèves à associer</div>
        <div id="trombi-faces-list"></div>
      </div>
    </div>
  `;
  renderTrombiFacesList();
  setupTrombiDrag();
}

function renderTrombiFacesList(){
  const list = document.getElementById('trombi-faces-list');
  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  list.innerHTML = `
    <div style="background:var(--raised-2); border-radius:10px; padding:10px; margin-bottom:10px;">
      <div class="muted" style="font-size:12px; margin-bottom:6px;">Sélectionner un élève :</div>
      <select id="trombi-manual-sel">
        <option value="">— Choisir —</option>
        ${eleves.map(e=> `<option value="${e.id}" ${e.photo?'style="color:var(--success);"':''}>${escHTML(e.prenom)} ${escHTML(e.nom)}${e.photo?' ✓':''}</option>`).join('')}
      </select>
      <div class="muted" style="font-size:11px; margin-top:6px;">Puis trace un rectangle sur la photo</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:6px; max-height:50vh; overflow-y:auto;">
      ${eleves.filter(e=>e.photo).map(e=>`
        <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; background:var(--raised); border-radius:8px;">
          <img src="${e.photo}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1.5px solid var(--success);">
          <span style="font-size:12px; color:var(--success); flex:1;">${escHTML(e.prenom)} ${escHTML(e.nom)}</span>
          <span data-eid="${e.id}" class="trombi-del-inline" style="font-size:12px; color:var(--danger); cursor:pointer;">✕</span>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('trombi-manual-sel').addEventListener('change', (ev)=>{ trombiSelectedEid = ev.target.value; });
  list.querySelectorAll('.trombi-del-inline').forEach(link=>{
    link.addEventListener('click', ()=>{
      getEleve(link.dataset.eid).photo = '';
      saveNow();
      renderTrombiFacesList();
    });
  });
}

function setupTrombiDrag(){
  const wrap = document.getElementById('trombi-img-wrap');
  const selBox = document.getElementById('trombi-sel-box');
  const display = document.getElementById('trombi-img-display');
  if(!wrap || !selBox || !display) return;
  let dragging=false, startX,startY, startIX=0, startIY=0;

  function getPos(ev){
    const wr = wrap.getBoundingClientRect();
    const dr = display.getBoundingClientRect();
    const clientX = ev.touches ? ev.touches[0].clientX : (ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX);
    const clientY = ev.touches ? ev.touches[0].clientY : (ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY);
    const x = Math.max(0, Math.min(clientX-wr.left, wr.width));
    const y = Math.max(0, Math.min(clientY-wr.top, wr.height));
    const ix = Math.max(0, Math.min(clientX-dr.left, dr.width));
    const iy = Math.max(0, Math.min(clientY-dr.top, dr.height));
    return {x,y,ix,iy,dr};
  }
  function startDrag(ev){
    if(!trombiSelectedEid){ alert("Choisis d'abord un élève dans la liste à droite."); return; }
    ev.preventDefault();
    dragging = true;
    const p = getPos(ev);
    startX=p.x; startY=p.y; startIX=p.ix; startIY=p.iy;
    selBox.style.display='block';
    selBox.style.left=startX+'px'; selBox.style.top=startY+'px';
    selBox.style.width='0'; selBox.style.height='0';
  }
  function moveDrag(ev){
    if(!dragging) return;
    ev.preventDefault();
    const p = getPos(ev);
    const x=Math.min(startX,p.x), y=Math.min(startY,p.y);
    const w=Math.abs(p.x-startX), h=Math.abs(p.y-startY);
    selBox.style.left=x+'px'; selBox.style.top=y+'px';
    selBox.style.width=w+'px'; selBox.style.height=h+'px';
  }
  function endDrag(ev){
    if(!dragging) return;
    dragging = false;
    const p = getPos(ev);
    selBox.style.display='none';
    const w = Math.abs(p.ix-startIX), h = Math.abs(p.iy-startIY);
    if(w<10 || h<10 || !trombiSelectedEid) return;
    const imgX = Math.min(startIX,p.ix), imgY = Math.min(startIY,p.iy);
    const dr = p.dr;
    const scaleX = trombiOrigImg.naturalWidth/dr.width;
    const scaleY = trombiOrigImg.naturalHeight/dr.height;
    const canvas = document.createElement('canvas');
    canvas.width = 160; canvas.height = 160;
    canvas.getContext('2d').drawImage(trombiOrigImg, imgX*scaleX, imgY*scaleY, w*scaleX, h*scaleY, 0, 0, 160, 160);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const eleve = getEleve(trombiSelectedEid);
    eleve.photo = dataUrl;
    saveNow();
    trombiSelectedEid = '';
    renderTrombiFacesList();
  }
  wrap.addEventListener('mousedown', startDrag);
  wrap.addEventListener('mousemove', moveDrag);
  wrap.addEventListener('mouseup', endDrag);
  wrap.addEventListener('touchstart', startDrag, {passive:false});
  wrap.addEventListener('touchmove', moveDrag, {passive:false});
  wrap.addEventListener('touchend', endDrag, {passive:false});
}

function openAddEleveModal(){
  showModal(`
    <h3>Ajouter un élève</h3>
    <div class="field-row">
      <div class="field"><label>Prénom</label><input id="m-prenom" type="text" autofocus></div>
      <div class="field"><label>Nom</label><input id="m-nom" type="text"></div>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-save">Ajouter</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    const prenom = document.getElementById('m-prenom').value.trim();
    const nom = document.getElementById('m-nom').value.trim();
    if(!prenom && !nom) return;
    state.data.eleves.push(newEleve(nom, prenom));
    saveNow(); closeModal(); render();
  };
}

function openEleveFiche(id){
  state.currentEleveId = id;
  state.eleveSubtab = 'infos';
  renderElevePanel();
}

function renderElevePanel(){
  const e = getEleve(state.currentEleveId);
  if(!e) return;
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="overlay" id="panel-overlay">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>${e.prenom} ${e.nom}</h2>
            <div class="sub muted" style="font-size:12px; margin-top:2px;">${e.dateNaissance ? 'Né(e) le '+fmtDate(e.dateNaissance) : 'Date de naissance non renseignée'}</div>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" id="btn-pdf-eleve" title="Exporter en PDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7Z"/></svg>
            </button>
            <button class="icon-btn" id="btn-del-eleve" title="Supprimer l'élève">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg>
            </button>
            <button class="icon-btn" id="btn-close-panel" title="Fermer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </div>
        </div>
        <div class="panel-body">
          <div class="subtabs">
            ${subtab('infos','Infos')}${subtab('dispositifs','Dispositifs')}${subtab('viescolaire','Vie scolaire')}${subtab('absences','Absences')}${subtab('orientation','Orientation')}${subtab('rdv','Rendez-vous')}${subtab('courriers','Courriers')}
          </div>
          <div id="eleve-subtab-content"></div>
        </div>
      </div>
    </div>
  `;
  function subtab(key,label){ return `<button class="subtab ${state.eleveSubtab===key?'active':''}" data-sub="${key}">${label}</button>`; }

  document.getElementById('panel-overlay').addEventListener('click', (ev)=>{ if(ev.target.id==='panel-overlay') closePanel(); });
  document.getElementById('btn-close-panel').onclick = closePanel;
  document.getElementById('btn-pdf-eleve').onclick = ()=> printElevePDF(e);
  document.getElementById('btn-del-eleve').onclick = ()=>{
    confirmModal(`Supprimer ${e.prenom} ${e.nom} ? Toutes ses données seront perdues.`, ()=>{
      state.data.eleves = state.data.eleves.filter(x=>x.id!==e.id);
      saveNow(); closePanel(); render();
    });
  };
  root.querySelectorAll('.subtab').forEach(b=>{
    b.onclick = ()=>{ state.eleveSubtab = b.dataset.sub; renderElevePanel(); };
  });
  renderEleveSubtab(e);
}
function closePanel(){ state.currentEleveId=null; document.getElementById('modal-root').innerHTML=''; render(); }

function renderEleveSubtab(e){
  const el = document.getElementById('eleve-subtab-content');
  if(state.eleveSubtab==='infos') return renderSubInfos(el, e);
  if(state.eleveSubtab==='dispositifs') return renderSubDispositifs(el, e);
  if(state.eleveSubtab==='viescolaire') return renderSubViescolaire(el, e);
  if(state.eleveSubtab==='absences') return renderSubAbsences(el, e);
  if(state.eleveSubtab==='orientation') return renderSubOrientationEleve(el, e);
  if(state.eleveSubtab==='rdv') return renderSubRdvEleve(el, e);
  if(state.eleveSubtab==='courriers') return renderSubCourriers(el, e);
}

/* --- Infos --- */
function renderSubInfos(el, e){
  el.innerHTML = `
    <div style="display:flex; gap:16px; align-items:center; margin-bottom:18px;">
      <div class="photo-frame" id="photo-frame">
        ${e.photo ? `<img src="${e.photo}" alt="">` : `<span>${initiales(e)}</span>`}
      </div>
      <div>
        <div style="display:flex; gap:8px;">
          <label class="btn btn-sm" style="cursor:pointer;">Choisir une photo
            <input type="file" accept="image/*" id="photo-input" style="display:none;">
          </label>
          ${e.photo ? `<button class="btn btn-sm btn-ghost" id="btn-del-photo">Retirer</button>` : ''}
        </div>
        <p class="muted" style="font-size:11.5px; margin-top:6px;">Utilisée dans le trombinoscope et la fiche élève.</p>
      </div>
    </div>
    <div class="field-row">
      <div class="field"><label>Prénom</label><input data-f="prenom" value="${escAttr(e.prenom)}"></div>
      <div class="field"><label>Nom</label><input data-f="nom" value="${escAttr(e.nom)}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Date de naissance</label><input data-f="dateNaissance" type="date" value="${e.dateNaissance||''}"></div>
      <div class="field"><label>Sexe</label>
        <select data-f="sexe">
          <option value="" ${!e.sexe?'selected':''}>—</option>
          <option value="F" ${e.sexe==='F'?'selected':''}>F</option>
          <option value="M" ${e.sexe==='M'?'selected':''}>M</option>
        </select>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-between">
      <div class="section-title" style="margin:0;">Contacts</div>
      <button class="btn btn-sm" id="btn-add-contact">+ Contact</button>
    </div>
    <div id="contacts-list" style="margin-top:10px;"></div>
  `;
  el.querySelectorAll('[data-f]').forEach(inp=>{
    inp.addEventListener('input', ()=>{ e[inp.dataset.f]=inp.value; saveData(); if(inp.dataset.f==='nom'||inp.dataset.f==='prenom'){ document.querySelector('.panel-header h2').textContent = `${e.prenom} ${e.nom}`; } });
  });
  const photoInput = document.getElementById('photo-input');
  if(photoInput){
    photoInput.addEventListener('change', ()=>{
      const file = photoInput.files[0];
      if(!file) return;
      resizeImageToDataURL(file, 240, 0.75).then(dataUrl=>{
        e.photo = dataUrl;
        saveNow();
        renderEleveSubtab(e);
      }).catch(()=>{ alert("Impossible de lire cette image."); });
    });
  }
  const delPhotoBtn = document.getElementById('btn-del-photo');
  if(delPhotoBtn){
    delPhotoBtn.onclick = ()=>{ e.photo=''; saveNow(); renderEleveSubtab(e); };
  }
  renderContacts();
  document.getElementById('btn-add-contact').onclick = ()=>{
    if(!e.contacts) e.contacts=[];
    e.contacts.push({id:uid(), nom:'', lien:'', tel:'', mail:''});
    saveNow(); renderContacts();
  };
  function renderContacts(){
    const list = document.getElementById('contacts-list');
    if(!e.contacts || !e.contacts.length){ list.innerHTML = `<p class="muted" style="font-size:13px;">Aucun contact enregistré.</p>`; return; }
    list.innerHTML = e.contacts.map(ct=>`
      <div class="entry-row" data-cid="${ct.id}">
        <div class="field-row">
          <div class="field" style="margin-bottom:8px;"><label>Nom</label><input data-cf="nom" value="${escAttr(ct.nom)}"></div>
          <div class="field" style="margin-bottom:8px;"><label>Lien</label><input data-cf="lien" placeholder="mère, père, tuteur…" value="${escAttr(ct.lien)}"></div>
        </div>
        <div class="field-row">
          <div class="field" style="margin-bottom:0;"><label>Téléphone</label><input data-cf="tel" value="${escAttr(ct.tel)}"></div>
          <div class="field" style="margin-bottom:0;"><label>E-mail</label><input data-cf="mail" value="${escAttr(ct.mail)}"></div>
        </div>
        <div style="text-align:right; margin-top:8px;">
          <button class="icon-btn btn-del-contact" title="Supprimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg>
          </button>
        </div>
      </div>
    `).join('');
    list.querySelectorAll('.entry-row').forEach(row=>{
      const ct = e.contacts.find(c=>c.id===row.dataset.cid);
      row.querySelectorAll('[data-cf]').forEach(inp=>{
        inp.addEventListener('input', ()=>{ ct[inp.dataset.cf]=inp.value; saveData(); });
      });
      row.querySelector('.btn-del-contact').onclick = ()=>{
        e.contacts = e.contacts.filter(c=>c.id!==ct.id); saveNow(); renderContacts();
      };
    });
  }
}

/* --- Vie scolaire (notes / comportement) --- */
function renderSubViescolaire(el, e){
  el.innerHTML = `
    <div class="flex-between">
      <div class="section-title" style="margin:0;">Notes de vie scolaire</div>
      <button class="btn btn-sm btn-primary" id="btn-add-vs">+ Ajouter</button>
    </div>
    <div id="vs-list" style="margin-top:12px;"></div>
  `;
  document.getElementById('btn-add-vs').onclick = ()=> openViescolaireModal(e);
  const list = document.getElementById('vs-list');
  const items = [...(e.viescolaire||[])].sort((a,b)=> b.date.localeCompare(a.date));
  if(!items.length){ list.innerHTML = `<p class="muted" style="font-size:13px;">Aucune note enregistrée.</p>`; return; }
  const typeLabel = {positif:'Positif', observation:'Observation', incident:'Incident'};
  const typeTag = {positif:'success', observation:'', incident:'danger'};
  list.innerHTML = items.map(v=>`
    <div class="entry-row">
      <div class="entry-top">
        <span class="tag ${typeTag[v.type]}">${typeLabel[v.type]||v.type}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="entry-date">${fmtDate(v.date)}</span>
          <button class="icon-btn btn-del-vs" data-id="${v.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg></button>
        </div>
      </div>
      <p>${escHTML(v.texte)}</p>
    </div>
  `).join('');
  list.querySelectorAll('.btn-del-vs').forEach(b=>{
    b.onclick = ()=>{ e.viescolaire = e.viescolaire.filter(v=>v.id!==b.dataset.id); saveNow(); renderSubViescolaire(el,e); };
  });
}
function openViescolaireModal(e){
  showModal(`
    <h3>Nouvelle note</h3>
    <div class="field"><label>Type</label>
      <select id="m-type">
        <option value="observation">Observation</option>
        <option value="positif">Positif</option>
        <option value="incident">Incident</option>
      </select>
    </div>
    <div class="field"><label>Date</label><input id="m-date" type="date" value="${todayISO()}"></div>
    <div class="field"><label>Description</label><textarea id="m-texte" placeholder="Décris le fait observé…"></textarea></div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-save">Enregistrer</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    const texte = document.getElementById('m-texte').value.trim();
    if(!texte) return;
    if(!e.viescolaire) e.viescolaire=[];
    e.viescolaire.push({id:uid(), date:document.getElementById('m-date').value||todayISO(), type:document.getElementById('m-type').value, texte});
    saveNow(); closeModal(); renderEleveSubtab(e);
  };
}

/* --- Absences --- */
function renderSubAbsences(el, e){
  el.innerHTML = `
    <div class="flex-between">
      <div class="section-title" style="margin:0;">Absences &amp; retards</div>
      <button class="btn btn-sm btn-primary" id="btn-add-abs">+ Ajouter</button>
    </div>
    <div id="abs-list" style="margin-top:12px;"></div>
  `;
  document.getElementById('btn-add-abs').onclick = ()=> openAbsenceModal(e);
  const list = document.getElementById('abs-list');
  const items = [...(e.absences||[])].sort((a,b)=> b.date.localeCompare(a.date));
  if(!items.length){ list.innerHTML = `<p class="muted" style="font-size:13px;">Aucune absence enregistrée.</p>`; return; }
  list.innerHTML = items.map(a=>`
    <div class="entry-row">
      <div class="entry-top">
        <span class="tag ${a.justifie?'success':'danger'}">${a.justifie?'Justifiée':'Non justifiée'} · ${a.duree}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="entry-date">${fmtDate(a.date)}</span>
          <button class="icon-btn btn-del-abs" data-id="${a.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg></button>
        </div>
      </div>
      ${a.motif ? `<p>${escHTML(a.motif)}</p>` : ''}
    </div>
  `).join('');
  list.querySelectorAll('.btn-del-abs').forEach(b=>{
    b.onclick = ()=>{ e.absences = e.absences.filter(a=>a.id!==b.dataset.id); saveNow(); renderSubAbsences(el,e); };
  });
}
function openAbsenceModal(e){
  showModal(`
    <h3>Nouvelle absence</h3>
    <div class="field-row">
      <div class="field"><label>Date</label><input id="m-date" type="date" value="${todayISO()}"></div>
      <div class="field"><label>Durée</label>
        <select id="m-duree">
          <option value="heure">1 heure</option>
          <option value="demi-journée">Demi-journée</option>
          <option value="journée">Journée</option>
        </select>
      </div>
    </div>
    <div class="field"><label>Motif</label><input id="m-motif" placeholder="Raison indiquée (optionnel)"></div>
    <div class="field" style="display:flex; align-items:center; gap:8px; margin-top:4px;">
      <input type="checkbox" id="m-justifie" style="width:auto;">
      <label for="m-justifie" style="margin:0;">Justifiée</label>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-save">Enregistrer</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    if(!e.absences) e.absences=[];
    e.absences.push({id:uid(), date:document.getElementById('m-date').value||todayISO(), duree:document.getElementById('m-duree').value, motif:document.getElementById('m-motif').value.trim(), justifie:document.getElementById('m-justifie').checked});
    saveNow(); closeModal(); renderEleveSubtab(e);
  };
}

/* --- Dispositifs (PAP / PPRE / PAI / PPS / ULIS / AESH) --- */
const DISPOSITIF_TYPES = ['PAP','PPRE','PAI','PPS','ULIS','Aide humaine (AESH)','Autre'];

function daysUntil(iso){
  if(!iso) return null;
  const d = new Date(iso);
  if(isNaN(d)) return null;
  return Math.round((d.getTime() - Date.now()) / 86400000);
}

function newDispositif(){
  return { id:uid(), type:'PAP', referent:'', besoins:'', dateDebut:todayISO(), dateRenouvellement:'',
    mesures:'', aesh:false, aeshNom:'', aeshQuotite:'', protocoleUrgence:'', remarques:'', suivi:[] };
}

function renderSubDispositifs(el, e){
  el.innerHTML = `
    <div class="flex-between">
      <div class="section-title" style="margin:0;">Dispositifs d'accompagnement</div>
      <button class="btn btn-sm btn-primary" id="btn-add-disp">+ Ajouter</button>
    </div>
    <p class="muted" style="font-size:12.5px; margin-top:6px;">PAP, PPRE, PAI, PPS/ULIS, aide humaine (AESH) et autres mesures suivies pour cet élève.</p>
    <div id="disp-list" style="margin-top:12px;"></div>
  `;
  document.getElementById('btn-add-disp').onclick = ()=>{
    if(!e.dispositifs) e.dispositifs=[];
    e.dispositifs.push(newDispositif());
    saveNow(); renderSubDispositifs(el, e);
  };
  const list = document.getElementById('disp-list');
  const items = [...(e.dispositifs||[])].sort((a,b)=> (b.dateDebut||'').localeCompare(a.dateDebut||''));
  if(!items.length){ list.innerHTML = `<p class="muted" style="font-size:13px;">Aucun dispositif enregistré.</p>`; return; }
  list.innerHTML = items.map(d=> dispositifCardHTML(d)).join('');
  items.forEach(d=> bindDispositifCard(list, e, d, el));
}

function dispositifCardHTML(d){
  const j = daysUntil(d.dateRenouvellement);
  let renouvBadge = '';
  if(j!==null){
    if(j<0) renouvBadge = `<span class="tag danger">Renouvellement dépassé</span>`;
    else if(j<=45) renouvBadge = `<span class="tag warning">Renouvellement dans ${j} j</span>`;
  }
  return `
    <div class="entry-row disp-card" data-did="${d.id}" style="margin-bottom:12px;">
      <div class="entry-top" style="margin-bottom:10px;">
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <select data-df="type" style="width:auto; padding:4px 8px; font-size:12px;">${DISPOSITIF_TYPES.map(t=>`<option value="${t}" ${d.type===t?'selected':''}>${t}</option>`).join('')}</select>
          ${renouvBadge}
        </div>
        <button class="icon-btn btn-del-disp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg></button>
      </div>
      <div class="field-row">
        <div class="field" style="margin-bottom:8px;"><label>Référent / suivi</label><input data-df="referent" placeholder="Psy EN, médecin scolaire, enseignant référent ASH…" value="${escAttr(d.referent)}"></div>
        <div class="field" style="margin-bottom:8px;"><label>Besoins / troubles concernés</label><input data-df="besoins" placeholder="Dys, TDAH, allergie, trouble anxieux…" value="${escAttr(d.besoins)}"></div>
      </div>
      <div class="field-row">
        <div class="field" style="margin-bottom:8px;"><label>Date de mise en place</label><input data-df="dateDebut" type="date" value="${d.dateDebut||''}"></div>
        <div class="field" style="margin-bottom:8px;"><label>Renouvellement / révision</label><input data-df="dateRenouvellement" type="date" value="${d.dateRenouvellement||''}"></div>
      </div>
      <div class="field" style="margin-bottom:8px;"><label>Aménagements et mesures</label><textarea data-df="mesures" placeholder="Tiers-temps, adaptation des supports, tolérance orthographique, place adaptée…">${escHTML(d.mesures)}</textarea></div>
      <div class="field" style="margin-bottom:8px; display:flex; align-items:center; gap:8px;">
        <input type="checkbox" data-df="aesh" id="aesh-${d.id}" style="width:auto;" ${d.aesh?'checked':''}>
        <label for="aesh-${d.id}" style="margin:0;">Accompagnement humain (AESH/AVS)</label>
      </div>
      <div class="field-row aesh-fields" data-aesh-fields style="${d.aesh?'':'display:none;'}">
        <div class="field" style="margin-bottom:8px;"><label>Nom de l'AESH</label><input data-df="aeshNom" value="${escAttr(d.aeshNom)}"></div>
        <div class="field" style="margin-bottom:8px;"><label>Quotité horaire</label><input data-df="aeshQuotite" placeholder="ex. 12h/semaine, mutualisé…" value="${escAttr(d.aeshQuotite)}"></div>
      </div>
      <div class="field" style="margin-bottom:8px;"><label>Protocole / consignes particulières (urgence, PAI…)</label><textarea data-df="protocoleUrgence" placeholder="Conduite à tenir, trousse d'urgence, personnes à prévenir…">${escHTML(d.protocoleUrgence)}</textarea></div>
      <div class="field" style="margin-bottom:4px;"><label>Remarques</label><textarea data-df="remarques">${escHTML(d.remarques)}</textarea></div>
      <div class="divider"></div>
      <div class="flex-between">
        <span class="muted" style="font-size:12px;">Journal de suivi</span>
        <button class="btn btn-sm btn-add-suivi">+ Note</button>
      </div>
      <div class="suivi-list" style="margin-top:8px;">
        ${(d.suivi||[]).slice().sort((a,b)=>b.date.localeCompare(a.date)).map(s=>`
          <div class="entry-row" style="background:var(--surface); padding:8px 10px;">
            <div class="entry-top"><span class="entry-date">${fmtDate(s.date)}</span><button class="icon-btn btn-del-suivi" data-sid="${s.id}"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
            <p style="font-size:12.5px;">${escHTML(s.texte)}</p>
          </div>`).join('') || `<p class="muted" style="font-size:12.5px;">Aucune note de suivi.</p>`}
      </div>
    </div>
  `;
}

function bindDispositifCard(list, e, d, el){
  const card = list.querySelector(`.disp-card[data-did="${d.id}"]`);
  if(!card) return;
  card.querySelectorAll('[data-df]').forEach(input=>{
    const field = input.dataset.df;
    const evt = (input.type==='checkbox' || input.tagName==='SELECT') ? 'change' : 'input';
    input.addEventListener(evt, ()=>{
      d[field] = input.type==='checkbox' ? input.checked : input.value;
      if(field==='aesh'){
        card.querySelector('[data-aesh-fields]').style.display = d.aesh ? '' : 'none';
      }
      saveData();
    });
  });
  card.querySelector('.btn-del-disp').onclick = ()=>{
    confirmModal('Supprimer ce dispositif ?', ()=>{
      e.dispositifs = e.dispositifs.filter(x=>x.id!==d.id);
      saveNow(); renderSubDispositifs(el, e);
    });
  };
  card.querySelector('.btn-add-suivi').onclick = ()=>{
    showModal(`
      <h3>Note de suivi</h3>
      <div class="field"><label>Date</label><input id="m-date" type="date" value="${todayISO()}"></div>
      <div class="field"><label>Note</label><textarea id="m-texte" placeholder="Évolution, échange avec la famille, bilan d'étape…"></textarea></div>
      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
        <button class="btn btn-ghost" id="m-cancel">Annuler</button>
        <button class="btn btn-primary" id="m-save">Ajouter</button>
      </div>
    `);
    document.getElementById('m-cancel').onclick = closeModal;
    document.getElementById('m-save').onclick = ()=>{
      const texte = document.getElementById('m-texte').value.trim();
      if(!texte) return;
      if(!d.suivi) d.suivi=[];
      d.suivi.push({id:uid(), date:document.getElementById('m-date').value||todayISO(), texte});
      saveNow(); closeModal(); renderSubDispositifs(el, e);
    };
  };
}

/* --- Courriers aux familles --- */
const COURRIER_TEMPLATES = [
  { key:'absences', label:'Absences répétées',
    build:(e,ct)=> `Madame, Monsieur,\n\nJe me permets de vous contacter en tant que professeur principal de ${e.prenom} ${e.nom}.\nJ'ai constaté plusieurs absences ces dernières semaines et souhaitais faire le point avec vous à ce sujet.\n\nPourriez-vous me confirmer les motifs de ces absences, et me préciser si un rendez-vous serait utile pour en discuter ?\n\nJe reste à votre disposition.\n\nCordialement,` },
  { key:'miseengarde', label:'Mise en garde comportement',
    build:(e,ct)=> `Madame, Monsieur,\n\nEn tant que professeur principal de ${e.prenom} ${e.nom}, je me permets de vous alerter sur des difficultés de comportement observées récemment en classe.\n\nJe souhaiterais échanger avec vous afin de trouver ensemble des solutions et d'accompagner au mieux ${e.prenom} dans la suite de l'année.\n\nN'hésitez pas à me contacter pour convenir d'un moment d'échange.\n\nCordialement,` },
  { key:'convocation', label:'Convocation rendez-vous',
    build:(e,ct)=> `Madame, Monsieur,\n\nJe souhaiterais vous rencontrer afin de faire le point sur la scolarité de ${e.prenom} ${e.nom}.\n\nSeriez-vous disponible prochainement ? Merci de me indiquer vos disponibilités afin que nous puissions convenir d'un rendez-vous.\n\nCordialement,` },
  { key:'felicitations', label:'Félicitations / encouragements',
    build:(e,ct)=> `Madame, Monsieur,\n\nJe tenais à vous faire part de ma satisfaction concernant le travail et l'attitude de ${e.prenom} ${e.nom} ce trimestre.\n\nCes efforts sont à souligner et à encourager. Merci de votre soutien dans son travail.\n\nCordialement,` },
  { key:'vierge', label:'Courrier libre (vierge)',
    build:(e,ct)=> `Madame, Monsieur,\n\nConcernant ${e.prenom} ${e.nom} :\n\n\n\nCordialement,` },
];
function renderSubCourriers(el, e){
  const contacts = e.contacts||[];
  el.innerHTML = `
    <div class="section-title" style="margin:0 0 10px;">Modèle de courrier</div>
    <div class="field"><select id="courrier-template">${COURRIER_TEMPLATES.map(t=>`<option value="${t.key}">${t.label}</option>`).join('')}</select></div>
    ${contacts.length ? `<div class="field"><label>Destinataire</label><select id="courrier-contact"><option value="">— Choisir un contact —</option>${contacts.map(c=>`<option value="${c.id}">${escHTML(c.nom)} (${escHTML(c.lien)})${c.mail?' — '+escHTML(c.mail):''}</option>`).join('')}</select></div>` : `<p class="muted" style="font-size:12.5px;">Aucun contact enregistré dans l'onglet Infos — tu pourras copier le texte manuellement.</p>`}
    <div class="appreciation-box" style="margin-top:6px;">
      <textarea id="courrier-texte" style="min-height:220px;"></textarea>
    </div>
    <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
      <button class="btn btn-sm" id="btn-courrier-copy">Copier le texte</button>
      <button class="btn btn-sm btn-primary" id="btn-courrier-mail">Ouvrir dans Mail</button>
    </div>
  `;
  function fillTemplate(){
    const key = document.getElementById('courrier-template').value;
    const tpl = COURRIER_TEMPLATES.find(t=>t.key===key);
    document.getElementById('courrier-texte').value = tpl.build(e);
  }
  fillTemplate();
  document.getElementById('courrier-template').addEventListener('change', fillTemplate);
  document.getElementById('btn-courrier-copy').onclick = ()=>{
    const ta = document.getElementById('courrier-texte');
    ta.select();
    try{ document.execCommand('copy'); }catch(err){}
    if(navigator.clipboard) navigator.clipboard.writeText(ta.value).catch(()=>{});
  };
  document.getElementById('btn-courrier-mail').onclick = ()=>{
    const contactSel = document.getElementById('courrier-contact');
    const contact = contactSel ? contacts.find(c=>c.id===contactSel.value) : null;
    const to = contact && contact.mail ? contact.mail : '';
    const templateKey = document.getElementById('courrier-template').value;
    const subject = 'Concernant ' + e.prenom + ' ' + e.nom;
    const body = document.getElementById('courrier-texte').value;
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
}

/* --- Orientation (dans fiche élève) --- */
function renderSubOrientationEleve(el, e){
  if(!e.orientation) e.orientation={voeux:[], stages:[], notesOrientation:''};
  el.innerHTML = orientationBlockHTML(e);
  bindOrientationBlock(el, e);
}

/* --- RDV (dans fiche élève) --- */
function renderSubRdvEleve(el, e){
  el.innerHTML = `
    <div class="flex-between">
      <div class="section-title" style="margin:0;">Rendez-vous / entretiens</div>
      <button class="btn btn-sm btn-primary" id="btn-add-rdv">+ Ajouter</button>
    </div>
    <div id="rdv-list-e" style="margin-top:12px;"></div>
  `;
  document.getElementById('btn-add-rdv').onclick = ()=> openRdvModal(e);
  renderRdvListFor(e, document.getElementById('rdv-list-e'), ()=>renderSubRdvEleve(el,e));
}

/* ============================================================
   BULLETINS
   ============================================================ */
function renderBulletins(c, actions){
  actions.innerHTML = trimestreSwitchHTML() + `<button class="btn btn-sm" id="btn-import-ed" style="margin-left:10px;">Importer École Directe</button><button class="btn btn-sm" id="btn-matieres">Matières</button>`;
  bindTrimestreSwitch(actions);
  document.getElementById('btn-matieres').onclick = openSettingsModal;
  document.getElementById('btn-import-ed').onclick = openImportWizard;

  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  const matieres = state.data.classe.matieres;
  if(!eleves.length){ c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute des élèves depuis l'onglet Élèves.</p></div>`; return; }
  if(!matieres.length){ c.innerHTML = `<div class="empty-state"><h3>Aucune matière configurée</h3><p>Configure la liste des matières.</p></div>`; return; }

  c.innerHTML = `
    <div class="table-wrap">
      <table class="bulletins">
        <thead><tr>
          <th style="position:sticky; left:0; background:var(--raised);">Élève</th>
          ${matieres.map(m=>`<th>${m}</th>`).join('')}
          <th>Moy. gén.</th>
        </tr></thead>
        <tbody>
          ${eleves.map(e=>`
            <tr data-id="${e.id}">
              <td style="position:sticky; left:0; background:var(--surface); font-weight:500;">${e.prenom} ${e.nom}</td>
              ${matieres.map(m=>{
                const b = e.bulletins?.[state.trimestre]?.[m];
                const hasAppr = b && b.appreciation;
                return `<td>
                  <div style="display:flex; align-items:center; gap:4px;">
                    <input class="note-input" data-m="${escAttr(m)}" type="text" inputmode="decimal" value="${b?.moyenne ?? ''}" placeholder="—">
                    <button class="icon-btn btn-appr-mat" data-m="${escAttr(m)}" title="Appréciation ${escAttr(m)}" style="color:${hasAppr?'var(--accent-hi)':'var(--muted-2)'};">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H8l-4 4V5Z"/></svg>
                    </button>
                  </div>
                </td>`;
              }).join('')}
              <td class="moy-cell"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  c.querySelectorAll('tr[data-id]').forEach(tr=>{
    const e = getEleve(tr.dataset.id);
    updateMoyCell(tr, e);
    tr.querySelectorAll('.note-input').forEach(inp=>{
      inp.addEventListener('input', ()=>{
        const m = inp.dataset.m;
        if(!e.bulletins[state.trimestre]) e.bulletins[state.trimestre]={};
        if(!e.bulletins[state.trimestre][m]) e.bulletins[state.trimestre][m]={};
        e.bulletins[state.trimestre][m].moyenne = inp.value.replace(',','.');
        saveData();
        updateMoyCell(tr, e);
      });
    });
    tr.querySelectorAll('.btn-appr-mat').forEach(btn=>{
      btn.addEventListener('click', ()=> openMatiereApprModal(e, btn.dataset.m));
    });
  });
}
function updateMoyCell(tr, e){
  const moy = moyenneGenerale(e, state.trimestre);
  const cell = tr.querySelector('.moy-cell');
  cell.innerHTML = moy!==null ? `<span class="moy-badge ${moyClass(moy)}">${moy.toFixed(1)}</span>` : '<span class="muted">—</span>';
}

function openMatiereApprModal(e, matiere){
  if(!e.bulletins[state.trimestre]) e.bulletins[state.trimestre]={};
  if(!e.bulletins[state.trimestre][matiere]) e.bulletins[state.trimestre][matiere]={};
  const current = e.bulletins[state.trimestre][matiere].appreciation || '';
  showModal(`
    <h3>Appréciation — ${escHTML(matiere)}</h3>
    <p class="muted" style="font-size:12.5px; margin-top:-6px; margin-bottom:12px;">${e.prenom} ${e.nom} · ${state.trimestre}</p>
    <div class="field"><textarea id="m-appr" style="min-height:110px;">${escHTML(current)}</textarea></div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-save">Enregistrer</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    e.bulletins[state.trimestre][matiere].appreciation = document.getElementById('m-appr').value.trim();
    saveNow(); closeModal(); render();
  };
}

/* ============================================================
   IMPORT ÉCOLE DIRECTE (notes + appréciations, Excel/CSV)
   ============================================================ */
let importState = null;

function normStr(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
}

function openImportWizard(){
  if(typeof XLSX === 'undefined'){
    alert("La librairie de lecture Excel n'a pas pu se charger (connexion internet requise). Réessaie une fois en ligne.");
    return;
  }
  importState = { step:1, headers:[], rows:[], mapping:[], matches:[] };
  renderImportPanel();
}

function importPanelShell(bodyHTML){
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="overlay" id="import-overlay">
      <div class="panel" style="width:min(760px,100%);">
        <div class="panel-header">
          <div>
            <h2>Importer depuis École Directe</h2>
            <div class="sub muted" style="font-size:12px; margin-top:2px;">Notes et appréciations · ${state.trimestre}</div>
          </div>
          <button class="icon-btn" id="btn-close-import" title="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div class="panel-body">
          <div class="import-steps">
            ${[1,2,3,4].map(n=>`<div class="import-step-dot ${importState.step===n?'active':importState.step>n?'done':''}">${n}</div>`).join('')}
          </div>
          ${bodyHTML}
        </div>
      </div>
    </div>`;
  document.getElementById('import-overlay').addEventListener('click', (ev)=>{ if(ev.target.id==='import-overlay') closeImportWizard(); });
  document.getElementById('btn-close-import').onclick = closeImportWizard;
}
function closeImportWizard(){ importState=null; document.getElementById('modal-root').innerHTML=''; render(); }

function renderImportPanel(){
  if(importState.step===1) return renderImportStep1();
  if(importState.step===2) return renderImportStep2();
  if(importState.step===3) return renderImportStep3();
  if(importState.step===4) return renderImportStep4();
}

function renderImportStep1(){
  importPanelShell(`
    <p class="muted" style="font-size:13.5px;">
      Exporte le tableau de notes (et appréciations) depuis École Directe au format Excel (.xlsx) ou CSV, puis importe-le ici.
      Tu pourras vérifier la correspondance des colonnes avant tout import.
    </p>
    <div class="field" style="margin-top:16px;">
      <label>Fichier Excel / CSV</label>
      <input type="file" id="import-file-input" accept=".xlsx,.xls,.csv">
    </div>
    <div id="import-error" style="color:var(--danger); font-size:13px; margin-top:8px;"></div>
  `);
  document.getElementById('import-file-input').addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {type:'array'});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {header:1, defval:''});
        const nonEmpty = rows.filter(r=>r.some(c=>String(c).trim()!==''));
        if(nonEmpty.length<2) throw new Error('empty');
        importState.headers = nonEmpty[0].map(h=>String(h).trim());
        importState.rows = nonEmpty.slice(1);
        importState.mapping = guessMapping(importState.headers);
        importState.step = 2;
        renderImportPanel();
      }catch(err){
        document.getElementById('import-error').textContent = "Impossible de lire ce fichier. Vérifie le format (.xlsx, .xls ou .csv).";
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function mappingOptions(){
  const matieres = state.data.classe.matieres;
  const opts = [{v:'ignore', l:'Ignorer'}, {v:'nomcomplet', l:'Élève — nom complet'}, {v:'nom', l:'Élève — nom'}, {v:'prenom', l:'Élève — prénom'}];
  matieres.forEach(m=> opts.push({v:'note::'+m, l:'Note — '+m}));
  matieres.forEach(m=> opts.push({v:'appr::'+m, l:'Appréciation — '+m}));
  opts.push({v:'apprgen', l:'Appréciation générale'});
  return opts;
}

function guessMapping(headers){
  const sig = headers.join('|');
  if(state.data.mappingTemplates[sig]) return state.data.mappingTemplates[sig].slice();
  const matieres = state.data.classe.matieres;
  return headers.map(h=>{
    const n = normStr(h);
    if(['nom','nomeleve'].includes(n)) return 'nom';
    if(['prenom'].includes(n)) return 'prenom';
    if(['eleve','nomprenom','nometprenom','nomcomplet'].includes(n)) return 'nomcomplet';
    if(n.includes('appreciationgenerale') || n==='apprecgenerale') return 'apprgen';
    const matMatch = matieres.find(m=> normStr(m)===n || n.includes(normStr(m)));
    if(matMatch){
      if(n.includes('appreciation') || n.includes('appr')) return 'appr::'+matMatch;
      return 'note::'+matMatch;
    }
    return 'ignore';
  });
}

function renderImportStep2(){
  const opts = mappingOptions();
  importPanelShell(`
    <p class="muted" style="font-size:13px; margin-bottom:12px;">
      Indique à quoi correspond chaque colonne. Le mappage sera mémorisé pour tes prochains imports.
    </p>
    <div class="table-wrap" style="max-height:420px; overflow-y:auto;">
      <table class="mapping-table">
        <thead><tr><th>Colonne (fichier)</th><th>Aperçu</th><th>Correspond à</th></tr></thead>
        <tbody>
          ${importState.headers.map((h,i)=>`
            <tr>
              <td>${escHTML(h)||'<span class="muted">(sans nom)</span>'}</td>
              <td class="mapping-preview">${escHTML(String(importState.rows[0]?.[i] ?? ''))}</td>
              <td><select data-idx="${i}">${opts.map(o=>`<option value="${o.v}" ${importState.mapping[i]===o.v?'selected':''}>${o.l}</option>`).join('')}</select></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div id="mapping-warn" style="color:var(--warning); font-size:12.5px; margin-top:10px;"></div>
    <div style="display:flex; justify-content:space-between; margin-top:18px;">
      <button class="btn btn-ghost" id="btn-back1">← Retour</button>
      <button class="btn btn-primary" id="btn-next2">Continuer →</button>
    </div>
  `);
  document.querySelectorAll('.mapping-table select').forEach(sel=>{
    sel.addEventListener('change', ()=>{ importState.mapping[parseInt(sel.dataset.idx)] = sel.value; });
  });
  document.getElementById('btn-back1').onclick = ()=>{ importState.step=1; renderImportPanel(); };
  document.getElementById('btn-next2').onclick = ()=>{
    const hasEleveCol = importState.mapping.some(m=>['nom','prenom','nomcomplet'].includes(m));
    if(!hasEleveCol){ document.getElementById('mapping-warn').textContent = "Sélectionne au moins une colonne pour identifier l'élève (nom, prénom, ou nom complet)."; return; }
    importState.matches = computeMatches();
    importState.step = 3;
    renderImportPanel();
  };
}

function rowEleveName(row, mapping){
  let nom='', prenom='', complet='';
  mapping.forEach((m,i)=>{
    const val = String(row[i] ?? '').trim();
    if(m==='nom') nom = val;
    if(m==='prenom') prenom = val;
    if(m==='nomcomplet') complet = val;
  });
  return { nom, prenom, complet };
}

function computeMatches(){
  const eleves = state.data.eleves;
  return importState.rows.map(row=>{
    const {nom, prenom, complet} = rowEleveName(row, importState.mapping);
    const label = complet || `${prenom} ${nom}`.trim();
    const target = normStr(complet || (prenom+nom));
    let found = eleves.find(e=> normStr(e.prenom+e.nom)===target || normStr(e.nom+e.prenom)===target);
    if(!found && target){
      found = eleves.find(e=> target.includes(normStr(e.nom)) && target.includes(normStr(e.prenom)));
    }
    return { row, label: label || '(ligne sans nom)', eleveId: found ? found.id : null };
  });
}

function renderImportStep3(){
  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  const nbMatched = importState.matches.filter(m=>m.eleveId).length;
  importPanelShell(`
    <p class="muted" style="font-size:13px; margin-bottom:10px;">
      ${nbMatched} / ${importState.matches.length} élève(s) reconnu(s) automatiquement. Corrige les lignes non reconnues si besoin.
    </p>
    <div style="max-height:420px; overflow-y:auto; border:1px solid var(--hairline); border-radius:var(--radius-m);" id="match-list"></div>
    <div style="display:flex; justify-content:space-between; margin-top:18px;">
      <button class="btn btn-ghost" id="btn-back2">← Retour</button>
      <button class="btn btn-primary" id="btn-next3">Continuer →</button>
    </div>
  `);
  const list = document.getElementById('match-list');
  list.innerHTML = importState.matches.map((m,i)=>`
    <div class="match-row ${m.eleveId?'':'no-match'}">
      <span>${escHTML(m.label)}</span>
      <select data-i="${i}" style="max-width:220px;">
        <option value="">— Ignorer cette ligne —</option>
        ${eleves.map(e=>`<option value="${e.id}" ${m.eleveId===e.id?'selected':''}>${e.prenom} ${e.nom}</option>`).join('')}
      </select>
    </div>
  `).join('');
  list.querySelectorAll('select').forEach(sel=>{
    sel.addEventListener('change', ()=>{ importState.matches[parseInt(sel.dataset.i)].eleveId = sel.value || null; });
  });
  document.getElementById('btn-back2').onclick = ()=>{ importState.step=2; renderImportPanel(); };
  document.getElementById('btn-next3').onclick = ()=>{ importState.step=4; renderImportPanel(); };
}

function renderImportStep4(){
  const nb = importState.matches.filter(m=>m.eleveId).length;
  const noteCount = importState.mapping.filter(m=>m.startsWith('note::')).length;
  const apprCount = importState.mapping.filter(m=>m.startsWith('appr::')).length + importState.mapping.filter(m=>m==='apprgen').length;
  importPanelShell(`
    <div class="import-summary">
      <p style="margin:0 0 8px;"><b>${nb}</b> élève(s) seront mis à jour pour <b>${state.trimestre}</b>.</p>
      <p style="margin:0 0 8px; color:var(--muted);">${noteCount} colonne(s) de notes, ${apprCount} colonne(s) d'appréciation seront importées.</p>
      <p style="margin:0; color:var(--muted); font-size:12px;">Les valeurs existantes seront remplacées uniquement pour les colonnes mappées. Le mappage sera mémorisé pour ce même type de fichier.</p>
    </div>
    <div style="display:flex; justify-content:space-between; margin-top:18px;">
      <button class="btn btn-ghost" id="btn-back3">← Retour</button>
      <button class="btn btn-primary" id="btn-confirm-import">Importer</button>
    </div>
  `);
  document.getElementById('btn-back3').onclick = ()=>{ importState.step=3; renderImportPanel(); };
  document.getElementById('btn-confirm-import').onclick = ()=>{
    runImport();
    state.data.mappingTemplates[importState.headers.join('|')] = importState.mapping.slice();
    saveNow();
    closeImportWizard();
    render();
  };
}

function runImport(){
  const t = state.trimestre;
  importState.matches.forEach(m=>{
    if(!m.eleveId) return;
    const e = getEleve(m.eleveId);
    if(!e) return;
    if(!e.bulletins[t]) e.bulletins[t] = {};
    importState.mapping.forEach((map, i)=>{
      const val = String(m.row[i] ?? '').trim();
      if(!val) return;
      if(map.startsWith('note::')){
        const mat = map.slice(6);
        if(!e.bulletins[t][mat]) e.bulletins[t][mat] = {};
        e.bulletins[t][mat].moyenne = val.replace(',','.');
      } else if(map.startsWith('appr::')){
        const mat = map.slice(6);
        if(!e.bulletins[t][mat]) e.bulletins[t][mat] = {};
        e.bulletins[t][mat].appreciation = val;
      } else if(map==='apprgen'){
        e.bulletins[t].appreciationGenerale = val;
      }
    });
  });
}

/* ============================================================
   CONSEILS DE CLASSE
   ============================================================ */
let conseilIndex = 0;
function renderConseils(c, actions){
  actions.innerHTML = trimestreSwitchHTML() + `<button class="btn btn-sm" id="btn-presentation" style="margin-left:10px;">⛶ Plein écran</button>`;
  bindTrimestreSwitch(actions);
  document.getElementById('btn-presentation').onclick = enterPresentationMode;
  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  if(!eleves.length){ c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute des élèves pour préparer le conseil de classe.</p></div>`; return; }
  if(conseilIndex>=eleves.length) conseilIndex=0;
  const e = eleves[conseilIndex];
  const moy = moyenneGenerale(e, state.trimestre);
  const abs = absencesCount(e), absNJ = absencesNonJustifiees(e);
  const inc = incidentsCount(e);
  const positifs = (e.viescolaire||[]).filter(v=>v.type==='positif').length;

  c.innerHTML = `
    ${document.body.classList.contains('presentation-mode') ? `<button class="presentation-exit" id="btn-exit-presentation">✕ Quitter le plein écran</button>` : ''}
    <div class="conseil-nav">
      <button class="btn btn-ghost" id="c-prev">← Précédent</button>
      <span class="conseil-progress">${conseilIndex+1} / ${eleves.length} — ${state.trimestre}</span>
      <button class="btn btn-ghost" id="c-next">Suivant →</button>
    </div>
    <div class="conseil-card">
      <p class="cname">${e.prenom} ${e.nom}</p>
      <p class="cmoy">${moy!==null ? 'Moyenne générale : '+moy.toFixed(1)+'/20' : 'Aucun bulletin saisi'}</p>
      <div class="conseil-stats">
        <div class="cs-item"><b>${abs}</b>absences</div>
        <div class="cs-item"><b>${absNJ}</b>non justifiées</div>
        <div class="cs-item"><b>${inc}</b>incidents</div>
        <div class="cs-item"><b>${positifs}</b>notes positives</div>
      </div>
      <div class="divider"></div>
      <div class="flex-between">
        <div class="section-title" style="margin:0;">Appréciation générale</div>
        <button class="btn btn-sm" id="btn-regen">↻ Régénérer</button>
      </div>
      <div class="appreciation-box">
        <textarea id="appreciation-txt" placeholder="Appréciation générale du conseil de classe…">${e.bulletins[state.trimestre]?.appreciationGenerale ?? generateAppreciation(e)}</textarea>
      </div>
    </div>
  `;
  document.getElementById('c-prev').onclick = ()=>{ conseilIndex = (conseilIndex-1+eleves.length)%eleves.length; renderConseils(c,actions); };
  document.getElementById('c-next').onclick = ()=>{ conseilIndex = (conseilIndex+1)%eleves.length; renderConseils(c,actions); };
  const exitBtn = document.getElementById('btn-exit-presentation');
  if(exitBtn) exitBtn.onclick = exitPresentationMode;
  const ta = document.getElementById('appreciation-txt');
  if(!e.bulletins[state.trimestre]) e.bulletins[state.trimestre]={};
  if(e.bulletins[state.trimestre].appreciationGenerale===undefined){ e.bulletins[state.trimestre].appreciationGenerale = ta.value; saveData(); }
  ta.addEventListener('input', ()=>{ e.bulletins[state.trimestre].appreciationGenerale = ta.value; saveData(); });
  document.getElementById('btn-regen').onclick = ()=>{ ta.value = generateAppreciation(e); e.bulletins[state.trimestre].appreciationGenerale = ta.value; saveNow(); };
}

function enterPresentationMode(){
  document.body.classList.add('presentation-mode');
  if(document.documentElement.requestFullscreen){
    document.documentElement.requestFullscreen().catch(()=>{});
  }
  render();
}
function exitPresentationMode(){
  document.body.classList.remove('presentation-mode');
  if(document.fullscreenElement && document.exitFullscreen){
    document.exitFullscreen().catch(()=>{});
  }
  render();
}
document.addEventListener('keydown', (ev)=>{
  if(ev.key==='Escape' && document.body.classList.contains('presentation-mode')) exitPresentationMode();
});
document.addEventListener('fullscreenchange', ()=>{
  if(!document.fullscreenElement && document.body.classList.contains('presentation-mode')) exitPresentationMode();
});

function generateAppreciation(e){
  const moy = moyenneGenerale(e, state.trimestre);
  const absNJ = absencesNonJustifiees(e);
  const abs = absencesCount(e);
  const inc = incidentsCount(e);
  const positifs = (e.viescolaire||[]).filter(v=>v.type==='positif').length;
  let phrases = [];
  if(moy===null){ phrases.push("Trimestre à évaluer, les bulletins ne sont pas encore tous saisis."); }
  else if(moy>=14) phrases.push("Trimestre très satisfaisant, résultats solides dans l'ensemble des matières.");
  else if(moy>=12) phrases.push("Bon trimestre, résultats satisfaisants et réguliers.");
  else if(moy>=10) phrases.push("Résultats justes ce trimestre ; des marges de progression existent.");
  else phrases.push("Trimestre difficile, un travail plus régulier et approfondi est nécessaire pour progresser.");

  if(positifs>0) phrases.push("L'investissement et l'attitude positive de l'élève sont à souligner.");
  if(inc>=3) phrases.push("Le comportement a posé problème à plusieurs reprises ce trimestre et doit s'améliorer.");
  else if(inc>0) phrases.push("Quelques écarts de comportement ont été signalés.");

  if(abs>0){
    if(absNJ>=4) phrases.push(`Le nombre d'absences non justifiées (${absNJ}) est préoccupant et nuit à la progression.`);
    else if(absNJ>0) phrases.push(`${absNJ} absence${absNJ>1?'s':''} non justifiée${absNJ>1?'s':''} à signaler.`);
    else phrases.push("L'assiduité est correcte, les absences ont été justifiées.");
  } else {
    phrases.push("Assiduité sans reproche ce trimestre.");
  }

  const matieres = state.data.classe.matieres;
  const points = matieres.filter(m=>{ const v = moyenneMatiere(e, state.trimestre, m); return v!==null && v>=16; });
  const difficultes = matieres.filter(m=>{ const v = moyenneMatiere(e, state.trimestre, m); return v!==null && v<8; });
  if(points.length) phrases.push(`Résultats remarquables en ${points.join(', ')}.`);
  if(difficultes.length) phrases.push(`Des difficultés importantes sont à noter en ${difficultes.join(', ')}.`);

  return phrases.join(' ');
}

/* ============================================================
   ORIENTATION (vue globale)
   ============================================================ */
function renderOrientation(c, actions){
  actions.innerHTML = '';
  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  if(!eleves.length){ c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute des élèves pour suivre leur orientation.</p></div>`; return; }
  c.innerHTML = `<div id="orient-accordion"></div>`;
  const wrap = document.getElementById('orient-accordion');
  wrap.innerHTML = eleves.map(e=>`
    <div class="entry-row" style="cursor:pointer;" data-toggle="${e.id}">
      <div class="entry-top">
        <b>${e.prenom} ${e.nom}</b>
        <span class="muted" style="font-size:12px;">${(e.orientation?.voeux?.length||0)} vœu(x) · ${(e.orientation?.stages?.length||0)} stage(s)</span>
      </div>
      <div class="orient-detail" id="orient-detail-${e.id}" style="display:none; margin-top:12px;"></div>
    </div>
  `).join('');
  wrap.querySelectorAll('[data-toggle]').forEach(row=>{
    row.addEventListener('click', (ev)=>{
      if(ev.target.closest('.orient-detail')) return;
      const id = row.dataset.toggle;
      const det = document.getElementById('orient-detail-'+id);
      const isOpen = det.style.display!=='none';
      wrap.querySelectorAll('.orient-detail').forEach(d=>d.style.display='none');
      if(!isOpen){
        det.style.display='block';
        const e = getEleve(id);
        if(!e.orientation) e.orientation={voeux:[], stages:[], notesOrientation:''};
        det.innerHTML = orientationBlockHTML(e);
        bindOrientationBlock(det, e);
      }
    });
  });
}

function orientationBlockHTML(e){
  const voeux = e.orientation.voeux||[];
  const stages = e.orientation.stages||[];
  return `
    <div class="orient-section">
      <div class="flex-between"><h4>Vœux d'affectation (Affelnet / Parcoursup)</h4><button class="btn btn-sm" data-add="voeu">+ Vœu</button></div>
      <div data-list="voeux">${voeux.length ? voeux.map(v=>`
        <div class="entry-row" data-vid="${v.id}">
          <div class="field-row">
            <div class="field" style="margin-bottom:0;"><label>Rang</label><input data-vf="rang" type="number" min="1" value="${v.rang??''}"></div>
            <div class="field" style="margin-bottom:0;"><label>Formation / établissement</label><input data-vf="formation" value="${escAttr(v.formation)}"></div>
          </div>
          <div style="text-align:right; margin-top:6px;"><button class="icon-btn btn-del-v" data-id="${v.id}">Supprimer</button></div>
        </div>`).join('') : '<p class="muted" style="font-size:13px;">Aucun vœu enregistré.</p>'}</div>
    </div>
    <div class="orient-section">
      <div class="flex-between"><h4>Stages / PFMP</h4><button class="btn btn-sm" data-add="stage">+ Stage</button></div>
      <div data-list="stages">${stages.length ? stages.map(s=>`
        <div class="entry-row" data-sid="${s.id}">
          <div class="field-row">
            <div class="field" style="margin-bottom:8px;"><label>Début</label><input data-sf="debut" type="date" value="${s.debut||''}"></div>
            <div class="field" style="margin-bottom:8px;"><label>Fin</label><input data-sf="fin" type="date" value="${s.fin||''}"></div>
          </div>
          <div class="field" style="margin-bottom:8px;"><label>Entreprise / tuteur</label><input data-sf="entreprise" value="${escAttr(s.entreprise)}"></div>
          <div class="field" style="margin-bottom:0;"><label>Bilan</label><textarea data-sf="bilan">${escHTML(s.bilan||'')}</textarea></div>
          <div style="text-align:right; margin-top:6px;"><button class="icon-btn btn-del-s" data-id="${s.id}">Supprimer</button></div>
        </div>`).join('') : '<p class="muted" style="font-size:13px;">Aucun stage enregistré.</p>'}</div>
    </div>
    <div class="orient-section">
      <h4>Notes générales d'orientation</h4>
      <div class="field"><textarea data-of="notesOrientation" placeholder="Projet professionnel, pistes envisagées…">${escHTML(e.orientation.notesOrientation||'')}</textarea></div>
    </div>
  `;
}
function bindOrientationBlock(container, e){
  container.querySelector('[data-add="voeu"]').onclick = ()=>{
    e.orientation.voeux.push({id:uid(), rang:(e.orientation.voeux.length+1), formation:''});
    saveNow(); refresh();
  };
  container.querySelector('[data-add="stage"]').onclick = ()=>{
    e.orientation.stages.push({id:uid(), debut:'', fin:'', entreprise:'', bilan:''});
    saveNow(); refresh();
  };
  function refresh(){
    container.innerHTML = orientationBlockHTML(e);
    bindOrientationBlock(container, e);
  }
  container.querySelectorAll('[data-vid]').forEach(row=>{
    const v = e.orientation.voeux.find(x=>x.id===row.dataset.vid);
    row.querySelectorAll('[data-vf]').forEach(inp=>inp.addEventListener('input', ()=>{ v[inp.dataset.vf]=inp.value; saveData(); }));
    row.querySelector('.btn-del-v').onclick = ()=>{ e.orientation.voeux = e.orientation.voeux.filter(x=>x.id!==v.id); saveNow(); refresh(); };
  });
  container.querySelectorAll('[data-sid]').forEach(row=>{
    const s = e.orientation.stages.find(x=>x.id===row.dataset.sid);
    row.querySelectorAll('[data-sf]').forEach(inp=>inp.addEventListener('input', ()=>{ s[inp.dataset.sf]=inp.value; saveData(); }));
    row.querySelector('.btn-del-s').onclick = ()=>{ e.orientation.stages = e.orientation.stages.filter(x=>x.id!==s.id); saveNow(); refresh(); };
  });
  const notesEl = container.querySelector('[data-of="notesOrientation"]');
  if(notesEl) notesEl.addEventListener('input', ()=>{ e.orientation.notesOrientation = notesEl.value; saveData(); });
}

/* ============================================================
   RENDEZ-VOUS PARENTS (vue globale)
   ============================================================ */
function renderRdv(c, actions){
  actions.innerHTML = `<button class="btn btn-primary" id="btn-add-rdv-g">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
    Nouveau rendez-vous</button>`;
  const eleves = state.data.eleves;
  document.getElementById('btn-add-rdv-g').onclick = ()=>{
    if(!eleves.length){ return; }
    openRdvModal(null, ()=>renderRdv(c,actions));
  };
  if(!eleves.length){ c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute des élèves avant d'enregistrer un rendez-vous.</p></div>`; return; }

  const all = [];
  eleves.forEach(e=> (e.rdv||[]).forEach(r=> all.push({...r, eleve:e})) );
  all.sort((a,b)=> b.date.localeCompare(a.date));
  if(!all.length){ c.innerHTML = `<div class="empty-state"><h3>Aucun rendez-vous enregistré</h3><p>Ajoute un compte-rendu d'entretien avec une famille.</p></div>`; return; }

  c.innerHTML = `<div id="rdv-global-list"></div>`;
  const list = document.getElementById('rdv-global-list');
  list.innerHTML = all.map(r=>`
    <div class="entry-row">
      <div class="entry-top">
        <b>${r.eleve.prenom} ${r.eleve.nom}</b>
        <span class="entry-date">${fmtDate(r.date)}</span>
      </div>
      ${r.motif ? `<p style="color:var(--muted); font-size:12.5px; margin-top:6px;">Motif : ${escHTML(r.motif)}</p>` : ''}
      ${r.participants ? `<p style="color:var(--muted); font-size:12.5px; margin-top:2px;">Participants : ${escHTML(r.participants)}</p>` : ''}
      <p>${escHTML(r.compteRendu||'')}</p>
    </div>
  `).join('');
}

function renderRdvListFor(e, container, onChange){
  const items = [...(e.rdv||[])].sort((a,b)=> b.date.localeCompare(a.date));
  if(!items.length){ container.innerHTML = `<p class="muted" style="font-size:13px;">Aucun rendez-vous enregistré.</p>`; return; }
  container.innerHTML = items.map(r=>`
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-date">${fmtDate(r.date)}</span>
        <button class="icon-btn btn-del-rdv" data-id="${r.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg></button>
      </div>
      ${r.motif ? `<p style="color:var(--muted); font-size:12.5px; margin-top:6px;">Motif : ${escHTML(r.motif)}</p>` : ''}
      ${r.participants ? `<p style="color:var(--muted); font-size:12.5px; margin-top:2px;">Participants : ${escHTML(r.participants)}</p>` : ''}
      <p>${escHTML(r.compteRendu||'')}</p>
    </div>
  `).join('');
  container.querySelectorAll('.btn-del-rdv').forEach(b=>{
    b.onclick = ()=>{ e.rdv = e.rdv.filter(r=>r.id!==b.dataset.id); saveNow(); onChange(); };
  });
}

/* ============================================================
   AGENDA — vue globale chronologique
   Rendez-vous, renouvellements de dispositifs, items de vie de
   classe publiés : tout au même endroit, trié par date.
   ============================================================ */
function renderAgenda(c, actions){
  actions.innerHTML = '';
  const events = [];
  state.data.eleves.forEach(e=>{
    (e.rdv||[]).forEach(r=> events.push({
      date: r.date, type:'rdv', label:`Rendez-vous — ${e.prenom} ${e.nom}`,
      detail: r.motif || 'Sans motif précisé', eleveId: e.id
    }));
    (e.dispositifs||[]).forEach(d=>{
      if(d.dateRenouvellement) events.push({
        date: d.dateRenouvellement, type:'dispositif', label:`Renouvellement ${d.type} — ${e.prenom} ${e.nom}`,
        detail: d.referent ? 'Référent : '+d.referent : '', eleveId: e.id
      });
    });
  });
  (state.data.cours||[]).forEach(item=>{
    if(item.datePublication) events.push({
      date:item.datePublication, type:'cours', label:`Vie de classe — ${item.titre||'(sans titre)'}`,
      detail:item.consignes||'', coursId:item.id
    });
  });

  if(!events.length){
    c.innerHTML = `<div class="empty-state"><h3>Rien de programmé</h3><p>Les rendez-vous, renouvellements de dispositifs et séances de vie de classe apparaîtront ici automatiquement.</p></div>`;
    return;
  }

  const today = todayISO();
  events.sort((a,b)=> a.date.localeCompare(b.date));
  const avenir = events.filter(ev=> ev.date >= today);
  const passes = events.filter(ev=> ev.date < today).reverse();

  const typeMeta = {
    rdv:        { icon:'📅', cls:'' },
    dispositif: { icon:'⚑', cls:'warning' },
    cours:      { icon:'📖', cls:'' },
  };
  function rowHTML(ev){
    const m = typeMeta[ev.type];
    return `
      <div class="entry-row agenda-row" ${ev.eleveId?`data-eid="${ev.eleveId}"`:''} ${ev.coursId?`data-cid="${ev.coursId}"`:''} style="cursor:pointer;">
        <div class="entry-top">
          <span class="tag ${m.cls}">${m.icon} ${fmtDate(ev.date)}</span>
        </div>
        <p style="font-weight:600; font-size:13.5px; margin-top:6px;">${escHTML(ev.label)}</p>
        ${ev.detail ? `<p style="color:var(--muted); font-size:12.5px;">${escHTML(ev.detail)}</p>` : ''}
      </div>`;
  }

  c.innerHTML = `
    <div class="section-title">À venir</div>
    <div class="eleves-list" style="margin-bottom:26px;">
      ${avenir.length ? avenir.map(rowHTML).join('') : `<p class="muted" style="font-size:13px;">Rien de programmé à venir.</p>`}
    </div>
    <div class="section-title">Passés</div>
    <div class="eleves-list">
      ${passes.length ? passes.slice(0,30).map(rowHTML).join('') : `<p class="muted" style="font-size:13px;">Aucun historique.</p>`}
    </div>
  `;
  c.querySelectorAll('.agenda-row').forEach(row=>{
    row.onclick = ()=>{
      if(row.dataset.eid) openEleveFiche(row.dataset.eid);
      else if(row.dataset.cid) openCoursEditor(state.data.cours.find(i=>i.id===row.dataset.cid), false);
    };
  });
}

function openRdvModal(eleve, onDone){
  const eleves = state.data.eleves;
  const needSelect = !eleve;
  showModal(`
    <h3>Nouveau rendez-vous</h3>
    ${needSelect ? `<div class="field"><label>Élève</label><select id="m-eleve">${[...eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom)).map(e=>`<option value="${e.id}">${e.prenom} ${e.nom}</option>`).join('')}</select></div>` : ''}
    <div class="field-row">
      <div class="field"><label>Date</label><input id="m-date" type="date" value="${todayISO()}"></div>
      <div class="field"><label>Motif</label><input id="m-motif" placeholder="Bilan trimestriel, difficulté…"></div>
    </div>
    <div class="field"><label>Participants</label><input id="m-participants" placeholder="Mère, père, CPE…"></div>
    <div class="field"><label>Compte-rendu</label><textarea id="m-cr" placeholder="Résumé de l'entretien, décisions prises…"></textarea></div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-save">Enregistrer</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    const e = needSelect ? getEleve(document.getElementById('m-eleve').value) : eleve;
    if(!e) return;
    if(!e.rdv) e.rdv=[];
    e.rdv.push({
      id: uid(),
      date: document.getElementById('m-date').value || todayISO(),
      motif: document.getElementById('m-motif').value.trim(),
      participants: document.getElementById('m-participants').value.trim(),
      compteRendu: document.getElementById('m-cr').value.trim(),
    });
    saveNow(); closeModal();
    if(onDone) onDone();
    if(state.currentEleveId===e.id) renderEleveSubtab(e);
  };
}

/* ============================================================
   COURS & ACTIVITÉS
   ============================================================ */
function newCoursItem(){
  return { id:uid(), titre:'', categorie:'vdc', type:'mixte', datePublication:todayISO(), consignes:'', contenu:'', questions:[] };
}

function renderCours(c, actions){
  actions.innerHTML = `
    <button class="btn btn-sm" id="btn-suggest-vdc">📋 Thèmes vie de classe 6e</button>
    <button class="btn btn-primary" id="btn-add-cours" style="margin-left:8px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Nouvel item</button>`;
  document.getElementById('btn-add-cours').onclick = ()=> openCoursEditor(newCoursItem(), true);
  document.getElementById('btn-suggest-vdc').onclick = openSuggestedVdcModal;

  const items = [...state.data.cours].sort((a,b)=> (b.datePublication||'').localeCompare(a.datePublication||''));

  c.innerHTML = `
    <div class="ai-generate-box">
      <div class="ai-text"><b>Générer un item avec l'IA</b>Décris un thème, l'IA rédige une fiche ou un exercice de vie de classe adapté à tes 6èmes que tu pourras relire et modifier.</div>
      <button class="btn btn-ai" id="btn-ai-open">✨ Générer</button>
    </div>
    <div id="cours-grid"></div>
  `;
  document.getElementById('btn-ai-open').onclick = openAIGenerateModal;
  const grid = document.getElementById('cours-grid');
  if(!items.length){
    grid.innerHTML = `<div class="empty-state"><h3>Aucun item</h3><p>Crée une fiche manuellement, pioche dans les thèmes suggérés, ou génère-en une avec l'IA.</p></div>`;
    return;
  }
  grid.innerHTML = `<div class="cours-grid">${items.map(coursCardHTML).join('')}</div>`;
  grid.querySelectorAll('.cours-card').forEach(card=>{
    card.onclick = ()=> openCoursEditor(state.data.cours.find(i=>i.id===card.dataset.id), false);
  });
}

function coursCardHTML(item){
  const typeLabel = {fiche:'Fiche', exercice:'Exercice', document:'Document', mixte:'Mixte'}[item.type] || '';
  const excerpt = (item.consignes || item.contenu || '').slice(0,110);
  return `
    <div class="cours-card" data-id="${item.id}">
      <div class="cc-top">
        <div class="cc-title">${escHTML(item.titre) || '(sans titre)'}</div>
        <span class="chip vdc">${typeLabel}</span>
      </div>
      <div class="cc-meta">${fmtDate(item.datePublication)} · ${item.questions?.length||0} question(s)</div>
      <div class="cc-excerpt">${escHTML(excerpt)}${excerpt.length>=110?'…':''}</div>
    </div>`;
}

function openSuggestedVdcModal(){
  const existingTitles = new Set(state.data.cours.map(i=>normStr(i.titre)));
  showModal(`
    <h3>Thèmes vie de classe — 6e</h3>
    <p class="muted" style="font-size:12.5px; margin-top:-6px; margin-bottom:12px;">Séances prêtes à l'emploi (consignes, contenu, questions), à ajuster ensuite.</p>
    <div style="max-height:340px; overflow-y:auto; border:1px solid var(--hairline); border-radius:var(--radius-m); padding:4px 10px;">
      ${SUGGESTED_VDC.map((s,i)=>{
        const already = existingTitles.has(normStr(s.titre));
        return `<label style="display:flex; align-items:flex-start; gap:8px; padding:8px 2px; font-size:13px; ${already?'opacity:.5;':''}">
          <input type="checkbox" data-i="${i}" ${already?'disabled':'checked'} style="width:auto; margin-top:3px;">
          <span>${escHTML(s.titre)}${already?' <span class="muted">(déjà ajouté)</span>':''}</span>
        </label>`;
      }).join('')}
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-add">Ajouter la sélection</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-add').onclick = ()=>{
    const checked = [...document.querySelectorAll('[data-i]:checked')].map(el=>SUGGESTED_VDC[parseInt(el.dataset.i)]);
    checked.forEach(s=>{
      const item = newCoursItem();
      item.titre = s.titre;
      item.categorie = 'vdc';
      item.type = 'mixte';
      item.consignes = s.consignes;
      item.contenu = s.contenu;
      item.questions = s.questions.map(q=>({id:uid(), enonce:q}));
      state.data.cours.push(item);
    });
    saveNow(); closeModal(); render();
  };
}

function openAIGenerateModal(){
  showModal(`
    <h3>Générer avec l'IA</h3>
    <div class="field"><label>Thème / sujet</label><input id="ai-theme" placeholder="ex. les fondamentaux du basket-ball, l'organisation du cartable…" autofocus></div>
    <div class="field-row">
      <div class="field"><label>Type</label>
        <select id="ai-type">
          <option value="fiche">Fiche / consignes</option>
          <option value="exercice">Exercice (questions)</option>
          <option value="mixte">Mélange</option>
        </select>
      </div>
    </div>
    <div class="field"><label>Précisions (optionnel)</label><textarea id="ai-details" placeholder="Contraintes, durée, matériel, objectif particulier…"></textarea></div>
    <div id="ai-error" style="color:var(--danger); font-size:12.5px; margin-top:4px;"></div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-ai" id="m-generate">✨ Générer</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-generate').onclick = async ()=>{
    const theme = document.getElementById('ai-theme').value.trim();
    if(!theme){ document.getElementById('ai-error').textContent = 'Indique un thème.'; return; }
    const type = document.getElementById('ai-type').value;
    const details = document.getElementById('ai-details').value.trim();
    const btn = document.getElementById('m-generate');
    btn.disabled = true; btn.innerHTML = `<span class="spinner"></span> Génération…`;
    document.getElementById('ai-error').textContent = '';
    try{
      const item = await generateCoursWithAI({theme, type, details});
      closeModal();
      openCoursEditor(item, true);
    }catch(err){
      console.error(err);
      document.getElementById('ai-error').textContent = "La génération a échoué. Réessaie, ou crée l'item manuellement.";
      btn.disabled = false; btn.innerHTML = '✨ Générer';
    }
  };
}

async function generateCoursWithAI({theme, type, details}){
  const typeInstruction = {
    fiche: "Privilégie des consignes claires, peu ou pas de questions.",
    exercice: "Inclus plusieurs questions ou tâches précises que l'élève doit réaliser.",
    mixte: "Mélange des consignes et quelques questions ou tâches."
  }[type];
  const system = `Tu rédiges du contenu pédagogique pour un professeur principal de 6ème (élèves de 11-12 ans) en collège en France. Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans balises markdown ni bloc de code. Clés attendues : "titre" (string court), "consignes" (string, 2-4 phrases), "contenu" (string, le corps de la fiche, paragraphes séparés par des sauts de ligne), "questions" (tableau de strings, peut être vide). Langue simple, adaptée à des élèves de 6ème.`;
  const user = `Sujet : ${theme}\nType de contenu à produire : un support de vie de classe (méthodologie, organisation, règles de vie, projet de professeur principal).\n${typeInstruction}${details ? '\nPrécisions du professeur : '+details : ''}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({
      model:'claude-sonnet-4-6',
      max_tokens:1000,
      system,
      messages:[{ role:'user', content:user }]
    })
  });
  const data = await response.json();
  const textBlock = (data.content||[]).find(b=>b.type==='text');
  if(!textBlock) throw new Error('no text');
  const clean = textBlock.text.replace(/```json|```/g,'').trim();
  const parsed = JSON.parse(clean);
  const item = newCoursItem();
  item.titre = parsed.titre || theme;
  item.type = type;
  item.consignes = parsed.consignes || '';
  item.contenu = parsed.contenu || '';
  item.questions = (parsed.questions||[]).map(q=>({id:uid(), enonce: typeof q==='string'?q:String(q)}));
  return item;
}

function openCoursEditor(item, isNew){
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="overlay" id="cours-overlay">
      <div class="panel">
        <div class="panel-header">
          <div><h2>${isNew ? 'Nouvel item' : (item.titre || 'Item')}</h2><div class="sub muted" style="font-size:12px; margin-top:2px;">Cours &amp; activités</div></div>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" id="btn-print-cours" title="Imprimer / aperçu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7Z"/></svg>
            </button>
            ${!isNew ? `<button class="icon-btn" id="btn-del-cours" title="Supprimer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg></button>` : ''}
            <button class="icon-btn" id="btn-close-cours" title="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
          </div>
        </div>
        <div class="panel-body">
          <div class="field-row">
            <div class="field"><label>Titre</label><input id="cf-titre" value="${escAttr(item.titre)}" placeholder="Titre de la fiche / activité"></div>
            <div class="field"><label>Date</label><input id="cf-date" type="date" value="${item.datePublication||todayISO()}"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Type</label>
              <select id="cf-type">
                <option value="fiche" ${item.type==='fiche'?'selected':''}>Fiche / consignes</option>
                <option value="exercice" ${item.type==='exercice'?'selected':''}>Exercice (questions)</option>
                <option value="document" ${item.type==='document'?'selected':''}>Document</option>
                <option value="mixte" ${item.type==='mixte'?'selected':''}>Mélange</option>
              </select>
            </div>
          </div>
          <div class="field"><label>Consignes</label><textarea id="cf-consignes" placeholder="Ce que l'élève doit faire…">${escHTML(item.consignes)}</textarea></div>
          <div class="field"><label>Contenu</label><textarea id="cf-contenu" style="min-height:140px;" placeholder="Corps de la fiche / activité…">${escHTML(item.contenu)}</textarea></div>
          <div class="divider"></div>
          <div class="flex-between"><div class="section-title" style="margin:0;">Questions / tâches</div><button class="btn btn-sm" id="btn-add-q">+ Question</button></div>
          <div id="q-list" style="margin-top:10px;"></div>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
            <button class="btn btn-ghost" id="btn-cancel-cours">Annuler</button>
            <button class="btn btn-primary" id="btn-save-cours">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  `;
  let questions = (item.questions||[]).map(q=>({...q}));
  function renderQ(){
    const list = document.getElementById('q-list');
    if(!questions.length){ list.innerHTML = `<p class="muted" style="font-size:13px;">Aucune question.</p>`; return; }
    list.innerHTML = questions.map((q,i)=>`
      <div class="question-row" data-id="${q.id}">
        <span class="muted" style="font-family:var(--font-mono); font-size:12px; padding-top:10px;">${i+1}.</span>
        <textarea data-qid="${q.id}">${escHTML(q.enonce)}</textarea>
        <button class="icon-btn btn-del-q" data-id="${q.id}" style="margin-top:8px;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
    `).join('');
    list.querySelectorAll('textarea[data-qid]').forEach(ta=>{
      ta.addEventListener('input', ()=>{ const q = questions.find(x=>x.id===ta.dataset.qid); q.enonce = ta.value; });
    });
    list.querySelectorAll('.btn-del-q').forEach(b=>{
      b.onclick = ()=>{ questions = questions.filter(q=>q.id!==b.dataset.id); renderQ(); };
    });
  }
  renderQ();
  document.getElementById('btn-add-q').onclick = ()=>{ questions.push({id:uid(), enonce:''}); renderQ(); };

  document.getElementById('cours-overlay').addEventListener('click', (ev)=>{ if(ev.target.id==='cours-overlay') closeCoursEditor(); });
  document.getElementById('btn-close-cours').onclick = closeCoursEditor;
  document.getElementById('btn-cancel-cours').onclick = closeCoursEditor;
  if(!isNew){
    document.getElementById('btn-del-cours').onclick = ()=>{
      confirmModal(`Supprimer « ${item.titre||'cet item'} » ?`, ()=>{
        state.data.cours = state.data.cours.filter(i=>i.id!==item.id);
        saveNow(); closeCoursEditor();
      });
    };
  }
  document.getElementById('btn-print-cours').onclick = ()=>{
    const draft = {
      ...item,
      titre: document.getElementById('cf-titre').value,
      consignes: document.getElementById('cf-consignes').value,
      contenu: document.getElementById('cf-contenu').value,
      questions,
    };
    printCoursItem(draft);
  };
  document.getElementById('btn-save-cours').onclick = ()=>{
    item.titre = document.getElementById('cf-titre').value.trim();
    item.datePublication = document.getElementById('cf-date').value || todayISO();
    item.type = document.getElementById('cf-type').value;
    item.consignes = document.getElementById('cf-consignes').value.trim();
    item.contenu = document.getElementById('cf-contenu').value.trim();
    item.questions = questions.filter(q=>q.enonce.trim());
    if(isNew) state.data.cours.push(item);
    saveNow(); closeCoursEditor();
  };
}
function closeCoursEditor(){ document.getElementById('modal-root').innerHTML=''; render(); }

function printCoursItem(item){
  const win = window.open('', '_blank');
  if(!win) return;
  win.document.write(`
    <html><head><meta charset="utf-8"><title>${escHTML(item.titre)}</title>
    <style>
      body{ font-family: Georgia, serif; max-width:720px; margin:40px auto; color:#111; line-height:1.6; }
      h1{ font-size:22px; margin-bottom:4px; }
      .meta{ font-size:12px; color:#555; margin-bottom:24px; }
      .block{ margin-bottom:18px; font-size:14px; white-space:pre-wrap; }
      ol{ padding-left:20px; }
      li{ margin-bottom:8px; }
    </style></head><body>
      <h1>${escHTML(item.titre||'Sans titre')}</h1>
      <div class="meta">${fmtDate(item.datePublication)}${state.data.classe.nom ? ' · '+escHTML(state.data.classe.nom) : ''}</div>
      ${item.consignes ? `<div class="block"><b>Consignes</b><br>${escHTML(item.consignes)}</div>` : ''}
      ${item.contenu ? `<div class="block">${escHTML(item.contenu)}</div>` : ''}
      ${item.questions && item.questions.length ? `<div class="block"><b>Questions</b><ol>${item.questions.map(q=>`<li>${escHTML(q.enonce)}</li>`).join('')}</ol></div>` : ''}
    </body></html>
  `);
  win.document.close();
  win.focus();
  setTimeout(()=> win.print(), 300);
}

function printElevePDF(e){
  const win = window.open('', '_blank');
  if(!win) return;
  const matieres = state.data.classe.matieres;
  const tableauMoyennes = TRIMESTRES.map(t=>{
    const moy = moyenneGenerale(e, t);
    return `<tr><td>${t}</td><td>${moy!==null ? moy.toFixed(1) : '—'}</td><td>${escHTML(e.bulletins?.[t]?.appreciationGenerale || '')}</td></tr>`;
  }).join('');
  const dispositifsHTML = (e.dispositifs||[]).length ? `
    <div class="block"><b>Dispositifs</b>
      <ul>${e.dispositifs.map(d=>`<li>${escHTML(d.type)}${d.dateDebut?' — depuis le '+fmtDate(d.dateDebut):''}${d.mesures?' : '+escHTML(d.mesures):''}</li>`).join('')}</ul>
    </div>` : '';
  const absNJ = absencesNonJustifiees(e), absTotal = absencesCount(e);
  const contactsHTML = (e.contacts||[]).length ? `
    <div class="block"><b>Contacts</b>
      <ul>${e.contacts.map(ct=>`<li>${escHTML(ct.nom)} (${escHTML(ct.lien)})${ct.tel?' — '+escHTML(ct.tel):''}${ct.mail?' — '+escHTML(ct.mail):''}</li>`).join('')}</ul>
    </div>` : '';

  win.document.write(`
    <html><head><meta charset="utf-8"><title>${escHTML(e.prenom+' '+e.nom)}</title>
    <style>
      body{ font-family: Georgia, serif; max-width:720px; margin:40px auto; color:#111; line-height:1.6; }
      h1{ font-size:24px; margin-bottom:2px; }
      .meta{ font-size:12px; color:#555; margin-bottom:24px; }
      .block{ margin-bottom:18px; font-size:14px; }
      table{ width:100%; border-collapse:collapse; font-size:13px; margin-top:6px; }
      th, td{ border:1px solid #ccc; padding:6px 8px; text-align:left; vertical-align:top; }
      th{ background:#f0f0f0; }
      ul{ padding-left:20px; margin:6px 0; }
      li{ margin-bottom:4px; }
    </style></head><body>
      <h1>${escHTML(e.prenom+' '+e.nom)}</h1>
      <div class="meta">${state.data.classe.nom ? escHTML(state.data.classe.nom)+' · ' : ''}${state.data.classe.anneeScolaire||''}${e.dateNaissance ? ' · Né(e) le '+fmtDate(e.dateNaissance) : ''}</div>

      <div class="block"><b>Moyennes générales et appréciations</b>
        <table><thead><tr><th>Trimestre</th><th>Moyenne</th><th>Appréciation générale</th></tr></thead>
        <tbody>${tableauMoyennes}</tbody></table>
      </div>

      <div class="block"><b>Assiduité</b> — ${absTotal} absence${absTotal>1?'s':''} au total, dont ${absNJ} non justifiée${absNJ>1?'s':''}.</div>

      ${dispositifsHTML}
      ${contactsHTML}
    </body></html>
  `);
  win.document.close();
  win.focus();
  setTimeout(()=> win.print(), 300);
}

/* ============================================================
   MODALES génériques
   ============================================================ */
function showModal(innerHTML){
  const root = document.getElementById('modal-root');
  const existing = document.getElementById('panel-overlay');
  const wrapDiv = document.createElement('div');
  wrapDiv.className = 'modal-center';
  wrapDiv.id = 'generic-modal';
  wrapDiv.innerHTML = `<div class="modal-box">${innerHTML}</div>`;
  if(existing){ existing.appendChild(wrapDiv); } else { root.appendChild(wrapDiv); }
  wrapDiv.addEventListener('click', (ev)=>{ if(ev.target===wrapDiv) closeModal(); });
  setTimeout(()=>{ const f = wrapDiv.querySelector('input,textarea,select'); if(f) f.focus(); }, 30);
}
function closeModal(){ const m = document.getElementById('generic-modal'); if(m) m.remove(); }
function confirmModal(msg, onConfirm){
  showModal(`
    <h3>Confirmer</h3>
    <p style="font-size:13.5px; color:var(--muted);">${msg}</p>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
      <button class="btn btn-ghost" id="cm-cancel">Annuler</button>
      <button class="btn btn-danger" id="cm-ok">Confirmer</button>
    </div>
  `);
  document.getElementById('cm-cancel').onclick = closeModal;
  document.getElementById('cm-ok').onclick = ()=>{ closeModal(); onConfirm(); };
}

/* ---------------- Réglages classe ---------------- */
function openSettingsModal(){
  const cl = state.data.classe;
  showModal(`
    <h3>Réglages de la classe</h3>
    <div class="field-row">
      <div class="field"><label>Nom de la classe</label><input id="s-nom" value="${escAttr(cl.nom)}" placeholder="ex. 4e B"></div>
      <div class="field"><label>Année scolaire</label><input id="s-annee" value="${escAttr(cl.anneeScolaire)}"></div>
    </div>
    <div class="field"><label>Matières (une par ligne)</label><textarea id="s-matieres" style="min-height:160px;">${cl.matieres.join('\n')}</textarea></div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-primary" id="m-save">Enregistrer</button>
    </div>
    <div class="divider"></div>
    <div style="background:var(--danger-soft); border:1px solid rgba(255,107,107,.3); border-radius:var(--radius-m); padding:14px;">
      <p style="font-size:12.5px; margin:0 0 8px; color:var(--danger); font-weight:600;">Nouvelle année scolaire</p>
      <p class="muted" style="font-size:12px; margin:0 0 10px;">Supprime tous les élèves (fiches, bulletins, dispositifs, rendez-vous, orientation) et le nom de la classe. Conserve la liste des matières et les fiches Cours &amp; activités (réutilisables d'une année sur l'autre).</p>
      <button class="btn btn-sm btn-danger" id="btn-new-year" style="border-color:rgba(255,107,107,.3);">Réinitialiser pour une nouvelle année</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    cl.nom = document.getElementById('s-nom').value.trim();
    cl.anneeScolaire = document.getElementById('s-annee').value.trim();
    cl.matieres = document.getElementById('s-matieres').value.split('\n').map(s=>s.trim()).filter(Boolean);
    saveNow(); closeModal(); render();
  };
  document.getElementById('btn-new-year').onclick = openNewYearModal;
}

function openNewYearModal(){
  showModal(`
    <h3>Nouvelle année scolaire</h3>
    <p style="font-size:13px; color:var(--muted);">
      Cette action supprime définitivement : tous les élèves, leurs bulletins, dispositifs, absences, notes de vie scolaire, rendez-vous et données d'orientation, ainsi que le nom de la classe.<br><br>
      Sont conservés : la liste des matières et toutes les fiches de <b>Cours &amp; activités</b>.<br><br>
      Pense à exporter une sauvegarde avant si tu veux garder une trace de cette année (bouton « Exporter / importer » dans la barre latérale).
    </p>
    <div class="field"><label>Tape <b>NOUVELLE ANNEE</b> pour confirmer</label><input id="ny-confirm" placeholder="NOUVELLE ANNEE" autocomplete="off"></div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
      <button class="btn btn-ghost" id="m-cancel">Annuler</button>
      <button class="btn btn-danger" id="m-confirm" disabled style="opacity:.5; border:1px solid var(--hairline);">Réinitialiser</button>
    </div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  const input = document.getElementById('ny-confirm');
  const confirmBtn = document.getElementById('m-confirm');
  input.addEventListener('input', ()=>{
    const ok = input.value.trim().toUpperCase() === 'NOUVELLE ANNEE';
    confirmBtn.disabled = !ok;
    confirmBtn.style.opacity = ok ? '1' : '.5';
  });
  confirmBtn.onclick = ()=>{
    if(confirmBtn.disabled) return;
    state.data.eleves = [];
    state.data.classe.nom = '';
    saveNow();
    closeModal();
    setView('accueil');
  };
}

/* ---------------- Export / Import ---------------- */
function openExportModal(){
  showModal(`
    <h3>Exporter / importer</h3>
    <p style="font-size:13px; color:var(--muted); margin-bottom:14px;">Sauvegarde toutes les données (élèves, notes, absences, orientation, rendez-vous) dans un fichier JSON.</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn btn-primary" id="btn-do-export">Télécharger la sauvegarde</button>
      <label class="btn" style="cursor:pointer;">Importer un fichier
        <input type="file" id="import-file" accept="application/json" style="display:none;">
      </label>
    </div>
    <div style="text-align:right; margin-top:16px;"><button class="btn btn-ghost" id="m-cancel">Fermer</button></div>
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('btn-do-export').onclick = ()=>{
    const blob = new Blob([JSON.stringify(state.data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateTag = todayISO();
    a.href = url; a.download = `suivi-pp-${(state.data.classe.nom||'classe').replace(/\s+/g,'_')}-${dateTag}.json`;
    a.click(); URL.revokeObjectURL(url);
    localStorage.setItem(LAST_EXPORT_KEY, todayISO());
    localStorage.removeItem(BACKUP_SNOOZE_KEY);
    const b = document.getElementById('backup-banner'); if(b) b.remove();
  };
  document.getElementById('import-file').addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const parsed = JSON.parse(reader.result);
        if(!parsed.eleves) throw new Error('format invalide');
        state.data = parsed;
        saveNow(); closeModal(); setView('accueil');
      }catch(e){ alert("Fichier invalide : impossible d'importer cette sauvegarde."); }
    };
    reader.readAsText(file);
  });
}

/* ---------------- utils ---------------- */
function escHTML(s){ return (s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function escAttr(s){ return (s||'').replace(/"/g,'&quot;'); }

/* Redimensionne/recadre une photo en carré côté client avant stockage,
   pour rester léger en localStorage et en synchro Firebase. */
function resizeImageToDataURL(file, size, quality){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onerror = ()=> reject(new Error('read error'));
    reader.onload = ()=>{
      const img = new Image();
      img.onerror = ()=> reject(new Error('image error'));
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side)/2, sy = (img.height - side)/2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  state.data = loadData();
  updateSaveStatus('saved');
  document.querySelectorAll('.nav-item').forEach(b=>{
    b.addEventListener('click', ()=> setView(b.dataset.view));
  });
  document.getElementById('menu-btn').addEventListener('click', ()=>{
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.getElementById('btn-export').addEventListener('click', openExportModal);
  document.querySelector('.class-pill').addEventListener('click', openSettingsModal);
  document.querySelector('.class-pill').style.cursor = 'pointer';
  setView('accueil');
  initFirebaseSync();

  // Service worker désactivé temporairement : il causait un affichage périmé
  // (ancienne version de l'app mise en cache). On désinscrit toute version
  // déjà installée pour forcer un chargement frais à chaque visite.
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(regs=>{
      regs.forEach(r=> r.unregister());
    }).catch(()=>{});
  }
}
document.addEventListener('DOMContentLoaded', init);
