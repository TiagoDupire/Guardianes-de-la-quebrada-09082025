from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Game Models
class GameProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    current_level: int = 1
    levels_completed: List[int] = []
    total_score: int = 0
    level_scores: Dict[int, int] = {}
    achievements: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GameProgressCreate(BaseModel):
    player_name: str

class GameProgressUpdate(BaseModel):
    current_level: Optional[int] = None
    levels_completed: Optional[List[int]] = None
    total_score: Optional[int] = None
    level_scores: Optional[Dict[int, int]] = None
    achievements: Optional[List[str]] = None

class LevelCompletion(BaseModel):
    player_id: str
    level_number: int
    score: int
    completion_time: Optional[int] = None
    
# Basic routes
@api_router.get("/")
async def root():
    return {"message": "Guardianes de las Plantas del Perú - API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Game Progress Routes
@api_router.post("/game/progress", response_model=GameProgress)
async def create_game_progress(input: GameProgressCreate):
    # Check if player already exists
    existing = await db.game_progress.find_one({"player_name": input.player_name})
    if existing:
        return GameProgress(**existing)
    
    progress = GameProgress(**input.dict())
    await db.game_progress.insert_one(progress.dict())
    return progress

@api_router.get("/game/progress/{player_name}", response_model=GameProgress)
async def get_game_progress(player_name: str):
    progress = await db.game_progress.find_one({"player_name": player_name})
    if not progress:
        raise HTTPException(status_code=404, detail="Player progress not found")
    return GameProgress(**progress)

@api_router.put("/game/progress/{player_id}")
async def update_game_progress(player_id: str, update: GameProgressUpdate):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.game_progress.update_one(
        {"id": player_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return {"message": "Progress updated successfully"}

@api_router.post("/game/complete-level")
async def complete_level(completion: LevelCompletion):
    # Get current progress
    progress = await db.game_progress.find_one({"id": completion.player_id})
    if not progress:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Update progress
    levels_completed = progress.get("levels_completed", [])
    if completion.level_number not in levels_completed:
        levels_completed.append(completion.level_number)
    
    level_scores = progress.get("level_scores", {})
    level_scores[str(completion.level_number)] = max(
        level_scores.get(str(completion.level_number), 0), 
        completion.score
    )
    
    total_score = sum(level_scores.values())
    current_level = max(progress.get("current_level", 1), completion.level_number + 1)
    
    # Check for achievements
    achievements = progress.get("achievements", [])
    if completion.level_number == 1 and "first_level" not in achievements:
        achievements.append("first_level")
    if len(levels_completed) == 5 and "game_master" not in achievements:
        achievements.append("game_master")
    if completion.score >= 100 and "high_scorer" not in achievements:
        achievements.append("high_scorer")
    
    update_data = {
        "current_level": current_level,
        "levels_completed": levels_completed,
        "total_score": total_score,
        "level_scores": level_scores,
        "achievements": achievements,
        "updated_at": datetime.utcnow()
    }
    
    await db.game_progress.update_one(
        {"id": completion.player_id},
        {"$set": update_data}
    )
    
    return {"message": "Level completed successfully", "new_total_score": total_score}

@api_router.get("/game/leaderboard")
async def get_leaderboard():
    leaderboard = await db.game_progress.find(
        {},
        {"player_name": 1, "total_score": 1, "levels_completed": 1}
    ).sort("total_score", -1).limit(10).to_list(10)
    
    return leaderboard

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
