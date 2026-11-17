/* Menu : ses noms se changent dans le CMS (rubrique « Menu et pied de page »). S'ils ne tiennent pas sur une ligne,
   le site essaie dans l'ordre : menu un peu resserré, puis sans le bouton « Prendre rendez-vous », puis menu dans le
   bouton à trois traits (comme sur les petits écrans). Il garde la première solution où rien ne dépasse et où aucun
   texte ne touche son voisin (y compris la petite ligne « Hypnothérapeute · Paris 16e » sous le nom).
   Quand tout tient, rien ne change. */
(function () {
  var w = window, d = document, h = d.querySelector('.header-inner'), c = d.documentElement.classList, attente = 0;
  var toutes = ['menu-serre', 'menu-sans-bouton', 'menu-replie'];
  var essais = [[], ['menu-serre'], ['menu-sans-bouton'], ['menu-serre', 'menu-sans-bouton'], ['menu-replie'], ['menu-replie', 'menu-sans-bouton']];
  var ECART = 12;   /* espace minimal, en pixels, entre deux éléments de l'en-tête */
  if (!h || !c || !w.getComputedStyle || !w.matchMedia) { return; }
  function bords(e) {   /* bords visibles d'un élément : sa boîte, élargie à son texte si le texte en sort (selon le navigateur) */
    var q = e.getBoundingClientRect(), b = { g: q.left, d: q.right };
    if (d.createRange && !(e.querySelector && e.querySelector('.sr-only'))) {   /* texte réservé aux lecteurs d'écran : ignoré */
      var r = d.createRange(); r.selectNodeContents(e);
      var t = r.getBoundingClientRect();
      if (t.width) { b.g = Math.min(b.g, t.left); b.d = Math.max(b.d, t.right); }
    }
    return b;
  }
  function deborde() {   /* un élément de l'en-tête dépasse-t-il la largeur du contenu, ou touche-t-il le précédent ? */
    var s = w.getComputedStyle(h), limite = h.getBoundingClientRect().right - parseFloat(s.borderRightWidth) - parseFloat(s.paddingRight) + 1, avant = null;
    for (var i = 0; i < h.children.length; i++) {
      var e = h.children[i], t = w.getComputedStyle(e);
      if (t.display === 'none' || t.position === 'absolute') { continue; }
      var b = bords(e);
      if (b.d + (parseFloat(t.marginRight) || 0) > limite) { return true; }
      if (avant !== null && b.g < avant + ECART) { return true; }
      avant = b.d;
    }
    return false;
  }
  function choisir(liste) { toutes.forEach(function (n) { c.remove(n); }); liste.forEach(function (n) { c.add(n); }); }
  function ajuster() {
    attente = 0;
    choisir([]);
    if (w.matchMedia('(max-width: 1000px)').matches) { return; }   /* petits écrans : menu déjà à trois traits */
    for (var i = 0; i < essais.length; i++) {
      choisir(essais[i]);
      if (!deborde()) { return; }
    }
  }
  ajuster();
  w.addEventListener('resize', function () {
    if (!attente) { attente = w.requestAnimationFrame ? w.requestAnimationFrame(ajuster) : setTimeout(ajuster, 100); }
  });
  w.addEventListener('load', ajuster);
  if (document.fonts) {
    if (document.fonts.addEventListener) { document.fonts.addEventListener('loadingdone', ajuster); }
    if (document.fonts.ready) { document.fonts.ready.then(ajuster); }
  }
})();
