from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Set


class JobseekerData(BaseModel):
    programs: Set[str] = set()
    is_jobseeker: bool = True
    
    model_config = {
        "extra": "allow"  # Permet des champs supplémentaires
    }


class ProfileUpdate(BaseModel):
    jobseeker: Optional[JobseekerData] = None


class CoverLetterRequest(BaseModel):
    profile: str
    offer: str


class CoverLetterResponse(BaseModel):
    letter: str
    key_points: List[str]


class JobRecoRequest(BaseModel):
    profile: str


class JobRecoResponse(BaseModel):
    offers: List[str]


class CoachRequest(BaseModel):
    question: str


class CoachResponse(BaseModel):
    answer: str


class CVEvalRequest(BaseModel):
    cv_text: str


class CVEvalResponse(BaseModel):
    strengths: List[str]
    weaknesses: List[str]


class CVOptimizeRequest(BaseModel):
    cv_text: str
    target_role: Optional[str] = None


class CVOptimizeResponse(BaseModel):
    improved_cv: str
    suggestions: List[str] = []
    ats_score_hint: Optional[str] = None


class CareerExploreRequest(BaseModel):
    interests: List[str] = []
    experience_level: Optional[str] = None


class CareerExploreResponse(BaseModel):
    roles: List[str]
    skills_to_learn: List[str]
    resources: List[str]


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
    next_question: Optional[str] = None


# Company persona
class ShortlistRequest(BaseModel):
    offer_id: str
    top_k: int = 10


class ShortlistResponse(BaseModel):
    candidates: List[Dict[str, Any]]


class MatchingRequest(BaseModel):
    student_id: str
    top_k: int = 10


class MatchingResult(BaseModel):
    offers: List[Dict[str, Any]]


class JobPostingRequest(BaseModel):
    role: str
    requirements: List[str] = []


class JobPostingResponse(BaseModel):
    title: str
    description: str


class InterviewGuideRequest(BaseModel):
    role: str


class InterviewGuideResponse(BaseModel):
    questions: List[str]
    scoring_rubric: Dict[str, Any]


class OnboardingPackRequest(BaseModel):
    role: str


class OnboardingPackResponse(BaseModel):
    checklist: List[str]
    messages: List[str]


# School persona
class CohortTrackRequest(BaseModel):
    cohort_id: str


class CohortTrackResponse(BaseModel):
    risks: List[str]
    alerts: List[str]


class ReportsRequest(BaseModel):
    period: str


class ReportsResponse(BaseModel):
    indicators: Dict[str, Any]


class DocumentsRequest(BaseModel):
    student_id: str


class DocumentsResponse(BaseModel):
    generated: List[str]


class ComplianceRequest(BaseModel):
    school_id: str


class ComplianceResponse(BaseModel):
    checklist: List[str]


class PartnershipsRequest(BaseModel):
    domain: str


class PartnershipsResponse(BaseModel):
    prospects: List[str]


# Mentor persona
class MentorPlanRequest(BaseModel):
    student_id: str


class MentorPlanResponse(BaseModel):
    goals: List[str]
    milestones: List[str]


class MentorFeedbackRequest(BaseModel):
    student_id: str
    notes: Optional[str] = None


class MentorFeedbackResponse(BaseModel):
    feedback: List[str]


class RiskDetectRequest(BaseModel):
    student_id: str


class RiskDetectResponse(BaseModel):
    risks: List[str]


class MentorAdviceRequest(BaseModel):
    student_id: str


class MentorAdviceResponse(BaseModel):
    tips: List[str]


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
    metrics: Dict[str, Any]


class CatalogsRequest(BaseModel):
    scope: str


class CatalogsResponse(BaseModel):
    items: List[str]


class RgpdRequest(BaseModel):
    user_id: str


class RgpdResponse(BaseModel):
    export_url: Optional[str] = None
    deleted: bool = False


class ABTestRequest(BaseModel):
    experiment: str


class ABTestResponse(BaseModel):
    status: str


class JobseekerStatus(BaseModel):
    is_jobseeker: bool
    programs: List[str] = []


class ProfileUpdate(BaseModel):
    jobseeker: Optional[JobseekerStatus] = None


