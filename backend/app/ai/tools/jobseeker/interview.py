from app.models.schemas import (
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewStartRequest,
    InterviewStartResponse,
)


def jobseeker_interview_start(req: InterviewStartRequest) -> InterviewStartResponse:
    return InterviewStartResponse(
        session_id="js_sess_1",
        first_question=f"Présentez-vous brièvement pour {req.role}.",
    )


def jobseeker_interview_answer(req: InterviewAnswerRequest) -> InterviewAnswerResponse:
    return InterviewAnswerResponse(
        feedback="Utilise STAR et un exemple concret.",
        next_question="Parle d’une difficulté surmontée.",
    )
