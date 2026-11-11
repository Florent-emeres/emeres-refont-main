from app.models.schemas import PartnershipsRequest, PartnershipsResponse


def school_partnerships(req: PartnershipsRequest) -> PartnershipsResponse:
    prospects = [f"Entreprise {req.domain.title()} {i+1}" for i in range(3)]
    return PartnershipsResponse(prospects=prospects)
