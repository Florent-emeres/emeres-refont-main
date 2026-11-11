from app.models.schemas import OnboardingPackRequest, OnboardingPackResponse


def company_onboarding_pack(req: OnboardingPackRequest) -> OnboardingPackResponse:
    checklist = ["Contrat signé", "Matériel livré", "Parrain attribué"]
    messages = [
        f"Bienvenue dans l'équipe {req.role}!",
        "Voici votre guide de démarrage rapide.",
    ]
    return OnboardingPackResponse(checklist=checklist, messages=messages)
