from app.models.schemas import CVEvalRequest, CVEvalResponse


def student_diagnostic(req: CVEvalRequest) -> CVEvalResponse:
    return CVEvalResponse(strengths=["Clarté"], weaknesses=["Dates manquantes"])
