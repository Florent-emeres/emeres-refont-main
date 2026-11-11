from app.models.schemas import MatchingRequest, MatchingResult


def company_matching(req: MatchingRequest) -> MatchingResult:
    offers = [
        {"offer_id": f"offer_{i+1}", "match": 0.8 - i * 0.1} for i in range(min(req.top_k, 3))
    ]
    return MatchingResult(offers=offers)
