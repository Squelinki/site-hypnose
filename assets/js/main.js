/* ==========================================================================
   Caroline Roulleau – Hypnothérapeute · Petits scripts du site
   1. Menu mobile   2. Ombre de l'en-tête   3. Apparitions au défilement
   4. Exercice de respiration   5. Formulaire de contact   6. Badge à retourner
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
    '.encart-seul > *'
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

    /* 4. Exercice de respiration (cohérence cardiaque, 5 minutes) --------- */
    var breathe = root.querySelector('[data-breathe]');
    if (breathe) {
      var btn = breathe.querySelector('.breathe-btn');
      var timer = breathe.querySelector('.breathe-timer');
      var total = 5 * 60;
      var left = total;
      var tick = null;
      var fmt = function (s) {
        var m = Math.floor(s / 60), r = s % 60;
        return m + ' min ' + (r < 10 ? '0' : '') + r + ' s';
      };
      var stop = function (finished) {
        clearInterval(tick);
        tick = null;
        breathe.classList.remove('is-running');
        btn.setAttribute('aria-pressed', 'false');
        if (finished) {
          left = total;
          btn.textContent = "Recommencer l'exercice";
          timer.textContent = "Bravo, l'exercice est terminé.";
        } else {
          btn.textContent = 'Reprendre';
          timer.textContent = 'En pause · reste ' + fmt(left);
        }
      };
      btn.addEventListener('click', function () {
        if (tick) { stop(false); return; }
        breathe.classList.add('is-running');
        btn.textContent = 'Mettre en pause';
        btn.setAttribute('aria-pressed', 'true');
        timer.textContent = 'Reste ' + fmt(left);
        tick = setInterval(function () {
          left -= 1;
          timer.textContent = 'Reste ' + fmt(left);
          if (left <= 0) { stop(true); }
        }, 1000);
      });
    }

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

  window.initSite = initSite;
  if (!window.__APERCU__) { initSite(document); }
})();
