from app.models.schemas import CoverLetterRequest, CoverLetterResponse

def student_cover_letter(req: CoverLetterRequest) -> CoverLetterResponse:
    return CoverLetterResponse(
        letter=f"Cher employeur, je postule pour {req.offer} avec le profil {req.profile}.",
        key_points=["Motivation", "Compétences", "Adaptabilité"],
    )
