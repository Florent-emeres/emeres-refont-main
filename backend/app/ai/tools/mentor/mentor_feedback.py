from app.models.schemas import MentorFeedbackRequest, MentorFeedbackResponse

def mentor_mentor_feedback(req: MentorFeedbackRequest) -> MentorFeedbackResponse:
    feedback = [
        "Très bonne progression sur les objectifs fixés",
        "Poursuivre l'entraînement aux entretiens",
    ]
    if req.notes:
        feedback.append(f"Note mentor: {req.notes}")
    return MentorFeedbackResponse(feedback=feedback)
