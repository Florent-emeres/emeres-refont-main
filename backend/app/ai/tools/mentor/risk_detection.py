from app.models.schemas import RiskDetectRequest, RiskDetectResponse

def mentor_risk_detection(req: RiskDetectRequest) -> RiskDetectResponse:
    risks = [f"Manque de pratique pour {req.student_id}", "Risque de démotivation"]
    return RiskDetectResponse(risks=risks)
