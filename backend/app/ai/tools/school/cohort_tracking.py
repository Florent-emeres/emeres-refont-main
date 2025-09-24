from app.models.schemas import CohortTrackRequest, CohortTrackResponse

def school_cohort_tracking(req: CohortTrackRequest) -> CohortTrackResponse:
    return CohortTrackResponse(
        risks=[f"Retard sur livrables pour {req.cohort_id}"],
        alerts=["Prévoir point pédagogique"],
    )
