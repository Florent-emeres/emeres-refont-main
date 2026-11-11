"""Scoring et analyses locales déterministes pour les outils IA ÉMÉRÉS.

Ces heuristiques fournissent des résultats réels, différenciés et
instantanés SANS dépendre d'un provider LLM. Elles servent de socle :
le LLM (quand il est configuré) vient enrichir, jamais simuler.
"""

import re
from typing import Any

# ---------------------------------------------------------------------------
# Matching étudiant <-> offre
# ---------------------------------------------------------------------------

_SKILL_WEIGHT = 0.45
_FIELD_WEIGHT = 0.25
_LOCATION_WEIGHT = 0.15
_LEVEL_WEIGHT = 0.15

_FIELD_KEYWORDS = {
    "informatique": [
        "dev",
        "développeur",
        "developpeur",
        "data",
        "logiciel",
        "web",
        "logiciel",
        "cyber",
        "système",
        "reseau",
        "réseau",
        "ia",
        "logiciel",
        "cloud",
        "python",
        "java",
        "javascript",
    ],
    "marketing": ["marketing", "communication", "community", "seo", "sea", "contenu"],
    "finance": ["finance", "comptab", "audit", "contrôle", "controle", "banque"],
    "rh": ["rh", "ressources humaines", "recrutement", "talent"],
    "design": ["design", "ux", "ui", "graphique", "créatif"],
    "commerce": ["commercial", "vente", "business", "client"],
    "santé": ["santé", "sante", "médical", "medical", "soin"],
    "droit": ["juridique", "droit", "avocat", "contrat"],
    "ingénierie": [
        "ingénieur",
        "ingenieur",
        "mécanique",
        "mecanique",
        "industriel",
        "électrique",
        "electrique",
        "btp",
        "génie",
        "genie",
    ],
}

_LEVEL_ORDER = ["bac", "bac+1", "bac+2", "bac+3", "bac+4", "bac+5", "bac+8"]


def _norm(text: str) -> str:
    return (text or "").lower().strip()


def _profile_skills(profile: dict) -> list[str]:
    skills: list[str] = []
    for key in ("main_skills", "skills", "technical_skills"):
        value = profile.get(key)
        if isinstance(value, list):
            skills.extend(str(s) for s in value)
    return [s for s in (_norm(s) for s in skills) if s]


def _profile_field(profile: dict) -> str:
    for key in ("field_of_study", "field", "domain", "study_domain"):
        if profile.get(key):
            return _norm(str(profile[key]))
    return ""


def _profile_city(profile: dict) -> str:
    for key in ("city", "address_city", "location"):
        if profile.get(key):
            return _norm(str(profile[key]))
    return ""


def _profile_level(profile: dict) -> str:
    for key in ("degree_preparing", "level", "study_level"):
        if profile.get(key):
            return _norm(str(profile[key]))
    year = profile.get("study_year")
    if year:
        return f"bac+{year}" if str(year).isdigit() else _norm(str(year))
    return ""


def _skill_overlap(
    profile_skills: list[str], offer_skills: list[str]
) -> tuple[list[str], list[str]]:
    matched, missing = [], []
    for oskill in (_norm(s) for s in offer_skills if s):
        if not oskill:
            continue
        if any(oskill in ps or ps in oskill for ps in profile_skills):
            matched.append(oskill)
        else:
            missing.append(oskill)
    return matched, missing


def _field_match(profile_field: str, offer: dict) -> bool:
    if not profile_field:
        return False
    keywords = set()
    for domain, kws in _FIELD_KEYWORDS.items():
        if domain in profile_field:
            keywords.update(kws)
            keywords.add(domain)
    if not keywords:
        keywords = {profile_field}
    haystack = _norm(
        " ".join(
            [
                offer.get("title") or "",
                " ".join(offer.get("sectors") or []),
                offer.get("description") or "",
                " ".join(offer.get("missions") or []),
            ]
        )
    )
    return any(kw in haystack for kw in keywords)


def _level_gap(profile_level: str, target_level: str) -> int | None:
    def rank(level: str) -> int | None:
        for i, ref in enumerate(_LEVEL_ORDER):
            if level.startswith(ref):
                return i
        return None

    r1, r2 = rank(profile_level), rank(_norm(target_level))
    if r1 is None or r2 is None:
        return None
    return abs(r1 - r2)


def score_offer_match(profile: dict, offer: dict) -> dict[str, Any]:
    """Score de compatibilité étudiant/offre, déterministe et explicable."""
    profile_skills = _profile_skills(profile)
    offer_skills = list(offer.get("skills_required") or []) + list(offer.get("requirements") or [])
    matched, missing = _skill_overlap(profile_skills, offer_skills)

    factors: list[str] = []
    score = 0.0
    max_score = 0.0

    # Compétences (45 %) — neutre si l'offre n'exige rien de listé
    if offer_skills:
        ratio = len(matched) / len(offer_skills)
        score += _SKILL_WEIGHT * ratio
        max_score += _SKILL_WEIGHT
        if matched:
            factors.append(f"Compétences correspondantes : {', '.join(sorted(set(matched))[:4])}")
        if missing:
            factors.append(f"Compétences à renforcer : {', '.join(sorted(set(missing))[:3])}")
    else:
        score += _SKILL_WEIGHT * 0.5
        max_score += _SKILL_WEIGHT

    # Domaine (25 %)
    max_score += _FIELD_WEIGHT
    if _field_match(_profile_field(profile), offer):
        score += _FIELD_WEIGHT
        factors.append(
            f"Domaine aligné avec ta formation ({_profile_field(profile) or 'non renseignée'})"
        )

    # Localisation (15 %)
    max_score += _LOCATION_WEIGHT
    city = _profile_city(profile)
    offer_loc = _norm(offer.get("location") or "")
    if offer.get("is_remote") or (offer.get("remote_percentage") or 0) >= 50:
        score += _LOCATION_WEIGHT
        factors.append("Télétravail possible")
    elif city and city in offer_loc:
        score += _LOCATION_WEIGHT
        factors.append(f"Localisation compatible ({offer.get('location')})")
    elif not city or not offer_loc:
        score += _LOCATION_WEIGHT * 0.5

    # Niveau (15 %)
    max_score += _LEVEL_WEIGHT
    gap = _level_gap(_profile_level(profile), offer.get("target_level") or "")
    if gap is None:
        score += _LEVEL_WEIGHT * 0.5
    elif gap == 0:
        score += _LEVEL_WEIGHT
        factors.append(f"Niveau adapté ({offer.get('target_level')})")
    elif gap == 1:
        score += _LEVEL_WEIGHT * 0.6
    # gap >= 2 : 0

    match_score = round(score / max_score, 2) if max_score else 0.5
    match_score = max(0.05, min(1.0, match_score))

    if not factors:
        factors.append(
            "Profil incomplet : complète tes compétences et ta ville pour un score précis"
        )
        reasoning = (
            "Score estimé sur des critères limités car ton profil est incomplet — "
            "complète-le pour un matching précis."
        )
    else:
        reasoning = (
            f"Compatibilité calculée sur {len(factors)} critères objectifs : "
            + " ; ".join(f[:1].lower() + f[1:] for f in factors[:3])
            + "."
        )

    return {
        "match_score": match_score,
        "reasoning": reasoning,
        "compatibility_factors": factors,
    }


# ---------------------------------------------------------------------------
# Analyse locale de CV
# ---------------------------------------------------------------------------

_ACTION_VERBS = [
    "développé",
    "developpe",
    "conçu",
    "concu",
    "géré",
    "gere",
    "dirigé",
    "dirige",
    "optimisé",
    "optimise",
    "réalisé",
    "realise",
    "créé",
    "cree",
    "animé",
    "anime",
    "coordonné",
    "coordonne",
    "automatisé",
    "automatise",
    "amélioré",
    "ameliore",
    "mis en place",
    "piloté",
    "pilote",
    "formé",
    "forme",
    "livré",
    "livre",
]
_SECTION_MARKERS = {
    "Formation": [
        "formation",
        "éducation",
        "education",
        "diplôme",
        "diplome",
        "études",
        "etudes",
        "master",
        "licence",
        "bts",
        "iut",
    ],
    "Expérience": ["expérience", "experience", "stage", "emploi", "mission"],
    "Compétences": ["compétences", "competences", "skills", "technique"],
    "Projets": ["projet", "portfolio", "réalisation", "realisation"],
    "Langues": ["langue", "anglais", "français", "francais", "espagnol", "allemand"],
}
_EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
_PHONE_RE = re.compile(r"(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}")


def analyze_cv_text(cv_text: str) -> dict[str, Any]:
    """Analyse heuristique réelle d'un CV (texte)."""
    text = cv_text or ""
    lowered = _norm(text)
    words = lowered.split()
    word_count = len(words)

    strengths: list[str] = []
    improvements: list[str] = []
    recommendations: list[str] = []

    # Sections présentes
    found_sections = []
    for section, markers in _SECTION_MARKERS.items():
        if any(m in lowered for m in markers):
            found_sections.append(section)
    missing_sections = [s for s in _SECTION_MARKERS if s not in found_sections]

    # Verbes d'action
    verb_hits = [v for v in _ACTION_VERBS if v in lowered]

    # Quantification
    numbers = re.findall(r"\d+\s?(?:%|ans|mois|clients|projets|utilisateurs|k€|euros)", lowered)

    # Contact
    has_email = bool(_EMAIL_RE.search(text))
    has_phone = bool(_PHONE_RE.search(text))

    # Scores par dimension (0-10)
    structure = 10.0 * len(found_sections) / len(_SECTION_MARKERS)
    if word_count < 80:
        content = 3.0
        improvements.append("CV trop court : développe tes expériences et projets")
    elif word_count > 800:
        content = 6.0
        improvements.append("CV très long : vise une page, va à l'essentiel")
    else:
        content = 7.5
        improvements.append("Ajoute des réalisations chiffrées pour crédibiliser ton parcours")
    if verb_hits:
        content = min(10.0, content + 1.5)
    if numbers:
        content = min(10.0, content + 1.0)

    keywords_score = min(10.0, 4.0 + 1.0 * len(verb_hits) + 0.5 * len(numbers))
    formatting = 10.0 * (bool(found_sections) + has_email + has_phone) / 3

    if found_sections:
        strengths.append(f"Sections présentes : {', '.join(found_sections)}")
    else:
        improvements.append(
            "Aucune section classique détectée (Formation, Expérience, Compétences)"
        )
    if verb_hits:
        strengths.append(f"Verbes d'action utilisés ({len(verb_hits)} occurrence(s))")
    else:
        improvements.append("Aucun verbe d'action détecté (développé, piloté, optimisé…)")
    if numbers:
        strengths.append("Résultats quantifiés (chiffres présents)")
    else:
        improvements.append("Aucun résultat chiffré : quantifie tes impacts (%, durée, volume)")
    if has_email and has_phone:
        strengths.append("Coordonnées complètes (email + téléphone)")
    elif not has_email and not has_phone:
        improvements.append("Coordonnées absentes : email et téléphone indispensables")

    overall = round(
        structure * 0.35 + content * 0.35 + keywords_score * 0.15 + formatting * 0.15, 1
    )
    ats = round(
        min(
            100.0,
            (len(found_sections) / len(_SECTION_MARKERS)) * 50
            + (20 if has_email else 0)
            + (15 if has_phone else 0)
            + min(15.0, 3.0 * len(verb_hits)),
        ),
    )

    if missing_sections:
        recommendations.append(f"Ajoute une section : {', '.join(missing_sections[:3])}")
    recommendations.append("Adapte les mots-clés à chaque offre visée")
    if not numbers:
        recommendations.append("Chiffre tes résultats (ex. « amélioration de 20 % », « 3 mois »)")

    detailed = {
        "structure": {
            "score": round(structure, 1),
            "comment": f"{len(found_sections)}/{len(_SECTION_MARKERS)} sections clés détectées",
        },
        "content": {
            "score": round(content, 1),
            "comment": (
                f"{word_count} mots, {len(verb_hits)} verbe(s) d'action, "
                f"{len(numbers)} résultat(s) chiffré(s)"
            ),
        },
        "keywords": {
            "score": round(keywords_score, 1),
            "comment": "Densité de mots-clés et verbes d'action",
        },
        "formatting": {
            "score": round(formatting, 1),
            "comment": (
                f"Email : {'oui' if has_email else 'non'} — "
                f"Téléphone : {'oui' if has_phone else 'non'}"
            ),
        },
    }

    return {
        "overall_score": overall,
        "strengths": strengths or ["Analyse terminée — complète ton CV pour plus de retours"],
        "improvement_areas": improvements,
        "detailed_analysis": detailed,
        "recommendations": recommendations,
        "ats_compatibility": ats,
    }


# ---------------------------------------------------------------------------
# Évaluation locale de réponses d'entretien
# ---------------------------------------------------------------------------

_STAR_MARKERS = [
    "situation",
    "contexte",
    "tâche",
    "tache",
    "j'ai",
    "jai",
    "action",
    "résultat",
    "resultat",
    "enfin",
    "finalement",
]
_EXAMPLE_MARKERS = [
    "par exemple",
    "lors de",
    "chez",
    "projet",
    "stage",
    "j'ai réalisé",
    "j'ai développé",
    "j'ai géré",
]


def evaluate_interview_answers(questions: list[str], answers: list[str]) -> dict[str, Any]:
    """Feedback d'entretien calculé sur les réponses réelles de l'étudiant."""
    valid = [a for a in answers if (a or "").strip()]
    if not valid:
        return {
            "overall_performance": 0.0,
            "strengths": [],
            "improvement_areas": ["Aucune réponse exploitable : donne des réponses complètes"],
            "tips": ["Structure chaque réponse : Situation, Tâche, Action, Résultat (STAR)"],
        }

    scores = []
    has_examples = False
    has_numbers = False
    total_words = 0
    for answer in valid:
        lowered = _norm(answer)
        words = len(lowered.split())
        total_words += words
        s = 5.0
        if words >= 40:
            s += 2.0
        elif words >= 15:
            s += 1.0
        else:
            scores.append(max(1.0, s - 2.0))
            continue
        if any(m in lowered for m in _STAR_MARKERS):
            s += 1.5
        if any(m in lowered for m in _EXAMPLE_MARKERS):
            s += 1.5
            has_examples = True
        if re.search(r"\d", lowered):
            s += 1.0
            has_numbers = True
        scores.append(min(10.0, s))

    overall = round(sum(scores) / len(scores), 1)
    avg_words = total_words // len(valid)

    strengths = []
    improvements = []
    if overall >= 7:
        strengths.append("Réponses développées et structurées")
    if has_examples:
        strengths.append("Exemples concrets mobilisés")
    else:
        improvements.append("Illustre chaque réponse avec un exemple concret (projet, stage)")
    if has_numbers:
        strengths.append("Résultats chiffrés dans tes réponses")
    else:
        improvements.append("Chiffre tes réussites (%, durée, taille d'équipe)")
    if avg_words < 25:
        improvements.append("Réponses trop brèves : développe avec la méthode STAR")
    if not strengths:
        strengths.append("Tu as complété l'entretien — c'est déjà un bon entraînement")

    tips = [
        "Prépare 3 histoires réutilisables (réussite, échec appris, travail d'équipe)",
        "Termine chaque réponse par le résultat obtenu",
        "Entraîne-toi à voix haute, en 2 minutes chrono par question",
    ]

    return {
        "overall_performance": overall,
        "strengths": strengths,
        "improvement_areas": improvements
        or ["Continue à t'entraîner sur des questions sectorielles"],
        "tips": tips,
    }
