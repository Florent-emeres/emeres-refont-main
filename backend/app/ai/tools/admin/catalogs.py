from app.models.schemas import CatalogsRequest, CatalogsResponse


def admin_catalogs(req: CatalogsRequest) -> CatalogsResponse:
    items = [f"item_{req.scope}_{i}" for i in range(1, 4)]
    return CatalogsResponse(items=items)
