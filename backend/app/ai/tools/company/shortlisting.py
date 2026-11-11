from app.models.schemas import ShortlistRequest, ShortlistResponse


def company_shortlisting(req: ShortlistRequest) -> ShortlistResponse:
    candidates = [
        {"candidate_id": f"cand_{i+1}", "score": 0.9 - i * 0.05} for i in range(min(req.top_k, 3))
    ]
    return ShortlistResponse(candidates=candidates)
