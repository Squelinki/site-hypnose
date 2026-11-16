# Site de Caroline Roulleau – Hypnothérapeute à Paris 16e

- **Adresse :** https://hypnose-roulleau.fr
- **Hébergement :** GitHub Pages (gratuit), publication automatique par GitHub Actions
- **Modifier les textes, tarifs, avis, annonces :** CMS en ligne https://app.pagescms.org (gratuit)
- **Mode d'emploi complet (mise en place, CMS, annonces et décorations, référencement) :** [GUIDE.md](GUIDE.md)

| Dossier ou fichier | Rôle |
|---|---|
| `contenu/` | Textes et réglages du site (modifiés par le CMS) |
| `modeles/` | Mise en page des pages (HTML) |
| `assets/` | Styles, scripts, polices (licence SIL OFL 1.1 incluse) et images |
| `construire.py` | Fabrique le site dans `_site/` à partir de `contenu/` et `modeles/` |
| `.pages.yml` | Configuration du CMS |
| `.github/workflows/publier-le-site.yml` | Publication automatique à chaque modification |
| `CNAME`, `robots.txt`, `favicon.*`, `apple-touch-icon.png` | Nom de domaine, consignes aux moteurs de recherche, icônes |
| `assets/img/logo*.svg`, `assets/img/logo-hypnose-roulleau.png`, `assets/img/partage.jpg` | Logo « HR » et image de partage (voir GUIDE.md, section 7) |

Pages publiées : `index.html` (accueil), `l-hypnose-c-est-quoi.html`, `indications.html`, `deroulement-d-une-seance.html`, `qui-suis-je.html`, `contact.html` (tarifs et formulaire), `mentions-legales.html`, `404.html`.
