"""
ÉMÉRÉS Premium Modules - Focus/Learning/Edutainment Services
Modules payants avec intégration crédits (≤30% du panier)
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime, timezone, timedelta
from enum import Enum
import uuid
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import logging

logger = logging.getLogger(__name__)

class ModuleType(str, Enum):
    """Types de modules premium"""
    # Focus
    FOCUS_ROOMS = "focus_rooms"
    SOUNDSCAPES = "soundscapes"
    DISTRACTION_BLOCKER = "distraction_blocker"
    FLOW_COACH = "flow_coach"
    
    # Learning
    MICRO_QUESTS = "micro_quests"
    SPACED_REPETITION = "spaced_repetition"
    AI_STUDY_COACH = "ai_study_coach"
    ASSESSMENT_SIMULATION = "assessment_simulation"
    
    # Edutainment
    CAREER_ESCAPE_ROOM = "career_escape_room"
    SPONSORED_TOURNAMENTS = "sponsored_tournaments"

class SubscriptionTier(str, Enum):
    """Niveaux d'abonnement"""
    FREE = "free"
    FOCUS_PLUS = "focus_plus"  # 6-7€/mois
    LEARN_PLUS = "learn_plus"  # 9-12€/mois
    VR_SIM_PASS = "vr_sim_pass"  # 6-9€/mois
    PREMIUM_ALL = "premium_all"

class PurchaseType(str, Enum):
    """Types d'achats"""
    SUBSCRIPTION = "subscription"
    ONE_TIME = "one_time"
    CREDITS_ONLY = "credits_only"

class UsageFrequency(str, Enum):
    """Fréquence d'usage"""
    DAILY = "daily"
    WEEKLY = "weekly" 
    MONTHLY = "monthly"
    ONE_TIME = "one_time"

# ========== MODÈLES DE DONNÉES ==========

class PremiumModule(BaseModel):
    """Module premium"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    module_type: ModuleType
    name: str
    description: str
    category: str  # "focus", "learning", "edutainment"
    
    # Pricing
    price_euros: float
    price_credits: Optional[int] = None  # Prix en crédits (si applicable)
    subscription_tier: List[SubscriptionTier] = []
    purchase_type: PurchaseType
    
    # Features
    free_features: List[str] = []
    premium_features: List[str] = []
    usage_limits: Dict[str, Any] = {}  # Limites par niveau
    
    # Metadata
    is_active: bool = True
    requires_subscription: bool = False
    min_age: Optional[int] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserSubscription(BaseModel):
    """Abonnement utilisateur"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    subscription_tier: SubscriptionTier
    
    # Facturation
    price_paid_euros: float
    credits_used: int = 0  # Crédits utilisés pour cet abonnement (≤30%)
    payment_id: str
    
    # Période
    start_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    end_date: str  # Date de fin d'abonnement
    auto_renew: bool = True
    
    # Status
    is_active: bool = True
    is_trial: bool = False
    trial_end_date: Optional[str] = None
    
    # Metadata
    purchased_by: Literal["student", "school", "company"] = "student"  # Qui a payé
    school_license_id: Optional[str] = None  # Si acheté par l'école
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ModuleUsage(BaseModel):
    """Usage d'un module"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module_type: ModuleType
    subscription_id: Optional[str] = None
    
    # Session
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_duration_minutes: Optional[int] = None
    completion_percentage: float = 0.0
    
    # Résultats
    score: Optional[float] = None
    achievements: List[str] = []
    metadata: Dict[str, Any] = {}
    
    # Timestamps
    started_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    completed_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class FocusRoom(BaseModel):
    """Salle de focus collaborative"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    
    # Configuration
    room_type: Literal["public", "private", "school"] = "public"
    max_participants: int = 25
    pomodoro_duration: int = 25  # minutes
    break_duration: int = 5
    long_break_duration: int = 15
    sessions_before_long_break: int = 4
    
    # Ownership
    created_by: str  # user_id
    school_id: Optional[str] = None
    is_premium: bool = False
    
    # État
    current_participants: List[str] = []  # user_ids
    is_active: bool = True
    started_at: Optional[str] = None
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MicroQuest(BaseModel):
    """Quête micro-learning"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    
    # Difficulté et durée
    difficulty_level: int = 1  # 1-5
    estimated_duration_minutes: int = 15
    
    # Contenu
    content_blocks: List[Dict[str, Any]] = []  # Texte, vidéo, quiz, etc.
    questions: List[Dict[str, Any]] = []
    correct_answers: List[str] = []
    
    # Récompenses
    points_reward: int = 25
    badge_reward: Optional[str] = None
    certificate: bool = False
    
    # Premium
    is_premium: bool = False
    mentor_feedback: bool = False  # Feedback par mentor si premium
    
    # État
    is_active: bool = True
    completion_count: int = 0
    average_score: float = 0.0
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AssessmentSimulation(BaseModel):
    """Simulation d'assessment center"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    industry: str
    job_role: str
    
    # Configuration
    simulation_type: Literal["2d", "360", "vr_web"] = "2d"
    duration_minutes: int = 30
    difficulty: int = 3  # 1-5
    
    # Scénarios
    scenarios: List[Dict[str, Any]] = []
    evaluation_criteria: List[str] = []
    
    # Pricing
    price_euros: float = 3.99
    is_premium: bool = True
    
    # Statistiques
    completion_count: int = 0
    average_score: float = 0.0
    success_rate: float = 0.0  # % qui passent le seuil
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CareerEscapeRoom(BaseModel):
    """Escape room carrière"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    career_field: str
    
    # Configuration
    room_type: Literal["2d", "360"] = "2d"
    estimated_duration: int = 45  # minutes
    max_players: int = 4
    difficulty: int = 2
    
    # Épisodes
    episodes: List[Dict[str, Any]] = []
    total_episodes: int = 1
    
    # Pricing
    price_per_episode: float = 1.99
    season_pass_price: float = 7.99  # Pack complet
    
    # Métriques
    completion_rate: float = 0.0
    player_satisfaction: float = 0.0
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ========== CONFIGURATION DES MODULES ==========

PREMIUM_MODULES_CONFIG = {
    # Focus Modules
    ModuleType.FOCUS_ROOMS: {
        "name": "Focus Rooms Pro",
        "description": "Salles de travail collaboratives avec Pomodoro synchronisé",
        "category": "focus",
        "price_euros": 6.00,
        "subscription_tier": [SubscriptionTier.FOCUS_PLUS],
        "free_features": ["1 salle publique", "Pomodoro basique", "25 min sessions"],
        "premium_features": ["Salles privées", "Stats personnelles", "Sessions longues", "Replay"]
    },
    
    ModuleType.SOUNDSCAPES: {
        "name": "Deep Focus Soundscapes",
        "description": "Ambiances sonores optimisées pour la concentration",
        "category": "focus", 
        "price_euros": 4.00,
        "subscription_tier": [SubscriptionTier.FOCUS_PLUS],
        "free_features": ["3 ambiances de base", "Lecture en ligne"],
        "premium_features": ["Playlists IA", "Binauraux", "Mode hors-ligne", "Égaliseur"]
    },
    
    ModuleType.DISTRACTION_BLOCKER: {
        "name": "Blocage Distractions Pro",
        "description": "Bloque réseaux sociaux et sites perturbateurs",
        "category": "focus",
        "price_euros": 2.00,
        "subscription_tier": [SubscriptionTier.FOCUS_PLUS],
        "free_features": ["Blocage basique 30min", "Sites prédéfinis"],
        "premium_features": ["Politiques école", "Rapports d'attention", "Calendriers intelligents"]
    },
    
    ModuleType.FLOW_COACH: {
        "name": "Coach Flow IA",
        "description": "Micro-conseils pour maintenir la concentration",
        "category": "focus",
        "price_euros": 3.00,
        "subscription_tier": [SubscriptionTier.FOCUS_PLUS],
        "free_features": ["Conseils génériques", "1 session/jour"],
        "premium_features": ["Plans personnalisés", "Routines", "Bilan hebdo"]
    },
    
    # Learning Modules
    ModuleType.MICRO_QUESTS: {
        "name": "Quêtes Micro-Learning",
        "description": "Parcours gamifiés de compétences courtes",
        "category": "learning",
        "price_euros": 7.00,
        "subscription_tier": [SubscriptionTier.LEARN_PLUS],
        "free_features": ["3 quêtes/mois", "Progression basique"],
        "premium_features": ["Quêtes illimitées", "Mini-certificats", "Feedback mentor"]
    },
    
    ModuleType.SPACED_REPETITION: {
        "name": "Cartes Mémoires Pro",
        "description": "Système de révision espacée intelligent",
        "category": "learning",
        "price_euros": 3.00,
        "subscription_tier": [SubscriptionTier.LEARN_PLUS],
        "free_features": ["Decks publics", "50 cartes max"],
        "premium_features": ["Decks premium", "Illimité", "Decks école/entreprise", "Export"]
    },
    
    ModuleType.AI_STUDY_COACH: {
        "name": "Coach IA Études",
        "description": "Assistant personnel pour révisions et examens",
        "category": "learning",
        "price_euros": 5.00,
        "subscription_tier": [SubscriptionTier.LEARN_PLUS],
        "free_features": ["3 sessions/semaine", "Quiz basiques"],
        "premium_features": ["Illimité", "Analyses d'erreurs", "Simulations oral"]
    },
    
    ModuleType.ASSESSMENT_SIMULATION: {
        "name": "Simulations Assessment",
        "description": "Entraînement aux évaluations professionnelles",
        "category": "learning",
        "price_euros": 5.00,
        "purchase_type": PurchaseType.ONE_TIME,
        "free_features": ["1 simulation/mois", "Score basique"],
        "premium_features": ["Scénarios avancés", "Score certifié", "Rapport détaillé"]
    },
    
    # Edutainment Modules
    ModuleType.CAREER_ESCAPE_ROOM: {
        "name": "Escape Rooms Carrière",
        "description": "Découverte métiers par énigmes 2D/360",
        "category": "edutainment",
        "price_euros": 1.99,
        "purchase_type": PurchaseType.ONE_TIME,
        "free_features": ["1 épisode gratuit", "Mode découverte"],
        "premium_features": ["Tous épisodes", "Chrono", "Classements"]
    },
    
    ModuleType.SPONSORED_TOURNAMENTS: {
        "name": "Tournois & Défis Pro",
        "description": "Compétitions sponsorisées par entreprises",
        "category": "edutainment",
        "price_euros": 10.00,
        "purchase_type": PurchaseType.ONE_TIME,
        "free_features": ["Participation basique", "Résultats"],
        "premium_features": ["Coaching", "Feedback jurys", "Replays"]
    }
}

# Packs d'abonnement
SUBSCRIPTION_TIERS_CONFIG = {
    SubscriptionTier.FOCUS_PLUS: {
        "name": "Pack Focus+",
        "description": "Focus Rooms + Soundscapes + Blocker + Coach",
        "price_euros": 6.99,
        "price_school_per_student": 1.00,
        "modules": [
            ModuleType.FOCUS_ROOMS,
            ModuleType.SOUNDSCAPES, 
            ModuleType.DISTRACTION_BLOCKER,
            ModuleType.FLOW_COACH
        ],
        "benefits": ["Usage illimité", "Stats avancées", "Support prioritaire"]
    },
    
    SubscriptionTier.LEARN_PLUS: {
        "name": "Pack Learn+", 
        "description": "Quêtes + Cartes + Coach IA + Assessments",
        "price_euros": 10.99,
        "price_school_per_student": 2.00,
        "modules": [
            ModuleType.MICRO_QUESTS,
            ModuleType.SPACED_REPETITION,
            ModuleType.AI_STUDY_COACH,
            ModuleType.ASSESSMENT_SIMULATION
        ],
        "benefits": ["Contenu illimité", "Certificats", "Feedback expert"]
    },
    
    SubscriptionTier.VR_SIM_PASS: {
        "name": "Pass Simulations",
        "description": "Escape Rooms + Tournois + Assessments",
        "price_euros": 8.99,
        "price_school_per_student": 1.50,
        "modules": [
            ModuleType.CAREER_ESCAPE_ROOM,
            ModuleType.SPONSORED_TOURNAMENTS,
            ModuleType.ASSESSMENT_SIMULATION
        ],
        "benefits": ["Accès complet", "Événements exclusifs", "Certifications"]
    },
    
    SubscriptionTier.PREMIUM_ALL: {
        "name": "Pack Complet",
        "description": "Tous les modules premium inclus",
        "price_euros": 19.99,
        "price_school_per_student": 3.50,
        "modules": list(ModuleType),
        "benefits": ["Accès total", "Support VIP", "Bêta features"]
    }
}

class PremiumModulesService:
    """Service de gestion des modules premium"""
    
    def __init__(self, db, credits_service=None):
        self.db = db
        self.credits_service = credits_service
        self.MAX_CREDITS_PERCENT = 30  # Maximum 30% en crédits
        self.MIN_ORDER_EUROS = 10  # Minimum 10€ pour utiliser crédits

    async def initialize_collections(self):
        """Initialise les collections MongoDB"""
        collections = [
            'premium_modules', 'user_subscriptions', 'module_usage',
            'focus_rooms', 'micro_quests', 'assessment_simulations',
            'career_escape_rooms'
        ]
        
        for collection in collections:
            if collection not in await self.db.list_collection_names():
                await self.db.create_collection(collection)
        
        # Index
        await self.db.user_subscriptions.create_index([("user_id", 1), ("is_active", 1)])
        await self.db.module_usage.create_index([("user_id", 1), ("created_at", -1)])
        await self.db.focus_rooms.create_index([("is_active", 1), ("room_type", 1)])
        
        logger.info("Premium modules collections initialized")

    async def get_user_subscription(self, user_id: str) -> Optional[UserSubscription]:
        """Récupère l'abonnement actif de l'utilisateur"""
        now = datetime.now(timezone.utc).isoformat()
        
        subscription_data = await self.db.user_subscriptions.find_one({
            "user_id": user_id,
            "is_active": True,
            "end_date": {"$gt": now}
        })
        
        if subscription_data:
            return UserSubscription(**subscription_data)
        return None

    async def check_module_access(self, user_id: str, module_type: ModuleType) -> tuple[bool, str]:
        """Vérifie si l'utilisateur a accès à un module"""
        subscription = await self.get_user_subscription(user_id)
        
        if not subscription:
            return False, "Abonnement requis pour ce module premium"
        
        tier_config = SUBSCRIPTION_TIERS_CONFIG.get(subscription.subscription_tier)
        if not tier_config:
            return False, "Abonnement invalide"
        
        if module_type in tier_config["modules"]:
            return True, "Accès accordé"
        
        return False, f"Module non inclus dans votre abonnement {subscription.subscription_tier}"

    async def create_subscription(
        self,
        user_id: str,
        subscription_tier: SubscriptionTier,
        payment_euros: float,
        credits_used: int = 0,
        payment_id: str = None,
        duration_months: int = 1,
        purchased_by: str = "student",
        school_license_id: str = None
    ) -> UserSubscription:
        """Crée un nouvel abonnement"""
        
        # Calculer la date de fin
        start_date = datetime.now(timezone.utc)
        end_date = start_date + timedelta(days=30 * duration_months)
        
        subscription = UserSubscription(
            user_id=user_id,
            subscription_tier=subscription_tier,
            price_paid_euros=payment_euros,
            credits_used=credits_used,
            payment_id=payment_id or f"sub-{uuid.uuid4()}",
            end_date=end_date.isoformat(),
            purchased_by=purchased_by,
            school_license_id=school_license_id
        )
        
        # Désactiver l'ancien abonnement si existant
        await self.db.user_subscriptions.update_many(
            {"user_id": user_id, "is_active": True},
            {"$set": {"is_active": False}}
        )
        
        # Créer le nouveau
        await self.db.user_subscriptions.insert_one(subscription.dict())
        
        logger.info(f"Created subscription {subscription.id} for user {user_id}: {subscription_tier}")
        return subscription

    async def purchase_with_credits(
        self,
        user_id: str,
        subscription_tier: SubscriptionTier,
        credits_to_use_euros: float
    ) -> tuple[bool, str, Optional[UserSubscription]]:
        """Achat d'abonnement avec crédits (≤30%)"""
        
        tier_config = SUBSCRIPTION_TIERS_CONFIG.get(subscription_tier)
        if not tier_config:
            return False, "Abonnement invalide", None
        
        total_price = tier_config["price_euros"]
        
        # Vérifier les règles crédits
        if total_price < self.MIN_ORDER_EUROS:
            return False, f"Commande minimum de {self.MIN_ORDER_EUROS}€ requise", None
        
        max_credits_euros = total_price * self.MAX_CREDITS_PERCENT / 100
        if credits_to_use_euros > max_credits_euros:
            return False, f"Maximum {self.MAX_CREDITS_PERCENT}% ({max_credits_euros:.2f}€) payable en crédits", None
        
        # Vérifier le solde crédits via credits_service
        if self.credits_service:
            can_use, message = await self.credits_service.can_use_credits_for_order(
                user_id=user_id,
                order_total_cents=int(total_price * 100),
                credits_to_use_cents=int(credits_to_use_euros * 100)
            )
            
            if not can_use:
                return False, message, None
        
        # Calculer le montant restant à payer
        remaining_euros = total_price - credits_to_use_euros
        credits_used_cents = int(credits_to_use_euros * 100)
        
        # Dépenser les crédits si service disponible
        if self.credits_service and credits_used_cents > 0:
            payment_id = f"premium-sub-{uuid.uuid4()}"
            spend_transaction = await self.credits_service.spend_credits(
                user_id=user_id,
                credits_amount_cents=credits_used_cents,
                order_id=payment_id,
                metadata={
                    "subscription_tier": subscription_tier,
                    "total_price_euros": total_price,
                    "remaining_euros": remaining_euros
                }
            )
            
            if not spend_transaction:
                return False, "Échec de la dépense des crédits", None
        
        # Créer l'abonnement
        subscription = await self.create_subscription(
            user_id=user_id,
            subscription_tier=subscription_tier,
            payment_euros=remaining_euros,
            credits_used=credits_used_cents,
            payment_id=f"premium-{uuid.uuid4()}"
        )
        
        return True, f"Abonnement {subscription_tier} créé avec succès", subscription

    async def record_module_usage(
        self,
        user_id: str,
        module_type: ModuleType,
        session_duration: int = None,
        completion_percentage: float = 0.0,
        score: float = None,
        metadata: Dict[str, Any] = None
    ) -> ModuleUsage:
        """Enregistre l'usage d'un module"""
        
        subscription = await self.get_user_subscription(user_id)
        subscription_id = subscription.id if subscription else None
        
        usage = ModuleUsage(
            user_id=user_id,
            module_type=module_type,
            subscription_id=subscription_id,
            session_duration_minutes=session_duration,
            completion_percentage=completion_percentage,
            score=score,
            metadata=metadata or {}
        )
        
        if completion_percentage >= 100.0:
            usage.completed_at = datetime.now(timezone.utc).isoformat()
        
        await self.db.module_usage.insert_one(usage.dict())
        logger.info(f"Recorded usage for user {user_id}: {module_type}")
        
        return usage

    async def get_user_usage_stats(self, user_id: str, days: int = 30) -> Dict[str, Any]:
        """Récupère les statistiques d'usage utilisateur"""
        since_date = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
        
        pipeline = [
            {"$match": {"user_id": user_id, "created_at": {"$gte": since_date}}},
            {"$group": {
                "_id": "$module_type",
                "sessions_count": {"$sum": 1},
                "total_duration": {"$sum": "$session_duration_minutes"},
                "avg_completion": {"$avg": "$completion_percentage"},
                "avg_score": {"$avg": "$score"}
            }}
        ]
        
        results = await self.db.module_usage.aggregate(pipeline).to_list(None)
        
        stats = {}
        for result in results:
            stats[result["_id"]] = {
                "sessions": result["sessions_count"],
                "total_duration_minutes": result["total_duration"] or 0,
                "avg_completion_percent": result["avg_completion"] or 0,
                "avg_score": result["avg_score"] or 0
            }
        
        return stats

    # ========== FOCUS MODULES ==========
    
    async def create_focus_room(
        self,
        name: str,
        created_by: str,
        room_type: str = "public",
        max_participants: int = 25,
        is_premium: bool = False
    ) -> FocusRoom:
        """Crée une salle de focus"""
        
        room = FocusRoom(
            name=name,
            description=f"Salle de focus collaborative - {name}",
            room_type=room_type,
            max_participants=max_participants,
            created_by=created_by,
            is_premium=is_premium
        )
        
        await self.db.focus_rooms.insert_one(room.dict())
        logger.info(f"Created focus room {room.id}: {name}")
        
        return room

    async def join_focus_room(self, room_id: str, user_id: str) -> tuple[bool, str]:
        """Rejoint une salle de focus"""
        room_data = await self.db.focus_rooms.find_one({"id": room_id, "is_active": True})
        
        if not room_data:
            return False, "Salle introuvable"
        
        room = FocusRoom(**room_data)
        
        # Vérifier les permissions pour salle premium
        if room.is_premium:
            has_access, message = await self.check_module_access(user_id, ModuleType.FOCUS_ROOMS)
            if not has_access:
                return False, message
        
        # Vérifier la capacité
        if len(room.current_participants) >= room.max_participants:
            return False, "Salle pleine"
        
        # Ajouter l'utilisateur
        if user_id not in room.current_participants:
            await self.db.focus_rooms.update_one(
                {"id": room_id},
                {"$push": {"current_participants": user_id}}
            )
        
        return True, "Rejoint avec succès"

    # ========== MICRO QUESTS ==========
    
    async def get_available_quests(self, user_id: str) -> List[MicroQuest]:
        """Récupère les quêtes disponibles pour l'utilisateur"""
        subscription = await self.get_user_subscription(user_id)
        
        # Utilisateur gratuit : seulement les quêtes gratuites
        if not subscription:
            cursor = self.db.micro_quests.find({"is_premium": False, "is_active": True})
        else:
            # Utilisateur premium : toutes les quêtes
            cursor = self.db.micro_quests.find({"is_active": True})
        
        quests_data = await cursor.to_list(None)
        return [MicroQuest(**quest) for quest in quests_data]

# ========== INITIALISATION ==========

async def create_premium_modules_service(db, credits_service=None) -> PremiumModulesService:
    """Crée et initialise le service des modules premium"""
    service = PremiumModulesService(db, credits_service)
    await service.initialize_collections()
    return service