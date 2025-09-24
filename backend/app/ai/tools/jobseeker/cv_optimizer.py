from app.models.schemas import CVOptimizeRequest, CVOptimizeResponse

def jobseeker_cv_optimizer(req: CVOptimizeRequest) -> CVOptimizeResponse:
    base_cv = req.cv_text.strip()
    additions = "\n\n— Axe insertion —\n• Soft skills visibles\n• Réalisations concrètes\n• Lisibilité des dates"
    improved = base_cv + additions
    if req.target_role:
        improved += f"\n• Ciblage: {req.target_role}"
    return CVOptimizeResponse(
        improved_cv=improved,
        suggestions=[
            "Ajoute 2 réalisations chiffrées.",
            "Soigne l’en-tête.",
        ],
        ats_score_hint="Mots-clés du poste visé.",
    )
