from app.models.schemas import InterviewGuideRequest, InterviewGuideResponse

def company_interview_guide(req: InterviewGuideRequest) -> InterviewGuideResponse:
    questions = [
        f"Parlez-moi de votre expérience liée au rôle {req.role}.",
        "Quel a été votre plus grand défi professionnel ?",
        "Comment mesurez-vous votre impact au quotidien ?",
    ]
    scoring = {"technical": 40, "soft_skills": 35, "culture_fit": 25}
    return InterviewGuideResponse(questions=questions, scoring_rubric=scoring)
