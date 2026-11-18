/* ==========================================================================
   Caroline Roulleau – Hypnothérapeute · Petits scripts du site
   1. Menu mobile   2. Ombre de l'en-tête   3. Apparitions au défilement
   4. Exercice de respiration   5. Formulaire de contact   6. Badge à retourner
   7. Mode nuit   8. Vrai ou faux   9. Calculateur tabac   10. Surprise cachée
   11. Bon cadeau   12. Plan d'accès
   Le site reste lisible et utilisable même si ce fichier ne se charge pas.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL = 'hypnose.roulleau@gmail.com';
  var TELEPHONE = '07 69 85 06 19';
  var escapeBound = false;
  var revealObserver = null;

  /* Éléments qui apparaissent en douceur quand on les fait défiler à l'écran */
  var REVEAL = [
    '.sec .wrap > .eyebrow', '.sec .wrap > .h2', '.sec .wrap > .lead2', '.sec .wrap > .note',
    '.sec .wrap > .disclaimer', '.sec .wrap > .link-more', '.wrap > .callout', '.band .wrap > *',
    '.intro-grid > *', '.about-grid > *', '.breathe-grid > *', '.contact-grid > *',
    '.cards > li', '.steps > li', '.methods > li', '.facts > *', '.timeline > li',
    '.faq-list > details', '.more-group', '.cta-box', '.avis-head > *', '.avis-scroll', '.avis-note',
    '.encart-seul > *', '.vf-liste > li', '.themes-cartes > li', '.calc-grid > *', '.calc-sante', '.plan-grid > *',
    '.theme-grid > *', '.zoom'
  ].join(',');

  function reduceMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function initSite(root) {
    root = root || document;

    /* 0. Filet de sécurité : si un petit script de la page n'a pas pu s'exécuter, on affiche quand même
          les bandeaux et encarts du moment, et l'année en cours dans le pied de page. */
    if (window.CR) {
      [].forEach.call(root.querySelectorAll('[data-affiche-du][hidden]'), window.CR.montrer);
      window.CR.dater(root.querySelector('.foot-bottom'));
    }

    /* 1. Menu mobile ------------------------------------------------------ */
    var header = root.querySelector('.site-header');
    var burger = root.querySelector('.burger');
    if (header && burger) {
      var setMenu = function (open) {
        header.classList.toggle('nav-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      };
      burger.addEventListener('click', function () {
        setMenu(!header.classList.contains('nav-open'));
      });
      [].forEach.call(header.querySelectorAll('.nav a'), function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
      if (!escapeBound) {
        escapeBound = true;
        document.addEventListener('keydown', function (e) {
          var h = document.querySelector('.site-header.nav-open');
          if (e.key === 'Escape' && h) {
            h.classList.remove('nav-open');
            var b = h.querySelector('.burger');
            if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
          }
        });
      }
    }

    /* 2. Ombre légère sous l'en-tête dès que l'on fait défiler la page ----- */
    if (header && 'IntersectionObserver' in window) {
      var sentinel = document.createElement('div');
      sentinel.className = 'haut-de-page';
      sentinel.setAttribute('aria-hidden', 'true');
      header.parentNode.insertBefore(sentinel, header);
      new IntersectionObserver(function (entries) {
        header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
      }).observe(sentinel);
    }

    /* 3. Apparitions au défilement ----------------------------------------
       Seuls les éléments encore hors de l'écran sont concernés : rien de ce
       qui est déjà visible ne disparaît. Désactivé si l'appareil demande
       de réduire les animations. */
    if ('IntersectionObserver' in window && !reduceMotion()) {
      if (revealObserver) { revealObserver.disconnect(); }
      var limit = (window.innerHeight || document.documentElement.clientHeight) * 0.92;
      var items = [].slice.call(root.querySelectorAll(REVEAL));
      var below = items.filter(function (el) { return el.getBoundingClientRect().top > limit; });
      below.forEach(function (el) { el.classList.add('rv'); });
      document.documentElement.classList.add('reveal-on');
      revealObserver = new IntersectionObserver(function (entries, obs) {
        var n = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          entry.target.style.animationDelay = (Math.min(n, 5) * 90) + 'ms';   /* effet « en cascade » */
          n += 1;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      below.forEach(function (el) { revealObserver.observe(el); });
    }

    /* 4. Exercice de respiration (cohérence cardiaque : 1, 3 ou 5 minutes) - */
    var breathe = root.querySelector('[data-breathe]');
    if (breathe) { respiration(breathe); }

    /* 5. Formulaire de contact -------------------------------------------- */
    var form = root.querySelector('[data-contact-form]');
    if (form) {
      var status = form.querySelector('.form-status');
      var email = form.getAttribute('data-email') || EMAIL;          /* réglés dans le CMS (Infos pratiques) */
      var telephone = form.getAttribute('data-telephone') || TELEPHONE;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = new FormData(form);
        if (data.get('_gotcha')) { return; }               /* robot détecté */
        var action = form.getAttribute('action') || '';

        /* Tant que le formulaire n'est pas relié à Formspree (action « mailto: »),
           on ouvre la messagerie de l'internaute avec le message déjà rédigé. */
        if (action.indexOf('mailto:') === 0) {
          var nom = data.get('nom') || '';
          var dispos = data.get('disponibilites') || '';
          var corps = (data.get('message') || '') +
                      (dispos ? '\n\nMes disponibilités : ' + dispos : '') +
                      '\n\n' + nom + '\n' + (data.get('email') || '') + '\n' + (data.get('telephone') || '');
          window.location.href = 'mailto:' + email +
            '?subject=' + encodeURIComponent('Demande de rendez-vous – ' + nom) +
            '&body=' + encodeURIComponent(corps);
          status.textContent = 'Votre messagerie s’ouvre avec votre message prêt à envoyer.';
          return;
        }

        /* Envoi direct via Formspree */
        var submit = form.querySelector('[type="submit"]');
        submit.disabled = true;
        status.textContent = 'Envoi en cours…';
        fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) { throw new Error(String(r.status)); }
            form.reset();
            status.textContent = 'Merci, votre message a bien été envoyé ! Je vous réponds rapidement.';
          })
          .catch(function () {
            status.textContent = "L'envoi n'a pas fonctionné. Appelez-moi au " + telephone +
                                 ' ou écrivez à ' + email + '.';
          })
          .then(function () { submit.disabled = false; });
      });
    }

    /* 6. Badge à retourner (image des encarts d'annonce, page d'accueil) -- */
    [].forEach.call(root.querySelectorAll('[data-badge]'), badge);

    /* 7. Mode nuit (bouton lune / soleil de l'en-tête) --------------------- */
    [].forEach.call(root.querySelectorAll('.theme-btn'), function (btn) {
      majBoutonTheme(btn);
      btn.addEventListener('click', function () {
        var r = btn.getBoundingClientRect();
        basculerTheme(document.documentElement.getAttribute('data-theme') !== 'sombre', r.left + r.width / 2, r.top + r.height / 2);
      });
    });

    /* 8. « Vrai ou faux ? » (page d'accueil) ------------------------------- */
    [].forEach.call(root.querySelectorAll('[data-vrai-faux]'), vraiFaux);

    /* 9. Calculateur d'économies (page « Arrêt du tabac ») ------------------ */
    [].forEach.call(root.querySelectorAll('[data-calc-tabac]'), calculateur);

    /* 10. Petite surprise cachée : 5 clics sur le logo du pied de page ------ */
    surprise(root);

    /* 11. Bon cadeau : le lien remplit le début du message du formulaire --- */
    [].forEach.call(root.querySelectorAll('[data-cadeau]'), function (a) {
      a.addEventListener('click', function () { preRemplir(root, a.getAttribute('data-cadeau')); });
      if (/[?&]objet=bon-cadeau\b/.test(window.location.search)) { preRemplir(root, a.getAttribute('data-cadeau')); }
    });

    /* 12. Plan d'accès : la station survolée dans la liste ressort sur le plan */
    [].forEach.call(root.querySelectorAll('.plan'), planAcces);
  }

  /* Comme une récompense de montre connectée : l'image fait un tour complet quand elle
     apparaît à l'écran, puis se retourne d'un clic, d'une touche ou d'un glissé du doigt,
     pour montrer le texte gravé au dos (réglé dans le CMS : encart, « Texte au dos »).
     Visiteurs qui demandent de réduire les animations : pas de tour, la face change d'un clic. */
  function badge(b) {
    var carte = b.querySelector('.badge-carte'), dos = b.querySelector('.badge-dos');
    if (!carte || !dos || b.classList.contains('badge-on')) { return; }
    var calme = reduceMotion();
    var image = window.requestAnimationFrame ? function (f) { window.requestAnimationFrame(f); }
      : function (f) { setTimeout(function () { f(Date.now()); }, 16); };

    var bouton = document.createElement('button');
    bouton.setAttribute('type', 'button');
    bouton.className = 'badge-bouton';
    bouton.setAttribute('aria-label', "Retourner l'image");
    bouton.setAttribute('aria-pressed', 'false');
    bouton.setAttribute('title', "Retournez l'image !");
    b.appendChild(bouton);
    var reflet = document.createElement('span');
    reflet.className = 'badge-reflet';
    carte.appendChild(reflet);
    for (var k = 0, N = 9; k < N; k++) {   /* tranche dorée, plus foncée au milieu */
      var couche = document.createElement('i'), z = (k + 0.5) / N - 0.5, f = 1 - Math.abs(z) * 2;
      couche.className = 'badge-couche';
      couche.setAttribute('style', '--k:' + z.toFixed(3) + ';background:rgb(' +
        Math.round(222 - 76 * f) + ',' + Math.round(190 - 74 * f) + ',' + Math.round(118 - 62 * f) + ')');
      carte.appendChild(couche);
    }
    dos.hidden = false;
    b.classList.add('badge-on');
    function ajuster() {   /* texte un peu long (saisi dans le CMS) : il est réduit juste ce qu'il faut pour tenir au dos */
      var t = 1;
      dos.style.removeProperty('--t');
      while (dos.scrollHeight > dos.clientHeight + 1 && t > 0.55) { t -= 0.05; dos.style.setProperty('--t', t.toFixed(2)); }
    }
    ajuster();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(ajuster); }
    var reajuster = null;
    window.addEventListener('resize', function () { clearTimeout(reajuster); reajuster = setTimeout(ajuster, 200); });

    /* angle en degrés (0 = image, 180 = dos), vitesse en degrés par seconde ; un ressort ramène l'angle vers la cible */
    var angle = 0, vitesse = 0, cible = 0, raideur = 80, amorti = 0.74, rx = 0, rxCible = 0, ry = 0, ryCible = 0;
    var anime = false, avant = 0, glisse = null, doigt = 0, sansClic = false, touche = false, eclat = null;

    function face() { return ((Math.round(cible / 180) % 2) + 2) % 2; }
    function poser() {
      var a = angle + ry, s = Math.sin(a * Math.PI / 180);
      carte.style.setProperty('--ry', a.toFixed(2) + 'deg');
      carte.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      carte.style.setProperty('--bx', (50 + s * 60).toFixed(1) + '%');
      carte.style.setProperty('--brille', Math.min(1, Math.abs(s) * 1.5 + (Math.abs(rx) + Math.abs(ry)) / 30).toFixed(2));
    }
    function briller() {   /* l'or du dos scintille une fois */
      b.classList.remove('badge-brille');
      void b.offsetWidth;
      b.classList.add('badge-brille');
      clearTimeout(eclat);
      eclat = setTimeout(function () { b.classList.remove('badge-brille'); }, 2000);
    }
    function repos() {   /* à plat, net, sur la face d'arrivée */
      var envers = face() === 1;
      angle = cible = envers ? 180 : 0;
      vitesse = 0;
      poser();
      b.classList.remove('badge-3d');
      b.classList.toggle('badge-envers', envers);
      bouton.setAttribute('aria-pressed', String(envers));
      if (envers) { briller(); }
    }
    function etape(t) {
      t = typeof t === 'number' ? t : Date.now();
      var dt = avant ? Math.min(0.034, Math.max(0.001, (t - avant) / 1000)) : 0.016;
      avant = t;
      var tenu = glisse && glisse.bouge;
      if (tenu) {   /* il suit le doigt, avec un soupçon d'inertie : pas d'à-coups */
        angle += (doigt - angle) * (1 - Math.exp(-dt / 0.025));
      } else {   /* ressort : la pièce ralentit et se pose sur une face */
        vitesse += (-raideur * (angle - cible) - 2 * Math.sqrt(raideur) * amorti * vitesse) * dt;
        angle += vitesse * dt;
      }
      var suivre = Math.min(1, dt * 10);
      rx += (rxCible - rx) * suivre;
      ry += (ryCible - ry) * suivre;
      poser();
      if (tenu || Math.abs(angle - cible) > 0.1 || Math.abs(vitesse) > 3 || Math.abs(rx - rxCible) > 0.05 || Math.abs(ry - ryCible) > 0.05) {
        image(etape);
        return;
      }
      anime = false;
      angle = cible; vitesse = 0; rx = rxCible; ry = ryCible;
      if (rx || ry) { poser(); return; }   /* la souris est encore dessus : il reste un peu incliné */
      repos();
    }
    function demarrer() {
      b.classList.add('badge-3d');
      if (!anime) { anime = true; avant = 0; image(etape); }
    }
    function retourner() {
      touche = true;
      cible = Math.round(cible / 180) * 180 + 180;
      if (calme) { repos(); return; }
      raideur = 60;
      amorti = 0.74;
      vitesse += 220;
      demarrer();
    }
    function tourner() {   /* le tour complet de bienvenue */
      if (touche || calme) { return; }
      raideur = 22;
      amorti = 0.74;
      cible += 360;
      vitesse += 130;
      demarrer();
    }

    bouton.addEventListener('click', function () {
      if (sansClic) { sansClic = false; return; }   /* fin d'un glissé à la souris : ce n'était pas un clic */
      retourner();
    });
    if (calme) { return; }

    /* Au doigt ou à la souris, comme une médaille de montre connectée : faire glisser l'image sur toute sa largeur
       la fait tourner d'un demi-tour (le bord suit le doigt). La largeur est celle du cadre, qui ne change pas :
       celle de l'image qui tourne rétrécit quand on la voit de profil (c'est ce qui la faisait s'emballer). */
    var DEMI_TOUR_PAR_LARGEUR = 180, ELAN_MAX = 1100;
    function elan(g, fin) {   /* vitesse du doigt sur ses 100 dernières millisecondes (0 s'il s'était arrêté avant de lâcher) */
      var p = g.pts, n = p.length, i = n - 1;
      if (n < 2 || fin - p[n - 1][0] > 80) { return 0; }
      while (i > 0 && p[n - 1][0] - p[i - 1][0] <= 100) { i--; }
      if (i === n - 1) { i--; }
      var dt = (p[n - 1][0] - p[i][0]) / 1000;
      return dt > 0 ? (p[n - 1][1] - p[i][1]) / dt : 0;
    }
    bouton.addEventListener('pointerdown', function (e) {
      if (glisse && glisse.bouge && e.pointerId !== glisse.id) { return; }   /* un deuxième doigt : on garde le premier */
      sansClic = false;
      if (e.button) { return; }
      glisse = { id: e.pointerId, x: e.clientX, y: e.clientY, a: 0, k: DEMI_TOUR_PAR_LARGEUR / (b.offsetWidth || 300), bouge: false, hors: false, pts: [] };
      if (bouton.setPointerCapture) { try { bouton.setPointerCapture(e.pointerId); } catch (err) { /* rien */ } }
    });
    bouton.addEventListener('pointermove', function (e) {
      if (glisse && e.pointerId === glisse.id) {
        if (glisse.hors) { return; }
        var dx = e.clientX - glisse.x, dy = e.clientY - glisse.y;
        if (!glisse.bouge) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) { return; }   /* le doigt tremble : pas encore un glissé */
          if (Math.abs(dy) > Math.abs(dx)) { glisse.hors = true; return; }   /* geste vertical : c'est la page qui défile */
          glisse.bouge = touche = true;
          glisse.a = angle - dx * glisse.k;   /* il part de là où il en est, sans à-coup */
          vitesse = 0;
          rxCible = 0;   /* il ne tourne que de gauche à droite, comme une médaille sur son axe */
          b.classList.add('badge-glisse');
        }
        doigt = glisse.a + dx * glisse.k;
        glisse.pts.push([e.timeStamp || Date.now(), doigt]);
        if (glisse.pts.length > 24) { glisse.pts.shift(); }
        demarrer();
        return;
      }
      if (e.pointerType === 'mouse' && !glisse) {   /* survol : l'image s'incline un peu vers la souris */
        var r = b.getBoundingClientRect();   /* le cadre, qui ne tourne pas */
        if (!r.width || !r.height) { return; }
        ryCible = (Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) - 0.5) * 12;
        rxCible = -(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) - 0.5) * 9;
        demarrer();
      }
    });
    function lacher(e, annule) {
      if (!glisse || e.pointerId !== glisse.id) { return; }
      var g = glisse;
      glisse = null;
      b.classList.remove('badge-glisse');
      if (g.bouge || g.hors) {   /* c'était un glissé, pas un clic */
        sansClic = true;
        setTimeout(function () { sansClic = false; }, 350);
      }
      if (!g.bouge) { return; }
      var v = annule ? 0 : elan(g, e.timeStamp || Date.now());
      cible = Math.round((angle + Math.max(-ELAN_MAX, Math.min(ELAN_MAX, v)) * 0.3) / 180) * 180;   /* son élan la pose sur la face la plus proche : un tour au plus */
      v = Math.max(-2 * ELAN_MAX, Math.min(2 * ELAN_MAX, v));
      var d = cible - angle;
      /* elle garde la vitesse du doigt puis freine en douceur jusqu'à la face, sans rebond */
      var w = d * v > 0 ? Math.max(5.5, Math.min(13, 2 * Math.abs(v / d))) : 9;
      raideur = w * w;
      amorti = 1;
      vitesse = v;
      demarrer();
    }
    bouton.addEventListener('pointerup', function (e) { lacher(e, false); });
    bouton.addEventListener('pointercancel', function (e) { lacher(e, true); });
    bouton.addEventListener('lostpointercapture', function (e) { lacher(e, true); });
    bouton.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse' || glisse) { return; }
      rxCible = ryCible = 0;
      if (b.classList.contains('badge-3d')) { demarrer(); }
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entrees) {
        if (!entrees.some(function (en) { return en.isIntersecting; })) { return; }
        io.disconnect();
        var img = carte.querySelector('img');   /* on attend que l'image soit chargée pour la faire tourner */
        setTimeout(function () {
          if (!img || img.complete !== false) { tourner(); } else { img.addEventListener('load', tourner, { once: true }); }
        }, 280);
      }, { threshold: 0.55 });
      io.observe(b);
    }
  }

  /* ---------------------------------------------------------------------------------------------
     4. Exercice de respiration : le cercle grandit 5 s (inspirez) puis rétrécit 5 s (expirez).
        Durée au choix, bruit des vagues facultatif (créé sur place, aucun fichier à charger),
        vibrations sur les téléphones Android, écran gardé allumé pendant l'exercice. */
  function respiration(sec) {
    var btn = sec.querySelector('.breathe-btn'), timer = sec.querySelector('.breathe-timer');
    var orb = sec.querySelector('.breathe-orb'), tour = sec.querySelector('.breathe-tour-avance');
    var bilan = sec.querySelector('[data-breathe-bilan]'), annonceur = sec.querySelector('[data-breathe-annonce]');
    var btnSon = sec.querySelector('.breathe-son'), btnVibre = sec.querySelector('.breathe-vibre');
    var PHASE = 5000, total = 0, ecoule = 0, dernier = 0, enCours = false, phase = -1, verrou = null, audio = null;
    var peutVibrer = !!(window.navigator && 'vibrate' in window.navigator && window.matchMedia &&
                        window.matchMedia('(pointer: coarse)').matches);   /* téléphones Android (l'iPhone ne vibre pas sur commande) */
    var image = window.requestAnimationFrame ? function (f) { window.requestAnimationFrame(f); }
      : function (f) { setTimeout(function () { f(Date.now()); }, 40); };
    if (!btn || !timer || !orb) { return; }
    if (btnVibre && peutVibrer) { btnVibre.hidden = false; }

    function minutes() {
      var r = sec.querySelector('input[name="breathe-duree"]:checked');
      return r ? Math.max(1, +r.value || 5) : 5;
    }
    function fmt(ms) {
      var s = Math.max(0, Math.ceil(ms / 1000)), m = Math.floor(s / 60), r = s % 60;
      return m + ' min ' + (r < 10 ? '0' : '') + r + ' s';
    }
    function annonce(t) { if (annonceur) { annonceur.textContent = t; } }
    function presse(b) { return !!b && b.getAttribute('aria-pressed') === 'true'; }
    function dessiner() {
      var x = (ecoule % (2 * PHASE)) / (2 * PHASE);
      if (!reduceMotion()) { orb.style.transform = 'scale(' + (0.8 - 0.2 * Math.cos(2 * Math.PI * x)).toFixed(4) + ')'; }
      if (tour) { tour.style.strokeDashoffset = (100 - 100 * Math.min(1, total ? ecoule / total : 0)).toFixed(2); }
      var p = Math.floor(ecoule / PHASE) % 2;
      if (p !== phase) {
        phase = p;
        sec.classList.toggle('expire', p === 1);
        if (enCours) { vague(p === 0); vibrer(35); }
      }
    }
    function boucle(t) {
      if (!enCours) { return; }
      if (dernier) { ecoule += Math.min(Math.max(t - dernier, 0), 250); }   /* onglet en arrière-plan : pas de saut */
      dernier = t;
      if (ecoule >= total) { ecoule = total; dessiner(); finir(); return; }
      dessiner();
      var texte = 'Reste ' + fmt(total - ecoule);
      if (timer.textContent !== texte) { timer.textContent = texte; }
      image(boucle);
    }
    function demarrer() {
      total = minutes() * 60000;
      if (ecoule >= total || sec.classList.contains('termine')) { ecoule = 0; }
      sec.classList.remove('termine', 'en-pause');
      sec.classList.add('en-cours');
      enCours = true; dernier = 0; phase = -1;
      btn.textContent = 'Mettre en pause';
      btn.setAttribute('aria-pressed', 'true');
      timer.textContent = 'Reste ' + fmt(total - ecoule);
      annonce(ecoule ? "L'exercice reprend." : "C'est parti : inspirez pendant que le cercle s'agrandit, expirez pendant qu'il se resserre.");
      sonDemarrer();
      ecran(true);
      image(boucle);
    }
    function pause() {
      enCours = false;
      sec.classList.remove('en-cours');
      sec.classList.add('en-pause');
      btn.textContent = 'Reprendre';
      btn.setAttribute('aria-pressed', 'false');
      timer.textContent = 'En pause · reste ' + fmt(total - ecoule);
      annonce('Exercice en pause.');
      sonCouper(false);
      ecran(false);
    }
    function finir() {
      enCours = false;
      sec.classList.remove('en-cours', 'en-pause', 'expire');
      sec.classList.add('termine');
      var m = Math.round(total / 60000);
      if (bilan) { bilan.textContent = m + ' min de calme'; }
      btn.textContent = "Recommencer l'exercice";
      btn.setAttribute('aria-pressed', 'false');
      timer.textContent = "Bravo, l'exercice est terminé ! L'idéal : trois fois par jour.";
      annonce('Bravo, ' + m + ' minute' + (m > 1 ? 's' : '') + ' de cohérence cardiaque : l’exercice est terminé.');
      sonCouper(true);
      ecran(false);
      vibrer([60, 90, 60]);
    }
    /* bruit des vagues : un souffle doux qui monte à l'inspiration et redescend à l'expiration */
    function creerVagues() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { return null; }
      var ctx = new AC(), n = Math.floor(ctx.sampleRate * 3), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
      var b0 = 0, b1 = 0, b2 = 0;
      for (var i = 0; i < n; i++) {
        var w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.0990460; b1 = 0.96300 * b1 + w * 0.2965164; b2 = 0.57000 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
      }
      var src = ctx.createBufferSource(), filtre = ctx.createBiquadFilter(), gain = ctx.createGain();
      src.buffer = buf; src.loop = true;
      filtre.type = 'lowpass'; filtre.frequency.value = 320; filtre.Q.value = 0.4;
      gain.gain.value = 0;
      src.connect(filtre); filtre.connect(gain); gain.connect(ctx.destination);
      src.start();
      return { ctx: ctx, filtre: filtre, gain: gain };
    }
    function sonDemarrer() {
      if (!presse(btnSon)) { return; }
      try {
        audio = audio || creerVagues();
        if (audio && audio.ctx.state === 'suspended') { audio.ctx.resume(); }
      } catch (e) { audio = null; }
    }
    function sonCouper(lentement) {
      if (!audio) { return; }
      var t = audio.ctx.currentTime, g = audio.gain.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.setTargetAtTime(0, t, lentement ? 0.8 : 0.12);
    }
    function vague(inspire) {
      if (!audio || !presse(btnSon)) { return; }
      var t = audio.ctx.currentTime, g = audio.gain.gain, f = audio.filtre.frequency, duree = PHASE / 1000 * 0.94;
      g.cancelScheduledValues(t); f.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t); f.setValueAtTime(f.value, t);
      g.linearRampToValueAtTime(inspire ? 0.26 : 0.035, t + duree);
      f.linearRampToValueAtTime(inspire ? 1200 : 320, t + duree);
    }
    function vibrer(motif) {
      if (peutVibrer && presse(btnVibre)) { try { window.navigator.vibrate(motif); } catch (e) { /* refusé */ } }
    }
    function ecran(garder) {   /* évite que l'écran du téléphone ne s'éteigne pendant l'exercice */
      var n = window.navigator;
      if (!n || !n.wakeLock) { return; }
      if (garder) {
        n.wakeLock.request('screen').then(function (v) { verrou = v; }, function () {});
      } else if (verrou) {
        verrou.release().then(null, function () {});
        verrou = null;
      }
    }

    btn.addEventListener('click', function () { if (enCours) { pause(); } else { demarrer(); } });
    [].forEach.call(sec.querySelectorAll('input[name="breathe-duree"]'), function (r) {
      r.addEventListener('change', function () {
        total = minutes() * 60000;
        if (enCours) { return; }
        if (sec.classList.contains('en-pause') && ecoule < total) {
          timer.textContent = 'En pause · reste ' + fmt(total - ecoule);
        } else {
          ecoule = 0;
          sec.classList.remove('termine', 'en-pause', 'expire');
          btn.textContent = "Commencer l'exercice";
          timer.textContent = minutes() + ' minute' + (minutes() > 1 ? 's' : '') + ', à interrompre quand vous voulez';
        }
        dessiner();
      });
    });
    [btnSon, btnVibre].forEach(function (b) {
      if (!b) { return; }
      b.addEventListener('click', function () {
        var actif = !presse(b);
        b.setAttribute('aria-pressed', String(actif));
        if (b === btnSon) {
          if (actif && enCours) { sonDemarrer(); vague(phase === 0); } else if (!actif) { sonCouper(false); }
        } else if (actif) { vibrer(35); }
      });
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden && enCours) { pause(); } });
    total = minutes() * 60000;
    dessiner();
  }

  /* 7. Mode nuit : choix mémorisé dans le navigateur (aucun cookie) ; un cercle s'agrandit depuis le bouton */
  function majBoutonTheme(btn) {
    var sombre = document.documentElement.getAttribute('data-theme') === 'sombre';
    btn.setAttribute('aria-pressed', String(sombre));
    btn.setAttribute('title', sombre ? 'Revenir au mode clair' : 'Passer en mode nuit');
  }
  function appliquerTheme(sombre) {
    var html = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
    if (sombre) { html.setAttribute('data-theme', 'sombre'); } else { html.removeAttribute('data-theme'); }
    try {
      if (sombre) { window.localStorage.setItem('cr-theme', 'sombre'); } else { window.localStorage.removeItem('cr-theme'); }
    } catch (e) { /* stockage indisponible : le choix vaut pour cette page */ }
    if (meta) { meta.setAttribute('content', sombre ? '#191C1A' : '#F6F1EA'); }
    [].forEach.call(document.querySelectorAll('.theme-btn'), majBoutonTheme);
  }
  function basculerTheme(sombre, x, y) {
    var html = document.documentElement;
    if (!document.startViewTransition || reduceMotion()) { appliquerTheme(sombre); return; }
    html.classList.add('vt-theme');
    var t = document.startViewTransition(function () { appliquerTheme(sombre); });
    var fin = function () { html.classList.remove('vt-theme'); };
    t.ready.then(function () {
      var w = window.innerWidth, h = window.innerHeight;
      var rayon = Math.sqrt(Math.pow(Math.max(x, w - x), 2) + Math.pow(Math.max(y, h - y), 2));
      html.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rayon + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' });
    }, fin);
    t.finished.then(fin, fin);
  }

  /* 8. « Vrai ou faux ? » : on choisit, la carte se retourne et donne la réponse ; score à la fin */
  function vraiFaux(liste) {
    var sec = liste.parentNode;
    while (sec && sec.tagName !== 'SECTION' && sec.parentNode) { sec = sec.parentNode; }
    var score = sec.querySelector('[data-vf-score]'), tout = sec.querySelector('.vf-tout'), rejouer = sec.querySelector('.vf-rejouer');
    var cartes = [].slice.call(liste.querySelectorAll('.vf')), n = cartes.length, reponses = 0, justes = 0, revele = false;
    function cacher(el, oui) {
      if (!el) { return; }
      if (oui) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); } else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    }
    function montrer(c, verso, focus) {
      var r = c.querySelector('.vf-recto'), v = c.querySelector('.vf-verso');
      c.classList.toggle('retournee', verso);
      cacher(r, verso); cacher(v, !verso);
      if (focus) {
        var cible = verso ? v : r.querySelector('.vf-affirmation');
        cible.setAttribute('tabindex', '-1');
        try { cible.focus({ preventScroll: true }); } catch (e) { cible.focus(); }
      }
    }
    function pluriel(k, mot) { return k + ' ' + mot + (k > 1 ? 's' : ''); }
    function majScore() {
      if (!score) { return; }
      score.classList.remove('vf-bravo');
      if (revele) { score.textContent = ''; return; }
      if (reponses < n) {
        score.textContent = 'Votre score : ' + pluriel(justes, 'bonne') + ' ' + (justes > 1 ? 'réponses' : 'réponse') + ' sur ' + reponses + '.';
        return;
      }
      score.textContent = justes === n ? 'Sans faute : ' + justes + '/' + n + ' ! L’hypnose n’a plus de secrets pour vous.'
        : justes >= n - 2 ? justes + '/' + n + ' : bravo, vous connaissez bien l’hypnose !'
        : justes + '/' + n + ' : quelques idées reçues ont la vie dure… on en parle ?';
      if (justes === n) { score.classList.add('vf-bravo'); }
      if (rejouer) { rejouer.hidden = false; }
      if (tout) { tout.hidden = true; }
    }
    cartes.forEach(function (c) {
      montrer(c, false, false);
      [].forEach.call(c.querySelectorAll('.vf-btn'), function (b) {
        b.addEventListener('click', function () {
          if (c.classList.contains('repondue')) { montrer(c, true, true); return; }
          var juste = b.getAttribute('data-choix') === c.getAttribute('data-reponse');
          c.classList.add('repondue', juste ? 'juste' : 'rate');
          b.setAttribute('aria-pressed', 'true');
          var res = c.querySelector('[data-vf-resultat]');
          if (res) { res.textContent = juste ? 'Bien vu !' : 'Eh non…'; }
          reponses += 1;
          if (juste) { justes += 1; }
          montrer(c, true, true);
          majScore();
        });
      });
      var retour = c.querySelector('.vf-retour');
      if (retour) { retour.addEventListener('click', function () { montrer(c, false, true); }); }
    });
    if (tout) {
      tout.addEventListener('click', function () {
        revele = true;
        cartes.forEach(function (c) { if (!c.classList.contains('repondue')) { c.classList.add('repondue'); } montrer(c, true, false); });
        majScore();
        tout.hidden = true;
        if (rejouer) { rejouer.hidden = false; }
      });
    }
    if (rejouer) {
      rejouer.addEventListener('click', function () {
        reponses = 0; justes = 0; revele = false;
        cartes.forEach(function (c) {
          c.classList.remove('repondue', 'juste', 'rate');
          [].forEach.call(c.querySelectorAll('.vf-btn'), function (b) { b.removeAttribute('aria-pressed'); });
          var res = c.querySelector('[data-vf-resultat]');
          if (res) { res.textContent = ''; }
          montrer(c, false, false);
        });
        majScore();
        if (score) { score.textContent = ''; }
        rejouer.hidden = true;
        if (tout) { tout.hidden = false; }
        var premier = liste.querySelector('.vf-btn');
        if (premier) { premier.focus(); }
      });
    }
  }

  /* 9. Calculateur : « vous avez économisé » ou « vous pourriez économiser » (rien n'est enregistré) */
  function calculateur(sec) {
    var f = sec.querySelector('.calc-form');
    if (!f) { return; }
    var $ = function (s) { return sec.querySelector(s); };
    var cig = $('#calc-cig'), cigVal = $('#calc-cig-val'), duree = $('#calc-duree'), unite = $('#calc-unite'), prix = $('#calc-prix');
    var lblDuree = $('label[for="calc-duree"]'), phrase = $('[data-calc-phrase]'), montant = $('[data-calc-montant]');
    var elCig = $('[data-calc-cig]'), elCigMot = $('[data-calc-cig-mot]'), elPaquets = $('[data-calc-paquets]'), elAn = $('[data-calc-an]');
    var elSeance = $('[data-calc-seance]'), annonceur = $('[data-calc-annonce]'), titreSante = $('[data-calc-titre-sante]');
    var medaille = $('.calc-medaille'), medTxt = $('.calc-medaille-txt');
    var etapes = [].slice.call(sec.querySelectorAll('.calc-etapes li'));
    var prixSeance = parseFloat(sec.getAttribute('data-seance')) || 0, nomSeance = sec.getAttribute('data-seance-nom') || '';
    var PALIERS = [[1, '1 jour'], [7, '1 semaine'], [30.4375, '1 mois'], [91.3125, '3 mois'], [182.625, '6 mois'],
                   [365.25, '1 an'], [730.5, '2 ans'], [1826.25, '5 ans'], [3652.5, '10 ans']];
    var affiche = 0, anim = null, derniere = null, dureeTouchee = false, minuterie = null;
    function euros(v) {
      var dec = v < 100 ? 2 : 0;
      try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v).replace(/\u202f/g, '\u00a0'); }
      catch (e) { return (dec ? v.toFixed(2).replace('.', ',') : String(Math.round(v))) + ' €'; }
    }
    function nombre(v) {
      try { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(v)).replace(/\u202f/g, '\u00a0'); }
      catch (e) { return String(Math.round(v)); }
    }
    function valeur(el, def, min, max) {
      var v = parseFloat(String(el.value).replace(',', '.'));
      return Math.min(max, Math.max(min, isFinite(v) ? v : def));
    }
    function compter(cible, animer) {
      if (anim) { window.cancelAnimationFrame(anim); anim = null; }
      if (!animer || reduceMotion() || !window.requestAnimationFrame) { affiche = cible; montant.textContent = euros(cible); return; }
      var depart = affiche, t0 = null;
      function pas(t) {
        if (t0 === null) { t0 = t; }
        var x = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - x, 3);
        affiche = depart + (cible - depart) * e;
        montant.textContent = euros(affiche);
        anim = x < 1 ? window.requestAnimationFrame(pas) : null;
      }
      anim = window.requestAnimationFrame(pas);
    }
    function calculer(animer) {
      var choix = f.querySelector('input[name="calc-mode"]:checked'), projet = !!choix && choix.value === 'projet', cle = projet ? 'data-projet' : 'data-arrete';
      var n = valeur(cig, 10, 1, 60), p = valeur(prix, 12.5, 1, 99), jours = valeur(duree, 1, 0, 9999) * (parseFloat(unite.value) || 1);
      var parJour = n * p / 20, total = parJour * jours, cigarettes = n * jours;
      if (cigVal) { cigVal.textContent = n; }
      phrase.textContent = projet ? 'Vous pourriez économiser' : 'Vous avez déjà économisé';
      if (lblDuree) { lblDuree.textContent = lblDuree.getAttribute(cle); }
      if (titreSante) { titreSante.textContent = titreSante.getAttribute(cle); }
      elCig.textContent = nombre(cigarettes);
      if (elCigMot) { elCigMot.textContent = cigarettes >= 2 ? 'cigarettes en moins' : 'cigarette en moins'; }
      elPaquets.textContent = nombre(cigarettes / 20);
      elAn.textContent = euros(parJour * 365.25);
      if (elSeance) {
        var j = prixSeance ? Math.ceil(prixSeance / parJour) : 0;
        elSeance.textContent = j ? 'À ce rythme, la consultation' + (nomSeance ? ' « ' + nomSeance + ' »' : '') + ' (' + euros(prixSeance) +
          ') représente ' + j + ' jour' + (j > 1 ? 's' : '') + ' de cigarettes.' : '';
      }
      etapes.forEach(function (li) { li.classList.toggle('atteint', jours * 1440 >= (+li.getAttribute('data-minutes') || 0)); });
      var palier = '';
      PALIERS.forEach(function (x) { if (jours >= x[0] - 1e-6) { palier = x[1]; } });
      var texte = palier ? (projet ? 'Objectif : ' + palier : palier + ' sans tabac') : '';
      if (medaille && texte !== derniere) {
        medaille.hidden = !texte;
        medTxt.textContent = texte;
        if (derniere !== null && texte) { medaille.classList.remove('tourne'); void medaille.offsetWidth; medaille.classList.add('tourne'); }
        derniere = texte;
      }
      compter(total, animer);
      if (annonceur) {
        clearTimeout(minuterie);
        minuterie = setTimeout(function () { annonceur.textContent = phrase.textContent + ' ' + euros(total) + '.'; }, 800);
      }
    }
    [duree, unite].forEach(function (el) { el.addEventListener('input', function () { dureeTouchee = true; }); });
    [].forEach.call(f.querySelectorAll('input[name="calc-mode"]'), function (r) {
      r.addEventListener('change', function () {
        if (r.checked && r.value === 'projet' && !dureeTouchee) { duree.value = 1; unite.value = '365.25'; }
      });
    });
    f.addEventListener('input', function () { calculer(true); });
    f.addEventListener('change', function () { calculer(true); });
    f.addEventListener('submit', function (e) { e.preventDefault(); });
    calculer(false);
  }

  /* 10. Petite surprise cachée (textes réglés dans le CMS, « Surprise cachée ») :
         5 clics rapides sur le logo du pied de page, ou taper « hypnose » au clavier. */
  var surpriseClavier = false;
  var PENDULE = '<svg class="surprise-pendule" viewBox="0 0 110 230" width="110" height="230" aria-hidden="true">' +
    '<circle cx="55" cy="6" r="4" fill="#E9CF93"/><path d="M55 8V161" stroke="#E9CF93" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 4.5"/>' +
    '<circle cx="55" cy="165" r="5.5" fill="none" stroke="#E9CF93" stroke-width="3"/><circle cx="55" cy="198" r="29" fill="#C29A52"/>' +
    '<circle cx="55" cy="198" r="23" fill="#FBEFCB"/><path d="M55 198v-14M55 198l9 6" stroke="#5F4A26" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle cx="55" cy="198" r="2.6" fill="#5F4A26"/></svg>';
  function surprise(root) {
    var src = document.getElementById('surprise'), d = null;
    if (!src) { return; }
    try { d = JSON.parse(src.textContent); } catch (e) { return; }
    [].forEach.call(root.querySelectorAll('[data-surprise]'), function (logo) {
      var clics = [];
      logo.addEventListener('click', function () {
        var t = Date.now();
        clics = clics.filter(function (x) { return t - x < 2500; });
        clics.push(t);
        if (clics.length >= 5) { clics = []; ouvrirSurprise(d); }
      });
    });
    if (!surpriseClavier) {
      surpriseClavier = true;
      var tape = '';
      document.addEventListener('keydown', function (e) {
        var c = e.target;
        if (!e.key || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) { return; }
        if (c && (/^(INPUT|TEXTAREA|SELECT)$/.test(c.tagName) || c.isContentEditable)) { return; }
        tape = (tape + e.key.toLowerCase()).slice(-7);
        if (tape === 'hypnose') { tape = ''; ouvrirSurprise(d); }
      });
    }
  }
  function ouvrirSurprise(d) {
    if (document.querySelector('.surprise')) { return; }
    var avant = document.activeElement, minuteries = [], fini = false;
    var o = document.createElement('div'), boite = document.createElement('div');
    o.className = 'surprise';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.setAttribute('aria-label', d.titre || 'Surprise');
    boite.className = 'surprise-boite';
    boite.innerHTML = PENDULE;
    function ligne(texte, classe) {
      var p = document.createElement('p');
      p.className = classe;
      p.textContent = texte;
      boite.appendChild(p);
      return p;
    }
    if (d.titre) { ligne(d.titre, 'surprise-titre'); }
    var lignes = (d.lignes || []).map(function (t) { return ligne(t, 'surprise-ligne'); });
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.textContent = d.bouton || 'Se réveiller';
    boite.appendChild(b);
    o.appendChild(boite);
    document.body.appendChild(o);
    setTimeout(function () { o.classList.add('ouverte'); }, 20);
    lignes.forEach(function (p, i) { minuteries.push(setTimeout(function () { p.classList.add('vue'); }, reduceMotion() ? 0 : 900 + i * 1800)); });
    b.focus();
    function fermer() {
      document.removeEventListener('keydown', clavier, true);
      o.classList.remove('ouverte');
      setTimeout(function () { if (o.parentNode) { o.parentNode.removeChild(o); } }, 650);
      if (avant && avant.focus) { try { avant.focus({ preventScroll: true }); } catch (e) { avant.focus(); } }
    }
    function reveiller() {
      if (fini) { fermer(); return; }
      fini = true;
      minuteries.forEach(clearTimeout);
      lignes.forEach(function (p) { p.parentNode.removeChild(p); });
      var t = boite.querySelector('.surprise-titre');
      if (t) { t.parentNode.removeChild(t); }
      boite.insertBefore(ligne(d.reveil || '1… 2… 3…', 'surprise-ligne surprise-reveil vue'), b);
      b.textContent = 'Fermer';
      b.focus();
      minuteries.push(setTimeout(fermer, 4500));
    }
    function clavier(e) {
      if (e.key === 'Escape') { e.preventDefault(); reveiller(); }
      else if (e.key === 'Tab') { e.preventDefault(); b.focus(); }
    }
    document.addEventListener('keydown', clavier, true);
    b.addEventListener('click', reveiller);
    o.addEventListener('click', function (e) { if (e.target === o) { reveiller(); } });
  }

  /* 11. Bon cadeau : début de message prêt dans le formulaire, objet du mail adapté */
  function preRemplir(root, message) {
    var zone = root.querySelector('#message'), objet = root.querySelector('input[name="subject"]'), nom = root.querySelector('#nom');
    if (zone && message && !zone.value.trim()) { zone.value = message; }
    if (objet) { objet.value = objet.value.replace('Demande de rendez-vous', 'Demande de bon cadeau'); }
    if (nom) { setTimeout(function () { try { nom.focus({ preventScroll: true }); } catch (e) { nom.focus(); } }, 450); }
  }

  /* 12. Plan d'accès : la ligne survolée (ou touchée) met sa station en avant sur le plan */
  function planAcces(plan) {
    [].forEach.call(plan.querySelectorAll('.plan-liste li[data-plan]'), function (li) {
      var st = plan.querySelector('.p-station[data-plan="' + li.getAttribute('data-plan') + '"]');
      if (!st) { return; }
      var allumer = function () { li.classList.add('actif'); st.classList.add('actif'); };
      var eteindre = function () { li.classList.remove('actif'); st.classList.remove('actif'); };
      li.addEventListener('mouseenter', allumer);
      li.addEventListener('mouseleave', eteindre);
      li.addEventListener('click', function () {
        var deja = st.classList.contains('actif');
        [].forEach.call(plan.querySelectorAll('.actif'), function (x) { x.classList.remove('actif'); });
        if (!deja) { allumer(); }
      });
    });
  }

  window.initSite = initSite;
  if (!window.__APERCU__) { initSite(document); }
})();
