from app.models.schemas import FinalEvalRequest, FinalEvalResponse


def mentor_final_evaluation(req: FinalEvalRequest) -> FinalEvalResponse:
    return FinalEvalResponse(grade="A", comments=f"Étudiant {req.student_id} prêt pour la suite")
