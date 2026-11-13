# Guide du site – Caroline Roulleau

Ce guide explique, pas à pas, comment **mettre le site en ligne gratuitement sur GitHub Pages**, **brancher le nouveau nom de domaine hypnose-roulleau.fr**, **garder les visiteurs et le référencement de c-hypnose.net**, puis **modifier le site vous-même**.

---

## 1. Avant la mise en ligne : 2 choses à compléter, 2 à vérifier

1. **Votre numéro SIRET.** Dans `mentions-legales.html`, remplacez « à compléter ».
2. **Le formulaire de contact** (facultatif mais conseillé). Sans réglage, le bouton « Envoyer » ouvre la messagerie du visiteur avec son message déjà rédigé. Pour recevoir les messages directement :
   1. créez un compte gratuit sur https://formspree.io (50 messages par mois) ;
   2. créez un formulaire et copiez son adresse, du type `https://formspree.io/f/abcdwxyz` ;
   3. dans `contact.html`, remplacez `action="mailto:hypnose.roulleau@gmail.com"` par `action="https://formspree.io/f/abcdwxyz"` ;
   4. envoyez-vous un premier message de test et confirmez votre adresse e-mail quand Formspree vous le demande.
3. **À vérifier : l'accès au cabinet.** Les stations indiquées (métro Alma-Marceau, George V, Kléber, RER C Pont de l'Alma, bus 32 et 92) viennent d'un plan en ligne : corrigez-les si besoin dans `contact.html` (bloc « ACCÈS », où vous pouvez aussi ajouter l'étage ou le code) et dans `index.html` (section « Tarifs & contact »).
4. **À vérifier : les liens « Pour aller plus loin »** de l'accueil (7 émissions et articles, tous contrôlés le 13 novembre 2026). Les sites de radio et de presse changent parfois leurs adresses : cliquez-les de temps en temps.

**Votre photo** est en place : `assets/img/caroline-roulleau.jpg`. Elle apparaît à l'accueil, sur « Qui suis-je ? », et dans l'image d'aperçu affichée quand on partage le site (WhatsApp, Facebook…), `assets/img/partage.jpg`. La photo reçue est de taille moyenne (618 × 636 px) : si vous en avez une version plus grande, elle sera plus nette sur les écrans récents. Pour la remplacer, gardez le même nom de fichier, un format vertical 4:5 (idéalement 1000 × 1250 px) et un poids inférieur à 300 Ko (le site gratuit https://squoosh.app réduit le poids d'une photo en un clic). L'image de partage, elle, ne se met pas à jour toute seule : remplacez-la par une image de 1200 × 630 px si vous changez de photo.

---

## 2. Mettre le site en ligne sur GitHub Pages (gratuit)

1. Créez un compte gratuit sur https://github.com.
2. Cliquez sur **New repository** (nouveau dépôt). Nom : `site-hypnose`. Laissez **Public** (obligatoire pour la version gratuite ; ne mettez donc rien de privé dans ce dépôt). Cliquez sur **Create repository**.
3. Sur la page du dépôt, cliquez sur **uploading an existing file**, puis **glissez tout le contenu** du dossier du site (les fichiers `.html`, le dossier `assets`, `favicon.svg`, etc. — pas le dossier lui-même). Cliquez sur **Commit changes**.
   Le petit fichier caché `.nojekyll` peut ne pas apparaître dans votre explorateur : ce n'est pas grave.
4. Allez dans **Settings → Pages**. Dans **Source**, choisissez **Deploy from a branch**, branche **main**, dossier **/(root)**, puis **Save**.
5. Une minute plus tard, le site est en ligne à l'adresse `https://VOTRE-IDENTIFIANT.github.io/site-hypnose/`. Vérifiez-le.

---

## 3. Acheter et brancher hypnose-roulleau.fr

1. **Achetez le domaine** chez un registraire français (OVHcloud, Gandi…) : comptez une dizaine d'euros par an. Vérifiez d'abord qu'il est disponible.
2. **Dans GitHub** : Settings → Pages → **Custom domain** → saisissez `hypnose-roulleau.fr` → **Save**.
3. **Chez le registraire**, dans la « zone DNS » du domaine :
   - supprimez les enregistrements A/AAAA existants sur `hypnose-roulleau.fr` (page de parking) ;
   - ajoutez 4 enregistrements **A** pour `hypnose-roulleau.fr` :
     `185.199.108.153` · `185.199.109.153` · `185.199.110.153` · `185.199.111.153`
   - (conseillé) ajoutez 4 enregistrements **AAAA** :
     `2606:50c0:8000::153` · `2606:50c0:8001::153` · `2606:50c0:8002::153` · `2606:50c0:8003::153`
   - ajoutez un enregistrement **CNAME** pour `www` qui pointe vers `VOTRE-IDENTIFIANT.github.io.`
4. Attendez la propagation (de quelques minutes à 24 h), puis cochez **Enforce HTTPS** dans Settings → Pages.
5. (Conseillé) Dans les paramètres de votre **compte** GitHub (Settings → Pages), ajoutez et vérifiez votre domaine : cela empêche quiconque de l'utiliser sur GitHub.

---

## 4. Garder c-hypnose.net et le rediriger (référencement)

1. **Ne résiliez pas c-hypnose.net tout de suite** : gardez-le au moins un an. Les liens existants (Google, PagesJaunes, Facebook, annuaires) pointent encore dessus.
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

4. Ensuite seulement, résiliez l'abonnement Wix.

---

## 5. Après la mise en ligne

- **Google Search Console** (gratuit) : ajoutez `hypnose-roulleau.fr` et déclarez le plan du site `https://hypnose-roulleau.fr/sitemap.xml`. Si c-hypnose.net y est déjà validé, utilisez l'outil **Changement d'adresse**.
- **Mettez à jour l'adresse du site** partout : fiche Google (Google Business Profile), PagesJaunes (compte Solocal), Facebook, annuaires, signature e-mail, cartes de visite.

---

## 6. Modifier le site vous-même

**La méthode simple :** sur github.com, ouvrez le fichier (par exemple `contact.html`), cliquez sur le **crayon** (Edit), modifiez le texte, puis **Commit changes**. La modification est en ligne en une minute environ.

**Pour remplacer un mot dans tout le site** (téléphone, horaires…) : sur la page du dépôt, appuyez sur la touche **.** (point) : un éditeur s'ouvre dans le navigateur. Utilisez **Ctrl + Maj + H** (Rechercher/Remplacer dans tous les fichiers), puis enregistrez via l'icône « Source Control » → **Commit & Push**.

**Où se trouve quoi :**

| Je veux changer… | Fichier(s) |
|---|---|
| Les tarifs | `contact.html` (bloc « TARIFS »), `index.html` (section Tarifs & contact) ; et `"priceRange"` dans le bloc `application/ld+json` de `index.html` et `contact.html` |
| Le téléphone, l'adresse, les horaires | toutes les pages (pied de page), `contact.html`, `index.html`, `mentions-legales.html`, et le bloc `application/ld+json` de `index.html` et `contact.html` → utilisez Rechercher/Remplacer |
| Un texte de page | le fichier de la page (voir le tableau du README) |
| Les questions fréquentes | `index.html`, section « Questions fréquentes » |
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
