from app.models.schemas import RgpdRequest, RgpdResponse

def admin_rgpd(req: RgpdRequest) -> RgpdResponse:
    return RgpdResponse(export_url=f"https://export.emeres/{req.user_id}", deleted=False)
