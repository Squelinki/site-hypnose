document.documentElement.classList.add('js');
/* Annonces et décorations : elles s'affichent selon la date du jour à Paris, chaque année.
   Les fêtes dont la date change (Pâques, Journée du sommeil, fêtes des mères et des pères) sont calculées ici, chaque année.
   Pour voir le site à une autre date, ajoutez ?apercu=JJ/MM ou ?apercu=JJ/MM/AAAA à l'adresse (ex. ?apercu=15/12). */
window.CR = (function () {
  var d = new Date(), j = d.getDate(), m = d.getMonth() + 1, a = d.getFullYear();
  try {
    new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'numeric', year: 'numeric' })
      .formatToParts(d).forEach(function (p) {
        if (p.type === 'day') { j = +p.value; } else if (p.type === 'month') { m = +p.value; } else if (p.type === 'year') { a = +p.value; }
      });
  } catch (e) { /* navigateur ancien : date de l'appareil */ }
  var q = /[?&]apercu=(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{4}))?/.exec(location.search);
  if (q) { j = +q[1]; m = +q[2]; if (q[3]) { a = +q[3]; } }
  function jour(an, mo, jo) { return new Date(Date.UTC(an, mo - 1, jo)); }
  function paques(an) {   /* dimanche de Pâques (calendrier grégorien) */
    var g = an % 19, c = Math.floor(an / 100), h = (c - Math.floor(c / 4) - Math.floor((8 * c + 13) / 25) + 19 * g + 15) % 30,
      i = h - Math.floor(h / 28) * (1 - Math.floor(h / 28) * Math.floor(29 / (h + 1)) * Math.floor((21 - g) / 11)),
      k = i - (an + Math.floor(an / 4) + i + 2 - c + Math.floor(c / 4)) % 7;
    return jour(an, 3 + Math.floor((k + 40) / 44), k + 28 - 31 * Math.floor((3 + Math.floor((k + 40) / 44)) / 4));
  }
  var FETES = {
    paques: paques,
    sommeil: function (an) { var x = jour(an, 3, 19); x.setUTCDate(19 - (x.getUTCDay() + 2) % 7); return x; },   /* vendredi avant le printemps */
    meres: function (an) {   /* dernier dimanche de mai, ou 1er dimanche de juin si c'est la Pentecôte */
      var x = jour(an, 5, 31), pentecote = paques(an);
      x.setUTCDate(31 - x.getUTCDay());
      pentecote.setUTCDate(pentecote.getUTCDate() + 49);
      if (x.getTime() === pentecote.getTime()) { x.setUTCDate(x.getUTCDate() + 7); }
      return x;
    },
    peres: function (an) { var x = jour(an, 6, 1); x.setUTCDate(1 + (7 - x.getUTCDay()) % 7 + 14); return x; }   /* 3e dimanche de juin */
  };
  /* « 01/12 » ou « paques-6 » (6 jours avant Pâques) -> 1201, 0322… */
  function quand(t, an) {
    var f = /^([a-z]+)([+-]\d+)?$/.exec(t), p = String(t).split('/');
    if (f && FETES[f[1]]) {
      var x = FETES[f[1]](an);
      x.setUTCDate(x.getUTCDate() + (+f[2] || 0));
      return (x.getUTCMonth() + 1) * 100 + x.getUTCDate();
    }
    return +p[1] * 100 + +p[0];
  }
  var cr = {
    jour: m * 100 + j,
    annee: a,
    quand: quand,
    actif: function (du, au) {
      var s = quand(du, cr.annee), e = quand(au, cr.annee), n = cr.jour;
      return s <= e ? (n >= s && n <= e) : (n >= s || n <= e);
    },
    montrer: function (el) {
      if (!el || !cr.actif(el.getAttribute('data-affiche-du'), el.getAttribute('data-affiche-au'))) { return; }
      [].forEach.call(el.querySelectorAll('[data-annee]'), function (s) { s.textContent = cr.annee; });
      el.hidden = false;
    }
  };
  return cr;
})();
