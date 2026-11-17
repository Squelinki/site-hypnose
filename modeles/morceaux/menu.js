/* Menu : ses noms se changent dans le CMS (rubrique « Menu et pied de page »). S'ils ne tiennent pas sur une ligne,
   le site essaie dans l'ordre : menu un peu resserré, puis sans le bouton « Prendre rendez-vous », puis menu dans le
   bouton à trois traits (comme sur les petits écrans). Il garde la première solution où rien ne dépasse.
   Quand tout tient, rien ne change. */
(function () {
  var w = window, h = document.querySelector('.header-inner'), c = document.documentElement.classList, attente = 0;
  var toutes = ['menu-serre', 'menu-sans-bouton', 'menu-replie'];
  var essais = [[], ['menu-serre'], ['menu-sans-bouton'], ['menu-serre', 'menu-sans-bouton'], ['menu-replie'], ['menu-replie', 'menu-sans-bouton']];
  if (!h || !c || !w.getComputedStyle || !w.matchMedia) { return; }
  function deborde() {   /* un élément de l'en-tête dépasse-t-il la largeur du contenu (marges de la page comprises) ? */
    var s = w.getComputedStyle(h), limite = h.getBoundingClientRect().right - parseFloat(s.borderRightWidth) - parseFloat(s.paddingRight) + 1;
    for (var i = 0; i < h.children.length; i++) {
      var e = h.children[i], t = w.getComputedStyle(e);
      if (t.display !== 'none' && t.position !== 'absolute' && e.getBoundingClientRect().right + (parseFloat(t.marginRight) || 0) > limite) { return true; }
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
