from app.models.schemas import DocumentsRequest, DocumentsResponse


def school_documents(req: DocumentsRequest) -> DocumentsResponse:
    generated = [
        f"certificat_scolarite_{req.student_id}.pdf",
        f"convention_stage_{req.student_id}.pdf",
    ]
    return DocumentsResponse(generated=generated)
