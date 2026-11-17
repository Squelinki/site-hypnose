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
| **Vrai ou faux ?** | Le petit jeu de l'accueil, qui remplace la liste de questions : une affirmation, on répond « Vrai » ou « Faux », la carte se retourne et donne l'explication. L'interrupteur tout en haut l'active ou le désactive |
| **Questions fréquentes (FAQ)** | La FAQ classique de l'accueil (« Vos questions »), affichée à la place du jeu quand « Vrai ou faux ? » est désactivé |
| **Pages thématiques** | Les pages « Arrêt du tabac », « Sommeil », « Stress et anxiété », « Poids et alimentation », « Peurs et phobies » (section 3 bis) ; on peut en ajouter |
| **Surprise cachée** | Les phrases du pendule caché (section 3 bis) |
| **Bon cadeau** | La ligne discrète « Envie d'offrir une séance ? » sous les tarifs |
| **Calendrier de l'Avent** | Les 24 petits conseils bien-être du calendrier de l'Avent (un par jour, du 1er au 24 décembre) |
| **Lectures et émissions** | Les liens « Pour aller plus loin » de l'accueil |
| **Menu et pied de page** | Les noms des pages dans le menu, le bouton vert « Prendre rendez-vous », les titres et les liens du pied de page (repris aussi dans le fil d'Ariane des pages thématiques et pour Google). Case vide = nom d'origine. Les adresses des pages ne changent pas. Si les noms deviennent trop longs pour une ligne, le menu se resserre, puis le bouton se masque, puis le menu passe dans le bouton à trois traits : rien ne déborde ni ne se chevauche. Page « Accompagnements » (anciennement « Indications ») : voir la section 3 bis |
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
| 2 – 31 janvier | Galette des rois (jeu de la fève) | – | – |
| 1er – 2 février | Crêpe de la Chandeleur (à faire sauter) | « Bonne Chandeleur ! » | – |
| 7 – 14 février | Cœurs | « Bonne Saint-Valentin ! Prenez soin de vous et de ceux que vous aimez. » | – |
| La semaine de la Journée du sommeil, calculée chaque année (en 2027 : du 13 au 19 mars) | Lune et étoiles | Journée du sommeil (lien vers l'encart) | « Retrouver un sommeil apaisé » |
| 20 mars – 30 avril | Pétales de fleurs | – | – |
| Du lundi précédant Pâques au lundi de Pâques, calculé chaque année (en 2027 : du 22 au 29 mars) | Cloche de Pâques | « Joyeuses Pâques ! » | – |
| 1er avril | Poisson d'avril | – | – |
| 1er – 7 mai | Brin de muguet à 13 clochettes, au pied de la photo | « Un brin de muguet pour vous porter bonheur ! » | – |
| 24 – 31 mai | – | Journée mondiale sans tabac (lien vers l'encart) | « Arrêter de fumer avec l'hypnose » |
| 21 juin | Notes de musique (Fête de la musique) | – | – |
| 21 juin – 31 août | Soleil d'été et glace (une boule de plus à chaque clic) | « Bel été à toutes et à tous ! » | – |
| 10 – 14 juillet | Fanions bleu-blanc-rouge sous le menu, feu d'artifice dans le haut des pages et fusée à lancer (à la place de la glace) | – | – |
| 1er – 30 septembre | Ardoise de la rentrée (bonnes résolutions) | « C'est la rentrée : et si cette année, vous preniez du temps pour vous ? » | « Une rentrée plus sereine » |
| 22 septembre – 31 octobre | Feuilles d'automne | – | – |
| 4 – 10 octobre | – | Journée mondiale de la santé mentale (lien vers la page Accompagnements) | – |
| 1er – 30 novembre | – | Mois sans tabac (lien vers l'encart) | Mois sans tabac, avec le visuel |
| 1er – 24 décembre | Calendrier de l'Avent (le conseil du jour) | – | – |
| 1er – 31 décembre | Guirlande lumineuse et neige sur tout le site | « Belles fêtes de fin d'année ! » | « Des fêtes plus sereines » |

Les encarts s'affichent sur la page d'accueil, **juste sous la photo** : faites défiler la page pour les voir.

**Dans le CMS** (rubrique *Annonces et décorations*), pour chaque annonce :
- **Activée** : décochez pour la mettre en pause ;
- **Début / Fin** au format JJ/MM (une période peut chevaucher deux années, ex. du 15/12 au 15/01), ou le nom d'une fête dont la date change chaque année (voir plus bas) ;
- **Décorations** : guirlande, neige (en haut des pages) ou neige sur tout le site, paillettes, pétales, muguet, soleil, feuilles, cœurs, notes de musique, cloche de Pâques, lune et étoiles, galette des rois, crêpe, poisson d'avril, glace, feu d'artifice du 14 juillet, fanions bleu-blanc-rouge, ardoise de la rentrée, calendrier de l'Avent (plusieurs possibles, ou aucune) ;
- **Bandeau** : une phrase courte en haut de toutes les pages, idéale pour vos **dates de fermeture** (« Le cabinet sera fermé du 24 au 26 décembre ») ;
- **Encart** : un bloc sur la page d'accueil, avec titre, texte, points clés, image et boutons. L'image se retourne comme un badge (voir *Les petites surprises au clic*) ; la phrase gravée au dos se règle dans **Texte au dos de l'image** (vide = la phrase prévue pour l'occasion, par exemple « Bravo, vous avez trouvé l'œuf caché ! » à Pâques ou « Un jour après l'autre, vous allez y arriver ! » pour le Mois sans tabac ; pour une annonce que vous créez vous-même : « Bravo, vous avez trouvé la face cachée ! »).
Écrivez `{annee}` pour afficher l'année en cours. Pour ajouter une annonce : bouton **Add** en bas de la liste.

**Fêtes dont la date change chaque année : tout est automatique.** Dans *Début* et *Fin*, écrivez simplement **Pâques**, **Journée du sommeil**, **Fête des mères** ou **Fête des pères**, suivi si besoin d'un nombre de jours avant (-) ou après (+) : `Pâques -6` = 6 jours avant Pâques, `Pâques +1` = le lundi de Pâques. Le site recalcule la date tout seul chaque année ; rien à modifier d'une année sur l'autre. Les dates calculées pour l'année en cours et la suivante s'affichent dans le journal de publication (onglet **Actions** → **Publier le site** → étape **Construire le site**). La fête des mères suit la règle française (dernier dimanche de mai, ou premier dimanche de juin si c'est la Pentecôte).

Pour une nouvelle décoration, demandez-la-moi : elle s'ajoute ensuite à la liste du CMS.

**Voir le site à une autre date** : ajoutez `?apercu=JJ/MM` à l'adresse, ou `?apercu=JJ/MM/AAAA` pour une autre année, par exemple https://hypnose-roulleau.fr/?apercu=15/12 (Noël), https://hypnose-roulleau.fr/?apercu=01/05 (muguet), https://hypnose-roulleau.fr/?apercu=14/07 (14 juillet), https://hypnose-roulleau.fr/?apercu=16/03/2027 (Journée du sommeil 2027) ou https://hypnose-roulleau.fr/?apercu=26/03/2027 (Pâques 2027). Seul votre écran est concerné.

### Les petites surprises au clic

Comme les clins d'œil de Google sur certaines recherches, chaque décoration cache une petite animation. Rien à régler : elles arrivent et repartent avec leur décoration.

| Décoration | Au clic |
|---|---|
| **Galette des rois** (janvier) | Chaque clic sert une part ; la fève est cachée dans l'une des huit. Quand on la trouve, la couronne se soulève et des paillettes jaillissent : « Bravo, vous voilà reine ou roi du jour. Très belle année ! ». Puis une nouvelle galette arrive. |
| **Crêpe** (Chandeleur) | Elle saute et retombe dans la poêle. À la troisième, une pluie de pièces d'or (selon la tradition, on fait sauter la crêpe une pièce dans l'autre main pour la prospérité). |
| **Poisson d'avril** (1er avril) | Le poisson en papier se décolle et s'enfuit : « Poisson d'avril ! » |
| **Brin de muguet** (1er – 7 mai) | Le jeu des 13 clochettes : chaque clic fait tinter une clochette, qui s'allume. À la 13e (un brin à 13 clochettes porte bonheur), une pluie de muguet tombe sur la page avec un petit mot de Caroline. Puis le brin se remet à zéro pour une nouvelle partie. |
| **Cloche de Pâques** | Elle sonne et sème des œufs en chocolat qui rebondissent en bas du haut de page ; une petite histoire s'affiche clic après clic. |
| **Lune** (Journée du sommeil) | Elle s'endort (« Zzz… ») et glisse au troisième clic que l'hypnose peut aider à mieux dormir. |
| **Glace** (été) | Une boule de plus à chaque clic (vanille, fraise, pistache, abricot, puis chocolat avec sa cerise) ; le clic suivant sert une nouvelle glace. |
| **Fusée** (10 – 14 juillet) | Chaque clic lance une fusée qui éclate en bleu, puis en blanc, puis en rouge… À la 14e fusée (pour le 14 juillet), bouquet final sur toute la page : « Bon 14 juillet à toutes et à tous ! ». Puis on peut recommencer. |
| **Fanions** (10 – 14 juillet) | Un clic sur un fanion, en haut de page, fait onduler toute la ligne. |
| **Ardoise** (rentrée) | Elle écrit à la craie une bonne résolution (« Je prends du temps pour moi », « Je respire », « J'ose ! »…) et lance un avion en papier. |
| **Calendrier de l'Avent** (1er – 24 décembre) | Le paquet porte le numéro du jour ; ouvert, il offre le petit conseil bien-être du jour (modifiable dans le CMS, rubrique *Calendrier de l'Avent*). |
| **Guirlande** (décembre) | Un clic sur une ampoule, en haut de page, lance une vague de lumière. |
| **Image d'un encart** (Mois sans tabac, Journée mondiale sans tabac…) | Comme un badge de récompense sur une montre connectée : elle fait un tour complet en apparaissant, puis se retourne d'un clic (ou d'un glissé du doigt, sur téléphone ; à la souris, elle s'incline aussi un peu au survol). Au dos, sur fond vert gravé d'or : « Badge débloqué », le nom et la date de l'occasion (repris du surtitre de l'encart), et la phrase choisie dans le CMS. Tout encart avec une image en profite automatiquement. |
| **Photo de Caroline** (accueil et « Qui suis-je ? ») | Pendant chaque période décorée, une gerbe aux couleurs du moment jaillit du clic : flocons, paillettes, cœurs, notes, pétales, feuilles, étoiles, clochettes, œufs, pièces, petits poissons, avions en papier ou étincelles. |

Pour que les visiteurs découvrent ces petits jeux, une bulle « Psst… » les invite à cliquer, une seule fois par visite (pour la revoir, ouvrez le site dans une fenêtre de navigation privée).

**Un seul objet à cliquer à la fois** : quand deux périodes se chevauchent, c'est l'occasion la plus courte qui l'emporte. Du 10 au 14 juillet, la fusée remplace la glace, qui revient le 15 ; quand la semaine de Pâques englobe le 1er avril, le poisson d'avril passe ce jour-là avant la cloche, qui revient le lendemain. Les autres décorations (soleil, fanions, pétales…) s'ajoutent sans rien remplacer.

La **neige sur tout le site** (décembre) tombe légèrement devant toute la page, sans jamais gêner un clic. Les décorations sont discrètes et ne gênent aucun lien ni bouton. Les objets à cliquer sont de vrais boutons (utilisables au clavier, annoncés par les lecteurs d'écran) ; le reste est ignoré par les lecteurs d'écran. Chez les visiteurs qui ont demandé à réduire les animations, rien ne bouge : les jeux affichent seulement leurs messages.

---

## 3 bis. Mode nuit, pages thématiques, jeux et plan d'accès

**Tout est automatique** : rien à régler pour que ces nouveautés fonctionnent.

- **Mode nuit** : le bouton lune, en haut de chaque page, fait passer le site en couleurs sombres (un cercle s'agrandit depuis le bouton). La version claire reste celle par défaut ; le choix du visiteur est retenu sur son appareil pour les pages suivantes (aucun cookie).
- **Transitions entre les pages** : la page suivante monte en douceur, le trait du menu glisse jusqu'à la nouvelle rubrique et la photo de Caroline passe de l'accueil à la page « Qui suis-je ? » (Chrome, Edge et Safari récents ; les autres navigateurs changent de page normalement). Coupées si l'appareil demande moins d'animations.
- **Pages thématiques** (`hypnose-arret-du-tabac.html`, `hypnose-sommeil.html`, `hypnose-stress-anxiete.html`, `hypnose-poids.html`, `hypnose-phobies.html`) : de vraies pages, utiles aux visiteurs et à Google, rangées sous « Accompagnements » (le menu reste le même). Elles apparaissent toutes seules dans la page Accompagnements (« Zoom sur… »), sur l'accueil (« En savoir plus »), dans le pied de page et dans le plan du site pour Google. Pour en **ajouter** une : CMS → *Pages thématiques* → *Ajouter*, remplissez le nom court, l'adresse (ex. `hypnose-confiance-en-soi`), les titres et les paragraphes. Pour en retirer une sans l'effacer : décochez « Publiée ». Les textes ont été rédigés à partir de ceux du site : **faites-les relire par Caroline**.
- **Page « Accompagnements »** (anciennement « Indications ») : son adresse reste `indications.html`, Google et les liens existants continuent de fonctionner. Son nom apparaît à plusieurs endroits, tous modifiables dans le CMS :
  1. *Menu et pied de page* → Menu → « 2e lien » (menu du haut, et fil d'Ariane en haut des pages thématiques) ;
  2. *Textes des pages* → *Accueil* → Bloc « Accompagnements » → « Surtitre » et « Lien en bas du bloc » ;
  3. *Textes des pages* → *Accompagnements* → « Surtitre », « Titre dans Google » (facultatif) et « Lien vers cette page (bas des pages thématiques et pied de page) ».

  Dans le pied de page, cette page n'est plus dans la colonne « Le site » (pas de doublon) : c'est le dernier lien de la colonne « Accompagnements », « Tous les accompagnements → », sous la liste des pages thématiques. Le titre de la colonne se change dans *Menu et pied de page* → Pied de page → « Titre de la colonne « Accompagnements » ».
- **Pas de pages « cachées »** : des pages invisibles pour les visiteurs mais faites pour Google sont considérées par Google comme du référencement abusif (« pages satellites ») et peuvent faire baisser tout le site.
- **Calculateur « Combien vous coûte la cigarette ? »** (page Arrêt du tabac) : le visiteur indique depuis quand il a arrêté (ou sur quelle durée il compte arrêter) et combien il fumait ; le site affiche l'argent économisé, les étapes de santé déjà franchies (source : Tabac info service) et une médaille qui se retourne. Rien n'est enregistré. Le prix moyen du paquet se met à jour dans le CMS (page thématique, « Prix moyen d'un paquet »).
- **Vrai ou faux ?** (accueil) : score à la fin, bouton « Voir toutes les réponses » pour ceux qui ne veulent pas jouer. Sans JavaScript, les réponses s'affichent directement. **Pour revenir à la FAQ classique** : CMS → *Vrai ou faux ?* → désactivez l'interrupteur tout en haut, puis enregistrez. La liste « Vos questions » revient exactement comme avant (mêmes questions, même présentation, au même endroit) ; ses questions se modifient dans *Questions fréquentes (FAQ)*. Réactivez l'interrupteur pour remettre le jeu : rien n'est effacé, ni d'un côté ni de l'autre. Ne supprimez donc pas `contenu/faq.yml`.
- **Exercice de respiration** : durée au choix (1, 3 ou 5 minutes), bruit des vagues facultatif (fabriqué dans le navigateur, aucun fichier à charger), vibrations sur les téléphones Android, l'écran reste allumé pendant l'exercice, médaille « Bravo ! » à la fin. Il se met en pause tout seul si l'on change d'onglet.
- **Surprise cachée** : cinq clics rapides sur le logo du pied de page (ou taper « hypnose » au clavier d'un ordinateur) font apparaître un pendule qui se balance, avec les phrases réglées dans le CMS (*Surprise cachée*). « Se réveiller » ou la touche Échap referme. Pas de clignotement ; immobile si l'appareil demande moins d'animations.
- **Bon cadeau** : une ligne discrète sous les tarifs ; le lien prépare le début du message dans le formulaire et met « Demande de bon cadeau » dans l'objet du mail. La même ligne peut s'ajouter dans l'encart d'une annonce : case « Proposer d'offrir une séance » (cochée pour les fêtes de fin d'année, donc visible tout le mois de décembre, chaque année) ; son lien ouvre le formulaire avec le message déjà préparé. Le bon à imprimer est un document à part (PDF), à remplir à la main.
- **Page « Plan et accès »** (`plan-et-acces.html`) : l'adresse du cabinet avec les boutons d'itinéraire (Google Maps, Plans d'iPhone), le plan du quartier dessiné pour le site (cabinet, église, stations de métro, RER C, bus 32 et 92, itinéraire depuis Alma – Marceau) et les temps de marche. Le lien est dans la colonne « Le site » du pied de page de toutes les pages, et sous l'adresse sur l'accueil et sur la page Tarifs & contact. Sur ordinateur, le plan est à gauche, l'adresse et les transports à droite ; sur téléphone, l'adresse vient d'abord, puis le plan (qui s'ouvre centré sur le cabinet et défile de côté), puis les transports.
  - Textes de la page (surtitre, titre, phrase d'introduction, titre et description dans Google) : *Textes des pages* → *Plan et accès*. La première fois, le CMS peut afficher un bouton **Create file** : cliquez dessus, les textes actuels s'affichent, modifiez puis enregistrez. Tant que vous n'y touchez pas, la page garde ses textes d'origine.
  - Nom du lien (pied de page, accueil, Tarifs & contact) : *Menu et pied de page* → Pied de page → « 5e lien ».
  - **Le plan dessiné disparaît tout seul si l'adresse du cabinet change** dans le CMS (il ne montrerait plus le bon endroit) : la page reste, avec l'adresse, l'accès et les boutons d'itinéraire. Demandez-moi alors un nouveau plan, et changez la phrase d'introduction.
- **Visuels des occasions** : les encarts sans image (nouvelle année, Journée du sommeil, rentrée, fêtes de fin d'année) reçoivent automatiquement un visuel de la même famille que ceux de novembre et du 31 mai, qui se retourne comme un badge. Une image choisie dans le CMS reste prioritaire. Les fichiers (`assets/img/occasions/`) peuvent aussi servir sur Instagram ou Facebook.
- **Petits dessins** (pages thématiques, étapes de la séance, page introuvable) : dessinés pour le site, leurs couleurs suivent le mode clair ou nuit.

---

## 4. Si quelque chose ne va pas

- **Le site ne change pas après un enregistrement** : onglet **Actions** du dépôt. Une croix rouge signifie que la construction a échoué ; cliquez dessus, puis sur l'étape **Construire le site** : le message commence par **ERREUR** et explique le problème en français (date mal écrite, image introuvable…). **Le site en ligne n'est pas modifié** tant que l'erreur n'est pas corrigée. Corrigez dans le CMS et enregistrez de nouveau.
- **Revenir en arrière** : sur GitHub, ouvrez le fichier concerné dans `contenu/`, bouton **History**, choisissez une version précédente et recopiez-la. Les enregistrements faits depuis le CMS y apparaissent sous la forme « Update … (via Pages CMS) ».
- **Installer une mise à jour que je vous envoie** : page du dépôt → **Add file** → **Upload files**, glissez le contenu du dossier reçu, puis **Commit changes**. Ces paquets de mise à jour ne contiennent pas vos textes ni vos images (dossiers `contenu/` et `assets/img/medias/`), sauf un fichier nouveau ou un fichier que je vous signale dans mon message, préparé à partir de votre dernière version : ce que vous avez modifié dans le CMS est conservé. **N'envoyez plus le paquet complet `site-hypnose-roulleau`** : il remplacerait vos textes par ceux d'origine.
- **Relancer la publication à la main** : onglet **Actions** → **Publier le site** → **Run workflow**.
- **L'année du pied de page** (« © 2027 Caroline Roulleau ») change toute seule le 1er janvier, dans le navigateur des visiteurs. GitHub republie aussi le site chaque 1er janvier ; si le dépôt n'a reçu aucune modification depuis 60 jours, GitHub peut mettre cette tâche annuelle en pause (onglet **Actions** → **Publier le site** → **Enable workflow** pour la réactiver). Ce n'est pas grave : l'année affichée reste juste.

---

## 5. Nom de domaine et ancien site

**hypnose-roulleau.fr** est déclaré dans **Settings → Pages** (champ *Custom domain*). Les réglages DNS chez le registraire restent ceux mis en place : 4 enregistrements **A** (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), 4 enregistrements **AAAA** conseillés (`2606:50c0:8000::153` à `2606:50c0:8003::153`) et un **CNAME** `www` → `squelinki.github.io.`

**c-hypnose.net** (ancien site Wix) doit être redirigé vers le nouveau site : c'est le rôle du dépôt `redirection-c-hypnose` (voir son README). Tant que l'ancien site reste en ligne, Google voit deux sites aux textes identiques et continue de montrer l'ancien. Gardez le domaine c-hypnose.net au moins un an, et ne résiliez l'abonnement Wix qu'une fois la redirection en place (et le domaine transféré, s'il a été acheté chez Wix).

---

## 6. Référencement (Google, Bing…)

**Déjà dans le site** : titre et description propres à chaque page (modifiables dans le CMS), données structurées (cabinet, adresse, téléphone, horaires, tarifs, Caroline, réseaux sociaux), plan du site `sitemap.xml` mis à jour automatiquement, `robots.txt`, image de partage, pages rapides et adaptées au téléphone.

**À faire, gratuitement, dans cet ordre :**
1. ~~**Rediriger c-hypnose.net**~~ : fait.
2. **Google Search Console** (https://search.google.com/search-console) : *Ajouter une propriété* → *Domaine* → `hypnose-roulleau.fr`, validation par un enregistrement **TXT** chez le registraire. Puis **Sitemaps** → `sitemap.xml` → *Envoyer*, et **Inspection de l'URL** → `https://hypnose-roulleau.fr/` → *Demander l'indexation*.
3. **Bing Webmaster Tools** (https://www.bing.com/webmasters) → *Importer depuis Google Search Console*. Bing alimente aussi Copilot et DuckDuckGo.
4. **Revendiquer la fiche Google existante** (https://share.google/SU6ubBhQa9dX3cHF1) — idéalement par Caroline, avec son compte Google : ouvrez la fiche, cliquez sur le lien du type « Vous êtes le propriétaire de cet établissement ? », puis suivez la validation proposée par Google (vidéo du cabinet, appel, SMS, e-mail ou courrier). Une fois la fiche validée : vérifiez que nom, adresse et téléphone sont **écrits exactement comme sur le site**, choisissez la catégorie la plus proche de l'hypnothérapie, indiquez les horaires, le site `https://hypnose-roulleau.fr/`, une description et des photos. Caroline peut ensuite vous ajouter comme gestionnaire. Le site affiche déjà un lien « Laisser un avis Google » vers cette fiche ; après validation, remplacez-le dans le CMS (*Coordonnées* → *Fiche Google*) par le lien du bouton **Demander des avis**, qui ouvre directement le formulaire. Proposez ensuite aux personnes satisfaites de laisser un avis : la fiche n'en a encore aucun.
5. **Mettre à jour l'adresse du site partout** : Facebook (champ *Site web*), Instagram (bio), LinkedIn, PagesJaunes (fiche à réclamer gratuitement via un compte Solocal), Infobel, annuaires de praticiens et de votre école de formation, signature e-mail, cartes de visite.
6. **Le code postal** : la rue de Chaillot dépend du code **75116** pour La Poste. Utilisez le même partout (site, fiche Google, PagesJaunes, Facebook) : sur le site, il se change en un clic dans le CMS.

Comptez quelques jours à quelques semaines pour que Google affiche le nouveau site. La Search Console (*Performances*) montre ensuite les recherches qui vous amènent des visiteurs.

---

## 7. Logo

Le logo « HR » (Hypnose Roulleau) apparaît dans l'en-tête, le pied de page, l'onglet du navigateur, l'icône de l'écran d'accueil des téléphones, l'image de partage (Facebook, WhatsApp, LinkedIn…) et dans les données transmises à Google.

| Fichier | Rôle |
|---|---|
| `assets/img/logo.svg` | Le médaillon de l'en-tête et du pied de page |
| `assets/img/logo-hypnose-roulleau.svg` et `.png` | Le logo d'origine (fond transparent), déclaré à Google |
| `favicon.svg`, `favicon.ico` | L'icône de l'onglet (anneau un peu plus épais pour rester lisible en tout petit) |
| `apple-touch-icon.png` | L'icône quand on ajoute le site à l'écran d'accueil d'un iPhone ou d'un iPad |
| `assets/img/partage.jpg` | L'image qui s'affiche quand on partage un lien du site |

**L'icône de l'onglet se met à jour toute seule.** Les navigateurs gardent longtemps en mémoire la petite icône d'un site. Pour l'éviter, son adresse porte une empreinte qui change automatiquement dès que le fichier change (par exemple `favicon.svg?v=1a2b3c4d`) : à la visite suivante, le navigateur charge la nouvelle icône. Il en va de même pour le logo, les styles et les scripts. Si votre onglet montre encore l'ancienne icône juste après une mise à jour, attendez quelques minutes puis fermez l'onglet et rouvrez le site. Dans les résultats de Google, l'icône change au prochain passage de Google sur le site (quelques jours à quelques semaines).

Pour changer de logo, demandez-moi : les icônes et l'image de partage doivent être refaites en même temps.

---

## 8. Pour aller plus loin (modifier la mise en page)

| Dossier ou fichier | Rôle |
|---|---|
| `contenu/` | Tous les textes et réglages (ce que modifie le CMS) |
| `modeles/` | La mise en page de chaque page (HTML), `base.html` pour l'en-tête et le pied de page communs, `theme.html` pour les pages thématiques, `morceaux/date.js` pour la date du jour et le calcul des fêtes mobiles, `acces.html` et `morceaux/plan.html` pour la page « Plan et accès » et son plan dessiné, `illustrations/` pour les petits dessins |
| `assets/css/style.css` | Couleurs, polices, mise en forme (section 1 « RÉGLAGES » pour les couleurs) ; section 20 bis pour les annonces et décorations |
| `assets/js/` | `main.js` (menu, animations, formulaire), `decorations.js` (décorations saisonnières et leurs petites surprises au clic) |
| `assets/img/medias/` | Les images envoyées depuis le CMS |
| `assets/img/occasions/` | Les visuels fournis avec le site pour les encarts (nouvelle année, Journée du sommeil, rentrée, fêtes) |
| `contenu/calendrier-avent.yml` | Les conseils du calendrier de l'Avent (rubrique du CMS) |
| `construire.py` | Le programme qui fabrique le site à partir de `contenu/` et `modeles/` |
| `.pages.yml` | La configuration du CMS (rubriques et champs) |
| `.github/workflows/publier-le-site.yml` | La publication automatique |

Pour fabriquer le site sur un ordinateur : `pip install -r requirements.txt` puis `python construire.py` ; le résultat est dans le dossier `_site/`.
