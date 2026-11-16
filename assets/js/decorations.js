/* ==========================================================================
   Caroline Roulleau – Décorations saisonnières
   Guirlande lumineuse, neige, paillettes, pétales, muguet, soleil, feuilles
   d'automne, cœurs, cloche de Pâques, lune et étoiles.
   Les périodes se choisissent dans le CMS (« Annonces et décorations ») :
   ce fichier n'a pas besoin d'être modifié.

   Petites surprises au clic :
   - le muguet : jeu des 13 clochettes (un brin à 13 clochettes porte bonheur) ;
   - la cloche de Pâques : elle sonne et sème des œufs ;
   - la lune (Journée du sommeil) : elle s'endort ;
   - les ampoules de la guirlande : une vague de lumière ;
   - la photo de l'accueil (et de « Qui suis-je ? ») : une gerbe aux couleurs du moment.
   Le reste est purement décoratif : ignoré par les lecteurs d'écran, sans
   effet sur les clics, et immobile si l'appareil demande de réduire les animations.
   ========================================================================== */
(function () {
  'use strict';

  var PALETTES = {
    guirlande: ['#E9B949', '#C8734F', '#8FB08A', '#F3DFA9', '#D98C8C'],
    neige: ['#FFFFFF'],
    paillettes: ['#C99A3E', '#E0B65C', '#B8862F', '#E8C77A'],
    petales: ['#E8A0AC', '#F1B9C2', '#E48D9C', '#F6CCD2'],
    feuilles: ['#B7653F', '#D29A4A', '#9C4F35', '#C98A3E', '#8A9E86'],
    coeurs: ['#E59AA3', '#D9777F', '#F1BCC2', '#C9734F', '#EDA7AE'],
    etoiles: ['#D2B05C', '#B1A0CE', '#94AACB', '#E0C47E'],
    soleil: ['#F0C46A', '#E9A94F', '#F6D88E'],
    oeufs: ['#E8A0AC', '#9FC3A0', '#EFCB66', '#A9B8E0', '#E9AE86', '#C7B0DD']
  };
  /* nombre d'éléments sur grand écran (environ deux fois moins sur téléphone) */
  var NOMBRE = { neige: 28, petales: 20, feuilles: 12, paillettes: 22, coeurs: 14, etoiles: 18 };
  /* forme et couleurs de la gerbe qui jaillit quand on clique sur la photo */
  var GERBES = {
    guirlande: ['etoile', 'guirlande'], neige: ['flocon', 'neige'], paillettes: ['etoile', 'paillettes'],
    petales: ['petale', 'petales'], feuilles: ['feuille', 'feuilles'], coeurs: ['coeur', 'coeurs'],
    soleil: ['etoile', 'soleil'], lune: ['etoile', 'etoiles'], muguet: ['clochette', 'neige'], cloches: ['oeuf', 'oeufs']
  };
  /* pesanteur (px/s²) et freinage de l'air pour chaque forme */
  var PHYSIQUE = { flocon: [150, 0.985], etoile: [480, 0.975], petale: [170, 0.975], feuille: [190, 0.975],
                   coeur: [-140, 0.975], clochette: [420, 0.98], oeuf: [1300, 0.995] };
  var actifs = [];   /* décorations du moment */

  function hasard(min, max) { return min + Math.random() * (max - min); }
  function choix(liste) { return liste[Math.floor(Math.random() * liste.length)]; }
  function petitEcran() { return (window.innerWidth || 1024) < 700; }
  function calme() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function zone(root) { return root.querySelector('.hero') || root.querySelector('.page-hero'); }
  function fr(t) { return String(t).replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0'); }
  function boite(type) {
    var b = document.createElement('div');
    b.className = 'deco deco-' + type;
    b.setAttribute('aria-hidden', 'true');
    return b;
  }
  /* relance une petite animation CSS (classe posée puis retirée) */
  function relancer(el, classe, duree) {
    el.classList.remove(classe);
    if (el.getBoundingClientRect) { el.getBoundingClientRect(); }
    el.classList.add(classe);
    clearTimeout(el['minuterie-' + classe]);
    el['minuterie-' + classe] = setTimeout(function () { el.classList.remove(classe); }, duree);
  }

  /* Neige, pétales, feuilles : chaque élément descend dans sa colonne ; paillettes et étoiles : elles scintillent sur place */
  function particules(root, type) {
    var z = zone(root);
    if (!z) { return; }
    var b = boite(type);
    var n = Math.round(NOMBRE[type] * (petitEcran() ? 0.55 : 1));
    var html = '';
    for (var i = 0; i < n; i++) {
      var s, d, extra = '', classe = 'p';
      if (type === 'neige') {
        s = hasard(5, 13); d = hasard(11, 22);
        if (i % 3 === 0) { classe += ' flocon'; s += 5; }
      } else if (type === 'petales') {
        s = hasard(12, 20); d = hasard(13, 24);
      } else if (type === 'feuilles') {
        s = hasard(14, 22); d = hasard(12, 22);
      } else if (type === 'coeurs') {
        s = hasard(10, 20); d = hasard(14, 24);
      } else if (type === 'etoiles') {
        s = hasard(9, 17); d = hasard(3.6, 7.5);
        if (i % 3 === 0) { classe += ' point'; s = hasard(3.5, 5.5); }
        extra = '--yy:' + hasard(4, 92).toFixed(1) + '%;';
      } else {   /* paillettes */
        s = hasard(12, 26); d = hasard(2.6, 5.2);
        extra = '--yy:' + hasard(4, 92).toFixed(1) + '%;';
      }
      html += '<span class="' + classe + '" style="--x:' + hasard(0, 98).toFixed(1) + '%;--s:' + s.toFixed(1) + 'px;' +
        '--d:' + d.toFixed(1) + 's;--r:' + (-hasard(0, d)).toFixed(1) + 's;--y:' + (-hasard(8, 92)).toFixed(0) + '%;' +
        '--a:' + hasard(8, 26).toFixed(0) + 'px;--t:' + hasard(10, 70).toFixed(0) + 'deg;' +
        '--o:' + hasard(type === 'neige' ? 0.55 : 0.75, 0.98).toFixed(2) + ';--c:' + choix(PALETTES[type]) + ';' + extra + '"><i></i></span>';
    }
    b.innerHTML = html;
    z.insertBefore(b, z.firstChild);
  }

  /* ---------------------------------------------------------------------
     Envols : petits éléments lancés au-dessus de la page (gerbes, œufs,
     notes de musique, pluie de muguet), puis effacés. Rien chez les
     visiteurs qui demandent de réduire les animations.
     --------------------------------------------------------------------- */
  function couche() {
    if (calme() || !document.body || !document.body.animate) { return null; }
    var c = document.querySelector('.deco-envol');
    if (!c) {
      c = document.createElement('div');
      c.className = 'deco-envol';
      c.setAttribute('aria-hidden', 'true');
      document.body.appendChild(c);
    }
    return c;
  }

  /* trajectoire image par image : vitesse (px/s), pesanteur, freinage, rebonds sur un sol, balancement */
  function trajet(o) {
    var images = [], x = 0, y = 0, r = 0, vx = o.vx || 0, vy = o.vy || 0, vr = o.vr || 0, dt = 1 / 60;
    var n = Math.max(3, Math.round(o.duree / 1000 * 60)), fondu = o.fondu || 0.65, e = o.echelle || [1, 1], b = o.balance;
    for (var k = 0; k <= n; k++) {
      if (k % 3 === 0 || k === n) {
        var p = k / n, bx = b ? b[0] * Math.sin(b[1] * k * dt + b[2]) : 0;
        images.push({
          transform: 'translate(' + (x + bx).toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + r.toFixed(0) + 'deg) scale(' + (e[0] + (e[1] - e[0]) * p).toFixed(2) + ')',
          opacity: p <= fondu ? 1 : Math.max(0, Math.round((1 - p) / (1 - fondu) * 100) / 100)
        });
      }
      vy += (o.g || 0) * dt;
      if (o.frein) { vx *= o.frein; vy *= o.frein; vr *= o.frein; }
      x += vx * dt; y += vy * dt; r += vr * dt;
      if (o.sol !== undefined && y >= o.sol) {   /* rebond, puis l'élément roule et s'arrête */
        y = o.sol; vy = Math.abs(vy) < 90 ? 0 : -vy * (o.rebond || 0.3); vx *= 0.82; vr *= 0.6;
      }
    }
    return images;
  }

  function envol(forme, x, y, o) {
    var c = couche();
    if (!c) { return null; }
    var el = document.createElement('i'), t = o.taille || 14;
    el.className = 'envol f-' + forme;
    el.style.cssText = 'left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;--s:' + t.toFixed(1) + 'px;' + (o.couleur ? '--c:' + o.couleur + ';' : '');
    el.innerHTML = '<b>' + (o.texte || '') + '</b>';
    c.appendChild(el);
    var fin = function () { if (el.parentNode) { el.parentNode.removeChild(el); } };
    var anim = el.animate(trajet(o), { duration: o.duree, delay: o.delai || 0, easing: 'linear', fill: 'both' });
    anim.onfinish = fin;
    setTimeout(fin, o.duree + (o.delai || 0) + 500);
    return el;
  }

  /* gerbe : jaillit d'un point, en éventail vers le haut */
  function gerbe(x, y, formes, n) {
    for (var i = 0; i < n; i++) {
      var f = formes[i % formes.length], ph = PHYSIQUE[f[0]] || [400, 0.98];
      var angle = hasard(-165, -15) * Math.PI / 180, v = hasard(150, 380);
      envol(f[0], x, y, { couleur: choix(PALETTES[f[1]]), taille: hasard(11, 19), vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        g: ph[0], frein: ph[1], vr: hasard(-260, 260), duree: hasard(1200, 1800) });
    }
  }

  /* pluie de clochettes de muguet sur toute la page */
  function pluie(n) {
    var L = window.innerWidth || 1024, H = window.innerHeight || 768;
    for (var i = 0; i < n; i++) {
      var v = hasard(150, 250);
      envol('clochette', hasard(10, L - 10), -20, { couleur: '#FFFFFF', taille: hasard(18, 28), vy: v,
        duree: (H + 60) / v * 1000, delai: hasard(0, 1600), vr: hasard(-50, 50),
        balance: [hasard(10, 26), hasard(1.4, 2.6), hasard(0, 6)], fondu: 0.88 });
    }
  }

  /* notes de musique qui s'envolent (muguet, cloche) */
  function notes(x, y, n) {
    for (var i = 0; i < n; i++) {
      envol('note', x + hasard(-14, 14), y, { texte: i % 2 ? '\u266b' : '\u266a', taille: hasard(15, 21), vx: hasard(-26, 26),
        vy: hasard(-95, -70), duree: 1500, delai: i * 160, balance: [5, 5, i], fondu: 0.5 });
    }
  }

  /* point d'un élément, en coordonnées de la fenêtre (fx, fy entre 0 et 1) */
  function point(el, fx, fy) {
    var r = el.getBoundingClientRect();
    return [r.left + r.width * fx, r.top + r.height * fy];
  }

  /* ---------------------------------------------------------------------
     Objets à cliquer : muguet, cloche de Pâques, lune.
     Un vrai bouton (clavier et lecteurs d'écran) et une bulle de texte.
     --------------------------------------------------------------------- */
  function objet(root, type, dessin, libelle) {
    var cible = root.querySelector('.hero-visual') || root.querySelector('.page-hero');
    if (!cible) { return null; }
    var b = document.createElement('div');
    b.className = 'deco deco-' + type + ' deco-objet';
    b.innerHTML = '<button type="button" class="deco-bouton" aria-label="' + libelle + '" title="' + libelle + '">' + dessin + '</button>' +
      '<p class="deco-bulle" role="status"></p>';
    cible.appendChild(b);
    return { boite: b, bouton: b.querySelector('.deco-bouton'), bulle: b.querySelector('.deco-bulle'), clics: 0 };
  }

  function dire(o, texte, duree) {
    o.bulle.innerHTML = fr(texte);
    o.bulle.classList.add('vue');
    clearTimeout(o.minuterie);
    o.minuterie = setTimeout(function () { o.bulle.classList.remove('vue'); }, duree || 4500);
  }

  /* « Psst… » : une seule fois par visite, quand l'objet est bien visible à l'écran */
  function indice(o, cle, texte) {
    try { if (window.sessionStorage.getItem('cr-indice-' + cle)) { return; } } catch (e) { /* stockage indisponible */ }
    var montrer = function () {
      if (o.clics || !o.boite.parentNode || !o.boite.offsetParent) { return; }
      dire(o, texte, 4200);
      try { window.sessionStorage.setItem('cr-indice-' + cle, '1'); } catch (e) { /* stockage indisponible */ }
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entrees) {
        if (entrees[0].isIntersecting) { io.disconnect(); setTimeout(montrer, 1400); }
      }, { threshold: 0.6 });
      io.observe(o.bouton);
    } else {
      setTimeout(montrer, 2500);
    }
  }

  /* Muguet du 1er mai : un brin de 13 clochettes noué d'un ruban, au pied de la photo (ou dans un coin du haut de page).
     Le jeu : chaque clic fait tinter une clochette ; à la 13e, pluie de muguet porte-bonheur. */
  var CLOCHETTES = [   /* x, y, taille, dans l'ordre où elles s'allument (de bas en haut, une tige puis l'autre) */
    [95.6, 110.2, 1.42], [66.7, 130.6, 1.38], [101, 86, 1.35], [57, 110, 1.3], [111, 72, 1.3], [47, 98, 1.2], [122, 63, 1.2],
    [36, 90, 1.08], [133, 57, 1.08], [25, 86, 0.94], [143, 53, 0.94], [15, 84, 0.78], [150, 52, 0.78]];

  function messageMuguet(n) {
    if (n === 1) { return 'Ding ! <b>1</b> clochette sur 13. Faites-les toutes tinter : un brin à 13 clochettes porte bonheur !'; }
    if (n === 7) { return '<b>7</b> clochettes sur 13 : vous êtes sur la bonne voie !'; }
    if (n === 10) { return '<b>10</b> clochettes sur 13 : le bonheur approche…'; }
    if (n === 12) { return '<b>12</b> clochettes sur 13 : plus qu\'une !'; }
    return '<b>' + n + '</b> clochettes sur 13';
  }

  function muguet(root) {
    var cloches = '';
    CLOCHETTES.forEach(function (c) {
      cloches += '<g transform="translate(' + c[0] + ' ' + c[1] + ') scale(' + c[2] + ')">' +
        '<path d="M0-4.4q.2-3.4-1.6-6" fill="none" stroke="#6B8B58" stroke-width=".9"/>' +
        '<g class="cl" style="animation-delay:' + (-hasard(0, 2.8)).toFixed(2) + 's">' +
        '<circle class="halo" r="8" fill="url(#deco-muguet-h)"/>' +
        '<path d="M-5 0C-5-5.8 5-5.8 5 0v2.4l-1.6 1.8-1.7-1.4L0 4.4l-1.7-1.6-1.7 1.4L-5 2.4z" fill="url(#deco-muguet-g)" stroke="#AFC3A4" stroke-width=".7"/>' +
        '<path class="or" d="M-5 0C-5-5.8 5-5.8 5 0v2.4l-1.6 1.8-1.7-1.4L0 4.4l-1.7-1.6-1.7 1.4L-5 2.4z" fill="url(#deco-muguet-o)" stroke="#D9B65C" stroke-width=".7"/></g></g>';
    });
    var dessin = '<svg viewBox="0 0 160 210" focusable="false" aria-hidden="true"><defs>' +
      '<linearGradient id="deco-muguet-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E4EDDF"/></linearGradient>' +
      '<linearGradient id="deco-muguet-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF3"/><stop offset="1" stop-color="#F5DE96"/></linearGradient>' +
      '<radialGradient id="deco-muguet-h"><stop offset="0" stop-color="#FBE3A0" stop-opacity=".95"/><stop offset="1" stop-color="#FBE3A0" stop-opacity="0"/></radialGradient></defs>' +
      '<path d="M78 210C44 168 38 100 56 36c14 62 28 120 30 174z" fill="#7E9F6A"/>' +
      '<path d="M84 210c36-44 46-100 34-154-14 52-28 104-36 154z" fill="#93B37E"/>' +
      '<path d="M80 204C66 156 60 100 58 50M84 204c12-44 22-92 30-138" fill="none" stroke="#B5CDA4" stroke-width=".9"/>' +
      '<path d="M82 210c0-50 4-98 16-130 10-24 28-36 50-38M78 210c-2-42-6-82-20-110-10-18-26-26-44-26" fill="none" stroke="#6B8B58" stroke-width="2.1" stroke-linecap="round"/>' +
      cloches +
      '<path d="M79 178c-14-11-26-5-19 4 4 5 12 2 19-4zM83 178c14-11 26-5 19 4-4 5-12 2-19-4z" fill="#C8734F"/>' +
      '<path d="M80 180l-9 17M83 180l8 16" stroke="#C8734F" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="81" cy="179" r="3.4" fill="#A85C3E"/></svg>';
    var o = objet(root, 'muguet', dessin, 'Faire tinter le muguet (petit jeu)');
    if (!o) { return; }
    var cl = [].slice.call(o.boite.querySelectorAll('.cl'));
    indice(o, 'muguet', 'Psst… cliquez sur le muguet !');
    o.bouton.addEventListener('click', function () {
      relancer(o.boite, 'sonne', 1200);
      if (o.fini) { return; }   /* pendant la pluie de muguet : on écoute simplement tinter */
      o.clics += 1;
      var c = cl[o.clics - 1], p = point(c, 0.5, 0.2);
      c.classList.add('on');
      relancer(c, 'pop', 700);
      notes(p[0], p[1], 2);
      if (o.clics < cl.length) {
        dire(o, messageMuguet(o.clics));
        return;
      }
      o.fini = true;
      o.boite.classList.add('fete');
      dire(o, '<b>13 clochettes !</b> Votre brin porte-bonheur est complet. Je vous souhaite un joli mois de mai !', 7000);
      pluie(petitEcran() ? 22 : 38);
      setTimeout(function () {   /* le brin se prépare pour une nouvelle partie */
        o.boite.classList.remove('fete');
        cl.forEach(function (x) { x.classList.remove('on'); });
        o.clics = 0;
        o.fini = false;
      }, 7000);
    });
  }

  /* Cloche de Pâques : une cloche ailée, nouée d'un ruban. Au clic, elle sonne et sème des œufs. */
  function messageCloche(clics, oeufs) {
    if (clics === 1) { return 'Ding, dang, dong ! Les cloches sont de retour de Rome…'; }
    if (clics === 2) { return '… et elles sèment des œufs en chocolat !'; }
    return '<b>' + oeufs + '</b> œufs en chocolat : joyeuses Pâques !';
  }

  function cloches(root) {
    var aile = '<path class="aile" d="M41 51C30 35 14 28 2 30c5 3 9 7 10 11-6-.5-10 1.5-12 5 7 0 11 3 13 7-5 .5-8 3-9 6 10 2 25-1 37-8z" fill="#FFFDF8" stroke="#D3C8B4" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M37 49c-8-6-17-9-25-9M36 53c-8-2-15-2-22 1" fill="none" stroke="#E4DCCD" stroke-width="1" stroke-linecap="round"/>';
    var dessin = '<svg viewBox="0 0 120 120" focusable="false" aria-hidden="true"><defs>' +
      '<linearGradient id="deco-cloche-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F7DE92"/><stop offset=".55" stop-color="#E6B752"/><stop offset="1" stop-color="#C58A33"/></linearGradient></defs>' +
      '<g class="vol"><g class="corps">' + aile + '<g transform="matrix(-1 0 0 1 120 0)">' + aile + '</g>' +
      '<circle class="battant" cx="60" cy="91" r="5.5" fill="#A8742C"/>' +
      '<path d="M60 25c-13 0-21 10-22 24-1 14-4 23-12 30h68c-8-7-11-16-12-30-1-14-9-24-22-24z" fill="url(#deco-cloche-g)" stroke="#B9822F" stroke-width="1.2"/>' +
      '<path d="M23 78h74a4 4 0 0 1 0 8H23a4 4 0 0 1 0-8z" fill="#C99137" stroke="#A8742C" stroke-width="1"/>' +
      '<path d="M48 37c-4 7-6 16-7 30" fill="none" stroke="#FFF6D8" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M34 66q26 7 52 0" fill="none" stroke="#B9822F" stroke-width="1.4"/>' +
      '<path d="M58 24c-3 7-8 11-14 15M62 24c3 7 8 11 14 15" fill="none" stroke="#E59AA3" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M60 22c-9-10-21-9-19-1 1.6 6 11 6 19 1zM60 22c9-10 21-9 19-1-1.6 6-11 6-19 1z" fill="#EBA4AD" stroke="#D9777F" stroke-width="1"/>' +
      '<circle cx="60" cy="22" r="3.6" fill="#D9777F"/></g></g></svg>';
    var o = objet(root, 'cloches', dessin, 'Faire sonner la cloche de Pâques');
    if (!o) { return; }
    o.oeufs = 0;
    indice(o, 'cloches', 'Psst… sonnez la cloche !');
    o.bouton.addEventListener('click', function () {
      o.clics += 1;
      relancer(o.boite, 'sonne', 1400);
      var bas = point(o.bouton, 0.5, 0.74), haut = point(o.bouton, 0.5, 0.12), n = 3 + Math.floor(Math.random() * 3);
      var z = zone(root), r = z ? z.getBoundingClientRect() : null, H = window.innerHeight || 768;
      var sol = Math.min(H - 14, r ? r.bottom - 14 : H - 14);
      if (sol < bas[1] + 60) { sol = bas[1] + 160; }
      notes(haut[0], haut[1], 2);
      for (var i = 0; i < n; i++) {
        envol('oeuf', bas[0] + hasard(-12, 12), bas[1], { couleur: choix(PALETTES.oeufs), taille: hasard(20, 26),
          vx: hasard(-150, 150), vy: hasard(-260, -110), g: 1300, frein: 0.995, vr: hasard(-200, 200),
          sol: sol - bas[1], rebond: 0.4, duree: 2900, delai: i * 90, fondu: 0.82 });
      }
      o.oeufs += n;
      dire(o, messageCloche(o.clics, o.oeufs));
    });
  }

  /* Journée du sommeil : un croissant de lune qui somnole, et un ciel étoilé tout doux. Au clic, elle s'endort. */
  var MESSAGES_LUNE = ['Chut… la lune s\'endort.', 'Zzz… Bonne nuit, faites de beaux rêves !',
    'Bien dormir, ça s\'apprend aussi : l\'hypnose peut vous y aider.', 'Zzz…', 'Chut… elle dort !'];

  function lune(root) {
    particules(root, 'etoiles');
    var dessin = '<svg viewBox="0 0 100 100" focusable="false" aria-hidden="true"><defs>' +
      '<radialGradient id="deco-lune-h"><stop offset=".45" stop-color="#F8E7AE" stop-opacity=".7"/><stop offset="1" stop-color="#F8E7AE" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="deco-lune-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCF0C6"/><stop offset="1" stop-color="#E8C46E"/></linearGradient></defs>' +
      '<circle cx="47" cy="50" r="46" fill="url(#deco-lune-h)"/>' +
      '<g class="astre"><path d="M43.8 19.2A31 31 0 1 0 75.1 63A27 27 0 0 1 43.8 19.2z" fill="url(#deco-lune-g)" stroke="#D9B45E" stroke-width="1"/>' +
      '<path d="M27.5 55.5q4.5 4 9 0" fill="none" stroke="#A9823A" stroke-width="1.7" stroke-linecap="round"/>' +
      '<circle cx="30" cy="63" r="2.8" fill="#EFB2A0" fill-opacity=".75"/></g>' +
      '<text class="zz" x="70" y="33">z</text><text class="zz z2" x="79" y="21">z</text></svg>';
    var o = objet(root, 'lune', dessin, 'Endormir la lune (petit jeu)');
    if (!o) { return; }
    indice(o, 'lune', 'Psst… cliquez sur la lune !');
    o.bouton.addEventListener('click', function () {
      o.clics += 1;
      relancer(o.boite, 'berce', 1700);
      var p = point(o.bouton, 0.68, 0.28);
      ['Z', 'z', 'Z'].forEach(function (t, i) {
        envol('z', p[0], p[1], { texte: t, taille: 15 + i * 6, vx: hasard(22, 36), vy: hasard(-62, -48), duree: 2300,
          delai: i * 380, echelle: [0.6, 1.4], balance: [6, 3, i], fondu: 0.55 });
      });
      gerbe(p[0], p[1], [['etoile', 'etoiles']], 6);
      dire(o, MESSAGES_LUNE[o.clics <= 3 ? o.clics - 1 : 3 + o.clics % 2]);   /* trois phrases, puis « Zzz… » et « Chut… » à tour de rôle */
    });
  }

  /* Soleil d'été : halo chaud et rayons qui tournent très lentement */
  function soleil(root) {
    var z = zone(root);
    if (!z) { return; }
    var b = boite('soleil');
    b.innerHTML = '<i></i>';
    z.insertBefore(b, z.firstChild);
  }

  /* Guirlande lumineuse accrochée sous l'en-tête ; un clic sur une ampoule lance une vague de lumière */
  function guirlande(root) {
    var h = root.querySelector('.site-header');
    if (!h) { return; }
    var b = boite('guirlande');
    var petit = petitEcran();
    var P = petit ? 70 : 104, H = petit ? 26 : 36, y0 = 3, y1 = petit ? 11 : 18;
    var largeur = Math.max(window.innerWidth || 0, (window.screen && screen.width) || 0);
    var W = (Math.ceil(largeur / P) + 1) * P, cy = 2 * y1 - y0;
    var fil = 'M0 ' + y0, ampoules = '', k = 0;
    var rx = petit ? 2.3 : 3.2, ry = petit ? 3.2 : 4.5;
    for (var x = 0; x < W; x += P) {
      fil += ' Q' + (x + P / 2) + ' ' + cy + ' ' + (x + P) + ' ' + y0;
      for (var t = 0.2; t < 0.9; t += 0.3) {   /* trois ampoules par boucle */
        var px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * (x + P / 2) + t * t * (x + P);
        var py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y0;
        var c = PALETTES.guirlande[k % PALETTES.guirlande.length];
        k += 1;
        ampoules += '<g transform="translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')">' +
          '<rect x="-1.5" y="-.5" width="3" height="3" rx=".6" fill="#3F4F41"/>' +
          '<g class="l" style="--d:' + hasard(1.6, 3.4).toFixed(2) + 's;--r:' + (-hasard(0, 3)).toFixed(2) + 's">' +
          '<circle class="h" cy="' + (ry + 2.4).toFixed(1) + '" r="' + (ry + 3.6).toFixed(1) + '" fill="' + c + '"/>' +
          '<ellipse cy="' + (ry + 2.4).toFixed(1) + '" rx="' + rx + '" ry="' + ry + '" fill="' + c + '"/></g></g>';
      }
    }
    b.innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" focusable="false">' +
      '<path d="' + fil + '" fill="none" stroke="#4C6650" stroke-opacity=".6" stroke-width="1.3"/>' + ampoules + '</svg>';
    h.appendChild(b);
    var lampes = [].slice.call(b.querySelectorAll('.l'));
    b.addEventListener('click', function (e) {
      var l = e.target && e.target.closest ? e.target.closest('.l') : null, i0 = lampes.indexOf(l);
      if (i0 < 0) { return; }
      var loin = 0;
      lampes.forEach(function (x, i) {
        var d = Math.abs(i - i0);
        loin = Math.max(loin, d);
        x.style.setProperty('--v', (d * 0.045).toFixed(3) + 's');
      });
      relancer(b, 'vague', loin * 45 + 1100);
      gerbe(e.clientX, e.clientY, [['etoile', 'guirlande']], 8);
    });
    /* écran agrandi ou téléphone tourné : on rallonge la guirlande */
    if (!guirlande.ecoute) {
      guirlande.ecoute = true;
      var minuterie;
      window.addEventListener('resize', function () {
        clearTimeout(minuterie);
        minuterie = setTimeout(function () {
          var g = document.querySelector('.deco-guirlande');
          var svg = g && g.querySelector('svg');
          if (svg && Number(svg.getAttribute('width')) < (window.innerWidth || 0) + 10) {
            g.parentNode.removeChild(g);
            guirlande(document);
          }
        }, 250);
      });
    }
  }

  var EFFETS = {
    guirlande: guirlande,
    soleil: soleil,
    muguet: muguet,
    cloches: cloches,
    lune: lune,
    coeurs: function (r) { particules(r, 'coeurs'); },
    neige: function (r) { particules(r, 'neige'); },
    petales: function (r) { particules(r, 'petales'); },
    feuilles: function (r) { particules(r, 'feuilles'); },
    paillettes: function (r) { particules(r, 'paillettes'); }
  };

  /* Photo de Caroline : un clic fait jaillir une gerbe aux couleurs du moment */
  function photo(root) {
    var p = root.querySelector('.hero-visual .arch') || root.querySelector('.page-hero .photo');
    if (!p || p.getAttribute('data-gerbe')) { return; }
    p.setAttribute('data-gerbe', '1');
    p.addEventListener('click', function (e) {
      var formes = [];
      actifs.forEach(function (a) { if (GERBES[a]) { formes.push(GERBES[a]); } });
      if (formes.length) { gerbe(e.clientX, e.clientY, formes, petitEcran() ? 12 : 16); }
    });
  }

  /* Pose les décorations du moment (et retire les précédentes : utile pour l'aperçu) */
  function decorer(root) {
    root = root || document;
    [].forEach.call(document.querySelectorAll('.deco, .deco-envol'), function (el) { el.parentNode.removeChild(el); });
    document.documentElement.className = document.documentElement.className.replace(/\s*\ba-[a-z]+\b/g, '');
    actifs = [];
    var conf = document.getElementById('decorations');
    if (!conf || !window.CR) { return; }
    var liste;
    try { liste = JSON.parse(conf.textContent); } catch (e) { return; }
    liste.forEach(function (a) {
      if (!window.CR.actif(a.du, a.au)) { return; }
      a.effets.forEach(function (e) { if (actifs.indexOf(e) < 0 && EFFETS[e]) { actifs.push(e); } });
    });
    if (!actifs.length) { return; }
    document.documentElement.classList.add('a-deco');
    actifs.forEach(function (e) { document.documentElement.classList.add('a-' + e); EFFETS[e](root); });
    photo(root);
  }

  window.CR_decorer = decorer;
  if (!window.__APERCU__) { decorer(document); }
})();
