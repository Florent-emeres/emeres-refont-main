from app.models.schemas import (
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewStartRequest,
    InterviewStartResponse,
)


def student_interview_start(req: InterviewStartRequest) -> InterviewStartResponse:
    return InterviewStartResponse(
        session_id="sess_123",
        first_question=f"Pourquoi {req.role} ?",
    )


def student_interview_answer(req: InterviewAnswerRequest) -> InterviewAnswerResponse:
    return InterviewAnswerResponse(
        feedback="Réponse claire, illustre avec un exemple.",
        next_question="Parle d’un projet marquant.",
    )
