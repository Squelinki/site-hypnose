"""Construit le site de Caroline Roulleau dans le dossier _site/.

Les textes, tarifs, avis, annonces… sont dans le dossier contenu/ (modifiables avec le CMS, voir GUIDE.md).
La mise en page est dans le dossier modeles/. Les images, styles et scripts sont dans assets/.
GitHub lance ce script tout seul à chaque modification (voir .github/workflows/publier-le-site.yml).

Pour l'essayer sur un ordinateur :  pip install -r requirements.txt  puis  python construire.py
"""
import datetime
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
from jinja2 import Environment, FileSystemLoader, StrictUndefined, pass_context

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
EFFETS = {"guirlande", "neige", "paillettes", "petales", "muguet", "soleil", "feuilles", "coeurs", "cloches", "lune"}
ICONES = {"soleil", "feuille", "fleches", "montagne", "etoile"}


class Erreur(Exception):
    """Erreur de contenu, expliquée en français dans le journal de GitHub."""


def lire(chemin):
    fichier = ICI / "contenu" / chemin
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
        e["points"] = [p for p in e.get("points") or [] if chaine(p).strip()]
        a["encart"] = e
        annonces.append(a)
    for a in annonces:   # fêtes à date variable : dates calculées, affichées dans le journal de GitHub
        if "/" not in a["du"] or "/" not in a["au"]:
            print(f"  {a['nom']} : " + ", ".join(
                f"{an} du {date_reelle(a['du'], an):%d/%m} au {date_reelle(a['au'], an):%d/%m}" for an in (ANNEE, ANNEE + 1)))
    decorations = [{"du": a["du"], "au": a["au"], "effets": a["decorations"]} for a in annonces if a["decorations"]]
    return annonces, (json.dumps(decorations, ensure_ascii=False, separators=(",", ":")) if decorations else "")


# ---------------------------------------------------------------------------
# Données structurées pour Google (JSON-LD)
# ---------------------------------------------------------------------------
def donnees_google(infos, qui):
    biz, pers, web = SITE_URL + "/#cabinet", SITE_URL + "/#caroline-roulleau", SITE_URL + "/#site"
    photo = SITE_URL + "/assets/img/caroline-roulleau.jpg"
    reseaux = [infos.get(k) for k in ("instagram", "facebook") if infos.get(k)]
    cabinet = {
        "@type": "LocalBusiness", "@id": biz,
        "name": "Caroline Roulleau – Hypnothérapeute",
        "description": "Hypnose ericksonienne, Nouvelle Hypnose et PNL à Paris 16e : stress, confiance en soi, "
                       "sommeil, arrêt du tabac, phobies…",
        "url": SITE_URL + "/", "image": [photo, SITE_URL + "/assets/img/partage.jpg"],
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

    def fil(fichier, nom):
        return {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/"},
            {"@type": "ListItem", "position": 2, "name": nom, "item": f"{SITE_URL}/{fichier}"}]}

    graphes = {
        "index.html": [site, cabinet, caroline],
        "l-hypnose-c-est-quoi.html": [fil("l-hypnose-c-est-quoi.html", "L'hypnose, c'est quoi ?")],
        "indications.html": [fil("indications.html", "Indications")],
        "deroulement-d-une-seance.html": [fil("deroulement-d-une-seance.html", "Déroulement d'une séance")],
        "qui-suis-je.html": [caroline, fil("qui-suis-je.html", "Qui suis-je ?")],
        "contact.html": [cabinet, caroline, fil("contact.html", "Tarifs & contact")],
        "mentions-legales.html": [fil("mentions-legales.html", "Mentions légales")],
    }
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
    pages = {cle: lire(f"pages/{fichier}.yml") for _, _, cle, fichier in PAGES if fichier}
    annonces, decorations = preparer_annonces(lire("annonces.yml"))
    commun = {
        "infos": infos, "pages": pages, "annonces": annonces, "decorations": decorations,
        "avis": preparer_avis(lire("avis.yml")), "faq": lire("faq.yml"), "lectures": preparer_lectures(lire("lectures.yml")),
        "site_url": SITE_URL, "annee": ANNEE,
    }
    ld = donnees_google(infos, pages["qui"])

    # --strict (pour les tests) : toute variable inconnue dans un modèle arrête la construction
    options = {"undefined": StrictUndefined} if "--strict" in sys.argv else {}
    env = Environment(loader=FileSystemLoader(ICI / "modeles"), autoescape=False, keep_trailing_newline=True, **options)
    env.filters.update(texte=texte, titre=titre, paragraphes=paragraphes, annee=annee, lien=lien, attr=attr,
                       dimensions=dimensions, brut=esc,
                       lien_telephone=lambda t: t.replace(
                           "{telephone}", f'<a href="tel:{infos["tel"]}" class="nw">{esc(infos["telephone"])}</a>'))

    plan = []
    for fichier, modele, cle, source in PAGES:
        root = "/" if fichier == "404.html" else ""
        c = pages.get(cle, {})
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
        ctx = dict(commun, root=root, page=cle, fichier=fichier, seo_titre=seo_t, seo_description=seo_d,
                   noindex=(fichier == "404.html"), jsonld=ld.get(fichier),
                   adresse_page=f"{SITE_URL}/{'' if fichier == 'index.html' else fichier}")
        contenu = env.get_template(modele).render(**ctx)
        page = env.get_template("base.html").render(content=contenu.strip(), **ctx)
        (SORTIE / fichier).write_text(typo(page), encoding="utf-8")
        if fichier != "404.html":
            sources = ["modeles/base.html", f"modeles/{modele}", "contenu/infos-pratiques.yml"]
            sources += [f"contenu/pages/{source}.yml"] if source else []
            sources += ["contenu", "modeles"] if fichier == "index.html" else []
            plan.append((fichier, derniere_modif(sources)))

    (SORTIE / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "".join(f"  <url><loc>{SITE_URL}/{'' if f == 'index.html' else f}</loc><lastmod>{d}</lastmod></url>\n"
                for f, d in plan) + "</urlset>\n", encoding="utf-8")
    print(f"Site construit dans {SORTIE.name}/ : {len(PAGES)} pages, {len(annonces)} annonces actives.")


if __name__ == "__main__":
    try:
        construire()
    except Erreur as e:
        print(f"\nERREUR : {e}\nLe site en ligne n'a pas été modifié. Corrigez le contenu indiqué puis enregistrez de nouveau.\n")
        sys.exit(1)
