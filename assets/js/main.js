/* ==========================================================================
   Caroline Roulleau – Hypnothérapeute · Petits scripts du site
   1. Menu mobile   2. Ombre de l'en-tête   3. Apparitions au défilement
   4. Exercice de respiration   5. Formulaire de contact
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
  }

  window.initSite = initSite;
  if (!window.__APERCU__) { initSite(document); }
})();
