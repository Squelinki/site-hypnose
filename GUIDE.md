# Guide du site – Caroline Roulleau

Ce guide explique, pas à pas, comment **publier le site gratuitement sur GitHub Pages**, **brancher le nom de domaine hypnose-roulleau.fr**, **garder les visiteurs de c-hypnose.net**, **soigner le référencement sur Google**, puis **modifier le site vous-même**.

---

## 1. Points à vérifier

1. **L'accès au cabinet.** Les stations indiquées (métro Alma-Marceau, George V, Kléber, RER C Pont de l'Alma, bus 32 et 92) viennent d'un plan en ligne : corrigez-les si besoin dans `contact.html` (bloc « ACCÈS », où vous pouvez aussi ajouter l'étage ou le code) et dans `index.html` (section « Tarifs & contact »).
2. **Le code postal.** Le site indique 75016, comme l'ancien site. Les plans en ligne et les registres d'adresses indiquent plutôt **75116** pour la rue de Chaillot. Vérifiez lequel est le bon : pour Google, l'adresse doit être écrite **exactement de la même façon** partout (site, fiche Google, PagesJaunes, Facebook). Pour la changer dans tout le site, utilisez Rechercher/Remplacer (section 6).
3. **Les liens « Pour aller plus loin »** de l'accueil (7 émissions et articles, tous contrôlés le 13 novembre 2026). Les sites de radio et de presse changent parfois leurs adresses : cliquez-les de temps en temps.
4. **La section « Avis » des mentions légales.** Elle indique qu'aucune contrepartie (réduction, cadeau…) n'a été offerte en échange des avis Facebook affichés sur l'accueil. Si ce n'est pas exact, supprimez cette phrase dans `mentions-legales.html` (repère « À VÉRIFIER »).
5. **Les liens Instagram, Facebook et LinkedIn** (pied de page, page contact) : cliquez-les une fois pour vérifier qu'ils ouvrent les bons profils.

**Le formulaire de contact** est relié à Formspree (offre gratuite : 50 messages par mois). Les messages arrivent dans la boîte mail de votre compte Formspree, avec pour objet « Demande de rendez-vous – » suivi du nom saisi. Pour utiliser un autre formulaire Formspree, remplacez l'adresse `action="https://formspree.io/f/…"` dans `contact.html`.

**Votre photo** est en place : `assets/img/caroline-roulleau.jpg`. Elle apparaît à l'accueil, sur « Qui suis-je ? », et dans l'image d'aperçu affichée quand on partage le site (WhatsApp, Facebook…), `assets/img/partage.jpg`. La photo reçue est de taille moyenne (618 × 636 px) : si vous en avez une version plus grande, elle sera plus nette sur les écrans récents. Pour la remplacer, gardez le même nom de fichier, un format vertical 4:5 (idéalement 1000 × 1250 px) et un poids inférieur à 300 Ko (le site gratuit https://squoosh.app réduit le poids d'une photo en un clic). L'image de partage, elle, ne se met pas à jour toute seule : remplacez-la par une image de 1200 × 630 px si vous changez de photo.

---

## 2. Publier sur GitHub Pages (déjà fait)

Le site est publié depuis le dépôt `squelinki/site-hypnose`. Pour mémoire :

1. Sur la page du dépôt : **Add file → Upload files**, puis **glissez le contenu** du dossier du site (les fichiers `.html`, le dossier `assets`, etc. — pas le dossier lui-même). Les fichiers de même nom sont remplacés. Cliquez sur **Commit changes**.
2. Dans **Settings → Pages** : **Source** = **Deploy from a branch**, branche **main**, dossier **/(root)**.
3. Une minute plus tard, les changements sont en ligne.

---

## 3. Le nom de domaine hypnose-roulleau.fr

Le domaine est déclaré dans GitHub (c'est le rôle du petit fichier `CNAME` : ne le supprimez pas). Pour qu'il fonctionne :

1. **Chez le registraire** (là où le domaine a été acheté), dans la « zone DNS » du domaine :
   - supprimez les enregistrements A/AAAA existants sur `hypnose-roulleau.fr` (page de parking) ;
   - ajoutez 4 enregistrements **A** pour `hypnose-roulleau.fr` :
     `185.199.108.153` · `185.199.109.153` · `185.199.110.153` · `185.199.111.153`
   - (conseillé) ajoutez 4 enregistrements **AAAA** :
     `2606:50c0:8000::153` · `2606:50c0:8001::153` · `2606:50c0:8002::153` · `2606:50c0:8003::153`
   - ajoutez un enregistrement **CNAME** pour `www` qui pointe vers `squelinki.github.io.`
2. Dans **Settings → Pages**, attendez le message **« DNS check successful »** (de quelques minutes à 24 h), puis cochez **Enforce HTTPS**. C'est important pour Google : le site doit s'ouvrir en `https://`, avec ou sans `www`.
3. (Conseillé) Dans les paramètres de votre **compte** GitHub (Settings → Pages), ajoutez et vérifiez votre domaine : cela empêche quiconque de l'utiliser sur GitHub.

---

## 4. Garder c-hypnose.net et le rediriger

1. **Ne résiliez pas c-hypnose.net tout de suite** : gardez-le au moins un an. Les liens existants (Google, PagesJaunes, Facebook, annuaires) pointent encore dessus, et son ancienneté profite au nouveau site s'il est redirigé.
2. **Vérifiez où il est enregistré.** Dans Wix : Paramètres → Domaines. S'il a été acheté via Wix, transférez-le chez le même registraire que le nouveau domaine (« transférer hors de Wix » vous donne un code d'autorisation) **avant** de résilier l'abonnement Wix.
3. **Mettez en place une redirection permanente (301)** de `c-hypnose.net` vers `https://hypnose-roulleau.fr` (option « redirection web permanente » chez la plupart des registraires). Si l'option conserve le chemin, les anciennes adresses arrivent directement sur la bonne page, car les pages gardent les mêmes noms :

   | Ancienne adresse | Nouvelle adresse |
   |---|---|
   | c-hypnose.net/ | hypnose-roulleau.fr/ |
   | c-hypnose.net/l-hypnose-c-est-quoi | hypnose-roulleau.fr/l-hypnose-c-est-quoi.html |
   | c-hypnose.net/indications | hypnose-roulleau.fr/indications.html |
   | c-hypnose.net/deroulement-d-une-seance | hypnose-roulleau.fr/deroulement-d-une-seance.html |
   | c-hypnose.net/qui-suis-je | hypnose-roulleau.fr/qui-suis-je.html |
   | c-hypnose.net/contact | hypnose-roulleau.fr/contact.html |

4. Ensuite seulement, résiliez l'abonnement Wix. Tant que l'ancien site reste en ligne sans redirection, Google voit deux sites aux textes identiques et peut hésiter entre les deux.

---

## 5. Référencement (Google, Bing…)

**Déjà en place dans le site :** un titre et une description propres à chaque page (ce qui s'affiche dans Google), un titre principal clair par page, l'adresse officielle de chaque page (« canonical »), le plan du site `sitemap.xml`, le fichier `robots.txt`, des données structurées que Google lit directement (nom du cabinet, adresse, téléphone, horaires, tarifs, Caroline et sa formation, réseaux sociaux, fil d'Ariane), l'image d'aperçu pour les partages, les icônes du site, des pages légères et adaptées au téléphone.

**À faire une fois, gratuitement, dans cet ordre :**

1. **Vérifiez que https://hypnose-roulleau.fr s'ouvre** avec le cadenas (section 3).
2. **Google Search Console** (https://search.google.com/search-console) : **Ajouter une propriété** → type **Domaine** → `hypnose-roulleau.fr`. Google vous donne un enregistrement **TXT** : ajoutez-le dans la zone DNS chez le registraire, puis cliquez sur **Valider**. Ensuite :
   - menu **Sitemaps** → saisissez `sitemap.xml` → **Envoyer** ;
   - menu **Inspection de l'URL** → collez `https://hypnose-roulleau.fr/` → **Demander l'indexation**.
   (Si vous préférez la méthode « Balise HTML », un emplacement est prévu en haut de `index.html`, repère « GOOGLE SEARCH CONSOLE ».)
3. **Bing Webmaster Tools** (https://www.bing.com/webmasters) : choisissez **Importer depuis Google Search Console**. Bing alimente aussi Copilot et DuckDuckGo.
4. **La fiche Google (Google Business Profile)** — c'est le plus important pour apparaître dans Google Maps et sur « hypnothérapeute Paris 16 ». Sur https://business.google.com, créez ou récupérez la fiche du cabinet, avec **exactement** le même nom, la même adresse et le même téléphone que sur le site, la catégorie la plus proche de l'hypnothérapie, les horaires, l'adresse du site `https://hypnose-roulleau.fr/` et quelques photos. Proposez ensuite aux personnes satisfaites de laisser un avis Google : le nombre et la fraîcheur des avis comptent beaucoup.
5. **Mettez à jour l'adresse du site partout** : page Facebook (champ « Site web »), bio Instagram, profil LinkedIn, PagesJaunes (compte Solocal), annuaires de praticiens (dont celui de votre école de formation, s'il existe), signature e-mail, cartes de visite. Chaque lien vers le site aide son référencement.
6. **Redirigez c-hypnose.net** (section 4). Si c-hypnose.net est aussi validé dans la Search Console, utilisez ensuite l'outil **Changement d'adresse**.

**Au fil des modifications :**

- chaque page a son propre titre (`<title>`, 60 caractères au plus) et sa propre description (`<meta name="description">`, 155 caractères au plus) en haut du fichier : si vous changez le sujet d'une page, adaptez-les ;
- gardez **un seul** titre `<h1>` par page ;
- pour une nouvelle image : un nom de fichier parlant (ex. `cabinet-hypnose-paris-16.jpg`), un texte `alt="…"` qui la décrit, un poids inférieur à 300 Ko ;
- si vous créez une page : ajoutez-la au menu de chaque page et dans `sitemap.xml` (copiez une ligne `<url>…</url>`) ;
- soyez patient : Google met de quelques jours à quelques semaines à prendre en compte un nouveau site. La Search Console (menu **Performances**) montre ensuite les recherches qui vous amènent des visiteurs.

---

## 6. Modifier le site vous-même

**La méthode simple :** sur github.com, ouvrez le fichier (par exemple `contact.html`), cliquez sur le **crayon** (Edit), modifiez le texte, puis **Commit changes**. La modification est en ligne en une minute environ.

**Pour remplacer un mot dans tout le site** (téléphone, horaires…) : sur la page du dépôt, appuyez sur la touche **.** (point) : un éditeur s'ouvre dans le navigateur. Utilisez **Ctrl + Maj + H** (Rechercher/Remplacer dans tous les fichiers), puis enregistrez via l'icône « Source Control » → **Commit & Push**.

**Où se trouve quoi :**

| Je veux changer… | Fichier(s) |
|---|---|
| Les tarifs | `contact.html` (bloc « TARIFS »), `index.html` (section Tarifs & contact) ; et `"priceRange"` dans le bloc `application/ld+json` de `index.html` et `contact.html` |
| Le téléphone, l'adresse, les horaires | toutes les pages (pied de page), `contact.html`, `index.html`, `mentions-legales.html`, et le bloc `application/ld+json` de `index.html` et `contact.html` → utilisez Rechercher/Remplacer |
| Le titre et la description d'une page dans Google | en haut du fichier de la page : `<title>…</title>` et `<meta name="description" content="…">`, ainsi que les lignes `og:title` et `og:description` juste en dessous (aperçu sur Facebook et WhatsApp) |
| Un texte de page | le fichier de la page (voir le tableau du README) |
| Les questions fréquentes | `index.html`, section « Questions fréquentes » |
| Les avis (témoignages) | `index.html`, section « Témoignages » : copiez un bloc `<li>…</li>` entier et placez-le en premier (le plus récent d'abord), puis changez le texte, le prénom suivi de l'initiale du nom, et la date (deux fois dans le bloc). Mettez à jour le nombre d'avis dans cette section (« sur 11 avis ») **et** en haut de la page (« 11 avis Facebook »). N'affichez que de vrais avis, publiés par leurs auteurs, avec leur date |
| Les liens Instagram, Facebook et LinkedIn | le pied de page de **chaque** page (repère « RÉSEAUX SOCIAUX »), `contact.html` (bloc « Me joindre ») et `"sameAs"` dans le bloc `application/ld+json` de `index.html`, `contact.html` et `qui-suis-je.html` → utilisez Rechercher/Remplacer |
| L'adresse du formulaire (Formspree) | `contact.html` : `action="https://formspree.io/f/…"` |
| Les liens « Pour aller plus loin » | `index.html`, section « Pour aller plus loin » : copiez un bloc `<li>…</li>` entier, puis changez l'adresse (`href="…"`), la source et la date, le titre et la phrase |
| L'accès (métro, bus), l'étage, le code | `contact.html` (bloc « ACCÈS ») et `index.html` (section « Tarifs & contact ») |
| Votre photo | remplacez `assets/img/caroline-roulleau.jpg` (Add file → Upload files) en gardant le même nom |
| Les animations | `assets/css/style.css`, section 21 « ANIMATIONS » (voir ci-dessous) |
| Les couleurs ou les polices | `assets/css/style.css`, section 1 « RÉGLAGES » (ex. `--sauge-profonde`) |
| Le menu ou le pied de page | dans **chaque** page (ils sont recopiés en haut et en bas de chaque fichier) |

**Les animations.** Le site comporte quelques animations discrètes : apparition en douceur du haut de chaque page, des blocs au fil du défilement, fondu enchaîné d'une page à l'autre (dans Chrome, Edge et Safari ; Firefox change de page normalement), ouverture en douceur des questions fréquentes (dans les navigateurs qui le permettent), légers effets au survol des boutons et des liens. Elles fonctionnent telles quelles sur GitHub Pages, sans aucun réglage. Elles se coupent automatiquement chez les visiteurs qui ont activé « Réduire les animations » sur leur téléphone ou leur ordinateur. Pour les supprimer complètement, effacez la section 21 de `assets/css/style.css` (le site reste identique, simplement immobile).

**Règles d'or :**
- ne modifiez que le texte **entre** les balises (`<p>…</p>`, `<h2>…</h2>`), jamais les balises elles-mêmes ;
- gardez les guillemets des attributs (`href="…"`) ;
- en cas d'erreur, onglet **History** du fichier → revenez à la version précédente.

---

## 7. Alternative d'hébergement

Les conditions de GitHub Pages excluent son usage pour « faire tourner une activité en ligne » ou un site marchand. Un site vitrine sans paiement en ligne est une zone grise plutôt qu'un cas interdit. Si vous préférez éviter toute ambiguïté, les mêmes fichiers se publient tels quels, sans aucune modification, sur **Cloudflare Pages** ou **Netlify**, reliés au même dépôt GitHub.
