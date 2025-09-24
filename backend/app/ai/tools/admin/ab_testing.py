from app.models.schemas import ABTestRequest, ABTestResponse

def admin_ab_testing(req: ABTestRequest) -> ABTestResponse:
    return ABTestResponse(status=f"running:{req.experiment}")
