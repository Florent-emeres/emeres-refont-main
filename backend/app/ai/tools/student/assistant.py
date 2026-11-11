"""Assistant IA étudiant ÉMÉRÉS.

Guide l'étudiant pas à pas : bilan de situation, orientations vers les
bonnes sections, conseils actionnables. Fonctionne en deux modes :

1. LLM (si LLM_PROVIDER configuré) : réponse conversationnelle libre,
   system prompt enrichi du contexte réel de l'étudiant.
2. Moteur de guidage local (défaut) : détection d'intention + réponses
   personnalisées construites sur les données de la plateforme.

Le mode local est déterministe et toujours disponible : l'assistant reste
utile même sans clé LLM.
"""

import asyncio
import json
import os
import re
from typing import Any

from app.models.schemas import AssistantAction, AssistantRequest, AssistantResponse

try:
    from llm_client import LlmChat, UserMessage
except Exception:  # pragma: no cover
    LlmChat = None
    UserMessage = None

SYSTEM_PROMPT = """Tu es Émé, l'assistant IA de la plateforme ÉMÉRÉS
(insertion professionnelle des étudiants : stages, alternance, projets, mentorat).
Tu accompagnes un étudiant. Règles :
- Réponds en français, ton chaleureux, direct et encourageant (tutoiement).
- Sois CONCIS : 3 à 6 phrases maximum, va droit au but.
- Appuie-toi sur le CONTEXTE fourni (profil, candidatures, offres, mentorat)
  pour personnaliser.
- Termine par une action concrète unique (« Fait ceci »).
- Ne promets jamais de fonctionnalité qui n'existe pas sur la plateforme.
CONTEXTE ÉTUDIANT :
"""

# `path` = identifiant de section interne du dashboard étudiant (navigateToPage)
ACTIONS = {
    "offres": AssistantAction(
        label="Voir les offres",
        path="offers",
        description="Parcours les offres de stage et projets disponibles",
    ),
    "candidatures": AssistantAction(
        label="Suivre mes candidatures",
        path="applications",
        description="Statut en temps réel de tes candidatures",
    ),
    "profil": AssistantAction(
        label="Compléter mon profil",
        path="profile",
        description="Un profil complet est 3x plus consulté",
    ),
    "mentors": AssistantAction(
        label="Découvrir les mentors",
        path="discover-mentors",
        description="Trouve un mentor dans ton domaine",
    ),
    "cv": AssistantAction(
        label="Générer mon CV",
        path="cv",
        description="CV généré à partir de ton profil",
    ),
    "portfolio": AssistantAction(
        label="Mon portfolio",
        path="portfolio",
        description="Valorise tes projets et compétences",
    ),
}

CAPABILITIES = (
    "Je peux t'aider à : trouver des offres adaptées à ton profil, "
    "suivre tes candidatures, compléter ton profil, trouver un mentor, "
    "préparer tes entretiens et générer ton CV. Pose-moi ta question !"
)


def _detect_intent(question: str) -> str:
    q = (question or "").lower()
    if re.search(r"offre|stage|alternance|poste|mission|trouvr|cherch|recherch|projet", q):
        return "offres"
    if re.search(r"candidat|postul|réponse|reponse|statut|relance", q):
        return "candidatures"
    if re.search(r"profil|complét|complet|photo|compte", q):
        return "profil"
    if re.search(r"mentor|accompagn", q):
        return "mentors"
    if re.search(r"entretien|interview|prépar", q):
        return "entretien"
    if re.search(r"\bcv\b|curriculum|lettre de motivation|lettre", q):
        return "cv"
    if re.search(r"portfolio|réalis|realis", q):
        return "portfolio"
    if re.search(r"aide|sais[- ]tu|peux[- ]tu|fonctionne|comment ça marche|démarr|commenc", q):
        return "aide"
    if re.search(r"bonjour|salut|hello|coucou|bonsoir|hey", q):
        return "greeting"
    return "unknown"


def _fmt_apps(apps: dict[str, Any]) -> str:
    total = apps.get("total", 0)
    if not total:
        return "tu n'as aucune candidature en cours"
    parts = []
    for key, label in (
        ("received", "en attente de réponse"),
        ("reviewing", "en cours d'examen"),
        ("interview", "en entretien"),
        ("accepted", "acceptée(s)"),
        ("rejected", "refusée(s)"),
    ):
        n = apps.get(key, 0)
        if n:
            parts.append(f"{n} {label}")
    return f"tu as {total} candidature(s) : " + ", ".join(parts)


def build_local_answer(question: str, ctx: dict[str, Any]) -> AssistantResponse:
    """Moteur de guidage déterministe, personnalisé par le contexte plateforme."""
    intent = _detect_intent(question)
    first_name = ctx.get("first_name") or ""
    hello = f"Salut {first_name} ! " if first_name else "Salut ! "
    completion = int(ctx.get("profile_completion") or 0)
    missing = ctx.get("profile_missing") or []
    apps = ctx.get("applications") or {}
    offers_n = int(ctx.get("offers_available") or 0)
    mentors = ctx.get("mentorships") or {}

    if not (question or "").strip():
        intent = "greeting"

    if intent == "greeting":
        bits = [f"{hello}Voilà où tu en es :"]
        bits.append(f"profil complété à {completion} %")
        bits.append(_fmt_apps(apps).capitalize() + ".")
        if offers_n:
            bits.append(f"{offers_n} offre(s) sont actuellement ouvertes sur la plateforme.")
        answer = " ".join(bits)
        suggestions = [
            "Trouve-moi des offres",
            "Où en sont mes candidatures ?",
            "Comment compléter mon profil ?",
        ]
        actions = [ACTIONS["offres"], ACTIONS["candidatures"], ACTIONS["profil"]]
        if completion < 100:
            actions.append(ACTIONS["profil"])
        return AssistantResponse(answer=answer, suggestions=suggestions, actions=actions[:3])

    if intent == "offres":
        if offers_n == 0:
            answer = (
                f"{hello}aucune nouvelle offre ne correspond pour l'instant — mais ne reste "
                "pas inactif : complète ton profil et ton portfolio pour être visible dès la "
                "prochaine publication, et active un mentor pour préparer le terrain."
            )
            return AssistantResponse(
                answer=answer,
                suggestions=["Trouver un mentor", "Compléter mon profil"],
                actions=[ACTIONS["profil"], ACTIONS["portfolio"], ACTIONS["mentors"]],
            )
        if completion < 70:
            missing_txt = ", ".join(missing[:3])
            answer = (
                f"{hello}avant de chercher, ton profil n'est complété qu'à {completion} % — "
                "les recruteurs filtrent sur les profils complets. Complète-le d'abord "
                f"({missing_txt} manquants), puis je t'aiderai à cibler les {offers_n} "
                "offre(s) ouverte(s)."
            )
            return AssistantResponse(
                answer=answer,
                suggestions=["Compléter mon profil maintenant", "Voir les offres quand même"],
                actions=[ACTIONS["profil"], ACTIONS["offres"]],
            )
        field = ctx.get("field") or "ta filière"
        answer = (
            f"{hello}ton profil est prêt ({completion} %), on peut cibler ! "
            f"{offers_n} offre(s) ouverte(s). Filtre par ton domaine ({field}) et postule "
            "aux 2-3 qui collent le mieux : une candidature ciblée vaut mieux que dix "
            "génériques."
        )
        return AssistantResponse(
            answer=answer,
            suggestions=["Comment bien postuler ?", "Préparer ma lettre de motivation"],
            actions=[ACTIONS["offres"], ACTIONS["cv"]],
        )

    if intent == "candidatures":
        if not apps.get("total"):
            offer_hint = (
                f"Avec {offers_n} offre(s) ouverte(s), "
                if offers_n
                else "Les entreprises publient régulièrement — "
            )
            answer = (
                f"{hello}tu n'as aucune candidature en cours. {offer_hint}"
                "commence par repérer deux offres qui te plaisent — je peux t'aider à "
                "préparer le dossier."
            )
            actions = [ACTIONS["offres"], ACTIONS["cv"]]
        else:
            detail = _fmt_apps(apps)
            if apps.get("interview"):
                answer = (
                    f"{hello}{detail.capitalize()}. Prépare tes entretiens : entraîne-toi "
                    "sur les questions classiques et relis la fiche de l'entreprise."
                )
                actions = [ACTIONS["candidatures"], ACTIONS["mentors"]]
            elif apps.get("accepted"):
                answer = (
                    f"{hello}{detail.capitalize()}. Une acceptation, félicitations ! "
                    "Finalise les documents administratifs avec ton établissement depuis "
                    "ta candidature."
                )
                actions = [ACTIONS["candidatures"]]
            else:
                answer = (
                    f"{hello}{detail.capitalize()}. Les retours prennent généralement "
                    "quelques jours. En attendant, booste tes chances : complète ton "
                    "portfolio et postule à une ou deux offres supplémentaires."
                )
                actions = [ACTIONS["candidatures"], ACTIONS["portfolio"], ACTIONS["offres"]]
        return AssistantResponse(
            answer=answer,
            suggestions=["Comment relancer sans être lourd ?", "Trouve-moi d'autres offres"],
            actions=actions[:3],
        )

    if intent == "profil":
        if completion >= 100:
            answer = (
                f"{hello}ton profil est à 100 %, bravo ! Passe à l'étape suivante : un "
                "portfolio avec 1-2 projets concrets te distinguera vraiment."
            )
            return AssistantResponse(
                answer=answer,
                suggestions=["Voir les offres"],
                actions=[ACTIONS["portfolio"], ACTIONS["offres"]],
            )
        missing_txt = ", ".join(missing[:4]) if missing else "quelques détails"
        answer = (
            f"{hello}ton profil est complété à {completion} %. Il manque : {missing_txt}. "
            "Un profil complet est 3x plus consulté par les entreprises — 5 minutes "
            "suffisent."
        )
        return AssistantResponse(
            answer=answer,
            suggestions=["Pourquoi le profil est-il important ?", "Voir les offres"],
            actions=[ACTIONS["profil"], ACTIONS["offres"]],
        )

    if intent == "mentors":
        if mentors.get("accepted"):
            answer = (
                f"{hello}tu as déjà un mentor actif — prépare tes prochaines sessions avec "
                "des questions précises (objectifs, obstacles, prochaines étapes). Tu peux "
                "aussi élargir ton réseau."
            )
        else:
            answer = (
                f"{hello}pas encore de mentor. Un mentor multiplie tes chances d'insertion : "
                "cherche dans ton domaine, regarde son parcours, et envoie une demande "
                "personnalisée (précise pourquoi lui)."
            )
        return AssistantResponse(
            answer=answer,
            suggestions=["Comment bien démarrer avec un mentor ?"],
            actions=[ACTIONS["mentors"], ACTIONS["profil"]],
        )

    if intent == "entretien":
        answer = (
            f"{hello}pour réussir un entretien : 1) relis l'offre et l'entreprise, "
            "2) prépare 3 exemples concrets de tes projets, 3) prépare 2 questions à "
            "poser. Ton mentor peut aussi faire une simulation — et je te conseille de "
            "répéter à voix haute."
        )
        return AssistantResponse(
            answer=answer,
            suggestions=["Questions fréquentes en entretien ?", "Trouver un mentor"],
            actions=[ACTIONS["candidatures"], ACTIONS["mentors"]],
        )

    if intent == "cv":
        answer = (
            f"{hello}ton CV se génère directement depuis ton profil ÉMÉRÉS : plus il est "
            "complet, plus le CV est solide. Pour la lettre de motivation, adapte-la à "
            "chaque offre (1 paragraphe sur eux, 1 sur toi, 1 sur le lien entre les deux)."
        )
        return AssistantResponse(
            answer=answer,
            suggestions=["Compléter mon profil"],
            actions=[ACTIONS["cv"], ACTIONS["profil"]],
        )

    if intent == "portfolio":
        answer = (
            f"{hello}ton portfolio valorise ce qu'un CV ne montre pas : tes projets, ta "
            "progression, tes preuves. Ajoute 1-2 projets avec un résultat chiffré — même "
            "un projet d'études compte."
        )
        return AssistantResponse(
            answer=answer,
            suggestions=["Voir les offres"],
            actions=[ACTIONS["portfolio"], ACTIONS["offres"]],
        )

    if intent == "aide":
        return AssistantResponse(
            answer=f"{hello}{CAPABILITIES}",
            suggestions=[
                "Trouve-moi des offres",
                "Où en sont mes candidatures ?",
                "Comment compléter mon profil ?",
            ],
            actions=[ACTIONS["offres"], ACTIONS["candidatures"], ACTIONS["profil"]],
        )

    answer = (
        f"{hello}je ne suis pas sûr d'avoir tout saisi, mais voilà ce que je fais le "
        f"mieux : {CAPABILITIES}"
    )
    return AssistantResponse(
        answer=answer,
        suggestions=["Trouve-moi des offres", "Où en sont mes candidatures ?"],
        actions=[ACTIONS["offres"], ACTIONS["candidatures"]],
    )


async def _try_llm(question: str, ctx: dict[str, Any]) -> str | None:
    provider = os.getenv("LLM_PROVIDER", "stub").strip().lower()
    if provider not in {"openai", "ollama"} or LlmChat is None:
        return None
    try:
        chat = LlmChat(
            api_key=os.getenv("OPENAI_API_KEY") or os.getenv("EMERGENT_LLM_KEY"),
            session_id=f"emeres-assistant-{ctx.get('user_id', 'anon')}",
            system_message=SYSTEM_PROMPT + json.dumps(ctx, ensure_ascii=False, default=str),
        ).with_model(provider, os.getenv("LLM_MODEL", "gpt-4o-mini"))
        return await chat.send_message(UserMessage(text=question))
    except Exception:
        return None


async def student_assistant(req: AssistantRequest) -> AssistantResponse:
    ctx = req.context if isinstance(req.context, dict) else {}
    llm_answer = await _try_llm(req.question, ctx)
    if llm_answer:
        local = build_local_answer(req.question, ctx)
        return AssistantResponse(
            answer=llm_answer, suggestions=local.suggestions, actions=local.actions
        )
    return build_local_answer(req.question, ctx)


def student_assistant_tool(req: AssistantRequest) -> AssistantResponse:
    """Facade synchrone pour le hub AI v2 (routes sync, threadpool FastAPI)."""
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(student_assistant(req))
    return build_local_answer(req.question, req.context if isinstance(req.context, dict) else {})
