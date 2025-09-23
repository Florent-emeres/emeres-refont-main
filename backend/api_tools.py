"""
API Routes pour le système d'outils ÉMÉRÉS
Endpoints pour Coach IA, Focus Rooms, Cartes Mémoires, etc.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime
import jwt
import os
from motor.motor_asyncio import AsyncIOMotorDatabase
from tools_system import EmereToolsManager, CoachIAEtudes, convert_objectid_to_str

# Configuration JWT
JWT_SECRET = os.environ.get('SECRET_KEY', 'emeres-secret-key-change-in-production')
security = HTTPBearer()

# ============================================================================
# MODÈLES API
# ============================================================================

class ChatMessageRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class CreateSessionRequest(BaseModel):
    tool_type: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    message_id: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: Optional[str] = None
    error: Optional[str] = None

# ============================================================================
# CONFIGURATION ROUTER
# ============================================================================

def create_tools_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api/tools", tags=["tools"])
    
    # Initialiser les gestionnaires d'outils
    tools_manager = EmereToolsManager(db)
    coach_ia = CoachIAEtudes(tools_manager)

    # ============================================================================
    # HELPERS D'AUTHENTIFICATION
    # ============================================================================

    async def get_current_user(token: str = Depends(security)):
        try:
            if not token.credentials:
                raise HTTPException(status_code=401, detail="Token manquant")
            
            payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")  # Use "sub" like main server
            
            if not user_id:
                raise HTTPException(status_code=401, detail="Token invalide")
                
            # Vérifier que l'utilisateur existe (use "id" field like main server)
            user = await db.users.find_one({"id": user_id})
            if not user:
                raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
                
            return user
            
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Token invalide")

    # ============================================================================
    # ROUTES GÉNÉRALES DES OUTILS
    # ============================================================================

    @router.get("/available")
    async def get_available_tools(current_user: dict = Depends(get_current_user)):
        """Récupérer la liste des outils disponibles pour l'utilisateur"""
        tools_list = []
        
        for tool_id, tool_config in tools_manager.available_tools.items():
            access_check = await tools_manager.check_tool_access(
                current_user["id"], 
                tool_id
            )
            
            tools_list.append({
                "tool_id": tool_id,
                "name": tool_config["name"],
                "description": tool_config["description"],
                "has_access": access_check["has_access"],
                "premium_required": tool_config.get("premium_required", False),
                "pack_required": tool_config.get("pack_required", [])
            })
        
        return {"tools": tools_list}

    @router.post("/session")
    async def create_tool_session(
        request: CreateSessionRequest,
        current_user: dict = Depends(get_current_user)
    ):
        """Créer une nouvelle session d'outil"""
        # Vérifier l'accès à l'outil
        access_check = await tools_manager.check_tool_access(
            current_user["id"], 
            request.tool_type
        )
        
        if not access_check["has_access"]:
            raise HTTPException(
                status_code=403, 
                detail=f"Accès refusé: {access_check.get('reason', 'Non autorisé')}"
            )

        session_id = await tools_manager.create_tool_session(
            user_id=current_user["id"],
            tool_type=request.tool_type,
            metadata=request.context
        )
        
        return {
            "success": True,
            "session_id": session_id,
            "tool_type": request.tool_type
        }

    @router.get("/sessions")
    async def get_user_sessions(
        tool_type: Optional[str] = None,
        current_user: dict = Depends(get_current_user)
    ):
        """Récupérer les sessions de l'utilisateur"""
        sessions = await tools_manager.get_user_sessions(
            current_user["id"], 
            tool_type
        )
        
        return {"sessions": sessions}

    # ============================================================================
    # ROUTES COACH IA ÉTUDES
    # ============================================================================

    @router.post("/coach-ia/session")
    async def create_coach_ia_session(
        context: Optional[Dict[str, Any]] = None,
        current_user: dict = Depends(get_current_user)
    ):
        """Créer une session de coaching IA"""
        # Vérifier l'accès
        access_check = await tools_manager.check_tool_access(
            current_user["id"], 
            "coach_ia"
        )
        
        if not access_check["has_access"]:
            raise HTTPException(status_code=403, detail="Accès Premium requis")

        session_id = await coach_ia.create_chat_session(
            user_id=current_user["id"],
            context=context or {}
        )
        
        return {
            "success": True,
            "session_id": session_id,
            "tool_type": "coach_ia"
        }

    @router.post("/coach-ia/chat/{session_id}")
    async def send_coach_message(
        session_id: str,
        request: ChatMessageRequest,
        current_user: dict = Depends(get_current_user)
    ) -> ChatResponse:
        """Envoyer un message au Coach IA"""
        result = await coach_ia.send_message(
            session_id=session_id,
            user_id=current_user["id"],
            message=request.message
        )
        
        return ChatResponse(**result)

    @router.get("/coach-ia/history/{session_id}")
    async def get_coach_history(
        session_id: str,
        current_user: dict = Depends(get_current_user)
    ):
        """Récupérer l'historique de conversation avec le Coach IA"""
        history = await coach_ia.get_chat_history(
            session_id=session_id,
            user_id=current_user["id"]
        )
        
        return {"history": history}

    @router.get("/coach-ia/sessions")
    async def get_coach_sessions(current_user: dict = Depends(get_current_user)):
        """Récupérer toutes les sessions de coaching de l'utilisateur"""
        sessions = await coach_ia.get_user_coach_sessions(current_user["id"])
        
        return {"sessions": sessions}

    # ============================================================================
    # ROUTES STATISTIQUES ET MONITORING
    # ============================================================================

    @router.get("/stats")
    async def get_user_tools_stats(current_user: dict = Depends(get_current_user)):
        """Récupérer les statistiques d'utilisation des outils"""
        stats = await db.tool_usage_stats.find(
            {"user_id": current_user["id"]}
        ).to_list(length=20)
        
        return {"stats": [convert_objectid_to_str(stat) for stat in stats]}

    @router.get("/health")
    async def tools_health_check():
        """Vérification de l'état des outils"""
        return {
            "status": "healthy",
            "tools_available": len(tools_manager.available_tools),
            "timestamp": datetime.now().isoformat()
        }

    return router