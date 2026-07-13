/* ============================================================
   SUIVI PP — logique application
   Stockage: localStorage (clé suivipp-data-v1)
   ============================================================ */

const STORAGE_KEY = 'suivipp-data-v1';
const TRIMESTRES = ['T1', 'T2', 'T3'];
const DEFAULT_MATIERES = ['Français','Mathématiques','Histoire-Géo-EMC','Anglais','LV2','SVT','Physique-Chimie','Technologie','EPS','Arts plastiques','Éducation musicale'];

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
    eleves: []
  };
}

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultData();
    const parsed = JSON.parse(raw);
    if(!parsed.classe) parsed.classe = defaultData().classe;
    if(!parsed.eleves) parsed.eleves = [];
    return parsed;
  }catch(e){ console.error('Erreur chargement données', e); return defaultData(); }
}

let saveTimer = null;
function saveData(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }
    catch(e){ console.error('Erreur sauvegarde', e); }
  }, 350);
}
function saveNow(){
  clearTimeout(saveTimer);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function getEleve(id){ return state.data.eleves.find(e=>e.id===id); }

function newEleve(nom, prenom){
  return {
    id: uid(), nom: nom||'', prenom: prenom||'', dateNaissance:'', sexe:'',
    contacts: [],
    viescolaire: [],
    absences: [],
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

  if(state.view==='accueil') return renderAccueil(c, actions);
  if(state.view==='eleves') return renderEleves(c, actions);
  if(state.view==='bulletins') return renderBulletins(c, actions);
  if(state.view==='conseils') return renderConseils(c, actions);
  if(state.view==='orientation') return renderOrientation(c, actions);
  if(state.view==='rdv') return renderRdv(c, actions);
}

/* ============================================================
   ACCUEIL
   ============================================================ */
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

  const tsw = trimestreSwitchHTML();
  actions.innerHTML = tsw;
  bindTrimestreSwitch(actions);
}

function eleveCardHTML(e, lvl){
  const moy = moyenneGenerale(e, state.trimestre);
  const abs = absencesNonJustifiees(e);
  const inc = incidentsCount(e);
  const tags = [];
  if(moy!==null) tags.push(`<span class="tag ${moy<10?'danger':moy<12?'warning':'success'}">moy. ${moy.toFixed(1)}</span>`);
  if(abs>0) tags.push(`<span class="tag ${abs>=4?'danger':'warning'}">${abs} abs. non just.</span>`);
  if(inc>0) tags.push(`<span class="tag danger">${inc} incident${inc>1?'s':''}</span>`);
  if(!tags.length) tags.push(`<span class="tag success">RAS</span>`);
  return `
    <div class="eleve-card ${lvl}" data-id="${e.id}">
      <div class="eleve-avatar">${initiales(e)}</div>
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
function renderEleves(c, actions){
  actions.innerHTML = `<button class="btn btn-primary" id="btn-add-eleve">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
    Ajouter un élève</button>`;
  document.getElementById('btn-add-eleve').onclick = openAddEleveModal;

  const eleves = [...state.data.eleves].sort((a,b)=> (a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  if(!eleves.length){
    c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute les élèves de ta classe pour commencer le suivi.</p></div>`;
    return;
  }
  c.innerHTML = `<div class="eleves-list">${eleves.map(e=>eleveCardHTML(e, alerteLevel(e))).join('')}</div>`;
  c.querySelectorAll('.eleve-card').forEach(card=>{
    card.onclick = ()=> openEleveFiche(card.dataset.id);
  });
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
            ${subtab('infos','Infos')}${subtab('viescolaire','Vie scolaire')}${subtab('absences','Absences')}${subtab('orientation','Orientation')}${subtab('rdv','Rendez-vous')}
          </div>
          <div id="eleve-subtab-content"></div>
        </div>
      </div>
    </div>
  `;
  function subtab(key,label){ return `<button class="subtab ${state.eleveSubtab===key?'active':''}" data-sub="${key}">${label}</button>`; }

  document.getElementById('panel-overlay').addEventListener('click', (ev)=>{ if(ev.target.id==='panel-overlay') closePanel(); });
  document.getElementById('btn-close-panel').onclick = closePanel;
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
  if(state.eleveSubtab==='viescolaire') return renderSubViescolaire(el, e);
  if(state.eleveSubtab==='absences') return renderSubAbsences(el, e);
  if(state.eleveSubtab==='orientation') return renderSubOrientationEleve(el, e);
  if(state.eleveSubtab==='rdv') return renderSubRdvEleve(el, e);
}

/* --- Infos --- */
function renderSubInfos(el, e){
  el.innerHTML = `
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
  actions.innerHTML = trimestreSwitchHTML() + `<button class="btn btn-sm" id="btn-matieres" style="margin-left:10px;">Matières</button>`;
  bindTrimestreSwitch(actions);
  document.getElementById('btn-matieres').onclick = openSettingsModal;

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
              ${matieres.map(m=>`<td><input class="note-input" data-m="${escAttr(m)}" type="text" inputmode="decimal" value="${e.bulletins?.[state.trimestre]?.[m]?.moyenne ?? ''}" placeholder="—"></td>`).join('')}
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
  });
}
function updateMoyCell(tr, e){
  const moy = moyenneGenerale(e, state.trimestre);
  const cell = tr.querySelector('.moy-cell');
  cell.innerHTML = moy!==null ? `<span class="moy-badge ${moyClass(moy)}">${moy.toFixed(1)}</span>` : '<span class="muted">—</span>';
}

/* ============================================================
   CONSEILS DE CLASSE
   ============================================================ */
let conseilIndex = 0;
function renderConseils(c, actions){
  actions.innerHTML = trimestreSwitchHTML();
  bindTrimestreSwitch(actions);
  const eleves = [...state.data.eleves].sort((a,b)=>(a.nom+a.prenom).localeCompare(b.nom+b.prenom));
  if(!eleves.length){ c.innerHTML = `<div class="empty-state"><h3>Aucun élève</h3><p>Ajoute des élèves pour préparer le conseil de classe.</p></div>`; return; }
  if(conseilIndex>=eleves.length) conseilIndex=0;
  const e = eleves[conseilIndex];
  const moy = moyenneGenerale(e, state.trimestre);
  const abs = absencesCount(e), absNJ = absencesNonJustifiees(e);
  const inc = incidentsCount(e);
  const positifs = (e.viescolaire||[]).filter(v=>v.type==='positif').length;

  c.innerHTML = `
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
  const ta = document.getElementById('appreciation-txt');
  if(!e.bulletins[state.trimestre]) e.bulletins[state.trimestre]={};
  if(e.bulletins[state.trimestre].appreciationGenerale===undefined){ e.bulletins[state.trimestre].appreciationGenerale = ta.value; saveData(); }
  ta.addEventListener('input', ()=>{ e.bulletins[state.trimestre].appreciationGenerale = ta.value; saveData(); });
  document.getElementById('btn-regen').onclick = ()=>{ ta.value = generateAppreciation(e); e.bulletins[state.trimestre].appreciationGenerale = ta.value; saveNow(); };
}

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
  `);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-save').onclick = ()=>{
    cl.nom = document.getElementById('s-nom').value.trim();
    cl.anneeScolaire = document.getElementById('s-annee').value.trim();
    cl.matieres = document.getElementById('s-matieres').value.split('\n').map(s=>s.trim()).filter(Boolean);
    saveNow(); closeModal(); render();
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

/* ============================================================
   INIT
   ============================================================ */
function init(){
  state.data = loadData();
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

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
}
document.addEventListener('DOMContentLoaded', init);
