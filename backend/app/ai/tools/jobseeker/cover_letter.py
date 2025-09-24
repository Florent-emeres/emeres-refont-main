from app.models.schemas import CoverLetterRequest, CoverLetterResponse

def jobseeker_cover_letter(req: CoverLetterRequest) -> CoverLetterResponse:
    letter = (
        f"Madame, Monsieur,\n"
        f"Je souhaite postuler à {req.offer}. "
        "Mon parcours et ma motivation soutiennent ma réinsertion professionnelle."
    )
    return CoverLetterResponse(
        letter=letter,
        key_points=["Motivation", "Sérieux", "Disponibilité"],
    )
