from typing import Any

from pydantic import BaseModel


class JobseekerData(BaseModel):
    programs: set[str] = set()
    is_jobseeker: bool = True

    model_config = {"extra": "allow"}  # Permet des champs supplémentaires


class CoverLetterRequest(BaseModel):
    profile: str
    offer: str


class CoverLetterResponse(BaseModel):
    letter: str
    key_points: list[str]


class JobRecoRequest(BaseModel):
    profile: str


class JobRecoResponse(BaseModel):
    offers: list[str]


class CoachRequest(BaseModel):
    question: str


class CoachResponse(BaseModel):
    answer: str


class CVEvalRequest(BaseModel):
    cv_text: str


class CVEvalResponse(BaseModel):
    strengths: list[str]
    weaknesses: list[str]


class CVOptimizeRequest(BaseModel):
    cv_text: str
    target_role: str | None = None


class CVOptimizeResponse(BaseModel):
    improved_cv: str
    suggestions: list[str] = []
    ats_score_hint: str | None = None


class CareerExploreRequest(BaseModel):
    interests: list[str] = []
    experience_level: str | None = None


class CareerExploreResponse(BaseModel):
    roles: list[str]
    skills_to_learn: list[str]
    resources: list[str]


class InterviewStartRequest(BaseModel):
    role: str


class InterviewStartResponse(BaseModel):
    session_id: str
    first_question: str


class InterviewAnswerRequest(BaseModel):
    session_id: str
    answer: str


class InterviewAnswerResponse(BaseModel):
    feedback: str
    next_question: str | None = None


# Company persona
class ShortlistRequest(BaseModel):
    offer_id: str
    top_k: int = 10


class ShortlistResponse(BaseModel):
    candidates: list[dict[str, Any]]


class MatchingRequest(BaseModel):
    student_id: str
    top_k: int = 10


class MatchingResult(BaseModel):
    offers: list[dict[str, Any]]


class JobPostingRequest(BaseModel):
    role: str
    requirements: list[str] = []


class JobPostingResponse(BaseModel):
    title: str
    description: str


class InterviewGuideRequest(BaseModel):
    role: str


class InterviewGuideResponse(BaseModel):
    questions: list[str]
    scoring_rubric: dict[str, Any]


class OnboardingPackRequest(BaseModel):
    role: str


class OnboardingPackResponse(BaseModel):
    checklist: list[str]
    messages: list[str]


# School persona
class CohortTrackRequest(BaseModel):
    cohort_id: str


class CohortTrackResponse(BaseModel):
    risks: list[str]
    alerts: list[str]


class ReportsRequest(BaseModel):
    period: str


class ReportsResponse(BaseModel):
    indicators: dict[str, Any]


class DocumentsRequest(BaseModel):
    student_id: str


class DocumentsResponse(BaseModel):
    generated: list[str]


class ComplianceRequest(BaseModel):
    school_id: str


class ComplianceResponse(BaseModel):
    checklist: list[str]


class PartnershipsRequest(BaseModel):
    domain: str


class PartnershipsResponse(BaseModel):
    prospects: list[str]


# Mentor persona
class MentorPlanRequest(BaseModel):
    student_id: str


class MentorPlanResponse(BaseModel):
    goals: list[str]
    milestones: list[str]


class MentorFeedbackRequest(BaseModel):
    student_id: str
    notes: str | None = None


class MentorFeedbackResponse(BaseModel):
    feedback: list[str]


class RiskDetectRequest(BaseModel):
    student_id: str


class RiskDetectResponse(BaseModel):
    risks: list[str]


class MentorAdviceRequest(BaseModel):
    student_id: str


class MentorAdviceResponse(BaseModel):
    tips: list[str]


class FinalEvalRequest(BaseModel):
    student_id: str


class FinalEvalResponse(BaseModel):
    grade: str
    comments: str


# Admin persona
class ModerationRequest(BaseModel):
    item_id: str


class ModerationResponse(BaseModel):
    action: str


class ObservabilityRequest(BaseModel):
    timeframe: str


class ObservabilityResponse(BaseModel):
    metrics: dict[str, Any]


class CatalogsRequest(BaseModel):
    scope: str


class CatalogsResponse(BaseModel):
    items: list[str]


class RgpdRequest(BaseModel):
    user_id: str


class RgpdResponse(BaseModel):
    export_url: str | None = None
    deleted: bool = False


class ABTestRequest(BaseModel):
    experiment: str


class ABTestResponse(BaseModel):
    status: str


class JobseekerStatus(BaseModel):
    is_jobseeker: bool
    programs: list[str] = []


class ProfileUpdate(BaseModel):
    jobseeker: JobseekerStatus | None = None
