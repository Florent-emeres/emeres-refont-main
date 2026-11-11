from app.models.schemas import CareerExploreRequest, CareerExploreResponse


def jobseeker_career_explorer(req: CareerExploreRequest) -> CareerExploreResponse:
    roles = [
        "Agent d’accueil",
        "Préparateur de commandes",
        "Assistant administratif",
        "Dev Web Junior",
    ]
    skills = ["Communication", "Organisation", "Bureautique", "HTML/CSS/JS"]
    resources = ["Pôle Emploi", "AFPA", "PIX", "OpenClassrooms"]
    return CareerExploreResponse(roles=roles, skills_to_learn=skills, resources=resources)
