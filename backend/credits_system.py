"""
ÉMÉRÉS Credits System - Core Implementation
Système de crédits avec garde-fous économiques et anti-fraude
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime, timezone, timedelta
from enum import Enum
import uuid
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ActionType(str, Enum):
    """Types d'actions qui génèrent des points"""
    # Actions étudiants
    DAILY_LOGIN = "daily_login"
    PROFILE_COMPLETED = "profile_completed"
    PROFILE_UPDATE = "profile_update"
    APPLICATION_SENT = "application_sent"
    COMPANY_REVIEW = "company_review"
    REFERRAL = "referral"
    CV_UPDATE = "cv_update"
    SKILL_TEST = "skill_test"
    
    # Actions mentors
    MENTORING_SESSION_30 = "mentoring_session_30"
    MENTORING_SESSION_60 = "mentoring_session_60"
    CV_EVALUATION = "cv_evaluation"
    FLASH_ADVICE = "flash_advice"
    OBJECTIVE_REACHED = "objective_reached"
    GROUP_SESSION = "group_session"
    PROGRAM_COMPLETED = "program_completed"
    
    # Actions entreprises
    JOB_POSTED = "job_posted"
    INTERN_RECRUITED = "intern_recruited"
    TRAINING_GIVEN = "training_given"
    TEAM_CHALLENGE = "team_challenge"
    HR_EVENT = "hr_event"
    SCHOOL_PARTNERSHIP = "school_partnership"
    
    # Actions institutions
    STUDENT_SUPPORTED = "student_supported"
    PARTNERSHIP_CREATED = "partnership_created"
    PROJECT_LAUNCHED = "project_launched"
    EVENT_ORGANIZED = "event_organized"
    TEACHER_TRAINING = "teacher_training"
    PEDAGOGIC_INNOVATION = "pedagogic_innovation"

class TransactionType(str, Enum):
    """Types de transactions"""
    POINTS_EARNED = "points_earned"
    POINTS_TO_CREDITS = "points_to_credits"
    CREDITS_SPENT = "credits_spent"
    CREDITS_PURCHASED = "credits_purchased"
    CREDITS_EXPIRED = "credits_expired"
    CREDITS_REFUNDED = "credits_refunded"

class FraudRiskLevel(str, Enum):
    """Niveaux de risque fraude"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    BLOCKED = "blocked"

# ========== MODÈLES DE DONNÉES ==========

class UserBalance(BaseModel):
    """Solde utilisateur"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    points_balance: int = 0
    credits_balance: int = 0  # En centimes d'euros (1 crédit = 100 centimes)
    total_points_earned: int = 0
    total_credits_earned: int = 0
    total_credits_spent: int = 0
    total_credits_purchased: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PointsTransaction(BaseModel):
    """Transaction de points"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action_type: ActionType
    points_amount: int
    metadata: Dict[str, Any] = {}
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_fingerprint: Optional[str] = None
    fraud_score: float = 0.0
    fraud_risk: FraudRiskLevel = FraudRiskLevel.LOW
    is_valid: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CreditsTransaction(BaseModel):
    """Transaction de crédits"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    transaction_type: TransactionType
    credits_amount: int  # En centimes
    points_amount: Optional[int] = None  # Si conversion points->crédits
    order_id: Optional[str] = None  # Si achat ou dépense
    metadata: Dict[str, Any] = {}
    expires_at: Optional[str] = None  # Expiration des crédits
    is_valid: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ActionCap(BaseModel):
    """Limitation d'actions"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    action_type: ActionType
    user_id: str
    daily_count: int = 0
    weekly_count: int = 0
    monthly_count: int = 0
    last_action_at: Optional[str] = None
    cooldown_until: Optional[str] = None
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class FraudDetection(BaseModel):
    """Détection de fraude"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ip_address: str
    device_fingerprint: str
    user_agent: str
    risk_factors: List[str] = []
    risk_score: float = 0.0
    risk_level: FraudRiskLevel = FraudRiskLevel.LOW
    is_blocked: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class SystemSettings(BaseModel):
    """Paramètres système"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: Any
    description: str = ""
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ========== CONFIGURATION DES POINTS ==========

# Points gagnés par action (base) - CORRIGÉ CONFORMITÉ LÉGALE
POINTS_CONFIG = {
    # Étudiants - Valeurs ajustées pour éviter les gains passifs excessifs
    ActionType.DAILY_LOGIN: 1,  # Réduit de 10 à 1 - éviter farm connexions
    ActionType.PROFILE_COMPLETED: 2,  # Réduit de 50 à 2 - action unique
    ActionType.PROFILE_UPDATE: 1,  # Réduit de 5 à 1
    ActionType.APPLICATION_SENT: 1,  # Réduit de 15 à 1 - avec caps quotidiens
    ActionType.COMPANY_REVIEW: 5,  # Réduit de 25 à 5 - valeur ajoutée
    ActionType.REFERRAL: 20,  # Réduit de 100 à 20 - éviter abus
    ActionType.CV_UPDATE: 1,  # Réduit de 20 à 1
    ActionType.SKILL_TEST: 10,  # Réduit de 40 à 10 - effort réel
    
    # Mentors - IMPORTANT: Mentors payés en € par ÉMÉRÉS, pas en crédits
    # Ces points servent uniquement à réduire leurs propres achats d'outils
    ActionType.MENTORING_SESSION_30: 0,  # Mentors payés en €, pas en points
    ActionType.MENTORING_SESSION_60: 0,  # Mentors payés en €, pas en points
    ActionType.CV_EVALUATION: 5,  # Service gratuit → quelques points perso
    ActionType.FLASH_ADVICE: 2,  # Service gratuit → quelques points perso
    ActionType.OBJECTIVE_REACHED: 15,  # Succès étudiant → points bonus
    ActionType.GROUP_SESSION: 0,  # Mentors payés en €
    ActionType.PROGRAM_COMPLETED: 20,  # Succès programme → points bonus
    
    # Entreprises - Points pour engagement, pas rémunération
    ActionType.JOB_POSTED: 5,  # Réduit de 20 à 5
    ActionType.INTERN_RECRUITED: 15,  # Réduit de 100 à 15 - succès réel
    ActionType.TRAINING_GIVEN: 10,  # Réduit de 50 à 10
    ActionType.TEAM_CHALLENGE: 20,  # Réduit de 200 à 20
    ActionType.HR_EVENT: 25,  # Réduit de 300 à 25
    ActionType.SCHOOL_PARTNERSHIP: 30,  # Réduit de 400 à 30
    
    # Institutions - Points pour impact social
    ActionType.STUDENT_SUPPORTED: 2,  # Réduit de 30 à 2
    ActionType.PARTNERSHIP_CREATED: 20,  # Réduit de 200 à 20
    ActionType.PROJECT_LAUNCHED: 10,  # Réduit de 100 à 10
    ActionType.EVENT_ORGANIZED: 25,  # Réduit de 300 à 25
    ActionType.TEACHER_TRAINING: 15,  # Réduit de 150 à 15
    ActionType.PEDAGOGIC_INNOVATION: 30,  # Réduit de 400 à 30
}

# Caps par action (quotidien/mensuel) - RENFORCÉ ANTI-ABUS
ACTION_CAPS = {
    ActionType.DAILY_LOGIN: {"daily": 1, "monthly": 31},  # 1 seul par jour max
    ActionType.APPLICATION_SENT: {"daily": 3, "monthly": 30},  # Réduit pour éviter spam
    ActionType.COMPANY_REVIEW: {"daily": 1, "monthly": 10},  # Plus restrictif
    ActionType.CV_UPDATE: {"daily": 1, "monthly": 2},  # Très limité
    ActionType.SKILL_TEST: {"daily": 1, "monthly": 5},  # Limité pour éviter farm
    ActionType.REFERRAL: {"daily": 1, "monthly": 5},  # Très limité anti-abus
    
    # Mentors - Limites pour points bonus uniquement (payés en € séparément)
    ActionType.CV_EVALUATION: {"daily": 5, "monthly": 50},
    ActionType.FLASH_ADVICE: {"daily": 10, "monthly": 100},
    ActionType.OBJECTIVE_REACHED: {"daily": 3, "monthly": 20},
    
    # Entreprises - Caps raisonnables
    ActionType.JOB_POSTED: {"daily": 3, "monthly": 30},
    ActionType.INTERN_RECRUITED: {"daily": 5, "monthly": 50},
    
    # Institutions - Caps éducatifs
    ActionType.STUDENT_SUPPORTED: {"daily": 10, "monthly": 200},
}

# Cooldowns spéciaux (en heures)
ACTION_COOLDOWNS = {
    ActionType.REFERRAL: 24,  # 24h entre parrainages
    ActionType.COMPANY_REVIEW: 168,  # 7 jours pour même entreprise
    ActionType.OBJECTIVE_REACHED: 24,  # 24h entre objectifs
}

class CreditsService:
    """Service principal du système de crédits"""
    
    def __init__(self, db):
        self.db = db
        self.POINTS_TO_CREDITS_RATIO = 5  # 5 points = 1 crédit
        self.CREDITS_TO_EUROS_CENTS = 100  # 1 crédit = 100 centimes = 1€
        self.MAX_USAGE_PERCENT = 30  # Max 30% du panier en crédits
        self.MIN_ORDER_CENTS = 1000  # Minimum 10€ pour utiliser crédits
        self.CREDITS_EXPIRY_MONTHS = 12  # Expiration 12 mois
        
        # Garde-fous économiques
        self.MAX_OUTSTANDING_PERCENT = 10  # Max 10% du CA en crédits non utilisés
        self.MAX_COST_PERCENT = 8  # Max 8% des revenus en coût crédits
        
    async def initialize_collections(self):
        """Initialise les collections MongoDB"""
        collections = [
            'user_balances', 'points_transactions', 'credits_transactions',
            'action_caps', 'fraud_detections', 'system_settings'
        ]
        
        for collection in collections:
            if collection not in await self.db.list_collection_names():
                await self.db.create_collection(collection)
                logger.info(f"Created collection: {collection}")
        
        # Index pour performance
        await self.db.user_balances.create_index("user_id", unique=True)
        await self.db.points_transactions.create_index([("user_id", 1), ("created_at", -1)])
        await self.db.credits_transactions.create_index([("user_id", 1), ("created_at", -1)])
        await self.db.action_caps.create_index([("user_id", 1), ("action_type", 1)], unique=True)
        await self.db.fraud_detections.create_index([("user_id", 1), ("created_at", -1)])
        
        logger.info("Credits system collections initialized")

    async def get_user_balance(self, user_id: str) -> UserBalance:
        """Récupère le solde utilisateur"""
        balance_data = await self.db.user_balances.find_one({"user_id": user_id})
        
        if not balance_data:
            # Créer nouveau solde
            balance = UserBalance(user_id=user_id)
            await self.db.user_balances.insert_one(balance.dict())
            return balance
        
        return UserBalance(**balance_data)

    async def award_points(
        self, 
        user_id: str, 
        action_type: ActionType, 
        metadata: Dict[str, Any] = None,
        ip_address: str = None,
        user_agent: str = None,
        device_fingerprint: str = None
    ) -> Optional[PointsTransaction]:
        """Attribue des points pour une action"""
        
        if metadata is None:
            metadata = {}
            
        # 1. Vérifier les caps et cooldowns
        if not await self._check_action_limits(user_id, action_type):
            logger.warning(f"Action {action_type} blocked for user {user_id} - limits exceeded")
            return None
        
        # 2. Détection de fraude
        fraud_score = await self._calculate_fraud_score(
            user_id, action_type, ip_address, user_agent, device_fingerprint
        )
        
        if fraud_score > 0.8:  # Score élevé = blocage
            logger.warning(f"Action {action_type} blocked for user {user_id} - fraud risk")
            return None
        
        # 3. Calculer les points (avec multiplicateurs dynamiques)
        base_points = POINTS_CONFIG.get(action_type, 0)
        multiplier = await self._get_points_multiplier(action_type)
        points_amount = int(base_points * multiplier)
        
        if points_amount <= 0:
            return None
        
        # 4. Créer la transaction de points
        transaction = PointsTransaction(
            user_id=user_id,
            action_type=action_type,
            points_amount=points_amount,
            metadata=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
            device_fingerprint=device_fingerprint,
            fraud_score=fraud_score,
            fraud_risk=self._get_risk_level(fraud_score)
        )
        
        # 5. Sauvegarder la transaction
        await self.db.points_transactions.insert_one(transaction.dict())
        
        # 6. Mettre à jour le solde utilisateur
        await self._update_user_balance_points(user_id, points_amount)
        
        # 7. Mettre à jour les caps
        await self._update_action_caps(user_id, action_type)
        
        # 8. Conversion automatique points -> crédits
        await self._auto_convert_points_to_credits(user_id)
        
        logger.info(f"Awarded {points_amount} points to user {user_id} for {action_type}")
        return transaction

    async def _check_action_limits(self, user_id: str, action_type: ActionType) -> bool:
        """Vérifie les limites d'actions"""
        caps_config = ACTION_CAPS.get(action_type)
        if not caps_config:
            return True  # Pas de limite configurée
        
        # Récupérer les caps actuels
        caps_data = await self.db.action_caps.find_one({
            "user_id": user_id, 
            "action_type": action_type
        })
        
        if not caps_data:
            return True  # Premier usage
        
        caps = ActionCap(**caps_data)
        now = datetime.now(timezone.utc)
        
        # Vérifier cooldown spécial
        if action_type in ACTION_COOLDOWNS:
            if caps.cooldown_until:
                cooldown_end = datetime.fromisoformat(caps.cooldown_until.replace('Z', '+00:00'))
                if now < cooldown_end:
                    return False
        
        # Vérifier caps quotidiens/mensuels
        last_action = None
        if caps.last_action_at:
            last_action = datetime.fromisoformat(caps.last_action_at.replace('Z', '+00:00'))
        
        # Reset compteurs si nécessaire
        if last_action:
            if now.date() > last_action.date():
                caps.daily_count = 0
            if now.month != last_action.month or now.year != last_action.year:
                caps.monthly_count = 0
        
        # Vérifier les limites
        if "daily" in caps_config and caps.daily_count >= caps_config["daily"]:
            return False
        if "monthly" in caps_config and caps.monthly_count >= caps_config["monthly"]:
            return False
        
        return True

    async def _calculate_fraud_score(
        self, 
        user_id: str, 
        action_type: ActionType,
        ip_address: str = None,
        user_agent: str = None, 
        device_fingerprint: str = None
    ) -> float:
        """Calcule le score de risque de fraude"""
        score = 0.0
        risk_factors = []
        
        # 1. Analyse des patterns temporels
        recent_actions = await self.db.points_transactions.count_documents({
            "user_id": user_id,
            "created_at": {"$gte": (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()}
        })
        
        if recent_actions > 10:  # Burst d'actions
            score += 0.3
            risk_factors.append("high_frequency_actions")
        
        # 2. Analyse IP/Device
        if ip_address:
            # Vérifier TOR/VPN (simulation)
            if any(x in ip_address for x in ['127.', '10.', '192.168.']):  # IPs locales suspectes
                score += 0.2
                risk_factors.append("suspicious_ip")
        
        # 3. Patterns de multicomptes
        if device_fingerprint:
            similar_devices = await self.db.fraud_detections.count_documents({
                "device_fingerprint": device_fingerprint,
                "user_id": {"$ne": user_id}
            })
            
            if similar_devices > 0:
                score += 0.4
                risk_factors.append("device_sharing")
        
        # 4. Revenus élevés récents
        week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        recent_earnings = await self.db.points_transactions.aggregate([
            {"$match": {"user_id": user_id, "created_at": {"$gte": week_ago}}},
            {"$group": {"_id": None, "total": {"$sum": "$points_amount"}}}
        ]).to_list(1)
        
        if recent_earnings and recent_earnings[0]["total"] > 250:  # > 50€ de crédits potentiels
            score += 0.3
            risk_factors.append("high_weekly_earnings")
        
        # Sauvegarder la détection
        if score > 0.1:  # Seulement si risque détecté
            fraud_detection = FraudDetection(
                user_id=user_id,
                ip_address=ip_address or "unknown",
                device_fingerprint=device_fingerprint or "unknown",
                user_agent=user_agent or "unknown",
                risk_factors=risk_factors,
                risk_score=score,
                risk_level=self._get_risk_level(score)
            )
            
            await self.db.fraud_detections.insert_one(fraud_detection.dict())
        
        return min(score, 1.0)  # Cap à 1.0

    def _get_risk_level(self, score: float) -> FraudRiskLevel:
        """Convertit le score en niveau de risque"""
        if score >= 0.8:
            return FraudRiskLevel.BLOCKED
        elif score >= 0.5:
            return FraudRiskLevel.HIGH
        elif score >= 0.2:
            return FraudRiskLevel.MEDIUM
        else:
            return FraudRiskLevel.LOW

    async def _get_points_multiplier(self, action_type: ActionType) -> float:
        """Récupère le multiplicateur dynamique pour une action"""
        # Récupérer depuis les settings système
        multiplier_key = f"points_multiplier_{action_type}"
        setting = await self.db.system_settings.find_one({"key": multiplier_key})
        
        if setting:
            return float(setting["value"])
        
        # Multiplicateur par défaut
        return 1.0

    async def _update_user_balance_points(self, user_id: str, points_amount: int):
        """Met à jour le solde de points de l'utilisateur"""
        await self.db.user_balances.update_one(
            {"user_id": user_id},
            {
                "$inc": {
                    "points_balance": points_amount,
                    "total_points_earned": points_amount
                },
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            },
            upsert=True
        )

    async def _update_action_caps(self, user_id: str, action_type: ActionType):
        """Met à jour les compteurs d'actions"""
        now = datetime.now(timezone.utc).isoformat()
        cooldown_until = None
        
        # Calculer cooldown si nécessaire
        if action_type in ACTION_COOLDOWNS:
            cooldown_hours = ACTION_COOLDOWNS[action_type]
            cooldown_until = (datetime.now(timezone.utc) + timedelta(hours=cooldown_hours)).isoformat()
        
        await self.db.action_caps.update_one(
            {"user_id": user_id, "action_type": action_type},
            {
                "$inc": {"daily_count": 1, "weekly_count": 1, "monthly_count": 1},
                "$set": {
                    "last_action_at": now,
                    "cooldown_until": cooldown_until,
                    "updated_at": now
                }
            },
            upsert=True
        )

    async def _auto_convert_points_to_credits(self, user_id: str):
        """Conversion automatique points -> crédits"""
        balance = await self.get_user_balance(user_id)
        
        if balance.points_balance >= self.POINTS_TO_CREDITS_RATIO:
            # Calculer combien de crédits on peut créer
            credits_to_create = balance.points_balance // self.POINTS_TO_CREDITS_RATIO
            points_to_consume = credits_to_create * self.POINTS_TO_CREDITS_RATIO
            credits_amount_cents = credits_to_create * self.CREDITS_TO_EUROS_CENTS
            
            # Créer la transaction de conversion
            conversion_transaction = CreditsTransaction(
                user_id=user_id,
                transaction_type=TransactionType.POINTS_TO_CREDITS,
                credits_amount=credits_amount_cents,
                points_amount=points_to_consume,
                expires_at=(datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),  # 12 mois
                metadata={"auto_conversion": True}
            )
            
            await self.db.credits_transactions.insert_one(conversion_transaction.dict())
            
            # Mettre à jour le solde
            await self.db.user_balances.update_one(
                {"user_id": user_id},
                {
                    "$inc": {
                        "points_balance": -points_to_consume,
                        "credits_balance": credits_amount_cents,
                        "total_credits_earned": credits_amount_cents
                    },
                    "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
                }
            )
            
            logger.info(f"Auto-converted {points_to_consume} points to {credits_to_create} credits for user {user_id}")

    async def can_use_credits_for_order(self, user_id: str, order_total_cents: int, credits_to_use_cents: int) -> tuple[bool, str]:
        """Vérifie si l'utilisateur peut utiliser des crédits pour une commande"""
        
        # 1. Vérifier seuil minimum
        if order_total_cents < self.MIN_ORDER_CENTS:
            return False, f"Commande minimum de {self.MIN_ORDER_CENTS/100}€ requise pour utiliser des crédits"
        
        # 2. Vérifier pourcentage maximum
        max_credits_cents = int(order_total_cents * self.MAX_USAGE_PERCENT / 100)
        if credits_to_use_cents > max_credits_cents:
            return False, f"Maximum {self.MAX_USAGE_PERCENT}% de la commande peut être payé en crédits"
        
        # 3. Vérifier solde utilisateur
        balance = await self.get_user_balance(user_id)
        if balance.credits_balance < credits_to_use_cents:
            return False, "Solde de crédits insuffisant"
        
        # 4. Vérifier que les crédits ne sont pas expirés
        valid_credits = await self._get_valid_credits_balance(user_id)
        if valid_credits < credits_to_use_cents:
            return False, "Certains crédits ont expiré"
        
        return True, "OK"

    async def _get_valid_credits_balance(self, user_id: str) -> int:
        """Récupère le solde de crédits non expirés"""
        now = datetime.now(timezone.utc).isoformat()
        
        # Sommer les crédits non expirés
        pipeline = [
            {"$match": {
                "user_id": user_id,
                "transaction_type": {"$in": [TransactionType.POINTS_TO_CREDITS, TransactionType.CREDITS_PURCHASED]},
                "is_valid": True,
                "$or": [
                    {"expires_at": {"$gt": now}},
                    {"expires_at": None}
                ]
            }},
            {"$group": {"_id": None, "total": {"$sum": "$credits_amount"}}}
        ]
        
        result = await self.db.credits_transactions.aggregate(pipeline).to_list(1)
        earned_credits = result[0]["total"] if result else 0
        
        # Soustraire les crédits dépensés
        spent_pipeline = [
            {"$match": {
                "user_id": user_id,
                "transaction_type": TransactionType.CREDITS_SPENT,
                "is_valid": True
            }},
            {"$group": {"_id": None, "total": {"$sum": "$credits_amount"}}}
        ]
        
        spent_result = await self.db.credits_transactions.aggregate(spent_pipeline).to_list(1)
        spent_credits = spent_result[0]["total"] if spent_result else 0
        
        return max(0, earned_credits - spent_credits)

    async def spend_credits(self, user_id: str, credits_amount_cents: int, order_id: str, metadata: Dict[str, Any] = None) -> Optional[CreditsTransaction]:
        """Dépense des crédits"""
        
        if metadata is None:
            metadata = {}
        
        # Vérifier le solde
        valid_balance = await self._get_valid_credits_balance(user_id)
        if valid_balance < credits_amount_cents:
            return None
        
        # Créer la transaction de dépense
        spend_transaction = CreditsTransaction(
            user_id=user_id,
            transaction_type=TransactionType.CREDITS_SPENT,
            credits_amount=credits_amount_cents,
            order_id=order_id,
            metadata=metadata
        )
        
        await self.db.credits_transactions.insert_one(spend_transaction.dict())
        
        # Mettre à jour le solde
        await self.db.user_balances.update_one(
            {"user_id": user_id},
            {
                "$inc": {
                    "credits_balance": -credits_amount_cents,
                    "total_credits_spent": credits_amount_cents
                },
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        logger.info(f"User {user_id} spent {credits_amount_cents} credits for order {order_id}")
        return spend_transaction

    async def purchase_credits(self, user_id: str, credits_amount_cents: int, payment_id: str, metadata: Dict[str, Any] = None) -> CreditsTransaction:
        """Achat de crédits - BONUS LIMITÉS CONFORMITÉ LÉGALE"""
        
        if metadata is None:
            metadata = {}
        
        # Calculer bonus limité (max +10% pour maintenir équilibre économique)
        base_euros = credits_amount_cents / 100
        bonus_percent = 0
        
        if base_euros >= 50:  # Pack Gold
            bonus_percent = 10  # +10% max (était +50% avant)
        elif base_euros >= 10:  # Pack Flash
            bonus_percent = 5   # +5% max (était +20% avant)
        
        bonus_cents = int(credits_amount_cents * bonus_percent / 100)
        total_credits_cents = credits_amount_cents + bonus_cents
        
        # Créer la transaction d'achat
        purchase_transaction = CreditsTransaction(
            user_id=user_id,
            transaction_type=TransactionType.CREDITS_PURCHASED,
            credits_amount=total_credits_cents,
            order_id=payment_id,
            expires_at=(datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),  # 12 mois
            metadata={
                **metadata,
                "base_amount_cents": credits_amount_cents,
                "bonus_cents": bonus_cents,
                "bonus_percent": bonus_percent,
                "legal_compliance": "no_cash_out_no_euro_conversion"
            }
        )
        
        await self.db.credits_transactions.insert_one(purchase_transaction.dict())
        
        # Mettre à jour le solde
        await self.db.user_balances.update_one(
            {"user_id": user_id},
            {
                "$inc": {
                    "credits_balance": total_credits_cents,
                    "total_credits_purchased": total_credits_cents
                },
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            },
            upsert=True
        )
        
        logger.info(f"User {user_id} purchased {total_credits_cents/100}€ credits (base: {base_euros}€, bonus: {bonus_cents/100}€)")
        return purchase_transaction

    async def get_user_transactions(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Récupère l'historique des transactions utilisateur"""
        
        # Points transactions
        points_cursor = self.db.points_transactions.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        points_transactions = await points_cursor.to_list(length=limit)
        
        # Credits transactions
        credits_cursor = self.db.credits_transactions.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        credits_transactions = await credits_cursor.to_list(length=limit)
        
        # Combiner et trier par date
        all_transactions = []
        
        for tx in points_transactions:
            all_transactions.append({
                "type": "points",
                "id": tx["id"],
                "action_type": tx["action_type"],
                "amount": tx["points_amount"],
                "created_at": tx["created_at"],
                "metadata": tx.get("metadata", {})
            })
        
        for tx in credits_transactions:
            all_transactions.append({
                "type": "credits",
                "id": tx["id"],
                "transaction_type": tx["transaction_type"],
                "amount": tx["credits_amount"],
                "created_at": tx["created_at"],
                "expires_at": tx.get("expires_at"),
                "metadata": tx.get("metadata", {})
            })
        
        # Trier par date décroissante
        all_transactions.sort(key=lambda x: x["created_at"], reverse=True)
        
        return all_transactions[:limit]

    # ========== GARDE-FOUS ÉCONOMIQUES ==========
    
    async def check_economic_guardrails(self) -> Dict[str, Any]:
        """Vérifie les garde-fous économiques"""
        now = datetime.now(timezone.utc)
        thirty_days_ago = (now - timedelta(days=30)).isoformat()
        
        # 1. Calculer l'encours total de crédits non utilisés
        total_outstanding = await self._calculate_outstanding_credits()
        
        # 2. Estimer le CA des 30 derniers jours (simulation)
        estimated_revenue_cents = await self._estimate_monthly_revenue()
        
        # 3. Calculer le coût total des crédits distribués
        total_cost = await self._calculate_credits_cost_last_30_days()
        
        # Ratios
        outstanding_percent = (total_outstanding / estimated_revenue_cents * 100) if estimated_revenue_cents > 0 else 0
        cost_percent = (total_cost / estimated_revenue_cents * 100) if estimated_revenue_cents > 0 else 0
        
        # Alertes
        alerts = []
        if outstanding_percent > self.MAX_OUTSTANDING_PERCENT:
            alerts.append(f"Encours crédits trop élevé: {outstanding_percent:.1f}% > {self.MAX_OUTSTANDING_PERCENT}%")
        
        if cost_percent > self.MAX_COST_PERCENT:
            alerts.append(f"Coût crédits trop élevé: {cost_percent:.1f}% > {self.MAX_COST_PERCENT}%")
        
        return {
            "outstanding_credits_cents": total_outstanding,
            "estimated_revenue_cents": estimated_revenue_cents,
            "credits_cost_cents": total_cost,
            "outstanding_percent": outstanding_percent,
            "cost_percent": cost_percent,
            "alerts": alerts,
            "auto_nerf_required": len(alerts) > 0
        }

    async def _calculate_outstanding_credits(self) -> int:
        """Calcule l'encours total de crédits non utilisés"""
        # Tous les crédits gagnés/achetés moins les crédits dépensés
        pipeline = [
            {"$match": {
                "transaction_type": {"$in": [
                    TransactionType.POINTS_TO_CREDITS,
                    TransactionType.CREDITS_PURCHASED,
                    TransactionType.CREDITS_SPENT
                ]},
                "is_valid": True
            }},
            {"$group": {
                "_id": "$transaction_type",
                "total": {"$sum": "$credits_amount"}
            }}
        ]
        
        results = await self.db.credits_transactions.aggregate(pipeline).to_list(3)
        
        earned = 0
        spent = 0
        
        for result in results:
            if result["_id"] in [TransactionType.POINTS_TO_CREDITS, TransactionType.CREDITS_PURCHASED]:
                earned += result["total"]
            elif result["_id"] == TransactionType.CREDITS_SPENT:
                spent += result["total"]
        
        return max(0, earned - spent)

    async def _estimate_monthly_revenue(self) -> int:
        """Estime le CA mensuel (simulation)"""
        # Dans un vrai système, ceci viendrait de la comptabilité
        # Pour la simulation, on estime basé sur l'activité utilisateur
        
        thirty_days_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
        
        # Compter les actions payantes des 30 derniers jours
        active_users = await self.db.points_transactions.distinct(
            "user_id", 
            {"created_at": {"$gte": thirty_days_ago}}
        )
        
        # Estimation: 20€ de revenus moyens par utilisateur actif par mois
        estimated_revenue_cents = len(active_users) * 2000  # 20€ en centimes
        
        return estimated_revenue_cents

    async def _calculate_credits_cost_last_30_days(self) -> int:
        """Calcule le coût des crédits distribués sur 30 jours"""
        thirty_days_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
        
        # Crédits gagnés via points (coût = valeur faciale)
        pipeline = [
            {"$match": {
                "transaction_type": TransactionType.POINTS_TO_CREDITS,
                "created_at": {"$gte": thirty_days_ago},
                "is_valid": True
            }},
            {"$group": {"_id": None, "total": {"$sum": "$credits_amount"}}}
        ]
        
        result = await self.db.credits_transactions.aggregate(pipeline).to_list(1)
        return result[0]["total"] if result else 0

    async def apply_auto_nerf(self, guardrails: Dict[str, Any]):
        """Applique les mesures de protection automatiques"""
        if not guardrails["auto_nerf_required"]:
            return
        
        logger.warning("Applying economic guardrails auto-nerf")
        
        # 1. Réduire tous les multiplicateurs de points de 20%
        current_time = datetime.now(timezone.utc).isoformat()
        
        for action_type in ActionType:
            await self.db.system_settings.update_one(
                {"key": f"points_multiplier_{action_type}"},
                {
                    "$set": {
                        "value": 0.8,  # Réduction de 20%
                        "description": f"Auto-nerf applied due to economic guardrails",
                        "updated_at": current_time
                    }
                },
                upsert=True
            )
        
        # 2. Log l'événement
        logger.warning(f"Auto-nerf applied: {guardrails['alerts']}")
        
        # 3. Notifier les admins (simulation)
        print(f"🚨 ALERTE ÉCONOMIQUE - Auto-nerf appliqué: {guardrails['alerts']}")

# ========== INITIALISATION ==========

async def create_credits_service(db) -> CreditsService:
    """Crée et initialise le service de crédits"""
    service = CreditsService(db)
    await service.initialize_collections()
    return service