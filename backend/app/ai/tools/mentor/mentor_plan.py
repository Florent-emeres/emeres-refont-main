from app.models.schemas import MentorPlanRequest, MentorPlanResponse


def mentor_mentor_plan(req: MentorPlanRequest) -> MentorPlanResponse:
    return MentorPlanResponse(
        goals=["Renforcer compétences techniques", "Préparer portfolio"],
        milestones=["Semaine 1: diagnostic", "Semaine 4: revue projets"],
    )
