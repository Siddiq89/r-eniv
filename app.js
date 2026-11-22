/* R ENIV (logiciel R et RStudio) : navigation, progression, quiz, vidéos, observations et administration. */
(function () {
  "use strict";

  // Parcours R (niveaux r1…r8)
  var PARCOURS = [window.COURS].filter(Boolean);
  PARCOURS.forEach(function (c) { if (!c.cle) c.cle = "r"; });
  var T = window.T || function (k) { return k; };
  // Copie française de chaque parcours, pour pouvoir changer de langue sans recharger
  var ORIGINAUX = PARCOURS.map(function (c) { return JSON.stringify(c); });
  function appliquerLangue() {
    PARCOURS.forEach(function (c, i) {
      var fr = JSON.parse(ORIGINAUX[i]);
      for (var k in fr) c[k] = fr[k];
      if (window.traduireParcours) window.traduireParcours(c);
    });
    NIVEAUX = COURS.niveaux;
  }
  var CLE_PARCOURS = "r-eniv-parcours";
  var COURS = PARCOURS[0] || { niveaux: [] };
  var NIVEAUX = COURS.niveaux;
  function choisirParcours(cle) {
    for (var i = 0; i < PARCOURS.length; i++) if (PARCOURS[i].cle === cle) {
      COURS = PARCOURS[i]; NIVEAUX = COURS.niveaux; ecrire(CLE_PARCOURS, cle); return true;
    }
    return false;
  }
  function parcoursDe(id) {
    for (var i = 0; i < PARCOURS.length; i++)
      for (var j = 0; j < PARCOURS[i].niveaux.length; j++) {
        var n = PARCOURS[i].niveaux[j];
        if (n.id === id || id.indexOf(n.id + "-") === 0) return PARCOURS[i];
      }
    return null;
  }
  var CLE_PROGRESSION = "r-eniv-progression";
  var CLE_VIDEOS = "r-eniv-videos-ajouts";
  var CLE_MASQUEES = "r-eniv-videos-masquees";
  var app = document.getElementById("app");

  /* ---------------- Stockage (toujours protégé) ---------------- */
  function lire(cle, defaut) {
    try { var v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut; } catch (e) { return defaut; }
  }
  function ecrire(cle, val) {
    try { localStorage.setItem(cle, JSON.stringify(val)); } catch (e) { /* stockage indisponible */ }
  }

  var prog = lire(CLE_PROGRESSION, { lecons: {}, quiz: {} });
  if (!prog.lecons) prog.lecons = {};
  if (!prog.quiz) prog.quiz = {};
  function sauverProg() { ecrire(CLE_PROGRESSION, prog); majCompteur(); }

  /* ---------------- Utilitaires ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function niveau(id) { for (var i = 0; i < NIVEAUX.length; i++) if (NIVEAUX[i].id === id) return NIVEAUX[i]; return null; }
  function trouverLecon(id) {
    for (var i = 0; i < NIVEAUX.length; i++)
      for (var j = 0; j < NIVEAUX[i].lecons.length; j++)
        if (NIVEAUX[i].lecons[j].id === id) return { niv: NIVEAUX[i], lec: NIVEAUX[i].lecons[j], idx: j };
    return null;
  }
  function toutesLecons() {
    var out = [];
    NIVEAUX.forEach(function (n) { n.lecons.forEach(function (l) { out.push(l); }); });
    return out;
  }
  // Étapes d'un niveau : chaque leçon + le quiz
  function etapesNiveau(n) { return n.lecons.length + (n.quiz && n.quiz.length ? 1 : 0); }
  function etapesFaites(n) {
    var f = 0;
    n.lecons.forEach(function (l) { if (prog.lecons[l.id]) f++; });
    if (n.quiz && n.quiz.length && prog.quiz[n.id]) f++;
    return f;
  }
  function pctNiveau(n) { var t = etapesNiveau(n); return t ? Math.round(etapesFaites(n) * 100 / t) : 0; }
  function pctParcours(c) {
    var t = 0, f = 0;
    c.niveaux.forEach(function (n) { t += etapesNiveau(n); f += etapesFaites(n); });
    return t ? Math.round(f * 100 / t) : 0;
  }
  function pctGlobal() {
    var t = 0, f = 0;
    NIVEAUX.forEach(function (n) { t += etapesNiveau(n); f += etapesFaites(n); });
    return t ? Math.round(f * 100 / t) : 0;
  }
  function prochaineEtape() {
    for (var i = 0; i < NIVEAUX.length; i++) {
      var n = NIVEAUX[i];
      for (var j = 0; j < n.lecons.length; j++) if (!prog.lecons[n.lecons[j].id]) return { hash: n.lecons[j].id, label: n.lecons[j].titre };
      if (n.quiz && n.quiz.length && !prog.quiz[n.id]) return { hash: n.id + "-quiz", label: T("quiz.niveau") + " " + n.numero };
    }
    return null;
  }
  function majCompteur() {
    var p = pctGlobal();
    document.getElementById("meter-fill").style.width = p + "%";
    document.getElementById("meter-text").textContent = p + " %";
  }

  function fleche() { return window.LANGUE === "ar" ? "←" : "→"; }
  var FLECHE = "→";
  function noteVideos() { return window.LANGUE && window.LANGUE !== "fr" ? '<p class="note-videos">' + T("videos.langues") + '</p>' : ""; }

  /* ---------------- Vidéos ---------------- */
  function videosFichier() { return Array.isArray(window.VIDEOS) ? window.VIDEOS : []; }
  function cleVideo(v) { return (v.niveau || "") + "|" + (v.lecon || "") + "|" + (v.url || ""); }
  function toutesVideos() {
    var masquees = lire(CLE_MASQUEES, []);
    var fichier = videosFichier().filter(function (v) { return masquees.indexOf(cleVideo(v)) < 0; })
      .map(function (v) { return Object.assign({}, v, { _source: "fichier" }); });
    var ajouts = lire(CLE_VIDEOS, []).map(function (v, i) { return Object.assign({}, v, { _source: "local", _i: i }); });
    return fichier.concat(ajouts);
  }
  function idYoutube(url) {
    var m = String(url || "").match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function typeVideo(url) {
    if (idYoutube(url)) return "youtube";
    if (/\.(mp4|webm|ogg|ogv|m4v)(\?.*)?$/i.test(url || "")) return "fichier";
    return "lien";
  }
  function carteVideo(v) {
    var t = typeVideo(v.url);
    var ecran;
    if (t === "fichier") {
      ecran = '<video controls preload="metadata" src="' + esc(encodeURI(v.url)) + '"' + '></video>';
    } else if (t === "youtube") {
      ecran = '<button type="button" data-yt="' + esc(idYoutube(v.url)) + '">' + T("lire.ici") + '</button>';
    } else {
      ecran = '<a class="btn small" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + T("ouvrir.video") + '</a>';
    }
    var lien = t === "youtube"
      ? ' · <a href="https://www.youtube.com/watch?v=' + esc(idYoutube(v.url)) + '" target="_blank" rel="noopener">' + T("ouvrir.youtube") + '</a>' : "";
    var src = v._source === "local" ? ' <span class="tag local" title="' + esc(T("ajoutee.poste.titre")) + '">' + T("ajoutee.poste") + '</span>' : "";
    var lec = v.lecon ? trouverLecon(v.lecon) : null;
    return '<div class="video"><div class="screen">' + ecran + '</div><div class="info">' +
      '<b>' + '<bdi>' + esc(String(v.titre || T("video.sans.titre")).replace("(en arabe)", "(" + T("langue.video.ar") + ")")) + '</bdi>' + '</b>' +
      (v.description ? '<small>' + esc(String(v.description).replace("Chaîne YouTube :", T("chaine"))) + '</small>' : "") +
      '<small>' + (v.duree ? esc(v.duree) + " · " : "") + (lec ? '<a href="#' + lec.lec.id + '">' + esc(lec.lec.titre) + '</a>' : (niveau(v.niveau) ? T("niveau", niveau(v.niveau).numero) : "")) + lien + src + '</small>' +
      '</div></div>';
  }
  function blocVideos(liste, vide) {
    if (!liste.length) return '<div class="empty">' + vide + '</div>';
    return '<div class="videos">' + liste.map(carteVideo).join("") + '</div>';
  }
  // Lecteur YouTube intégré au clic ; message clair pour les vidéos locales introuvables
  app.addEventListener("click", function (e) {
    var b = e.target.closest("[data-yt]");
    if (!b) return;
    var id = b.getAttribute("data-yt");
    b.parentNode.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Vidéo YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  });
  app.addEventListener("error", function (e) {
    var el = e.target;
    if (el && el.tagName === "VIDEO") {
      var s = el.getAttribute("src");
      el.parentNode.innerHTML = '<div class="err">' + T("introuvable", esc(decodeURI(s))) + '</div>';
    }
  }, true);

  /* ---------------- Observations et livre d'or ---------------- */
  var CLE_OBS = "r-eniv-observations";
  function envoyerLivre(donnees) {
    var url = window.LIVRE_URL;
    if (!url) return Promise.reject("inactif");
    var corps = new URLSearchParams();
    for (var k in donnees) corps.append(k, donnees[k] == null ? "" : String(donnees[k]));
    corps.append("langue", window.LANGUE || "fr");
    // Apps Script ne renvoie pas d'en-têtes CORS : envoi « no-cors », réponse opaque.
    return fetch(url, { method: "POST", mode: "no-cors", body: corps });
  }
  function blocObservation(l) {
    var notes = lire(CLE_OBS, {});
    return '<section class="observation"><h3>' + T("obs.titre") + '</h3><p class="aide">' + T("obs.aide") + '</p>' +
      '<label class="sr" for="obs-txt">' + T("obs.titre") + '</label><textarea id="obs-txt" rows="4" maxlength="2000" placeholder="' + esc(T("obs.place")) + '">' + esc(notes[l.id] || "") + '</textarea>' +
      '<div class="row"><span id="obs-etat" class="tag" hidden>' + T("obs.enregistre") + '</span>' +
      '<button class="btn small" type="button" id="obs-envoyer">' + T("obs.envoyer") + '</button><span id="obs-msg" class="tag" role="status"></span></div></section>';
  }
  function brancherObservation(l) {
    var ta = document.getElementById("obs-txt"), etat = document.getElementById("obs-etat"), msg = document.getElementById("obs-msg"), minuteur;
    ta.addEventListener("input", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () {
        var notes = lire(CLE_OBS, {});
        if (ta.value.trim()) notes[l.id] = ta.value; else delete notes[l.id];
        ecrire(CLE_OBS, notes); etat.hidden = false;
      }, 400);
    });
    document.getElementById("obs-envoyer").addEventListener("click", function () {
      if (!ta.value.trim()) { msg.textContent = T("livre.vide"); return; }
      msg.textContent = T("livre.envoi");
      envoyerLivre({ nom: lire("r-eniv-nom", ""), etablissement: lire("r-eniv-etab", ""), profil: "eleve", parcours: COURS.cle, page: l.id + " " + l.titre, observation: ta.value })
        .then(function () { msg.textContent = T("livre.merci"); }, function (e) { msg.textContent = e === "inactif" ? T("livre.inactif") : T("livre.erreur"); });
    });
  }
  function vueLivre() {
    var h = '<main class="wrap"><div class="level-head"><span class="eyebrow">' + T("livre.eyebrow") + '</span><h1>' + T("livre.titre") + '</h1><p>' + T("livre.p") + '</p></div>' +
      '<div class="panel"><form id="f-livre" class="form">' +
      '<div class="field"><label for="l-nom">' + T("livre.nom") + '</label><input id="l-nom" maxlength="100" autocomplete="name" value="' + esc(lire("r-eniv-nom", "")) + '"></div>' +
      '<div class="field"><label for="l-etab">' + T("livre.etab") + '</label><input id="l-etab" maxlength="150" value="' + esc(lire("r-eniv-etab", "")) + '"></div>' +
      '<div class="field"><label for="l-profil">' + T("livre.profil") + '</label><select id="l-profil"><option value="eleve">' + T("livre.eleve") + '</option><option value="enseignant">' + T("livre.ens") + '</option><option value="visiteur">' + T("livre.visiteur") + '</option></select></div>' +
      '<div class="field full"><label for="l-obs">' + T("livre.obs") + '</label><textarea id="l-obs" rows="5" maxlength="2000" required>' + esc(lire("r-eniv-livre-brouillon", "")) + '</textarea></div>' +
      '<input type="text" name="site_web" id="l-piege" tabindex="-1" autocomplete="off" aria-hidden="true" class="piege">' +
      '<div class="full row"><button class="btn primary" type="submit">' + T("livre.envoyer") + '</button><span id="l-msg" class="tag" role="status"></span></div>' +
      '</form></div></main>';
    app.innerHTML = h;
    var obs = document.getElementById("l-obs"), msg = document.getElementById("l-msg");
    obs.addEventListener("input", function () { ecrire("r-eniv-livre-brouillon", obs.value); });
    document.getElementById("f-livre").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!obs.value.trim()) { msg.textContent = T("livre.vide"); return; }
      var nom = document.getElementById("l-nom").value.trim(), etab = document.getElementById("l-etab").value.trim();
      ecrire("r-eniv-nom", nom); ecrire("r-eniv-etab", etab);
      msg.textContent = T("livre.envoi");
      envoyerLivre({ nom: nom, etablissement: etab, profil: document.getElementById("l-profil").value, parcours: COURS.cle, page: "livre", observation: obs.value, site_web: document.getElementById("l-piege").value })
        .then(function () { msg.textContent = T("livre.merci"); obs.value = ""; ecrire("r-eniv-livre-brouillon", ""); },
              function (er) { msg.textContent = er === "inactif" ? T("livre.inactif") : T("livre.erreur"); });
    });
  }

  /* ---------------- Fichiers d'exemple ---------------- */
  function tousFichiers() { return Array.isArray(window.FICHIERS) ? window.FICHIERS : []; }
  function extension(f) { var m = String(f).match(/\.([a-z0-9]+)$/i); return m ? m[1].toUpperCase() : "FICHIER"; }
  function ligneFichier(f) {
    var nom = String(f.fichier).split("/").pop();
    return '<li class="file"><span class="ext">' + esc(extension(f.fichier)) + '</span>' +
      '<div class="file-info"><b>' + esc(f.titre || nom) + '</b>' +
      (f.description ? '<small>' + esc(f.description) + '</small>' : "") +
      '<small class="mono">' + esc(nom) + (f.taille ? " · " + esc(f.taille) : "") + '</small></div>' +
      '<a class="btn small" href="' + esc(f.fichier) + '" download="' + esc(nom) + '">' + T("telecharger") + '</a></li>';
  }
  // Dans un aperçu intégré (cadre), le navigateur bloque les téléchargements : on le dit clairement.
  var APERCU = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  function blocFichiers(liste) {
    var vus = {}, uniques = liste.filter(function (f) { if (vus[f.fichier]) return false; vus[f.fichier] = 1; return true; });
    var note = APERCU ? '<div class="astuce">' + T("apercu.dl") + '</div>' : "";
    return note + '<ul class="files' + (APERCU ? " off" : "") + '">' + uniques.map(ligneFichier).join("") + '</ul>';
  }

  /* ---------------- Fond « courbes de niveau » ---------------- */
  function dessinerCourbes(canvas) {
    var r = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    var st = getComputedStyle(document.documentElement);
    var c1 = st.getPropertyValue("--contour").trim(), c2 = st.getPropertyValue("--water").trim();
    var cx = r.width * 0.82, cy = r.height * 0.55;
    for (var k = 1; k <= 16; k++) {
      ctx.beginPath();
      for (var a = 0; a <= Math.PI * 2 + 0.01; a += 0.05) {
        var rad = k * 26 + Math.sin(a * 3 + k * 0.5) * 9 + Math.cos(a * 5 - k) * 5;
        var x = cx + Math.cos(a) * rad * 1.25, y = cy + Math.sin(a) * rad * 0.8;
        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = k % 5 === 0 ? c1 : c2;
      ctx.globalAlpha = k % 5 === 0 ? 0.35 : 0.13;
      ctx.lineWidth = k % 5 === 0 ? 1.4 : 1;
      ctx.stroke();
    }
  }

  /* ---------------- Vues ---------------- */
  function selecteur(cible) {
    if (PARCOURS.length < 2) return "";
    return '<div class="logiciels" role="tablist" aria-label="' + esc(T("choisir.logiciel")) + '">' + PARCOURS.map(function (c) {
      return '<a role="tab" href="#' + c.cle + (cible ? "/" + cible : "") + '"' + (c === COURS ? ' aria-selected="true" class="on"' : "") + '>' + esc(c.nom) + ' <small>' + pctParcours(c) + ' %</small></a>';
    }).join("") + '</div>';
  }

  function vueAccueil() {
    FLECHE = fleche();
    var suite = prochaineEtape();
    var nbLecons = toutesLecons().length;
    var totalLecons = PARCOURS.reduce(function (t, c) { return t + c.niveaux.reduce(function (u, n) { return u + n.lecons.length; }, 0); }, 0);
    var html = '<section class="hero"><canvas aria-hidden="true"></canvas><div class="wrap">' +
      '<div class="vitrine"><span class="eyebrow">' + T("vitrine.eyebrow", PARCOURS.length, totalLecons) + '</span>' +
      '<h1>' + T("vitrine.h1") + '</h1>' +
      '<p class="sous-titre">' + T("vitrine.sous") + '</p></div>' +
      selecteur() + '<span class="eyebrow">' + T("parcours.eyebrow", esc(COURS.nom), NIVEAUX.length, nbLecons) + '</span>' +
      '<h2 class="accroche">' + esc(COURS.accroche) + '</h2>' +
      '<p class="lead">' + esc(COURS.lead) + '</p>' +
      '<p class="enseignant">' + T("enseignant") + ' <b>BOUHAFSI SIDDIQ</b></p>' +
      '<div class="actions">' +
      (suite ? '<a class="btn primary" href="#' + suite.hash + '">' + (pctGlobal() ? T("reprendre") : T("commencer")) + esc(suite.label) + ' ' + FLECHE + '</a>'
             : '<a class="btn done" href="#' + NIVEAUX[NIVEAUX.length - 1].id + '">' + T("parcours.termine") + '</a>') +
      '<a class="btn" href="#videos">' + T("voir.videos") + '</a></div>' +
      '</div></section>';

    html += '<main class="wrap"><div class="section-title"><h2>' + T("itineraire") + '</h2><p>' + T("itineraire.sous") + '</p></div><ol class="route">';
    NIVEAUX.forEach(function (n) {
      var p = pctNiveau(n);
      var q = prog.quiz[n.id];
      var nbV = toutesVideos().filter(function (v) { return v.niveau === n.id; }).length;
      html += '<li class="stop' + (p === 100 ? " complete" : "") + '">' +
        '<div class="pin">' + (p === 100 ? "✓" : n.numero) + '</div>' +
        '<div><h3><a href="#' + n.id + '">' + esc(n.titre) + '</a></h3><p>' + esc(n.resume) + '</p>' +
        '<div class="meta"><span class="scale">' + esc(n.echelle) + '</span><span>' + T("n.lecons", n.lecons.length) + '</span><span>' + T(nbV > 1 ? "n.videos" : "n.video", nbV) + '</span>' +
        (q ? '<span>' + T("quiz.score", q.score, q.total) + '</span>' : '<span>' + T("quiz.afaire") + '</span>') + '</div></div>' +
        '<div class="right"><div class="ring" style="--p:' + p + '"><span>' + p + '%</span></div><a class="btn small" href="#' + n.id + '">' + T("ouvrir") + '</a></div>' +
        '</li>';
    });
    html += '</ol>';

    html += '<div class="section-title"><h2>' + T("comment") + '</h2></div><div class="grid-2">' +
      '<div class="panel"><h3>' + T("eleves") + '</h3><p>' + T("eleves.1", esc(COURS.court)) + '</p><p>' + T("eleves.2") + '</p></div>' +
      '<div class="panel"><h3>' + T("enseignants") + '</h3><p>' + T("enseignants.1") + '</p><p>' + T("enseignants.2") + '</p></div>' +
      '<div class="panel"><h3>' + T("tp") + '</h3><p>' + T("tp.1") + '</p></div>' +
      '</div>';
    html += '<div class="section-title"><h2>' + T("reinit") + '</h2></div><div class="row"><button class="btn small danger" id="reset" type="button">' + T("effacer") + '</button><span id="reset-msg" class="tag" hidden>' + T("confirmer") + '</span></div>';
    html += '</main>';
    app.innerHTML = html;
    var cv = app.querySelector(".hero canvas");
    requestAnimationFrame(function () { dessinerCourbes(cv); });

    var armed = false;
    document.getElementById("reset").addEventListener("click", function () {
      if (!armed) { armed = true; document.getElementById("reset-msg").hidden = false; return; }
      prog = { lecons: {}, quiz: {} }; sauverProg(); route();
    });
  }

  function barreLaterale(n, courant) {
    var h = '<nav class="side" aria-label="' + esc(T("lecons.niveau")) + '"><span class="label">' + T("niveau", n.numero) + ' · <span class="scale">' + esc(n.echelle) + '</span></span>' +
      '<a href="#' + n.id + '"' + (courant === n.id ? ' aria-current="page"' : "") + '><span class="check' + (pctNiveau(n) === 100 ? " on" : "") + '"></span><span>' + T("presentation") + '</span></a>';
    n.lecons.forEach(function (l, i) {
      h += '<a href="#' + l.id + '"' + (courant === l.id ? ' aria-current="page"' : "") + '><span class="check' + (prog.lecons[l.id] ? " on" : "") + '"></span><span>' + (i + 1) + '. ' + esc(l.titre) + '</span></a>';
    });
    if (n.quiz && n.quiz.length)
      h += '<a href="#' + n.id + '-quiz"' + (courant === n.id + "-quiz" ? ' aria-current="page"' : "") + '><span class="check quiz' + (prog.quiz[n.id] ? " on" : "") + '"></span><span>' + T("quiz.niveau") + '</span></a>';
    h += '<span class="label">' + T("autres.niveaux") + '</span>';
    NIVEAUX.forEach(function (m) { if (m !== n) h += '<a href="#' + m.id + '"><span class="check' + (pctNiveau(m) === 100 ? " on" : "") + '"></span><span>' + m.numero + '. ' + esc(m.titre) + '</span></a>'; });
    return h + '</nav>';
  }
  function entete(n, titre) {
    return '<div class="crumbs"><a href="#' + COURS.cle + '">' + T("parcours.x", esc(COURS.nom)) + '</a> / <a href="#' + n.id + '">' + T("niveau", n.numero) + '</a>' + (titre ? ' / ' + esc(titre) : "") + '</div>';
  }

  function vueNiveau(n) {
    var vids = toutesVideos().filter(function (v) { return v.niveau === n.id; });
    var h = '<main class="wrap">' + entete(n) +
      '<div class="level-head"><span class="eyebrow">' + T("niveau.echelle", n.numero, esc(n.echelle)) + '</span><h1>' + esc(n.titre) + '</h1><p>' + esc(n.resume) + '</p></div>' +
      '<div class="layout">' + barreLaterale(n, n.id) + '<article class="lesson">' +
      '<h2>' + T("programme") + '</h2><div class="sub"><span>' + T("n.lecons", n.lecons.length) + '</span><span>' + T("pct.termine", pctNiveau(n)) + '</span></div>' +
      '<div class="table-scroll"><table class="list"><tr><th>' + T("col.lecon") + '</th><th>' + T("col.duree") + '</th><th>' + T("col.etat") + '</th></tr>';
    n.lecons.forEach(function (l, i) {
      h += '<tr><td><a href="#' + l.id + '">' + (i + 1) + '. ' + esc(l.titre) + '</a></td><td>' + esc(l.duree) + '</td><td>' + (prog.lecons[l.id] ? '<span class="tag" style="color:var(--veg)">' + T("terminee") + '</span>' : '<span class="tag">' + T("afaire") + '</span>') + '</td></tr>';
    });
    if (n.quiz && n.quiz.length) {
      var q = prog.quiz[n.id];
      h += '<tr><td><a href="#' + n.id + '-quiz">' + T("quiz.niveau.n", n.quiz.length) + '</a></td><td>5 min</td><td>' + (q ? '<span class="tag" style="color:var(--veg)">' + q.score + '/' + q.total + '</span>' : '<span class="tag">' + T("afaire") + '</span>') + '</td></tr>';
    }
    var ficsN = tousFichiers().filter(function (f) { return f.niveau === n.id; });
    h += '</table></div>' + (ficsN.length ? '<h3>' + T("fichiers.niveau") + '</h3>' + blocFichiers(ficsN) : "") +
      '<h3>' + T("videos.niveau") + '</h3>' + noteVideos() +
      blocVideos(vids, T("aucune.video.niveau.admin")) +
      '<div class="lesson-foot"><a class="btn" href="#' + COURS.cle + '">' + T("retour.parcours") + '</a><a class="btn primary" href="#' + n.lecons[0].id + '">' + T("commencer.l1") + '</a></div>' +
      '</article></div></main>';
    app.innerHTML = h;
  }

  function vueLecon(r) {
    var n = r.niv, l = r.lec;
    var vids = toutesVideos().filter(function (v) { return v.lecon === l.id; });
    var fics = tousFichiers().filter(function (f) { return f.lecon === l.id; });
    var precedent = r.idx > 0 ? n.lecons[r.idx - 1].id : n.id;
    var suivant = r.idx < n.lecons.length - 1 ? n.lecons[r.idx + 1].id : n.id + "-quiz";
    var fait = !!prog.lecons[l.id];
    var recherche = "https://www.youtube.com/results?search_query=" + encodeURIComponent(COURS.recherche + " " + l.titre);
    var h = '<main class="wrap">' + entete(n, l.titre) +
      '<div class="layout">' + barreLaterale(n, l.id) + '<article class="lesson">' +
      '<span class="eyebrow">' + T("lecon.eyebrow", n.numero, r.idx + 1, n.lecons.length) + '</span>' +
      '<h2>' + esc(l.titre) + '</h2><div class="sub"><span>' + T("duree", esc(l.duree)) + '</span><span class="scale">' + esc(n.echelle) + '</span></div>' +
      (window.LANGUE && window.LANGUE !== "fr" && !l._traduite ? '<div class="astuce">' + T("non.traduit") + '</div>' : "") +
      '<div class="objectifs"><b>' + T("objectifs") + '</b><ul>' + l.objectifs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + '</ul></div>' +
      '<h3>' + T(vids.length > 1 ? "videos" : "video") + '</h3>' + noteVideos() +
      blocVideos(vids, T("pas.video", recherche)) +
      '<h3>' + T("cours") + '</h3><div class="body"' + (l._traduite || !window.LANGUE || window.LANGUE === "fr" ? "" : ' lang="fr" dir="ltr"') + '>' + l.contenu + '</div>' +
      (fics.length ? '<h3>' + T("fichiers.exemple") + '</h3>' + blocFichiers(fics) : "") +
      '<h3>' + T("exercice.dans", esc(COURS.court)) + '</h3><div class="exercice"' + (l._traduite || !window.LANGUE || window.LANGUE === "fr" ? "" : ' lang="fr" dir="ltr"') + '>' + l.exercice + '</div>' +
      blocObservation(l) +
      '<div class="lesson-foot"><a class="btn" href="#' + precedent + '">' + T("precedent") + '</a>' +
      '<button class="btn ' + (fait ? "done" : "primary") + '" id="toggle-fait" type="button">' + (fait ? T("lecon.terminee") : T("marquer")) + '</button>' +
      '<a class="btn" href="#' + suivant + '">' + T("suivant") + '</a></div>' +
      '</article></div></main>';
    app.innerHTML = h;
    ajouterBoutonsCopier();
    brancherObservation(l);
    document.getElementById("toggle-fait").addEventListener("click", function () {
      if (prog.lecons[l.id]) delete prog.lecons[l.id]; else prog.lecons[l.id] = Date.now();
      sauverProg();
      var y = window.scrollY; vueLecon(r); window.scrollTo(0, y);
    });
  }

  function ajouterBoutonsCopier() {
    app.querySelectorAll("pre").forEach(function (pre) {
      var b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.textContent = T("copier");
      b.addEventListener("click", function () {
        var txt = pre.querySelector("code").innerText;
        var ok = function () { b.textContent = T("copie"); setTimeout(function () { b.textContent = T("copier"); }, 1500); };
        try {
          navigator.clipboard.writeText(txt).then(ok, function () { selectionner(pre); });
        } catch (e) { selectionner(pre); }
      });
      pre.appendChild(b);
    });
  }
  function selectionner(el) {
    var range = document.createRange(); range.selectNodeContents(el.querySelector("code") || el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(range);
  }

  function vueQuiz(n) {
    var res = prog.quiz[n.id];
    var h = '<main class="wrap">' + entete(n, T("quiz.niveau")) + '<div class="layout">' + barreLaterale(n, n.id + "-quiz") +
      '<article class="lesson quiz"><span class="eyebrow">' + T("quiz.eyebrow", n.numero) + '</span><h2>' + T("quiz.titre", esc(n.titre)) + '</h2>' +
      '<div class="sub"><span>' + T("n.questions", n.quiz.length) + '</span>' + (res ? '<span>' + T("meilleur", res.score, res.total) + '</span>' : "") + '</div>' +
      '<form id="quiz-form"><ol class="qs">';
    n.quiz.forEach(function (q, i) {
      h += '<li class="q"><p>' + esc(q.question) + '</p>';
      q.choix.forEach(function (c, j) {
        h += '<label id="q' + i + 'c' + j + '-l"><input type="radio" name="q' + i + '" id="q' + i + 'c' + j + '" value="' + j + '"><span>' + esc(c) + '</span></label>';
      });
      h += '<p class="expl" id="q' + i + '-expl" hidden></p></li>';
    });
    h += '</ol><div class="row"><button class="btn primary" type="submit">' + T("valider") + '</button><button class="btn" type="button" id="quiz-reset">' + T("recommencer") + '</button></div></form>' +
      '<div id="quiz-score"></div>' +
      '<div class="lesson-foot"><a class="btn" href="#' + n.lecons[n.lecons.length - 1].id + '">' + T("derniere.lecon") + '</a>' +
      (NIVEAUX[NIVEAUX.indexOf(n) + 1] ? '<a class="btn" href="#' + NIVEAUX[NIVEAUX.indexOf(n) + 1].id + '">' + T("niveau.suivant") + '</a>' : '<a class="btn" href="#' + COURS.cle + '">' + T("retour.au.parcours") + '</a>') + '</div>' +
      '</article></div></main>';
    app.innerHTML = h;

    var form = document.getElementById("quiz-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var score = 0, repondu = 0;
      n.quiz.forEach(function (q, i) {
        var sel = form.querySelector('input[name="q' + i + '"]:checked');
        for (var j = 0; j < q.choix.length; j++) document.getElementById("q" + i + "c" + j + "-l").className = "";
        if (sel) repondu++;
        if (sel && +sel.value === q.bonne) score++;
        if (sel) {
          document.getElementById("q" + i + "c" + q.bonne + "-l").className = "ok";
          if (+sel.value !== q.bonne) document.getElementById("q" + i + "c" + sel.value + "-l").className = "ko";
          var ex = document.getElementById("q" + i + "-expl");
          ex.textContent = (+sel.value === q.bonne ? T("correct") : T("attendue", q.choix[q.bonne])) + (q.explication || "");
          ex.hidden = false;
        }
      });
      var zone = document.getElementById("quiz-score");
      if (repondu < n.quiz.length) {
        zone.innerHTML = '<div class="score">' + T("restantes", n.quiz.length - repondu) + '</div>';
        return;
      }
      var meilleur = prog.quiz[n.id];
      if (!meilleur || score > meilleur.score) prog.quiz[n.id] = { score: score, total: n.quiz.length, date: Date.now() };
      sauverProg();
      var pct = Math.round(score * 100 / n.quiz.length);
      zone.innerHTML = '<div class="score"><b>' + score + ' / ' + n.quiz.length + '</b><span>' +
        (pct >= 75 ? T("valide") : pct >= 50 ? T("presque") : T("revoir")) + '</span></div>';
      zone.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    document.getElementById("quiz-reset").addEventListener("click", function () { vueQuiz(n); });
  }

  function vueVideos() {
    var all = toutesVideos();
    var h = '<main class="wrap">' + selecteur("videos") + '<div class="level-head"><span class="eyebrow">' + T("mediatheque", esc(COURS.nom)) + '</span><h1>' + T("videos.titre") + '</h1><p>' + T("videos.sous", esc(COURS.nom)) + ' ' + T("videos.langues") + '</p></div>';
    NIVEAUX.forEach(function (n) {
      var v = all.filter(function (x) { return x.niveau === n.id; });
      h += '<div class="section-title"><h2>' + n.numero + '. ' + esc(n.titre) + '</h2><p class="scale">' + esc(n.echelle) + '</p></div>' +
        blocVideos(v, T("aucune.video"));
    });
    h += '<div class="section-title"><h2>' + T("merci.chaines") + '</h2></div><p>' + T("merci.chaines.p") + '</p>' +
      '<div class="section-title"><h2>' + T("ajouter.video") + '</h2></div><p>' + T("ajouter.video.p") + '</p></main>';
    app.innerHTML = h;
  }

  function vueTelechargements() {
    var all = tousFichiers();
    var general = all.filter(function (f) { return !f.niveau; });
    var h = '<main class="wrap">' + selecteur("telechargements") + '<div class="level-head"><span class="eyebrow">' + T("dl.eyebrow", esc(COURS.nom)) + '</span><h1>' + T("dl.titre") + '</h1>' +
      '<p>' + T("dl.p") + '</p></div>';
    if (general.length) h += blocFichiers(general);
    NIVEAUX.forEach(function (n) {
      var f = all.filter(function (x) { return x.niveau === n.id; });
      if (!f.length) return;
      h += '<div class="section-title"><h2>' + n.numero + '. ' + esc(n.titre) + '</h2><p class="scale">' + esc(n.echelle) + '</p></div>' + blocFichiers(f);
    });
    h += '<div class="section-title"><h2>' + T("ajouter.fichier") + '</h2></div><div class="panel"><p>' + T("ajouter.fichier.p") + '</p></div></main>';
    app.innerHTML = h;
  }

  /* ---------------- Remerciements aux chaînes YouTube ---------------- */
  function chaines() {
    var vus = {}, out = [];
    videosFichier().forEach(function (v) {
      var m = String(v.description || "").match(/Chaîne YouTube : (.+?)(?:\.(?:\s|$)|$)/);
      if (!m || !idYoutube(v.url)) return;
      var nom = m[1].trim();
      var k = nom.toLowerCase();
      if (!vus[k]) { vus[k] = { nom: nom, n: 0 }; out.push(vus[k]); }
      vus[k].n++;
    });
    return out.sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }); });
  }
  function vueRemerciements() {
    var c = chaines();
    var h = '<main class="wrap"><div class="level-head"><span class="eyebrow">' + T("merci") + '</span><h1>' + T("remerciements") + '</h1>' +
      '<p>' + T("merci.p", c.length) + '</p></div>' +
      '<ul class="merci">' + c.map(function (x) {
        return '<li><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(x.nom) + '&sp=EgIQAg%253D%253D" target="_blank" rel="noopener"><bdi>' + esc(x.nom) + '</bdi> ↗</a><span class="tag">' + T(x.n > 1 ? "n.videos" : "n.video", x.n) + '</span></li>';
      }).join("") + '</ul>' +
      '<div class="section-title"><h2>' + T("inspiration") + '</h2></div>' +
      '<div class="panel"><p>' + T("inspiration.p") + '</p></div>' +
      '<p style="margin-top:20px">' + T("retrait") + '</p></main>';
    app.innerHTML = h;
  }

  /* ---------------- Administration ---------------- */
  function exporterTexte() {
    var masquees = lire(CLE_MASQUEES, []);
    var liste = videosFichier().filter(function (v) { return masquees.indexOf(cleVideo(v)) < 0; }).concat(lire(CLE_VIDEOS, []));
    var propres = liste.map(function (v) {
      var o = { niveau: v.niveau || "", lecon: v.lecon || "", titre: v.titre || "", url: v.url || "", duree: v.duree || "", description: v.description || "" };
      return o;
    });
    return "/*\n * VIDÉOS TUTORIELLES : fichier généré depuis la page Administration le " + new Date().toLocaleString("fr-FR") + ".\n" +
      " * Remplacez donnees/videos.js par ce fichier pour publier les vidéos à tous les élèves.\n" +
      " * Champs : niveau (r1…r8), lecon (ex. r3-l2 ou vide), titre, url (YouTube ou videos/fichier.mp4), duree, description (\"Chaîne YouTube : Nom.\").\n */\n" +
      "window.VIDEOS = " + JSON.stringify(propres, null, 2) + ";\n";
  }

  function vueAdmin(message) {
    var all = toutesVideos();
    var optsNiv = NIVEAUX.map(function (n) { return '<option value="' + n.id + '">' + n.numero + '. ' + esc(n.titre) + '</option>'; }).join("");
    var h = '<main class="wrap">' + selecteur("admin") + '<div class="level-head"><span class="eyebrow">' + T("admin.eyebrow", esc(COURS.nom)) + '</span><h1>' + T("admin.titre") + '</h1>' +
      '<p>' + T("admin.p") + '</p></div>' +
      '<div class="panel"><h3>' + T("nouvelle.video") + '</h3><form id="f-video" class="form">' +
      '<div class="field"><label for="f-niveau">' + T("f.niveau") + '</label><select id="f-niveau" required>' + optsNiv + '</select></div>' +
      '<div class="field"><label for="f-lecon">' + T("f.lecon") + '</label><select id="f-lecon"></select><small>' + T("f.lecon.aide") + '</small></div>' +
      '<div class="field full"><label for="f-titre">' + T("f.titre") + '</label><input id="f-titre" required maxlength="140" placeholder="' + esc(T("f.titre.ex")) + '"></div>' +
      '<div class="field full"><label for="f-url">' + T("f.url") + '</label><input id="f-url" dir="ltr" required placeholder="https://www.youtube.com/watch?v=…  |  videos/zone_tampon.mp4"><small>' + T("f.url.aide") + '</small></div>' +
      '<div class="field"><label for="f-duree">' + T("f.duree") + '</label><input id="f-duree" placeholder="12:30" maxlength="12"></div>' +
      '<div class="field full"><label for="f-desc">' + T("f.desc") + '</label><textarea id="f-desc" rows="2" maxlength="400" placeholder="' + esc(T("f.desc.ex")) + '"></textarea></div>' +
      '<div class="full row"><button class="btn primary" type="submit">' + T("f.ajouter") + '</button><span id="f-type" class="tag"></span></div>' +
      '</form>' + (message ? '<div class="notice">' + esc(message) + '</div>' : "") + '</div>';

    h += '<div class="section-title"><h2>' + T("videos.parcours") + '</h2><p>' + T("au.total", all.length) + '</p></div>';
    if (!all.length) h += '<div class="empty">' + T("aucune.video.moment") + '</div>';
    else {
      h += '<div class="panel table-scroll"><table class="list"><tr><th>' + T("col.niveau") + '</th><th>' + T("col.lecon") + '</th><th>' + T("col.titre") + '</th><th>' + T("col.lien") + '</th><th>' + T("col.origine") + '</th><th></th></tr>';
      all.forEach(function (v, i) {
        var lec = v.lecon ? trouverLecon(v.lecon) : null;
        h += '<tr><td>' + (niveau(v.niveau) ? niveau(v.niveau).numero : "?") + '</td><td>' + (lec ? esc(lec.lec.titre) : T("tout.niveau")) + '</td><td>' + esc(v.titre) + '</td><td class="url">' + esc(v.url) + '</td>' +
          '<td>' + (v._source === "local" ? '<span class="tag local">' + T("ce.poste") + '</span>' : '<span class="tag">videos.js</span>') + '</td>' +
          '<td><button class="btn small danger" type="button" data-suppr="' + i + '">' + T("retirer") + '</button></td></tr>';
      });
      h += '</table></div>';
    }

    h += '<div class="section-title"><h2>' + T("publier") + '</h2></div><div class="panel">' +
      '<p>' + T("publier.p") + '</p>' +
      '<div class="row"><button class="btn primary" type="button" id="dl">' + T("dl.videos") + '</button><button class="btn" type="button" id="cp">' + T("copier.texte") + '</button><button class="btn danger" type="button" id="vider">' + T("vider") + '</button><span id="vider-msg" class="tag" hidden>' + T("confirmer") + '</span></div>' +
      '<p style="margin-top:12px"><label for="export-txt">' + T("contenu.fichier") + '</label></p><textarea id="export-txt" class="export" dir="ltr" readonly></textarea></div>';
    h += '</main>';
    app.innerHTML = h;

    var selN = document.getElementById("f-niveau"), selL = document.getElementById("f-lecon");
    function remplirLecons() {
      var n = niveau(selN.value);
      selL.innerHTML = '<option value="">' + T("tout.niveau") + '</option>' + n.lecons.map(function (l, i) { return '<option value="' + l.id + '">' + (i + 1) + '. ' + esc(l.titre) + '</option>'; }).join("");
    }
    selN.addEventListener("change", remplirLecons); remplirLecons();
    var urlIn = document.getElementById("f-url"), typeOut = document.getElementById("f-type");
    urlIn.addEventListener("input", function () {
      var t = urlIn.value.trim() ? typeVideo(urlIn.value.trim()) : "";
      typeOut.textContent = t === "youtube" ? T("yt.detecte") : t === "fichier" ? T("fichier.local") : t ? T("lien.externe") : "";
    });
    document.getElementById("export-txt").value = exporterTexte();

    document.getElementById("f-video").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = {
        niveau: selN.value, lecon: selL.value,
        titre: document.getElementById("f-titre").value.trim(),
        url: urlIn.value.trim(),
        duree: document.getElementById("f-duree").value.trim(),
        description: document.getElementById("f-desc").value.trim()
      };
      var ajouts = lire(CLE_VIDEOS, []); ajouts.push(v); ecrire(CLE_VIDEOS, ajouts);
      vueAdmin(T("video.ajoutee", v.titre));
    });
    app.querySelectorAll("[data-suppr]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = all[+b.getAttribute("data-suppr")];
        if (v._source === "local") { var a = lire(CLE_VIDEOS, []); a.splice(v._i, 1); ecrire(CLE_VIDEOS, a); }
        else { var m = lire(CLE_MASQUEES, []); m.push(cleVideo(v)); ecrire(CLE_MASQUEES, m); }
        vueAdmin(T("video.retiree", v.titre) + (v._source === "local" ? "" : T("video.retiree.tous")));
      });
    });
    document.getElementById("dl").addEventListener("click", function () {
      var blob = new Blob([exporterTexte()], { type: "text/javascript;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "videos.js";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    });
    document.getElementById("cp").addEventListener("click", function () {
      var ta = document.getElementById("export-txt"), b = this;
      try { navigator.clipboard.writeText(ta.value).then(function () { b.textContent = T("texte.copie"); }, function () { ta.select(); }); }
      catch (e) { ta.select(); }
    });
    var armed = false;
    document.getElementById("vider").addEventListener("click", function () {
      if (!armed) { armed = true; document.getElementById("vider-msg").hidden = false; return; }
      ecrire(CLE_VIDEOS, []); ecrire(CLE_MASQUEES, []);
      vueAdmin(T("vide.ok"));
    });
  }

  /* ---------------- Routeur (#accueil, #n1, #n1-l2, #n1-quiz, #videos, #admin) ---------------- */
  function route() {
    var h = (location.hash || "#accueil").slice(1);
    var nav = "accueil";
    // #r (+ /videos, /telechargements, /admin) : choix du parcours
    var m = h.match(/^([a-z]+)(?:\/(videos|telechargements|admin))?$/);
    if (m && choisirParcours(m[1])) h = m[2] || "accueil";
    else { var pc = parcoursDe(h); if (pc) choisirParcours(pc.cle); }
    if (h === "admin") { vueAdmin(); nav = "admin"; }
    else if (h === "videos") { vueVideos(); nav = "videos"; }
    else if (h === "telechargements") { vueTelechargements(); nav = "telechargements"; }
    else if (h === "remerciements") { vueRemerciements(); nav = "remerciements"; }
    else if (h === "livre") { vueLivre(); nav = "livre"; }
    else if (/^[a-z]\d+-quiz$/.test(h) && niveau(h.replace("-quiz", ""))) vueQuiz(niveau(h.replace("-quiz", "")));
    else if (niveau(h)) vueNiveau(niveau(h));
    else if (trouverLecon(h)) vueLecon(trouverLecon(h));
    else vueAccueil();
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === nav) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    majCompteur();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("langue", function () {
    var y = window.scrollY; appliquerLangue(); route(); window.scrollTo(0, y);
  });
  if (window.habillerPage) window.habillerPage();
  choisirParcours(lire(CLE_PARCOURS, "r"));
  appliquerLangue();
  route();
})();
