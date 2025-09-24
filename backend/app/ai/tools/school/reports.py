from app.models.schemas import ReportsRequest, ReportsResponse

def school_reports(req: ReportsRequest) -> ReportsResponse:
    indicators = {"period": req.period, "placed": 12, "in_progress": 5}
    return ReportsResponse(indicators=indicators)
