from app.models.schemas import CoachRequest, CoachResponse


def student_coach(req: CoachRequest) -> CoachResponse:
    return CoachResponse(answer="Commence par chiffrer tes résultats et clarifier tes dates.")
