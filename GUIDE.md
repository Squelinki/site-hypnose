# Guide du site – Caroline Roulleau

Le site se modifie désormais **sans toucher au code**, depuis un CMS en ligne gratuit (Pages CMS). Chaque modification enregistrée est publiée automatiquement par GitHub en 1 à 2 minutes.

```
Pages CMS (vous, Caroline)  →  dépôt GitHub squelinki/site-hypnose  →  GitHub construit le site  →  hypnose-roulleau.fr
```

---

## 1. Mise en place (une seule fois)

### 1.1 Passer la publication en mode « GitHub Actions »

1. Sur GitHub, ouvrez le dépôt `site-hypnose` → **Settings** → **Pages**.
2. Dans **Build and deployment**, rubrique **Source**, choisissez **GitHub Actions** (au lieu de « Deploy from a branch »).
   Le site actuel reste en ligne pendant ce temps. Si GitHub propose des modèles de workflow, ignorez-les.

### 1.2 Envoyer les nouveaux fichiers

1. Page du dépôt → **Add file** → **Upload files**.
2. Glissez **tout le contenu** du dossier `site-hypnose-roulleau` (pas le dossier lui-même), y compris le dossier **`.github`** et le fichier **`.pages.yml`**.
   Sur Mac, les noms qui commencent par un point sont cachés : dans le Finder, appuyez sur **Cmd + Maj + .** pour les afficher.
3. **Commit changes**.

### 1.3 Vérifier

1. Onglet **Actions** : la tâche **Publier le site** démarre. Au bout d'1 à 2 minutes, une coche verte apparaît.
2. Ouvrez https://hypnose-roulleau.fr : le site doit être identique.
3. Pour voir les décorations de décembre dès maintenant : https://hypnose-roulleau.fr/?apercu=15/12 (voir section 3).
4. **Settings → Pages** : vérifiez que le domaine `hypnose-roulleau.fr` est toujours indiqué et que **Enforce HTTPS** est coché.

### 1.4 Ranger (facultatif, après vérification)

Les anciennes pages à la racine du dépôt ne servent plus (le site est désormais fabriqué à partir des dossiers `contenu/` et `modeles/`). Vous pouvez supprimer :
`index.html`, `l-hypnose-c-est-quoi.html`, `indications.html`, `deroulement-d-une-seance.html`, `qui-suis-je.html`, `contact.html`, `mentions-legales.html`, `404.html`, `sitemap.xml` et `assets/img/mois-sans-tabac-caroline-roulleau.jpg` (l'image est maintenant dans `assets/img/medias/`).
Le plus simple : sur la page du dépôt, appuyez sur la touche **.** (point) ; un éditeur s'ouvre. Sélectionnez ces fichiers (Ctrl ou Cmd + clic), clic droit → **Delete**, puis icône **Source Control** → **Commit & Push**.

### 1.5 Ouvrir le CMS et inviter Caroline

1. Allez sur https://app.pagescms.org et cliquez sur **Sign in with GitHub** (votre compte GitHub).
2. Installez l'application GitHub **Pages CMS** quand elle vous est proposée : choisissez **Only select repositories** → `site-hypnose`.
3. Ouvrez le dépôt `site-hypnose` dans Pages CMS : les rubriques du site apparaissent à gauche.
4. **Inviter Caroline (ou quelqu'un d'autre)** : dans Pages CMS, ouvrez la page **Collaborators** du dépôt et saisissez son adresse e-mail. Elle reçoit un lien de connexion par e-mail : **pas besoin de compte GitHub**. Les personnes invitées peuvent modifier les textes et les images, mais pas la configuration du CMS.

Pages CMS est gratuit et open source. Il n'héberge rien : il enregistre directement les modifications dans votre dépôt GitHub.

---

## 2. Modifier le site avec le CMS

| Rubrique du CMS | Ce qu'elle change |
|---|---|
| **Annonces et décorations** | Les bandeaux, encarts et décorations de chaque période de l'année (section 3) |
| **Coordonnées, horaires et tarifs** | Téléphone, e-mail, adresse, accès, horaires, tarifs, moyens de paiement, réseaux sociaux, fiche Google, adresse du formulaire. Repris automatiquement sur toutes les pages et transmis à Google |
| **Avis** | Les témoignages de l'accueil (le plus récent en premier) et le nombre de recommandations |
| **Questions fréquentes** | La FAQ de l'accueil |
| **Lectures et émissions** | Les liens « Pour aller plus loin » de l'accueil |
| **Textes des pages** | Tous les textes de chaque page, ainsi que leur **titre et description dans Google** |

**Petites conventions d'écriture :**
- dans un texte long, **allez à la ligne** pour commencer un nouveau paragraphe ;
- dans un titre, mettez des **\*astérisques\*** autour des mots à afficher en italique vert : `Pourquoi choisir *l'hypnose ?*` ;
- dans la page « L'hypnose », une ligne qui commence par **>** est mise en valeur en grand ;
- les espaces insécables du français (avant « : ? ! », dans « 9 h », « 120 € »…) sont ajoutées automatiquement.

**Images** : envoyez-les depuis le CMS (médiathèque). Les photos trop lourdes sont réduites automatiquement sur le site. Le portrait de Caroline (`assets/img/caroline-roulleau.jpg`) et l'image de partage (`assets/img/partage.jpg`) ne passent pas par le CMS : pour les changer, demandez-moi ou remplacez-les sur GitHub en gardant le même nom.

**Après un enregistrement**, attendez 1 à 2 minutes puis rechargez le site (Ctrl + F5 ou Cmd + Maj + R pour éviter l'ancienne version en mémoire).

---

## 3. Annonces et décorations de l'année

Chaque annonce revient **toute seule chaque année** pendant sa période (heure de Paris), puis disparaît. Rien à faire d'une année sur l'autre : l'année affichée se met à jour seule.

| Période | Décoration | Bandeau en haut des pages | Encart sur l'accueil |
|---|---|---|---|
| 1er – 31 janvier | Paillettes dorées | « Belle et heureuse année 2027 ! » | « Et si cette année était celle du changement ? » |
| 7 – 14 février | Cœurs | « Bonne Saint-Valentin ! Prenez soin de vous et de ceux que vous aimez. » | – |
| La semaine de la Journée du sommeil, calculée chaque année (en 2027 : du 13 au 19 mars) | Lune et étoiles | Journée du sommeil (lien vers l'encart) | « Retrouver un sommeil apaisé » |
| 20 mars – 30 avril | Pétales de fleurs | – | – |
| Du lundi précédant Pâques au lundi de Pâques, calculé chaque année (en 2027 : du 22 au 29 mars) | Cloche de Pâques | « Joyeuses Pâques ! » | – |
| 1er – 7 mai | Brin de muguet à 13 clochettes, au pied de la photo | « Un brin de muguet pour vous porter bonheur ! » | – |
| 24 – 31 mai | – | Journée mondiale sans tabac (lien vers l'encart) | « Arrêter de fumer avec l'hypnose » |
| 21 juin – 31 août | Soleil d'été | « Bel été à toutes et à tous ! » | – |
| 1er – 30 septembre | – | – | « Une rentrée plus sereine » |
| 22 septembre – 31 octobre | Feuilles d'automne | – | – |
| 1er – 30 novembre | – | – | Mois sans tabac |
| 1er – 31 décembre | Guirlande lumineuse et neige | « Belles fêtes de fin d'année ! » | – |

**Dans le CMS** (rubrique *Annonces et décorations*), pour chaque annonce :
- **Activée** : décochez pour la mettre en pause ;
- **Début / Fin** au format JJ/MM (une période peut chevaucher deux années, ex. du 15/12 au 15/01), ou le nom d'une fête dont la date change chaque année (voir plus bas) ;
- **Décorations** : guirlande, neige, paillettes, pétales, muguet, soleil, feuilles, cœurs, cloche de Pâques, lune et étoiles (plusieurs possibles, ou aucune) ;
- **Bandeau** : une phrase courte en haut de toutes les pages, idéale pour vos **dates de fermeture** (« Le cabinet sera fermé du 24 au 26 décembre ») ;
- **Encart** : un bloc sur la page d'accueil, avec titre, texte, points clés, image et boutons.
Écrivez `{annee}` pour afficher l'année en cours. Pour ajouter une annonce : bouton **Add** en bas de la liste.

**Fêtes dont la date change chaque année : tout est automatique.** Dans *Début* et *Fin*, écrivez simplement **Pâques**, **Journée du sommeil**, **Fête des mères** ou **Fête des pères**, suivi si besoin d'un nombre de jours avant (-) ou après (+) : `Pâques -6` = 6 jours avant Pâques, `Pâques +1` = le lundi de Pâques. Le site recalcule la date tout seul chaque année ; rien à modifier d'une année sur l'autre. Les dates calculées pour l'année en cours et la suivante s'affichent dans le journal de publication (onglet **Actions** → **Publier le site** → étape **Construire le site**). La fête des mères suit la règle française (dernier dimanche de mai, ou premier dimanche de juin si c'est la Pentecôte).

Pour une nouvelle décoration, demandez-la-moi : elle s'ajoute ensuite à la liste du CMS.

**Voir le site à une autre date** : ajoutez `?apercu=JJ/MM` à l'adresse, ou `?apercu=JJ/MM/AAAA` pour une autre année, par exemple https://hypnose-roulleau.fr/?apercu=15/12 (Noël), https://hypnose-roulleau.fr/?apercu=01/05 (muguet), https://hypnose-roulleau.fr/?apercu=16/03/2027 (Journée du sommeil 2027) ou https://hypnose-roulleau.fr/?apercu=26/03/2027 (Pâques 2027). Seul votre écran est concerné.

### Les petites surprises au clic

Comme les clins d'œil de Google sur certaines recherches, chaque décoration cache une petite animation. Rien à régler : elles arrivent et repartent avec leur décoration.

| Décoration | Au clic |
|---|---|
| **Brin de muguet** (1er – 7 mai) | Le jeu des 13 clochettes : chaque clic fait tinter une clochette, qui s'allume. À la 13e (un brin à 13 clochettes porte bonheur), une pluie de muguet tombe sur la page avec un petit mot de Caroline. Puis le brin se remet à zéro pour une nouvelle partie. |
| **Cloche de Pâques** | Elle sonne et sème des œufs en chocolat qui rebondissent en bas du haut de page ; une petite histoire s'affiche clic après clic. |
| **Lune** (Journée du sommeil) | Elle s'endort (« Zzz… ») et glisse au troisième clic que l'hypnose peut aider à mieux dormir. |
| **Guirlande** (décembre) | Un clic sur une ampoule, en haut de page, lance une vague de lumière. |
| **Photo de Caroline** (accueil et « Qui suis-je ? ») | Pendant chaque période décorée, une gerbe aux couleurs du moment jaillit du clic : flocons, paillettes, cœurs, pétales, feuilles, étoiles, clochettes ou œufs. |

Pour que les visiteurs découvrent le muguet, la cloche et la lune, une bulle « Psst… » les invite à cliquer, une seule fois par visite (pour la revoir, ouvrez le site dans une fenêtre de navigation privée).

Les décorations sont discrètes et ne gênent aucun lien ni bouton. Le muguet, la cloche et la lune sont de vrais boutons (utilisables au clavier, annoncés par les lecteurs d'écran) ; le reste est ignoré par les lecteurs d'écran. Chez les visiteurs qui ont demandé à réduire les animations, rien ne bouge : les jeux affichent seulement leurs messages.

---

## 4. Si quelque chose ne va pas

- **Le site ne change pas après un enregistrement** : onglet **Actions** du dépôt. Une croix rouge signifie que la construction a échoué ; cliquez dessus, puis sur l'étape **Construire le site** : le message commence par **ERREUR** et explique le problème en français (date mal écrite, image introuvable…). **Le site en ligne n'est pas modifié** tant que l'erreur n'est pas corrigée. Corrigez dans le CMS et enregistrez de nouveau.
- **Revenir en arrière** : sur GitHub, ouvrez le fichier concerné dans `contenu/`, bouton **History**, choisissez une version précédente et recopiez-la.
- **Relancer la publication à la main** : onglet **Actions** → **Publier le site** → **Run workflow**.

---

## 5. Nom de domaine et ancien site

**hypnose-roulleau.fr** est déclaré dans **Settings → Pages** (champ *Custom domain*). Les réglages DNS chez le registraire restent ceux mis en place : 4 enregistrements **A** (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), 4 enregistrements **AAAA** conseillés (`2606:50c0:8000::153` à `2606:50c0:8003::153`) et un **CNAME** `www` → `squelinki.github.io.`

**c-hypnose.net** (ancien site Wix) doit être redirigé vers le nouveau site : c'est le rôle du dépôt `redirection-c-hypnose` (voir son README). Tant que l'ancien site reste en ligne, Google voit deux sites aux textes identiques et continue de montrer l'ancien. Gardez le domaine c-hypnose.net au moins un an, et ne résiliez l'abonnement Wix qu'une fois la redirection en place (et le domaine transféré, s'il a été acheté chez Wix).

---

## 6. Référencement (Google, Bing…)

**Déjà dans le site** : titre et description propres à chaque page (modifiables dans le CMS), données structurées (cabinet, adresse, téléphone, horaires, tarifs, Caroline, réseaux sociaux), plan du site `sitemap.xml` mis à jour automatiquement, `robots.txt`, image de partage, pages rapides et adaptées au téléphone.

**À faire, gratuitement, dans cet ordre :**
1. **Rediriger c-hypnose.net** (section 5).
2. **Google Search Console** (https://search.google.com/search-console) : *Ajouter une propriété* → *Domaine* → `hypnose-roulleau.fr`, validation par un enregistrement **TXT** chez le registraire. Puis **Sitemaps** → `sitemap.xml` → *Envoyer*, et **Inspection de l'URL** → `https://hypnose-roulleau.fr/` → *Demander l'indexation*.
3. **Bing Webmaster Tools** (https://www.bing.com/webmasters) → *Importer depuis Google Search Console*. Bing alimente aussi Copilot et DuckDuckGo.
4. **Revendiquer la fiche Google existante** (https://share.google/SU6ubBhQa9dX3cHF1) — idéalement par Caroline, avec son compte Google : ouvrez la fiche, cliquez sur le lien du type « Vous êtes le propriétaire de cet établissement ? », puis suivez la validation proposée par Google (vidéo du cabinet, appel, SMS, e-mail ou courrier). Une fois la fiche validée : vérifiez que nom, adresse et téléphone sont **écrits exactement comme sur le site**, choisissez la catégorie la plus proche de l'hypnothérapie, indiquez les horaires, le site `https://hypnose-roulleau.fr/`, une description et des photos. Caroline peut ensuite vous ajouter comme gestionnaire. Le site affiche déjà un lien « Laisser un avis Google » vers cette fiche ; après validation, remplacez-le dans le CMS (*Coordonnées* → *Fiche Google*) par le lien du bouton **Demander des avis**, qui ouvre directement le formulaire. Proposez ensuite aux personnes satisfaites de laisser un avis : la fiche n'en a encore aucun.
5. **Mettre à jour l'adresse du site partout** : Facebook (champ *Site web*), Instagram (bio), LinkedIn, PagesJaunes (fiche à réclamer gratuitement via un compte Solocal), Infobel, annuaires de praticiens et de votre école de formation, signature e-mail, cartes de visite.
6. **Le code postal** : la rue de Chaillot dépend du code **75116** pour La Poste. Le site affiche 75016, comme l'ancien. Choisissez-en un et utilisez-le partout (site, fiche Google, PagesJaunes, Facebook) : il se change en un clic dans le CMS.

Comptez quelques jours à quelques semaines pour que Google affiche le nouveau site. La Search Console (*Performances*) montre ensuite les recherches qui vous amènent des visiteurs.

---

## 7. Pour aller plus loin (modifier la mise en page)

| Dossier ou fichier | Rôle |
|---|---|
| `contenu/` | Tous les textes et réglages (ce que modifie le CMS) |
| `modeles/` | La mise en page de chaque page (HTML), `base.html` pour l'en-tête et le pied de page communs, `morceaux/date.js` pour la date du jour et le calcul des fêtes mobiles |
| `assets/css/style.css` | Couleurs, polices, mise en forme (section 1 « RÉGLAGES » pour les couleurs) ; section 20 bis pour les annonces et décorations |
| `assets/js/` | `main.js` (menu, animations, formulaire), `decorations.js` (décorations saisonnières : guirlande, neige, paillettes, pétales, muguet, soleil, feuilles, cœurs, cloche de Pâques, lune et étoiles, et leurs petites surprises au clic) |
| `assets/img/medias/` | Les images envoyées depuis le CMS |
| `construire.py` | Le programme qui fabrique le site à partir de `contenu/` et `modeles/` |
| `.pages.yml` | La configuration du CMS (rubriques et champs) |
| `.github/workflows/publier-le-site.yml` | La publication automatique |

Pour fabriquer le site sur un ordinateur : `pip install -r requirements.txt` puis `python construire.py` ; le résultat est dans le dossier `_site/`.
