/* ==========================================================================
   Caroline Roulleau – Décorations saisonnières
   Guirlande lumineuse, neige (en haut des pages ou sur tout le site),
   paillettes, pétales, muguet, soleil, feuilles d'automne, cœurs, notes de
   musique, cloche de Pâques, lune et étoiles, galette des rois, crêpe de la
   Chandeleur, poisson d'avril, glace de l'été, ardoise de la rentrée, calendrier de l'Avent.
   Les périodes se choisissent dans le CMS (« Annonces et décorations ») :
   ce fichier n'a pas besoin d'être modifié.

   Petites surprises au clic :
   - la galette des rois : on sert les parts une à une, jusqu'à trouver la fève ;
   - la crêpe de la Chandeleur : on la fait sauter ;
   - le poisson d'avril : il se décolle et s'enfuit ;
   - le muguet : jeu des 13 clochettes (un brin à 13 clochettes porte bonheur) ;
   - la cloche de Pâques : elle sonne et sème des œufs ;
   - la glace de l'été : une boule de plus à chaque clic, jusqu'à la cerise ;
   - la lune (Journée du sommeil) : elle s'endort ;
   - l'ardoise de la rentrée : elle écrit de bonnes résolutions et lance des avions en papier ;
   - le calendrier de l'Avent : chaque jour, une case s'ouvre sur un petit conseil bien-être ;
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
    oeufs: ['#E8A0AC', '#9FC3A0', '#EFCB66', '#A9B8E0', '#E9AE86', '#C7B0DD'],
    notes: ['#4C6650', '#C8734F', '#C99A3E', '#7D6A9E', '#5E8199'],
    pieces: ['#E9BE58'],
    poissons: ['#8FB7D0', '#B9D4E6', '#F0B49A', '#A8CFA8', '#F2D58A'],
    rentree: ['#FFFFFF']
  };
  /* nombre d'éléments sur grand écran (environ deux fois moins sur téléphone) */
  var NOMBRE = { neige: 28, petales: 20, feuilles: 12, paillettes: 22, coeurs: 14, etoiles: 18, notes: 14, flocons: 30 };
  /* forme et couleurs de la gerbe qui jaillit quand on clique sur la photo */
  var GERBES = {
    guirlande: ['etoile', 'guirlande'], neige: ['flocon', 'neige'], paillettes: ['etoile', 'paillettes'],
    petales: ['petale', 'petales'], feuilles: ['feuille', 'feuilles'], coeurs: ['coeur', 'coeurs'],
    soleil: ['etoile', 'soleil'], lune: ['etoile', 'etoiles'], muguet: ['clochette', 'neige'], cloches: ['oeuf', 'oeufs'],
    flocons: ['flocon', 'neige'], notes: ['croche', 'notes'], galette: ['etoile', 'paillettes'], crepe: ['piece', 'pieces'],
    poisson: ['poissonnet', 'poissons'], rentree: ['avion', 'rentree'], avent: ['etoile', 'guirlande'], glace: ['etoile', 'soleil']
  };
  /* pesanteur (px/s²) et freinage de l'air pour chaque forme */
  var PHYSIQUE = { flocon: [150, 0.985], etoile: [480, 0.975], petale: [170, 0.975], feuille: [190, 0.975],
                   coeur: [-140, 0.975], clochette: [420, 0.98], oeuf: [1300, 0.995], piece: [900, 0.99],
                   poissonnet: [240, 0.975], croche: [-120, 0.975], avion: [80, 0.99] };
  var actifs = [];   /* décorations du moment */

  function hasard(min, max) { return min + Math.random() * (max - min); }
  function choix(liste) { return liste[Math.floor(Math.random() * liste.length)]; }
  function petitEcran() { return (window.innerWidth || 1024) < 700; }
  function calme() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function zone(root) { return root.querySelector('.hero') || root.querySelector('.page-hero'); }
  function fr(t) { return String(t).replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0'); }
  function echappe(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
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
      } else if (type === 'notes') {
        s = hasard(16, 26); d = hasard(12, 20);
        if (i % 2) { classe += ' n2'; }
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

  /* Neige sur tout le site : quelques flocons légers qui tombent devant toute la page, sous l'en-tête.
     Rien chez les visiteurs qui demandent de réduire les animations (des flocons immobiles gêneraient la lecture). */
  function flocons(root) {
    if (calme()) { return; }
    var b = boite('flocons');
    var n = Math.round(NOMBRE.flocons * (petitEcran() ? 0.5 : 1)), html = '';
    for (var i = 0; i < n; i++) {
      var s = hasard(5, 11), d = hasard(13, 26), classe = 'p';
      if (i % 4 === 0) { classe += ' flocon'; s += 6; }
      html += '<span class="' + classe + '" style="--x:' + hasard(0, 98).toFixed(1) + '%;--s:' + s.toFixed(1) + 'px;' +
        '--d:' + d.toFixed(1) + 's;--r:' + (-hasard(0, d)).toFixed(1) + 's;--y:' + (-hasard(8, 92)).toFixed(0) + '%;' +
        '--a:' + hasard(8, 26).toFixed(0) + 'px;--t:' + hasard(10, 70).toFixed(0) + 'deg;--o:' + hasard(0.5, 0.9).toFixed(2) + '"><i></i></span>';
    }
    b.innerHTML = html;
    document.body.appendChild(b);   /* calque fixe : devant toute la page, quelle que soit la zone décorée */
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
      if (o.aligne) { r = Math.atan2(vy, vx) * 180 / Math.PI; }   /* le nez de l'avion suit sa trajectoire */
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
      var f = formes[i % formes.length], ph = PHYSIQUE[f[0]] || [400, 0.98], avion = f[0] === 'avion';
      var angle = hasard(-165, -15) * Math.PI / 180, v = hasard(150, 380) * (avion ? 1.3 : 1);
      envol(f[0], x, y, { couleur: choix(PALETTES[f[1]]), taille: hasard(11, 19) * (avion ? 1.5 : 1), vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        g: ph[0], frein: ph[1], vr: avion ? 0 : hasard(-260, 260), aligne: avion, duree: hasard(1200, 1800) * (avion ? 1.4 : 1) });
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
  function musique(x, y, n) {
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
      musique(p[0], p[1], 2);
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
      musique(haut[0], haut[1], 2);
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

  /* Galette des rois (janvier) : huit parts et une fève cachée. Chaque clic sert une part ;
     celle qui cache la fève couronne la reine ou le roi du jour, puis une nouvelle galette arrive. */
  var PARTS = 8;
  function polaire(a, r) {   /* point du disque de la galette (centre 85, 112), angle en degrés */
    var t = a * Math.PI / 180;
    return (85 + r * Math.cos(t)).toFixed(1) + ' ' + (112 + r * Math.sin(t)).toFixed(1);
  }

  function messageGalette(servies, reste) {
    if (servies === 1) { return 'Une part pour vous… Pas de fève ! Encore une ?'; }
    if (servies === 2) { return 'Toujours pas de fève… La prochaine sera peut-être la bonne !'; }
    if (reste === 1) { return 'Plus qu\'une part : la fève est forcément dedans !'; }
    return 'Pas de fève dans cette part. Plus que <b>' + reste + '</b> parts !';
  }

  function galette(root) {
    /* rosace dorée : 20 rayures en spirale, dessinées dans chaque part (et coupées à sa forme) pour des parts nettes */
    var rosace = '', parts = '', formes = '';
    for (var i = 0; i < 20; i++) {
      rosace += 'M' + polaire(i * 18, 5) + 'Q' + polaire(i * 18 + 8, 34) + ' ' + polaire(i * 18 + 40, 53);
    }
    for (var k = 0; k < PARTS; k++) {
      var a1 = -90 + 45 * k, m = (a1 + 22.5) * Math.PI / 180, bord = [];
      for (var j = 0; j <= 30; j++) {   /* bord festonné, débordant un peu sur les parts voisines pour éviter tout liseré */
        var a = a1 - 0.5 + 46 * j / 30;
        bord.push(polaire(a, 57 + 1.1 * Math.cos((a - a1) * 32 * Math.PI / 180)));
      }
      var d = 'M' + polaire(a1 + 202.5, 3) + 'L' + bord.join('L') + 'Z';   /* départ juste derrière le centre : pas de liseré au milieu */
      formes += '<clipPath id="deco-galette-c' + k + '"><path d="' + d + '"/></clipPath>';
      parts += '<g class="part" style="--dx:' + (Math.cos(m) * 34).toFixed(1) + 'px;--dy:' + (Math.sin(m) * 34).toFixed(1) + 'px">' +
        '<g clip-path="url(#deco-galette-c' + k + ')"><path d="' + d + '" fill="url(#deco-galette-g)"/>' +
        '<circle cx="85" cy="112" r="53.5" fill="none" stroke="#C27F35" stroke-opacity=".5" stroke-width="6"/>' +
        '<path d="' + rosace + '" fill="none" stroke="#A3672A" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/></g></g>';
    }
    var dessin = '<svg viewBox="0 0 170 190" focusable="false" aria-hidden="true"><defs>' +
      '<radialGradient id="deco-galette-g" gradientUnits="userSpaceOnUse" cx="78" cy="102" r="66"><stop offset="0" stop-color="#F9DE93"/>' +
      '<stop offset=".55" stop-color="#EEBB5E"/><stop offset=".85" stop-color="#DB9C47"/><stop offset="1" stop-color="#C4823A"/></radialGradient>' +
      '<linearGradient id="deco-couronne-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8DD8C"/><stop offset="1" stop-color="#DCA640"/></linearGradient>' +
      formes + '</defs>' +
      '<circle cx="85" cy="112" r="74" fill="#FBF7EF" stroke="#E0D4BF" stroke-width="1.6"/>' +
      '<circle cx="85" cy="112" r="65" fill="none" stroke="#EEE4D3" stroke-width="1.3"/>' +
      '<g class="feve" transform="translate(85 82)"><path d="M0-10.5 3.2-3.3 10.6-3 4.8 1.7 6.7 9 0 4.9-6.7 9-4.8 1.7-10.6-3-3.2-3.3Z" fill="#FBE3A0" stroke="#B5862C" stroke-width="1.4" stroke-linejoin="round"/></g>' +
      '<g class="gateau">' + parts + '</g>' +
      '<g transform="rotate(-7 85 30)"><g class="couronne">' +
      '<path d="M54 50V26L62 36L70 16L78 34L85 10L92 34L100 16L108 36L116 26V50Z" fill="url(#deco-couronne-g)" stroke="#B5862C" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<path d="M54 41H116" stroke="#C99A3E" stroke-width="1.2" opacity=".7"/>' +
      '<circle cx="70" cy="16" r="2.6" fill="#F8DD8C" stroke="#B5862C"/><circle cx="85" cy="10" r="2.8" fill="#F8DD8C" stroke="#B5862C"/>' +
      '<circle cx="100" cy="16" r="2.6" fill="#F8DD8C" stroke="#B5862C"/>' +
      '<circle cx="66" cy="45.5" r="2.7" fill="#C8734F"/><circle cx="85" cy="45.5" r="3.1" fill="#6E8F72"/><circle cx="104" cy="45.5" r="2.7" fill="#D9777F"/></g></g></svg>';
    var o = objet(root, 'galette', dessin, 'Servir une part de galette des rois (petit jeu)');
    if (!o) { return; }
    var partsEl = [].slice.call(o.boite.querySelectorAll('.part')), feveEl = o.boite.querySelector('.feve'), jeu;
    function nouvellePartie() {
      partsEl.forEach(function (x) { x.classList.remove('servie'); });
      o.boite.classList.remove('gagne');
      jeu = { depart: Math.floor(Math.random() * PARTS), servies: 0, feve: Math.floor(Math.random() * PARTS), fini: false };
      var m = (-90 + 45 * jeu.feve + 22.5) * Math.PI / 180;
      feveEl.setAttribute('transform', 'translate(' + (85 + 31 * Math.cos(m)).toFixed(1) + ' ' + (112 + 31 * Math.sin(m)).toFixed(1) + ')');
    }
    nouvellePartie();
    o.jeu = function () { return jeu; };   /* pour les tests */
    indice(o, 'galette', 'Psst… tirez les rois !');
    o.bouton.addEventListener('click', function () {
      o.clics += 1;
      if (jeu.fini) { relancer(o.boite, 'sonne', 900); return; }   /* pendant la fête : la couronne brille */
      var k = (jeu.depart + jeu.servies) % PARTS;
      jeu.servies += 1;
      partsEl[k].classList.add('servie');
      if (k !== jeu.feve) {
        dire(o, messageGalette(jeu.servies, PARTS - jeu.servies));
        return;
      }
      jeu.fini = true;
      o.boite.classList.add('gagne');
      var p = point(feveEl, 0.5, 0.5);
      gerbe(p[0], p[1], [['etoile', 'paillettes']], petitEcran() ? 12 : 18);
      dire(o, '<b>La fève !</b> Bravo, vous voilà reine ou roi du jour. Très belle année !', 7000);
      setTimeout(nouvellePartie, 7000);
    });
  }

  /* Crêpe de la Chandeleur : à chaque clic, elle saute et retombe dans la poêle. */
  function messageCrepe(n) {
    if (n === 1) { return 'Hop ! Elle retombe dans la poêle : selon la tradition, chance et prospérité pour toute l\'année !'; }
    if (n === 2) { return 'Et de deux ! Vous avez le coup de main.'; }
    if (n === 3) { return 'Trois crêpes ! La tradition veut qu\'on les fasse sauter une pièce dans l\'autre main : voici les vôtres.'; }
    return '<b>' + n + '</b> crêpes sautées. Bonne Chandeleur !';
  }

  function crepe(root) {
    var dessin = '<svg viewBox="0 0 176 128" focusable="false" aria-hidden="true"><defs>' +
      '<linearGradient id="deco-crepe-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7DC93"/><stop offset="1" stop-color="#DDA751"/></linearGradient>' +
      '<linearGradient id="deco-poele-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4541"/><stop offset="1" stop-color="#2B2725"/></linearGradient></defs>' +
      '<g class="vapeur" fill="none" stroke="#B8AFA4" stroke-width="2" stroke-linecap="round"><path d="M64 60c-5-6 5-9 0-16"/><path d="M94 58c-5-6 5-9 0-16"/></g>' +
      '<g class="poele"><path d="M127 80 168 68c3.6-1 6 1 6 4s-1.6 4.6-4.4 5.4L131 88z" fill="#80593A"/>' +
      '<path d="M126 79.6 135.4 77l2.6 8.8-8.6 2.6z" fill="#8C8580"/>' +
      '<path d="M22 80c1 15 13 25 30 26h54c17-1 29-11 30-26z" fill="url(#deco-poele-g)"/>' +
      '<ellipse cx="79" cy="80" rx="57" ry="13.5" fill="#57514C"/><ellipse cx="79" cy="81" rx="50.5" ry="10.5" fill="#2E2A27"/></g>' +
      '<g class="crepe"><ellipse cx="79" cy="77" rx="43" ry="8.6" fill="url(#deco-crepe-g)" stroke="#C99248" stroke-width=".9"/>' +
      '<g fill="#C4863B" fill-opacity=".5"><ellipse cx="62" cy="76" rx="3.4" ry="1.4"/><ellipse cx="96" cy="78" rx="3.4" ry="1.4"/>' +
      '<ellipse cx="74" cy="79.5" rx="2.2" ry="1"/><ellipse cx="84" cy="74.5" rx="2.2" ry="1"/>' +
      '<ellipse cx="50" cy="78.5" rx="1.8" ry=".8"/><ellipse cx="108" cy="75.5" rx="1.8" ry=".8"/></g></g></svg>';
    var o = objet(root, 'crepe', dessin, 'Faire sauter la crêpe (petit jeu de la Chandeleur)');
    if (!o) { return; }
    var enVol = false;
    o.sauts = 0;
    indice(o, 'crepe', 'Psst… faites sauter la crêpe !');
    o.bouton.addEventListener('click', function () {
      if (enVol) { return; }
      enVol = true;
      o.clics += 1;
      relancer(o.boite, 'saute', 1000);
      setTimeout(function () {   /* atterrissage */
        enVol = false;
        o.sauts += 1;
        dire(o, messageCrepe(o.sauts));
        if (o.sauts === 3 || o.sauts % 10 === 0) {
          var p = point(o.bouton, 0.45, 0.55);
          gerbe(p[0], p[1], [['piece', 'pieces']], petitEcran() ? 8 : 12);
        }
      }, calme() ? 0 : 950);
    });
  }

  /* Poisson d'avril (1er avril) : un poisson en papier collé au bord de la photo. Au clic, il se décolle et s'enfuit. */
  function poisson(root) {
    var dessin = '<svg viewBox="0 0 96 62" focusable="false" aria-hidden="true"><g class="corps">' +
      '<path class="queue" d="M66 31 86 14l-4 17 5 17z" fill="#9CC0D6" stroke="#5E8199" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M36 17l8-9 5 10z" fill="#9CC0D6" stroke="#5E8199" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M8 31c8-15 33-22 55-9 3 2 5 5.6 6 9-1 3.4-3 7-6 9-22 13-47 6-55-9z" fill="#BCD7E8" stroke="#5E8199" stroke-width="1.6"/>' +
      '<path d="M30 22q5 9 0 18M41 20q5 11 0 22M52 21q5 10 0 20" fill="none" stroke="#7FA2BA" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="20" cy="28" r="2.8" fill="#2F2B26"/><circle cx="19.2" cy="27.1" r=".9" fill="#fff"/>' +
      '<path d="M10.5 34q3 1.6 6 .4" fill="none" stroke="#5E8199" stroke-width="1.2" stroke-linecap="round"/></g>' +
      '<g transform="rotate(9 49 8)"><rect class="scotch" x="34" y="3" width="30" height="11" rx="1" fill="#F3EAD2" fill-opacity=".88" stroke="#DCCDAA" stroke-width=".7"/></g></svg>';
    var o = objet(root, 'poisson', dessin, 'Décoller le poisson en papier');
    if (!o) { return; }
    o.bouton.addEventListener('click', function () {
      if (o.parti) { return; }
      o.parti = true;
      o.clics += 1;
      o.boite.classList.add('nage');
      dire(o, '<b>Poisson d\'avril !</b> Il était accroché là depuis ce matin…', 5000);
      setTimeout(function () { o.boite.classList.add('parti'); o.bouton.disabled = true; }, calme() ? 0 : 2600);
    });
  }

  /* Ardoise de la rentrée : elle écrit de bonnes résolutions à la craie et lance un avion en papier à chaque clic. */
  var RESOLUTIONS = [['Bonne rentrée !'], ['Je prends du temps', 'pour moi'], ['Je respire'], ['J\'ose !'], ['Je crois', 'en moi'],
                     ['Je dors mieux'], ['Je souris']];

  function rentree(root) {
    var dessin = '<svg viewBox="0 0 180 146" focusable="false" aria-hidden="true"><defs>' +
      '<linearGradient id="deco-bois-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DDB277"/><stop offset="1" stop-color="#B5804A"/></linearGradient>' +
      '<radialGradient id="deco-ardoise-g" cx=".45" cy=".4" r=".75"><stop offset="0" stop-color="#4A5A52"/><stop offset="1" stop-color="#2F3B35"/></radialGradient>' +
      '<filter id="deco-craie-f" x="-5%" y="-30%" width="110%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" result="b"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="b" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter></defs>' +
      '<rect x="3" y="12" width="174" height="128" rx="10" fill="url(#deco-bois-g)" stroke="#9C6C3B" stroke-width="1.2"/>' +
      '<rect x="13" y="22" width="154" height="108" rx="4" fill="url(#deco-ardoise-g)"/>' +
      '<path d="M13 49H167M13 76H167M13 103H167" stroke="#C9776A" stroke-opacity=".22" stroke-width="1"/>' +
      '<path d="M30 117c22-5 48-3 72 1" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="9" stroke-linecap="round"/>' +
      '<text class="craie" x="90" y="80" text-anchor="middle" filter="url(#deco-craie-f)"></text>' +
      '<rect x="118" y="128" width="22" height="6" rx="2.5" fill="#F8F6EF" stroke="#D8D2C2" stroke-width=".7" transform="rotate(-4 129 131)"/></svg>';
    var o = objet(root, 'rentree', dessin, 'Écrire sur l\'ardoise (bonnes résolutions de rentrée)');
    if (!o) { return; }
    var texte = o.boite.querySelector('.craie'), minuterie;
    o.phrase = 0;
    function ecrire(lignes, instant) {
      clearTimeout(minuterie);
      lignes = lignes.map(fr);
      texte.setAttribute('class', 'craie' + (lignes.some(function (l) { return l.length > 13; }) ? ' longue' : ''));
      var total = lignes.join('').length, k = instant || calme() ? total : 0;
      (function suite() {
        var reste = k, html = '';
        lignes.forEach(function (l, i) {
          html += '<tspan x="90" dy="' + (i ? 24 : (lignes.length - 1) * -12) + '">' + echappe(l.slice(0, Math.max(0, reste))) + '</tspan>';
          reste -= l.length;
        });
        texte.innerHTML = html;
        if (k < total) { k += 1; minuterie = setTimeout(suite, 55); }
      })();
    }
    ecrire(RESOLUTIONS[0], true);
    o.bouton.addEventListener('click', function () {
      o.clics += 1;
      o.phrase = (o.phrase + 1) % RESOLUTIONS.length;
      relancer(o.boite, 'efface', 450);
      var phrase = RESOLUTIONS[o.phrase];
      minuterie = setTimeout(function () { ecrire(phrase); }, calme() ? 0 : 320);
      var p = point(o.bouton, 0.15, 0.2);
      envol('avion', p[0], p[1], { taille: 30, vx: hasard(-340, -250), vy: hasard(-170, -100), g: 80, frein: 0.996,
        aligne: true, duree: 3400, fondu: 0.8 });
      if (o.phrase === 0) { dire(o, 'Et vous, quelle est votre bonne résolution de rentrée ?', 5500); }
      else if (o.clics === 1) { dire(o, 'Mes bonnes résolutions de rentrée…', 3000); }
    });
  }

  /* Calendrier de l'Avent (1er – 24 décembre) : un paquet cadeau qui porte le numéro du jour.
     Ouvert, il offre le petit conseil bien-être du jour (textes modifiables dans le CMS). */
  function conseilsAvent() {
    var c = document.getElementById('conseils-avent');
    try { return c ? JSON.parse(c.textContent) : []; } catch (e) { return []; }
  }

  function texteAvent(n, conseils) {
    if (!n) { return '<b>Joyeuses fêtes !</b> Prenez bien soin de vous.'; }
    var c = conseils.length ? conseils[(n - 1) % conseils.length] : '';
    return '<b>' + n + (n === 1 ? '<sup>er</sup>' : '') + ' décembre</b> · ' + (c ? 'Le conseil du jour : ' + echappe(c) : 'Belle journée à vous !');
  }

  function avent(root) {
    var jour = window.CR.jour, n = Math.floor(jour / 100) === 12 && jour % 100 <= 24 ? jour % 100 : 0;
    var etoiles = '';
    [[38, 96], [100, 94], [44, 128], [96, 132], [33, 112], [106, 115]].forEach(function (e) {
      etoiles += '<path transform="translate(' + e[0] + ' ' + e[1] + ') scale(.55)" d="M0-7 1.9-2.3 7-2 3.1 1.2 4.3 6.3 0 3.4-4.3 6.3-3.1 1.2-7-2-1.9-2.3Z"/>';
    });
    var dessin = '<svg viewBox="0 0 140 156" focusable="false" aria-hidden="true"><defs>' +
      '<linearGradient id="deco-avent-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#62806A"/><stop offset="1" stop-color="#4A644F"/></linearGradient>' +
      '<radialGradient id="deco-avent-l"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse class="lueur" cx="70" cy="76" rx="60" ry="36" fill="url(#deco-avent-l)"/>' +
      '<rect x="22" y="76" width="96" height="74" rx="6" fill="url(#deco-avent-g)"/>' +
      '<g fill="#F6F1EA" fill-opacity=".38">' + etoiles + '</g>' +
      '<rect x="63" y="76" width="14" height="74" fill="#C8734F"/><rect x="63" y="76" width="4" height="74" fill="#DD9370" opacity=".7"/>' +
      '<g class="couvercle"><rect x="16" y="60" width="108" height="20" rx="5" fill="#6C8B71"/>' +
      '<rect x="63" y="60" width="14" height="20" fill="#C8734F"/>' +
      '<path d="M70 60c-6-16-28-22-28-8 0 7 14 9 28 8zM70 60c6-16 28-22 28-8 0 7-14 9-28 8z" fill="#D07B56" stroke="#A85C3E" stroke-width="1.2"/>' +
      '<circle cx="70" cy="60" r="5" fill="#A85C3E"/>' +
      '<path d="M75 57c10-6 17-12 23-18" fill="none" stroke="#94533A" stroke-width="1.2"/>' +
      '<circle cx="106" cy="30" r="15" fill="#FBF3DC" stroke="#C99A3E" stroke-width="1.5"/>' +
      '<text class="jour" x="106" y="35.5" text-anchor="middle">' + (n || '\u2605') + '</text></g></svg>';
    var o = objet(root, 'avent', dessin, n ? 'Ouvrir la case du ' + n + (n === 1 ? 'er' : '') + ' décembre (calendrier de l\'Avent)' : 'Ouvrir le cadeau');
    if (!o) { return; }
    indice(o, 'avent', n ? 'Psst… ouvrez la case du jour !' : 'Psst… ouvrez le cadeau !');
    o.bouton.addEventListener('click', function () {
      o.clics += 1;
      var ouvert = o.boite.classList.toggle('ouvert');
      if (!ouvert) {
        dire(o, n && n < 24 ? 'À demain pour un nouveau conseil !' : 'Joyeuses fêtes !', 3500);
        return;
      }
      var p = point(o.bouton, 0.5, 0.45);
      gerbe(p[0], p[1], [['etoile', 'guirlande']], petitEcran() ? 8 : 12);
      dire(o, texteAvent(n, conseilsAvent()), 12000);
    });
  }

  /* Glace de l'été : une boule pour commencer ; chaque clic en ajoute une, jusqu'à cinq et la cerise… puis une nouvelle glace. */
  var BOULES = [['#FBF0D2', '#E2CC92'], ['#F6B8C1', '#DC8796'], ['#CFE3AE', '#9EBE74'], ['#F5C88A', '#DA9A4F'], ['#A87557', '#7D513A']];
  var MESSAGES_GLACE = ['Une nouvelle glace ? Avec plaisir !', 'Une boule de fraise en plus ?', 'Et une de pistache !', 'Un peu d\'abricot…',
                        'Et du chocolat, avec sa cerise ! Bel été : savourez chaque instant.'];

  function glace(root) {
    var boules = '';
    BOULES.forEach(function (b, i) {
      boules += '<g transform="translate(50 ' + (124 - i * 21) + ')"><g class="boule' + (i ? '' : ' posee') + '">' +
        '<path d="M-22 5c-3-18 8-29 22-29s25 11 22 29c-2 4-6 1-8 4s-6 4-8 0-6-2-7 1-6 3-7-1-5-2-7-1-6-1-7-3z" fill="' + b[0] + '" stroke="' + b[1] + '" stroke-width="1.4"/>' +
        '<path d="M-12-13c3-4 8-6 13-6" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2.6" stroke-linecap="round"/></g></g>';
    });
    var dessin = '<svg viewBox="0 0 100 196" focusable="false" aria-hidden="true">' +
      '<path d="M27 128 50 192 73 128z" fill="#E3B26A" stroke="#BF8840" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M33 128l29 40M43 128l24 33M53 128l18 25M67 128l-29 40M57 128l-24 33M47 128l-18 25" stroke="#BF8840" stroke-opacity=".6" stroke-width="1.2"/>' +
      boules +
      '<g class="cerise"><path d="M51 17c1-7 4-11 9-13" fill="none" stroke="#6B8B58" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="50" cy="22" r="7" fill="#C8434A"/><circle cx="47.6" cy="19.6" r="2" fill="#fff" fill-opacity=".6"/></g></svg>';
    var o = objet(root, 'glace', dessin, 'Ajouter une boule de glace (petit jeu)');
    if (!o) { return; }
    var boulesEl = [].slice.call(o.boite.querySelectorAll('.boule'));
    o.boules = 1;
    indice(o, 'glace', 'Psst… une boule de plus ?');
    o.bouton.addEventListener('click', function () {
      o.clics += 1;
      if (o.boules >= BOULES.length) {   /* nouvelle glace */
        boulesEl.forEach(function (b, i) { if (i) { b.classList.remove('posee'); } });
        o.boite.classList.remove('complete');
        o.boules = 1;
        dire(o, MESSAGES_GLACE[0]);
        return;
      }
      var b = boulesEl[o.boules];
      o.boules += 1;
      b.classList.add('posee');
      relancer(b, 'plop', 600);
      dire(o, MESSAGES_GLACE[o.boules - 1], o.boules === BOULES.length ? 6500 : 4500);
      if (o.boules === BOULES.length) {
        o.boite.classList.add('complete');
        var p = point(o.bouton, 0.5, 0.1);
        gerbe(p[0], p[1], [['etoile', 'soleil']], petitEcran() ? 10 : 14);
      }
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
    galette: galette,
    crepe: crepe,
    poisson: poisson,
    rentree: rentree,
    avent: avent,
    glace: glace,
    flocons: flocons,
    notes: function (r) { particules(r, 'notes'); },
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
