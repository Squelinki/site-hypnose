"""Construit le site de Caroline Roulleau dans le dossier _site/.

Les textes, tarifs, avis, annonces… sont dans le dossier contenu/ (modifiables avec le CMS, voir GUIDE.md).
La mise en page est dans le dossier modeles/. Les images, styles et scripts sont dans assets/.
GitHub lance ce script tout seul à chaque modification (voir .github/workflows/publier-le-site.yml).

Pour l'essayer sur un ordinateur :  pip install -r requirements.txt  puis  python construire.py
"""
import datetime
import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path
from zoneinfo import ZoneInfo

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined, Undefined, pass_context

try:
    from PIL import Image, ImageOps
except ImportError:  # Pillow absent : les images sont copiées telles quelles
    Image = ImageOps = None

ICI = Path(__file__).resolve().parent
SORTIE = ICI / "_site"
SITE_URL = "https://hypnose-roulleau.fr"
FICHIERS_RACINE = ["favicon.ico", "favicon.svg", "apple-touch-icon.png", "robots.txt", "CNAME"]
AUJOURDHUI = datetime.datetime.now(ZoneInfo("Europe/Paris")).date()
ANNEE = AUJOURDHUI.year
JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
        "septembre", "octobre", "novembre", "décembre"]
EFFETS = {"guirlande", "neige", "flocons", "paillettes", "petales", "muguet", "soleil", "feuilles", "coeurs", "cloches", "lune",
          "notes", "galette", "crepe", "poisson", "rentree", "avent", "glace", "feux", "fanions"}
ICONES = {"soleil", "feuille", "fleches", "montagne", "etoile"}
ILLUSTRATIONS = {"tabac", "sommeil", "stress", "poids", "phobies", "aucune"}
# Pages du site qu'une page thématique ne doit pas remplacer
RESERVEES = {"index", "l-hypnose-c-est-quoi", "indications", "deroulement-d-une-seance", "qui-suis-je", "contact",
             "plan-et-acces", "mentions-legales", "404", "sitemap", "robots", "favicon"}


class Erreur(Exception):
    """Erreur de contenu, expliquée en français dans le journal de GitHub."""


def lire(chemin, facultatif=False):
    fichier = ICI / "contenu" / chemin
    if facultatif and not fichier.is_file():
        return None
    try:
        return yaml.safe_load(fichier.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as e:
        raise Erreur(f"Le fichier contenu/{chemin} est mal formé : {e}")


def chaine(v):
    return "" if v is None else str(v)


# ---------------------------------------------------------------------------
# Mise en forme des textes saisis dans le CMS
# ---------------------------------------------------------------------------
def esc(v):
    return html.escape(chaine(v), quote=False)


def attr(v):
    return html.escape(chaine(v).strip(), quote=True)


def italique(t, classe=""):
    return re.sub(r"\*(.+?)\*", lambda m: f"<em{classe}>{m.group(1)}</em>", t)


def texte(v, annonce=False):
    """Texte simple : *mot* = italique. Dans les annonces, « 1er » s'écrit en exposant."""
    t = italique(esc(v).strip())
    if annonce:
        t = re.sub(r"\b1er\b", "1<sup>er</sup>", t)
    return t


def ou(v, defaut):
    """Texte saisi dans le CMS, ou le texte d'origine si la case est vide (ou pas encore dans le fichier)."""
    if isinstance(v, Undefined):
        return defaut
    return " ".join(chaine(v).split()) or defaut


def titre(v, insecable=False):
    """Titre : *mot* = italique (vert) ; chaque retour à la ligne devient un passage à la ligne."""
    lignes = [l.strip() for l in chaine(v).strip().splitlines() if l.strip()]
    sortie = []
    for i, l in enumerate(lignes):
        l = italique(esc(l), ' class="nw"' if insecable else "")
        if insecable and i > 0:
            l = f'<span class="nw">{l}</span>'
        sortie.append(l)
    return "<br>".join(sortie)


def paragraphes(v, classe=None, indent=0, annonce=False):
    """Texte long : une ligne = un paragraphe ; une ligne qui commence par > est mise en valeur."""
    marge = " " * indent
    sortie = []
    for l in chaine(v).splitlines():
        l = l.strip()
        if not l:
            continue
        if l.startswith(">"):
            sortie.append(f'{marge}<p class="pull">{texte(l[1:].strip(), annonce)}</p>')
        else:
            c = f' class="{classe}"' if classe else ""
            sortie.append(f"{marge}<p{c}>{texte(l, annonce)}</p>")
    return "\n".join(sortie)


def annee(t):
    return t.replace("{annee}", f"<span data-annee>{ANNEE}</span>")


@pass_context
def lien(ctx, url):
    """Liens saisis dans le CMS : adresses complètes, ancres, ou pages du site (contact.html#…)."""
    url = chaine(url).strip()
    if re.match(r"^(https?:|mailto:|tel:|#|//)", url):
        return attr(url)
    url = url.lstrip("/")
    if ctx.get("fichier") == "index.html" and url.startswith("index.html#"):
        return attr(url[len("index.html"):])          # ancre sur la page elle-même
    return attr(ctx.get("root", "") + url)


def version(chemin):
    """Adresse d'un fichier du site suivie d'une empreinte de son contenu (favicon.svg?v=1a2b3c4d).
    Quand le fichier change (nouveau logo, nouveaux styles…), son adresse change aussi : les navigateurs
    chargent aussitôt la nouvelle version au lieu de garder l'ancienne en mémoire (l'icône de l'onglet, surtout)."""
    f = SORTIE / chemin
    if not f.is_file():
        return chemin
    return f"{chemin}?v={hashlib.sha256(f.read_bytes()).hexdigest()[:8]}"


def dimensions(chemin):
    """Largeur et hauteur réelles d'une image (évite que la page « saute » au chargement)."""
    f = SORTIE / chaine(chemin).strip().lstrip("/")
    if not f.is_file():
        raise Erreur(f"Image introuvable : {chemin}. Vérifiez qu'elle a bien été envoyée dans la médiathèque.")
    if Image is None:
        return ""
    with Image.open(f) as im:
        return f' width="{im.width}" height="{im.height}"'


def typo(page):
    """Espaces insécables du français, seulement dans le texte visible."""
    morceaux = re.split(r"(<script[\s\S]*?</script>|<style[\s\S]*?</style>|<!--[\s\S]*?-->|<title>[\s\S]*?</title>)", page)
    mots = r"(rendez-vous|vous-même|suis-je|c'est-à-dire|appelez-moi|envoyez-moi|écrivez-moi|contactez-moi)"

    def corrige(m):
        t = m.group(0)[1:-1]
        t = re.sub(r" ([?!:;»])", "\u00a0\\1", t)
        t = t.replace("« ", "«\u00a0")
        t = re.sub(r"(\d) (€|%)", "\\1\u00a0\\2", t)                 # 120 €, 100 %
        t = re.sub(r"(\d) (h|min|jours?)\b", "\\1\u00a0\\2", t)      # 9 h, 5 min, 30 jours
        t = re.sub(r"\b(ligne|RER) (\w)", "\\1\u00a0\\2", t)         # ligne 9, RER C
        t = t.replace("George V", "George\u00a0V")
        # mots composés à ne jamais couper en fin de ligne
        if re.search(mots, t):
            avant = t[:len(t) - len(t.lstrip())]
            apres = t[len(t.rstrip()):]
            t = avant + "<span>" + re.sub(mots, r'<span class="nw">\1</span>', t.strip()) + "</span>" + apres
        return ">" + t + "<"

    return "".join(p if i % 2 else re.sub(r">[^<]+<", corrige, p) for i, p in enumerate(morceaux))


def slug(t):
    t = unicodedata.normalize("NFKD", chaine(t)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-") or "annonce"


# ---------------------------------------------------------------------------
# Infos pratiques : valeurs calculées (téléphone, horaires, tarifs…)
# ---------------------------------------------------------------------------
def heure(v, ou):
    """« 9 h », « 9 h 30 », « 9h30 » ou « 09:30 » -> (9, 30)."""
    if isinstance(v, int):           # 19:00 non entre guillemets est lu comme un nombre de minutes
        return divmod(v, 60)
    m = re.fullmatch(r"\s*(\d{1,2})\s*(?:h|:)\s*(\d{2})?\s*", chaine(v))
    if not m or int(m.group(1)) > 23:
        raise Erreur(f"Heure non comprise dans {ou} : « {v} ». Écrivez par exemple 9 h ou 18 h 30.")
    return int(m.group(1)), int(m.group(2) or 0)


def heure_texte(h, mn):
    return f"{h} h" + (f" {mn:02d}" if mn else "")


def jours_texte(jours, ou):
    try:
        idx = sorted({JOURS.index(chaine(j).strip().lower()) for j in jours})
    except ValueError:
        raise Erreur(f"Jour inconnu dans {ou} : {jours}")
    if not idx:
        raise Erreur(f"Aucun jour choisi dans {ou}.")
    noms = [JOURS[i] for i in idx]
    if len(idx) >= 3 and idx == list(range(idx[0], idx[-1] + 1)):
        return f"du {noms[0]} au {noms[-1]}", idx
    if len(idx) == 1:
        return f"le {noms[0]}", idx
    return ", ".join(noms[:-1]) + " et " + noms[-1], idx


def preparer_infos(infos):
    tel = re.sub(r"\D", "", chaine(infos.get("telephone")))
    if len(tel) < 9:
        raise Erreur("Infos pratiques : le numéro de téléphone semble incomplet.")
    infos["tel"] = "+33" + tel[1:] if tel.startswith("0") else "+" + tel

    plages, longues, courtes, specs = infos.get("horaires") or [], [], [], []
    if not plages:
        raise Erreur("Infos pratiques : indiquez au moins une plage d'horaires.")
    for n, p in enumerate(plages, 1):
        ou = f"les horaires (plage {n})"
        jours, idx = jours_texte(p.get("jours") or [], ou)
        h1, h2 = heure(p.get("de"), ou), heure(p.get("a"), ou)
        longues.append(f"{jours}, de {heure_texte(*h1)} à {heure_texte(*h2)}")
        courtes.append(f"{jours}, {heure_texte(*h1)} – {heure_texte(*h2)}")
        specs.append({"@type": "OpeningHoursSpecification", "dayOfWeek": [DAYS[i] for i in idx],
                      "opens": "%02d:%02d" % h1, "closes": "%02d:%02d" % h2})
    majuscule = lambda s: s[:1].upper() + s[1:]
    infos["horaires_texte"] = majuscule(" ; ".join(longues))
    infos["horaires_court"] = majuscule(" ; ".join(courtes))
    infos["horaires_google"] = specs

    for t in infos.get("tarifs") or []:
        try:
            prix = float(chaine(t.get("prix")).replace(",", ".").replace("€", "").strip())
        except ValueError:
            raise Erreur(f"Tarif non compris pour « {t.get('intitule')} » : {t.get('prix')}")
        t["prix_nombre"] = prix
        t["prix_texte"] = (f"{prix:.0f}" if prix.is_integer() else f"{prix:.2f}".replace(".", ",")) + " €"
        t["intitule_court"] = t.get("intitule_court") or t.get("intitule")
    prix = [t["prix_nombre"] for t in infos.get("tarifs") or []]
    infos["fourchette"] = (f"{min(prix):.0f} € – {max(prix):.0f} €" if len(set(prix)) > 1 else f"{prix[0]:.0f} €") if prix else ""

    p = chaine(infos.get("paiement")).strip()
    phrase = (p[:1].lower() + p[1:]).rstrip(".") + "."
    if infos.get("paiement_precision"):
        phrase += " " + chaine(infos["paiement_precision"]).strip().rstrip(".") + "."
    infos["paiement_phrase"] = esc(phrase)

    adresse = f"{infos.get('adresse')} {infos.get('code_postal')} {infos.get('ville')}"
    infos["plan_osm"] = "https://www.openstreetmap.org/search?query=" + re.sub(r" ", "%20", adresse)
    infos["plan_google"] = "https://www.google.com/maps/search/?api=1&amp;query=" + adresse.replace(" ", "+")

    infos["reseaux"] = [{"nom": nom, "icone": ic, "url": attr(infos.get(cle))}
                        for nom, ic, cle in [("Instagram", "instagram", "instagram"), ("Facebook", "facebook", "facebook"),
                                             ("LinkedIn", "linkedin", "linkedin")] if infos.get(cle)]
    infos["fiche_google"] = chaine(infos.get("fiche_google")).strip()
    return infos


def date_fr(d):
    return f"{'1er' if d.day == 1 else d.day} {MOIS[d.month - 1]} {d.year}"


def preparer_avis(avis):
    for x in avis.get("liste") or []:
        d = x.get("date")
        if not isinstance(d, datetime.date):
            try:
                d = datetime.date.fromisoformat(chaine(d).strip())
            except ValueError:
                raise Erreur(f"Avis de {x.get('nom')} : date non comprise « {d} » (format attendu : AAAA-MM-JJ).")
        x["date_iso"], x["date_texte"] = d.isoformat(), date_fr(d)
    avis["sans_commentaire"] = max(0, int(avis.get("recommandations") or 0) - len(avis.get("liste") or []))
    return avis


def preparer_lectures(lectures):
    groupes = []
    for type_, titre_, verbe in [("ecouter", "À écouter", "Écouter"), ("lire", "À lire", "Lire")]:
        liens = [l for l in lectures.get("liens") or [] if chaine(l.get("type")) == type_]
        for l in liens:
            l["meta"] = " · ".join(esc(chaine(l.get(k)).strip()) for k in ("source", "date", "duree") if chaine(l.get(k)).strip())
            l["lien"] = attr(l.get("lien"))
        if liens:
            groupes.append({"type": type_, "titre": titre_, "verbe": verbe, "liens": liens})
    lectures["groupes"] = groupes
    return lectures


# Fêtes dont la date change chaque année : calculées automatiquement (ici pour le journal de construction,
# et dans le navigateur des visiteurs par modeles/morceaux/date.js, qui fait le même calcul).
FETES = {
    "paques": "paques", "dimanche de paques": "paques",
    "journee du sommeil": "sommeil", "journee mondiale du sommeil": "sommeil",
    "journee internationale du sommeil": "sommeil", "journee nationale du sommeil": "sommeil",
    "fete des meres": "meres", "fete des peres": "peres",
}
NOMS_FETES = {"paques": "Pâques", "sommeil": "Journée du sommeil", "meres": "Fête des mères", "peres": "Fête des pères"}


def paques(an):
    """Dimanche de Pâques (calendrier grégorien, algorithme de Meeus)."""
    a, b, c = an % 19, an // 100, an % 100
    h = (19 * a + b - b // 4 - (b - (b + 8) // 25 + 1) // 3 + 15) % 30
    l = (32 + 2 * (b % 4) + 2 * (c // 4) - h - c % 4) % 7
    m = (a + 11 * h + 22 * l) // 451
    return datetime.date(an, (h + l - 7 * m + 114) // 31, (h + l - 7 * m + 114) % 31 + 1)


def date_fete(cle, an):
    un_jour = datetime.timedelta(days=1)
    if cle == "paques":
        return paques(an)
    if cle == "sommeil":          # Journée du sommeil : le vendredi qui précède le printemps (20 mars)
        d = datetime.date(an, 3, 19)
        return d - (d.weekday() - 4) % 7 * un_jour
    if cle == "meres":            # dernier dimanche de mai, ou premier dimanche de juin si c'est la Pentecôte
        d = datetime.date(an, 5, 31)
        d -= (d.weekday() + 1) % 7 * un_jour
        return d + 7 * un_jour if d == paques(an) + 49 * un_jour else d
    d = datetime.date(an, 6, 1)   # fête des pères : troisième dimanche de juin
    return d + ((6 - d.weekday()) % 7 + 14) * un_jour


def sans_accents(t):
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")


def date_annonce(v, ou):
    """« 01/12 » -> ("01/12", "01/12") ; « Pâques -6 » -> ("paques-6", "Pâques -6") : code pour le site, texte lisible."""
    t = chaine(v).strip()
    m = re.fullmatch(r"(\d{1,2})\s*/\s*(\d{1,2})", t)
    if m:
        j, mo = int(m.group(1)), int(m.group(2))
        try:
            datetime.date(2024, mo, j)   # 2024 : année bissextile, le 29/02 est accepté
        except ValueError:
            raise Erreur(f"Date impossible pour l'annonce « {ou} » : « {v} ».")
        return f"{j:02d}/{mo:02d}", f"{j:02d}/{mo:02d}"
    n = sans_accents(t).lower().replace("−", "-").replace("–", "-")
    m = re.fullmatch(r"([a-z][a-z ]*?)\s*(?:([+-])\s*(\d{1,3})\s*(?:j|jours?)?)?", n)
    cle = FETES.get(re.sub(r"\s+", " ", m.group(1))) if m else None
    if not cle:
        raise Erreur(f"Date non comprise pour l'annonce « {ou} » : « {v} ». Formats acceptés : JJ/MM (par exemple 01/12), "
                     "ou une fête dont la date change chaque année : Pâques, Journée du sommeil, Fête des mères, Fête des pères, "
                     "éventuellement suivie d'un nombre de jours (par exemple Pâques -6 ou Pâques +1).")
    decalage = int(m.group(3) or 0) * (-1 if m.group(2) == "-" else 1)
    if abs(decalage) > 60:
        raise Erreur(f"Décalage trop grand pour l'annonce « {ou} » : « {v} » (60 jours au maximum).")
    texte = NOMS_FETES[cle] + (f" {decalage:+d}" if decalage else "")
    return f"{cle}{decalage:+d}" if decalage else cle, texte


def date_reelle(code, an):
    """Date d'un jour d'annonce pour une année donnée (pour le journal de construction)."""
    if "/" in code:
        j, mo = (int(x) for x in code.split("/"))
        return datetime.date(an, mo, min(j, 28) if mo == 2 and j == 29 else j)
    m = re.fullmatch(r"([a-z]+)([+-]\d+)?", code)
    return date_fete(m.group(1), an) + datetime.timedelta(days=int(m.group(2) or 0))


DOS_PAR_DEFAUT = "Bravo, vous avez trouvé la face cachée !"   # pour une annonce créée dans le CMS sans phrase prévue

# Phrase gravée au dos du badge, propre à chaque occasion (le champ « Texte au dos de l'image » du CMS reste prioritaire).
# Clé : le nom de l'annonce, sans accents ni majuscules.
DOS_PAR_OCCASION = {
    "nouvelle-annee": "Que cette année vous ressemble !",
    "galette-des-rois": "Bravo, vous avez trouvé la fève !",
    "chandeleur": "Retournée comme une crêpe : faites un vœu !",
    "saint-valentin": "Prenez soin de ceux que vous aimez… et de vous !",
    "journee-du-sommeil": "Bonne nuit… et beaux rêves !",
    "printemps": "Laissez fleurir le printemps en vous !",
    "poisson-d-avril": "Pas de blague : c'est bien gagné !",
    "paques": "Bravo, vous avez trouvé l'œuf caché !",
    "1er-mai": "Un brin de muguet porte-bonheur pour vous !",
    "journee-mondiale-sans-tabac": "Chaque jour sans tabac est une victoire !",
    "fete-de-la-musique": "Que la musique vous fasse du bien !",
    "ete": "Profitez de chaque rayon de soleil !",
    "14-juillet": "Vive la liberté d'être soi-même !",
    "rentree": "Belle rentrée, à votre rythme !",
    "automne": "Laissez tomber ce qui vous pèse !",
    "journee-mondiale-de-la-sante-mentale": "Prendre soin de soi, c'est essentiel !",
    "mois-sans-tabac": "Un jour après l'autre, vous allez y arriver !",
    "calendrier-de-l-avent": "Une douceur par jour jusqu'à Noël !",
    "fetes-de-fin-d-annee": "De belles fêtes, tout en douceur !",
}

# Visuels prêts à l'emploi pour les encarts qui n'ont pas d'image (une image choisie dans le CMS reste prioritaire).
# Clé : le nom de l'annonce, sans accents ni majuscules. Valeur : (image, description de l'image).
SIGNATURE = "Caroline Roulleau, hypnothérapeute ericksonienne et praticienne PNL"
VISUELS = {
    "nouvelle-annee": ("assets/img/occasions/nouvelle-annee.jpg",
                       f"Visuel « Et si cette année était celle du changement ? », avec des étoiles dorées : {SIGNATURE}"),
    "journee-du-sommeil": ("assets/img/occasions/journee-du-sommeil.jpg",
                           f"Visuel « Journée du sommeil : retrouver des nuits paisibles », avec une lune et des étoiles : {SIGNATURE}"),
    "rentree": ("assets/img/occasions/rentree.jpg",
                f"Visuel « Une rentrée plus sereine », avec un crayon et une feuille d'automne : {SIGNATURE}"),
    "fetes-de-fin-d-annee": ("assets/img/occasions/fetes.jpg",
                             f"Visuel « Des fêtes plus sereines », avec une couronne de Noël : {SIGNATURE}"),
}


def dos_du_badge(e, nom):
    """Texte gravé au dos de l'image d'un encart (l'image se retourne comme un badge de récompense).
    Le nom et la date viennent du surtitre (« Mois sans tabac · novembre {annee} ») ; la phrase, du champ « dos »."""
    morceaux = re.split(r"\s*[·•]\s*", chaine(e.get("surtitre")).strip(), maxsplit=1)
    nom_dos = morceaux[0].strip() or nom
    date_dos = morceaux[1].strip() if len(morceaux) > 1 else ""
    if not date_dos and "{annee}" not in nom_dos:
        date_dos = "{annee}"
    date_dos = date_dos[:1].upper() + date_dos[1:]
    defaut = DOS_PAR_OCCASION.get(slug(nom), DOS_PAR_DEFAUT)
    return nom_dos, date_dos, chaine(e.get("dos")).strip() or defaut


def preparer_annonces(donnees):
    annonces, ids = [], set()
    for a in donnees.get("annonces") or []:
        if not a.get("active"):
            continue
        nom = chaine(a.get("nom")).strip() or "Annonce"
        (a["du"], a["du_texte"]), (a["au"], a["au_texte"]) = date_annonce(a.get("du"), nom), date_annonce(a.get("au"), nom)
        base = slug(nom)
        a["id"], n = base, 2
        while a["id"] in ids:
            a["id"], n = f"{base}-{n}", n + 1
        ids.add(a["id"])
        effets = [chaine(e).strip() for e in a.get("decorations") or []]
        inconnus = [e for e in effets if e not in EFFETS]
        if inconnus:
            raise Erreur(f"Décoration inconnue pour l'annonce « {nom} » : {', '.join(inconnus)}.")
        a["decorations"] = effets
        a["bandeau"] = chaine(a.get("bandeau")).strip()
        e = a.get("encart") or {}
        e["afficher"] = bool(e.get("afficher") and chaine(e.get("titre")).strip())
        if e["afficher"] and not chaine(e.get("image")).strip() and slug(nom) in VISUELS:
            e["image"], alt = VISUELS[slug(nom)]          # visuel fourni avec le site
            e["image_alt"] = chaine(e.get("image_alt")).strip() or alt
        e["points"] = [p for p in e.get("points") or [] if chaine(p).strip()]
        e["bouton_cadeau"] = bool(e.get("bouton_cadeau"))   # ligne « Envie d'offrir une séance ? » (rubrique Bon cadeau)
        e["dos_nom"], e["dos_date"], e["dos_mot"] = dos_du_badge(e, nom)
        a["encart"] = e
        annonces.append(a)
    for a in annonces:   # fêtes à date variable : dates calculées, affichées dans le journal de GitHub
        if "/" not in a["du"] or "/" not in a["au"]:
            print(f"  {a['nom']} : " + ", ".join(
                f"{an} du {date_reelle(a['du'], an):%d/%m} au {date_reelle(a['au'], an):%d/%m}" for an in (ANNEE, ANNEE + 1)))
    decorations = [{"du": a["du"], "au": a["au"], "effets": a["decorations"]} for a in annonces if a["decorations"]]
    return annonces, (json.dumps(decorations, ensure_ascii=False, separators=(",", ":")) if decorations else "")


def preparer_avent(annonces):
    """Conseils du calendrier de l'Avent (un par jour, du 1er au 24 décembre), seulement si la décoration est utilisée."""
    if not any("avent" in a["decorations"] for a in annonces):
        return ""
    fichier = ICI / "contenu" / "calendrier-avent.yml"
    conseils = [chaine(c).strip() for c in ((lire("calendrier-avent.yml") if fichier.exists() else {}).get("conseils") or [])]
    conseils = [c for c in conseils if c]
    if not conseils:
        print("  Calendrier de l'Avent : aucun conseil saisi, le paquet souhaitera simplement une belle journée.")
    elif len(conseils) < 24:
        print(f"  Calendrier de l'Avent : {len(conseils)} conseils pour 24 jours, ils seront répétés.")
    return json.dumps(conseils, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


# ---------------------------------------------------------------------------
# Pages thématiques, « Vrai ou faux ? », surprise cachée, bon cadeau, plan d'accès
# ---------------------------------------------------------------------------
def nombre(v, defaut, ou):
    if v in (None, ""):
        return defaut
    try:
        return float(chaine(v).replace(",", ".").replace("€", "").strip())
    except ValueError:
        raise Erreur(f"Nombre non compris dans {ou} : « {v} ».")


def preparer_themes(infos):
    """Pages thématiques (dossier contenu/themes/, une page par fichier), rangées sous la page Accompagnements (indications.html)."""
    dossier = ICI / "contenu" / "themes"
    if not dossier.is_dir():
        return []
    themes, adresses = [], set()
    for f in sorted(list(dossier.glob("*.yml")) + list(dossier.glob("*.yaml"))):
        t = lire(f"themes/{f.name}")
        if not t or t.get("publier") is False:
            continue
        nom = chaine(t.get("titre_court")).strip()
        if not nom:
            raise Erreur(f"Page thématique contenu/themes/{f.name} : il manque le nom court.")
        adresse = slug(re.sub(r"\.html?$", "", chaine(t.get("adresse")).strip())) if chaine(t.get("adresse")).strip() \
            else "hypnose-" + slug(nom)
        if adresse in RESERVEES or adresse in adresses:
            raise Erreur(f"Page thématique « {nom} » : l'adresse {adresse}.html est déjà prise par une autre page. "
                         "Choisissez une autre adresse.")
        adresses.add(adresse)
        for cle, libelle in (("seo_titre", "titre pour Google"), ("titre", "titre"), ("introduction", "introduction")):
            if not chaine(t.get(cle)).strip():
                raise Erreur(f"Page thématique « {nom} » : il manque le {libelle}.")
        dessin = chaine(t.get("illustration")).strip() or "aucune"
        if dessin not in ILLUSTRATIONS:
            raise Erreur(f"Page thématique « {nom} » : illustration inconnue ({dessin}).")
        mot = chaine(t.get("tarif")).strip().lower()
        tarifs = infos.get("tarifs") or []
        choix = [x for x in tarifs if mot and mot in chaine(x.get("intitule")).lower()] or tarifs[:1]
        t.update(nom=nom, fichier=adresse + ".html", source=f"contenu/themes/{f.name}",
                 illustration="" if dessin == "aucune" else dessin, tarif_choisi=choix[0] if choix else None,
                 ordre=nombre(t.get("ordre"), 99, f"l'ordre de la page « {nom} »"),
                 resume=chaine(t.get("resume")).strip() or chaine(t.get("introduction")).strip(),
                 sections=[x for x in t.get("sections") or [] if chaine(x.get("titre")).strip() or chaine(x.get("texte")).strip()])
        if t.get("calculateur_tabac"):
            t["prix_paquet"] = nombre(t.get("prix_paquet"), 12.5, f"le prix du paquet (page « {nom} »)")
            if not 1 <= t["prix_paquet"] <= 100:
                raise Erreur(f"Page « {nom} » : le prix du paquet de cigarettes semble faux ({t['prix_paquet']} €).")
        themes.append(t)
    themes.sort(key=lambda t: (t["ordre"], slug(t["nom"])))
    return themes


def preparer_vrai_faux():
    """Jeu « Vrai ou faux ? » de la page d'accueil, à la place de la liste de questions (FAQ).
    Interrupteur « actif » du CMS : décoché, la FAQ classique (faq.yml) revient, comme avant."""
    d = lire("vrai-ou-faux.yml", facultatif=True)
    if not d or d.get("actif") is False:
        return None
    cartes = []
    for n, x in enumerate(d.get("affirmations") or [], 1):
        a = chaine(x.get("affirmation")).strip()
        if not a:
            continue
        r = slug(x.get("reponse"))
        if r not in ("vrai", "faux"):
            raise Erreur(f"Vrai ou faux ? (affirmation {n}) : la réponse doit être « vrai » ou « faux ».")
        cartes.append({"affirmation": a, "vrai": r == "vrai", "explication": chaine(x.get("explication")).strip()})
    if not cartes:
        return None
    d["affirmations"] = cartes
    return d


def preparer_faq():
    """FAQ classique « Vos questions » (faq.yml) : affichée quand « Vrai ou faux ? » est désactivé."""
    d = lire("faq.yml", facultatif=True) or {}
    d["questions"] = [{**q, "reponse": q.get("reponse")} for q in d.get("questions") or []
                      if isinstance(q, dict) and chaine(q.get("question")).strip()]
    return d


def preparer_surprise():
    """Petite surprise cachée (pendule) : textes saisis dans le CMS, transmis à main.js."""
    d = lire("surprise.yml", facultatif=True)
    if not d or not d.get("active"):
        return ""
    lignes = [l.strip() for l in chaine(d.get("message")).splitlines() if l.strip()]
    if not lignes:
        return ""
    donnees = {"titre": chaine(d.get("titre")).strip(), "lignes": lignes,
               "bouton": chaine(d.get("bouton")).strip() or "Se réveiller",
               "reveil": chaine(d.get("reveil")).strip() or "1… 2… 3… Vous êtes bien réveillé(e) !"}
    return json.dumps(donnees, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


NAVIGATION = {   # noms d'origine du menu et du pied de page (rubrique « Menu et pied de page » du CMS ; case vide = ce nom)
    "menu": {"hypnose": "L'hypnose", "indications": "Accompagnements", "deroulement": "Déroulement",
             "qui": "Qui suis-je ?", "contact": "Tarifs & contact", "bouton": "Prendre rendez-vous"},
    "pied": {"titre_cabinet": "Cabinet", "titre_site": "Le site",
             "hypnose": "L'hypnose, c'est quoi ?", "deroulement": "Déroulement d'une séance",
             "qui": "Qui suis-je ?", "contact": "Tarifs & contact", "acces": "Plan et accès",
             "titre_accompagnements": "Accompagnements", "mentions": "Mentions légales et confidentialité"},
}


def preparer_navigation():
    """Noms du menu (en haut) et du pied de page, modifiables dans le CMS."""
    d = lire("menu.yml", facultatif=True) or {}
    sortie = {}
    for groupe, defauts in NAVIGATION.items():
        saisi = d.get(groupe) if isinstance(d.get(groupe), dict) else {}
        sortie[groupe] = {cle: " ".join(chaine(saisi.get(cle)).split()) or defaut for cle, defaut in defauts.items()}
    return sortie


def preparer_bon_cadeau():
    d = lire("bon-cadeau.yml", facultatif=True)
    if not d or not d.get("actif") or not chaine(d.get("texte")).strip():
        return None
    return {"texte": chaine(d.get("texte")).strip(), "lien": chaine(d.get("lien")).strip() or "Demander un bon cadeau",
            "message": chaine(d.get("message")).strip()}


def plan_disponible(infos):
    """Le plan dessiné ne vaut que pour le cabinet du 30 rue de Chaillot : il disparaît tout seul si l'adresse change."""
    adresse = re.sub(r"[^a-z0-9]+", " ", sans_accents(chaine(infos.get("adresse"))).lower()).strip()
    ok = re.match(r"30 (bis |ter )?rue (de )?chaillot\b", adresse) is not None   # « 30, rue de Chaillot », « 30 rue Chaillot »…
    if not ok:
        print("  Plan dessiné masqué sur la page « Plan et accès » : l'adresse du cabinet a changé "
              "(le plan montre le 30 rue de Chaillot). La page garde l'adresse, l'accès et les boutons d'itinéraire.")
    return ok


ACCES = {   # textes d'origine de la page « Plan et accès » (CMS : Textes des pages › Plan et accès ; case vide = ce texte)
    "seo_titre": "Plan et accès au cabinet | Hypnose à Paris 16e",
    "surtitre": "Venir au cabinet",
    "titre": "Plan *et accès*",
    "introduction": "Le cabinet se trouve au coin de l'avenue Marceau, juste à côté de l'église Saint-Pierre-de-Chaillot.",
}


def preparer_acces(d, infos, plan):
    """Page « Plan et accès ». Son fichier (contenu/pages/acces.yml) n'existe qu'après un premier enregistrement
    dans le CMS : en attendant, la page prend les textes d'origine ci-dessus."""
    d = d if isinstance(d, dict) else {}
    page = {cle: chaine(d.get(cle)).strip() or defaut for cle, defaut in ACCES.items()}
    if not plan and not chaine(d.get("introduction")).strip():   # le cabinet a déménagé : pas de « coin de l'avenue Marceau »
        page["introduction"] = "L'adresse du cabinet, les transports et l'itinéraire pour venir."
    adresse = " ".join(f"{chaine(infos.get('adresse')).strip()}, {chaine(infos.get('code_postal')).strip()} "
                       f"{chaine(infos.get('ville')).strip()}".split())
    acces = chaine(infos.get("acces")).strip().rstrip(".")
    page["seo_description"] = chaine(d.get("seo_description")).strip() or (
        f"Venir au cabinet d'hypnose de Caroline Roulleau : {adresse}." + (f" {acces}." if acces else "")
        + (" Plan et itinéraire." if plan else " Itinéraire."))
    return page


# ---------------------------------------------------------------------------
# Données structurées pour Google (JSON-LD)
# ---------------------------------------------------------------------------
def donnees_google(infos, qui, themes=(), noms=None, plan=False):
    biz, pers, web = SITE_URL + "/#cabinet", SITE_URL + "/#caroline-roulleau", SITE_URL + "/#site"
    photo = SITE_URL + "/assets/img/caroline-roulleau.jpg"
    reseaux = [infos.get(k) for k in ("instagram", "facebook") if infos.get(k)]
    cabinet = {
        "@type": "LocalBusiness", "@id": biz,
        "name": "Caroline Roulleau – Hypnothérapeute",
        "description": "Hypnose ericksonienne, Nouvelle Hypnose et PNL à Paris 16e : stress, confiance en soi, "
                       "sommeil, arrêt du tabac, phobies…",
        "url": SITE_URL + "/", "image": [photo, SITE_URL + "/assets/img/partage.jpg"],
        "logo": {"@type": "ImageObject", "url": SITE_URL + "/assets/img/logo-hypnose-roulleau.png", "width": 512, "height": 512},
        "telephone": infos["tel"], "email": chaine(infos.get("email")).strip(),
        "priceRange": infos["fourchette"], "currenciesAccepted": "EUR",
        "paymentAccepted": re.sub(r"\s+ou\s+", ", ", chaine(infos.get("paiement")).strip()),
        "address": {"@type": "PostalAddress", "streetAddress": chaine(infos.get("adresse")).strip(),
                    "postalCode": chaine(infos.get("code_postal")).strip(),
                    "addressLocality": chaine(infos.get("ville")).strip(), "addressRegion": "Île-de-France",
                    "addressCountry": "FR"},
        "openingHoursSpecification": infos["horaires_google"],
        "founder": {"@id": pers},
        "sameAs": reseaux + ([chaine(infos["fiche_google"]).strip()] if infos.get("fiche_google") else []),
    }
    if plan:   # le plan dessiné du quartier (page « Plan et accès »)
        cabinet["hasMap"] = SITE_URL + "/plan-et-acces.html"
    caroline = {
        "@type": "Person", "@id": pers, "name": "Caroline Roulleau",
        "jobTitle": chaine(qui.get("metier")).strip(),
        "image": photo, "url": SITE_URL + "/qui-suis-je.html", "worksFor": {"@id": biz},
        "alumniOf": {"@type": "EducationalOrganization", "name": "Institut Français d'Hypnose Ericksonienne (IFHE)"},
        "knowsAbout": ["Hypnose ericksonienne", "Nouvelle Hypnose", "Programmation neuro-linguistique (PNL)", "Hypnose classique"],
        "sameAs": [infos.get(k) for k in ("linkedin", "instagram", "facebook") if infos.get(k)],
    }
    site = {"@type": "WebSite", "@id": web, "url": SITE_URL + "/", "name": "Caroline Roulleau – Hypnothérapeute",
            "alternateName": "Caroline Roulleau Hypnose", "inLanguage": "fr-FR", "publisher": {"@id": biz}}

    noms = noms or {g: dict(v) for g, v in NAVIGATION.items()}
    pied = noms["pied"]   # fil d'Ariane pour Google : noms des pages du pied de page (rubrique « Menu et pied de page »)

    def fil(fichier, nom):
        return {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/"},
            {"@type": "ListItem", "position": 2, "name": nom, "item": f"{SITE_URL}/{fichier}"}]}

    graphes = {
        "index.html": [site, cabinet, caroline],
        "l-hypnose-c-est-quoi.html": [fil("l-hypnose-c-est-quoi.html", pied["hypnose"])],
        "indications.html": [fil("indications.html", noms["menu"]["indications"])],
        "deroulement-d-une-seance.html": [fil("deroulement-d-une-seance.html", pied["deroulement"])],
        "qui-suis-je.html": [caroline, fil("qui-suis-je.html", pied["qui"])],
        "contact.html": [cabinet, caroline, fil("contact.html", pied["contact"])],
        "plan-et-acces.html": [cabinet, fil("plan-et-acces.html", pied["acces"])],
        "mentions-legales.html": [fil("mentions-legales.html", "Mentions légales")],
    }
    for t in themes:   # pages thématiques : fil d'Ariane Accueil › Accompagnements › page, et le service proposé
        adresse = f"{SITE_URL}/{t['fichier']}"
        service = {"@type": "Service", "name": chaine(t.get("surtitre")).strip() or t["nom"], "serviceType": "Hypnothérapie",
                   "url": adresse, "provider": {"@id": biz}, "areaServed": {"@type": "City", "name": "Paris"}}
        if t.get("tarif_choisi"):
            service["offers"] = {"@type": "Offer", "price": f"{t['tarif_choisi']['prix_nombre']:.2f}", "priceCurrency": "EUR"}
        graphes[t["fichier"]] = [
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/"},
                {"@type": "ListItem", "position": 2, "name": noms["menu"]["indications"], "item": SITE_URL + "/indications.html"},
                {"@type": "ListItem", "position": 3, "name": t["nom"], "item": adresse}]},
            service, dict(cabinet)]
    return {f: json.dumps({"@context": "https://schema.org", "@graph": g}, ensure_ascii=False, separators=(",", ":"))
            for f, g in graphes.items()}


# ---------------------------------------------------------------------------
# Construction
# ---------------------------------------------------------------------------
PAGES = [  # (fichier publié, modèle, clé de menu, fichier de contenu)
    ("index.html", "accueil.html", "accueil", "accueil"),
    ("l-hypnose-c-est-quoi.html", "hypnose.html", "hypnose", "hypnose"),
    ("indications.html", "indications.html", "indications", "indications"),
    ("deroulement-d-une-seance.html", "deroulement.html", "deroulement", "deroulement"),
    ("qui-suis-je.html", "qui-suis-je.html", "qui", "qui-suis-je"),
    ("contact.html", "contact.html", "contact", "contact"),
    ("plan-et-acces.html", "acces.html", "acces", "acces"),
    ("mentions-legales.html", "mentions-legales.html", "mentions", "mentions-legales"),
    ("404.html", "404.html", "404", None),
]


def derniere_modif(sources):
    """Date de la dernière modification (historique Git), pour le plan du site."""
    try:
        r = subprocess.run(["git", "log", "-1", "--format=%cs", "--", *sources], cwd=ICI,
                           capture_output=True, text=True, timeout=20)
        return r.stdout.strip() or AUJOURDHUI.isoformat()
    except (OSError, subprocess.SubprocessError):
        return AUJOURDHUI.isoformat()


def optimiser_medias():
    """Réduit les photos trop lourdes envoyées par le CMS (l'original reste dans le dépôt)."""
    if Image is None:
        return
    for f in (SORTIE / "assets/img/medias").rglob("*"):
        if f.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        with Image.open(f) as im:
            trop_grande = max(im.size) > 1600 or f.stat().st_size > 450_000
            if not trop_grande:
                continue
            im = ImageOps.exif_transpose(im)
            im.thumbnail((1600, 1600))
            if f.suffix.lower() in (".jpg", ".jpeg"):
                im.convert("RGB").save(f, quality=82, optimize=True, progressive=True)
            else:
                im.save(f, optimize=True)
        print(f"  image allégée : {f.relative_to(SORTIE)}")


def construire():
    if SORTIE.exists():
        shutil.rmtree(SORTIE)
    shutil.copytree(ICI / "assets", SORTIE / "assets")
    for nom in FICHIERS_RACINE:
        if (ICI / nom).exists():
            shutil.copy(ICI / nom, SORTIE / nom)
    optimiser_medias()

    infos = preparer_infos(lire("infos-pratiques.yml"))
    carte = plan_disponible(infos)   # plan dessiné du quartier (page « Plan et accès »)
    pages = {cle: lire(f"pages/{fichier}.yml", facultatif=(cle == "acces")) for _, _, cle, fichier in PAGES if fichier}
    pages["acces"] = preparer_acces(pages["acces"], infos, carte)
    annonces, decorations = preparer_annonces(lire("annonces.yml"))
    themes = preparer_themes(infos)
    vrai_faux = preparer_vrai_faux()
    navigation = preparer_navigation()
    commun = {
        "infos": infos, "pages": pages, "annonces": annonces, "decorations": decorations, "conseils_avent": preparer_avent(annonces),
        "avis": preparer_avis(lire("avis.yml")), "faq": preparer_faq() if not vrai_faux else {"questions": []},
        "vrai_faux": vrai_faux, "lectures": preparer_lectures(lire("lectures.yml")),
        "themes": themes, "surprise": preparer_surprise(), "bon_cadeau": preparer_bon_cadeau(), "plan": carte,
        "navigation": navigation, "site_url": SITE_URL, "annee": ANNEE,
    }
    ld = donnees_google(infos, pages["qui"], themes, navigation, carte)

    # --strict (pour les tests) : toute variable inconnue dans un modèle arrête la construction
    options = {"undefined": StrictUndefined} if "--strict" in sys.argv else {}
    env = Environment(loader=FileSystemLoader(ICI / "modeles"), autoescape=False, keep_trailing_newline=True, **options)
    env.filters.update(texte=texte, titre=titre, paragraphes=paragraphes, annee=annee, lien=lien, attr=attr,
                       dimensions=dimensions, brut=esc, version=version, ou=ou,
                       lien_telephone=lambda t: t.replace(
                           "{telephone}", f'<a href="tel:{infos["tel"]}" class="nw">{esc(infos["telephone"])}</a>'))

    plan = []
    a_construire = [(f, m, cle, src, None) for f, m, cle, src in PAGES]
    a_construire[-1:-1] = [(t["fichier"], "theme.html", "indications", None, t) for t in themes]   # avant la page 404
    for fichier, modele, cle, source, theme in a_construire:
        root = "/" if fichier == "404.html" else ""
        c = theme or pages.get(cle, {})
        if fichier == "404.html":
            seo_t, seo_d = "Page introuvable | Caroline Roulleau, hypnothérapeute", "Cette page n'existe pas ou a changé d'adresse."
        else:
            seo_t, seo_d = chaine(c.get("seo_titre")).strip(), chaine(c.get("seo_description")).strip()
        if fichier == "contact.html" and not seo_d:
            tarifs = ", ".join((t["intitule_court"] if i == 0 else t["intitule_court"][:1].lower() + t["intitule_court"][1:])
                               + " " + t["prix_texte"] for i, t in enumerate(infos.get("tarifs") or []))
            seo_d = (f"{tarifs}. {infos['adresse']}, {infos['code_postal']} {infos['ville']}. "
                     f"{infos['horaires_texte']}, sur rendez-vous : {infos['telephone']}.")
        if not seo_t:
            raise Erreur(f"Il manque le titre pour Google de la page {fichier}.")
        ctx = dict(commun, root=root, page=cle, fichier=fichier, seo_titre=seo_t, seo_description=seo_d, theme=theme,
                   noindex=(fichier == "404.html"), jsonld=ld.get(fichier),
                   adresse_page=f"{SITE_URL}/{'' if fichier == 'index.html' else fichier}")
        contenu = env.get_template(modele).render(**ctx)
        page = env.get_template("base.html").render(content=contenu.strip(), **ctx)
        (SORTIE / fichier).write_text(typo(page), encoding="utf-8")
        if fichier != "404.html":
            sources = ["modeles/base.html", f"modeles/{modele}", "contenu/infos-pratiques.yml"]
            sources += [f"contenu/pages/{source}.yml"] if source else []
            sources += [theme["source"]] if theme else []
            sources += ["modeles/morceaux/plan.html"] if cle == "acces" else []
            sources += ["contenu", "modeles"] if fichier == "index.html" else []
            plan.append((fichier, derniere_modif(sources)))

    (SORTIE / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "".join(f"  <url><loc>{SITE_URL}/{'' if f == 'index.html' else f}</loc><lastmod>{d}</lastmod></url>\n"
                for f, d in plan) + "</urlset>\n", encoding="utf-8")
    print(f"Site construit dans {SORTIE.name}/ : {len(PAGES) + len(themes)} pages (dont {len(themes)} pages thématiques), "
          f"{len(annonces)} annonces actives.")


if __name__ == "__main__":
    try:
        construire()
    except Erreur as e:
        print(f"\nERREUR : {e}\nLe site en ligne n'a pas été modifié. Corrigez le contenu indiqué puis enregistrez de nouveau.\n")
        sys.exit(1)
