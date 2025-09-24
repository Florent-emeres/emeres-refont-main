from app.models.schemas import MentorAdviceRequest, MentorAdviceResponse

def mentor_mentor_advice(req: MentorAdviceRequest) -> MentorAdviceResponse:
    tips = [
        "Planifie une veille hebdomadaire",
        "Prépare une démonstration concrète",
    ]
    return MentorAdviceResponse(tips=tips)
