from app.models.schemas import CoachRequest, CoachResponse


def jobseeker_coach(req: CoachRequest) -> CoachResponse:
    answer = "Plan 7 jours : 1 CV, 2 candidatures ciblées, 1 simulation d’entretien."
    return CoachResponse(answer=answer)
