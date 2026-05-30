import os
import asyncio
import uuid
import re
import httpx
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional, List
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from bs4 import BeautifulSoup

load_dotenv()

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "legacy_vault")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "A@070610")

client: Optional[AsyncIOMotorClient] = None
db = None

def get_db():
    return db

# ============ CONFIGURATION ============
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "")
MONITOR_INTERVAL = int(os.getenv("MONITOR_INTERVAL", "60"))

# ============ PYDANTIC MODELS ============
class GameCreate(BaseModel):
    title: str
    year: str
    cover_image: str = ""
    hook_text: str = ""
    cover_athletes: str = ""
    description: str = ""
    youtube_embed: str = ""
    order: int = 0
    is_active: bool = True

class GameUpdate(BaseModel):
    title: Optional[str] = None
    year: Optional[str] = None
    cover_image: Optional[str] = None
    hook_text: Optional[str] = None
    cover_athletes: Optional[str] = None
    description: Optional[str] = None
    youtube_embed: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class ClipCreate(BaseModel):
    game_id: str
    platform: str
    title: str
    embed_url: str
    description: str = ""

class ProofCreate(BaseModel):
    image_url: str
    description: str = ""
    source: str = ""
    order: int = 0

class MockupCreate(BaseModel):
    image_url: str
    video_url: Optional[str] = None
    is_video: bool = False
    title: str = ""

class CommunityPostCreate(BaseModel):
    author: str
    platform: str
    content: str
    avatar_url: str = ""

class SocialFeedCreate(BaseModel):
    platform: str
    content: str
    author: str = ""
    timestamp: Optional[str] = None

class SubmissionCreate(BaseModel):
    name: str
    platform: str
    profile_url: str
    content_url: str
    follower_count: Optional[int] = None
    description: str = ""

class SignatureCreate(BaseModel):
    name: str

class SubscriberCreate(BaseModel):
    email: str

class CommentCreate(BaseModel):
    text: str
    author: str
    game_id: Optional[str] = None

class ReplyCreate(BaseModel):
    text: str
    author: str
    comment_id: str

class ContentUpdate(BaseModel):
    key: str
    value: str

class VoteCreate(BaseModel):
    game_id: str

class SecretCreate(BaseModel):
    key: str
    value: str

# ============ LIFESPAN ============
@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
    
    # Seed default games if empty
    games_count = await db.games.count_documents({})
    if games_count == 0:
        default_games = [
            {"id": str(uuid.uuid4()), "title": "NBA 2K15", "year": "2014", "cover_image": "", "hook_text": "Where the modern 2K era truly began", "cover_athletes": "", "description": "", "youtube_embed": "", "order": 1, "is_active": True},
            {"id": str(uuid.uuid4()), "title": "NBA 2K16", "year": "2015", "cover_image": "", "hook_text": "The one OGs still call the GOAT", "cover_athletes": "", "description": "", "youtube_embed": "", "order": 2, "is_active": True},
            {"id": str(uuid.uuid4()), "title": "NBA 2K17", "year": "2016", "cover_image": "", "hook_text": "Pure basketball soul", "cover_athletes": "", "description": "", "youtube_embed": "", "order": 3, "is_active": True},
            {"id": str(uuid.uuid4()), "title": "NBA 2K20", "year": "2019", "cover_image": "", "hook_text": "The final masterpiece", "cover_athletes": "", "description": "", "youtube_embed": "", "order": 4, "is_active": True},
        ]
        await db.games.insert_many(default_games)
    
    yield
    
    client.close()

# ============ APP ============
app = FastAPI(title="Legacy Vault API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ HELPER FUNCTIONS ============
def generate_id():
    return str(uuid.uuid4())

def serialize_doc(doc):
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"]) if "_id" in doc else None
    return doc

# ============ PUBLIC ROUTES ============

@app.get("/api/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

@app.get("/api/games")
async def get_games():
    games = await db.games.find().sort("order", 1).to_list(100)
    return [{"id": g["id"], "title": g["title"], "year": g["year"], "cover_image": g.get("cover_image", ""), "hook_text": g.get("hook_text", ""), "cover_athletes": g.get("cover_athletes", ""), "description": g.get("description", ""), "youtube_embed": g.get("youtube_embed", ""), "order": g.get("order", 0)} for g in games]

@app.get("/api/games/{game_id}")
async def get_game(game_id: str):
    game = await db.games.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, message="Game not found")
    return game

@app.post("/api/games", response_model=dict)
async def create_game(game: GameCreate):
    doc = game.model_dump()
    doc["id"] = generate_id()
    await db.games.insert_one(doc)
    return {"id": doc["id"], "message": "Game created"}

@app.put("/api/games/{game_id}")
async def update_game(game_id: str, game: GameUpdate):
    update_data = {k: v for k, v in game.model_dump().items() if v is not None}
    result = await db.games.update_one({"id": game_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, message="Game not found")
    return {"message": "Game updated"}

@app.delete("/api/games/{game_id}")
async def delete_game(game_id: str):
    result = await db.games.delete_one({"id": game_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Game not found")
    return {"message": "Game deleted"}

@app.get("/api/clips")
async def get_clips(game_id: Optional[str] = None):
    query = {} if not game_id else {"game_id": game_id}
    clips = await db.clips.find(query).to_list(100)
    return [{"id": c["id"], "game_id": c["game_id"], "platform": c["platform"], "title": c["title"], "embed_url": c["embed_url"], "description": c.get("description", "")} for c in clips]

@app.post("/api/clips", response_model=dict)
async def create_clip(clip: ClipCreate):
    doc = clip.model_dump()
    doc["id"] = generate_id()
    await db.clips.insert_one(doc)
    return {"id": doc["id"], "message": "Clip created"}

@app.put("/api/clips/{clip_id}")
async def update_clip(clip_id: str, clip: ClipCreate):
    update_data = clip.model_dump()
    result = await db.clips.update_one({"id": clip_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, message="Clip not found")
    return {"message": "Clip updated"}

@app.delete("/api/clips/{clip_id}")
async def delete_clip(clip_id: str):
    result = await db.clips.delete_one({"id": clip_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Clip not found")
    return {"message": "Clip deleted"}

@app.get("/api/proofs")
async def get_proofs():
    proofs = await db.proofs.find().sort("order", 1).to_list(100)
    return [{"id": p["id"], "image_url": p["image_url"], "description": p.get("description", ""), "source": p.get("source", ""), "order": p.get("order", 0)} for p in proofs]

@app.post("/api/proofs", response_model=dict)
async def create_proof(proof: ProofCreate):
    doc = proof.model_dump()
    doc["id"] = generate_id()
    await db.proofs.insert_one(doc)
    return {"id": doc["id"], "message": "Proof created"}

@app.delete("/api/proofs/{proof_id}")
async def delete_proof(proof_id: str):
    result = await db.proofs.delete_one({"id": proof_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Proof not found")
    return {"message": "Proof deleted"}

@app.get("/api/mockups")
async def get_mockups():
    mockups = await db.mockups.find().to_list(100)
    return [{"id": m["id"], "image_url": m.get("image_url", ""), "video_url": m.get("video_url"), "is_video": m.get("is_video", False), "title": m.get("title", "")} for m in mockups]

@app.post("/api/mockups", response_model=dict)
async def create_mockup(mockup: MockupCreate):
    doc = mockup.model_dump()
    doc["id"] = generate_id()
    await db.mockups.insert_one(doc)
    return {"id": doc["id"], "message": "Mockup created"}

@app.delete("/api/mockups/{mockup_id}")
async def delete_mockup(mockup_id: str):
    result = await db.mockups.delete_one({"id": mockup_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Mockup not found")
    return {"message": "Mockup deleted"}

@app.get("/api/community-wall")
async def get_community_posts():
    posts = await db.community_posts.find().to_list(100)
    return [{"id": p["id"], "author": p["author"], "platform": p["platform"], "content": p["content"], "avatar_url": p.get("avatar_url", "")} for p in posts]

@app.post("/api/community-wall", response_model=dict)
async def create_community_post(post: CommunityPostCreate):
    doc = post.model_dump()
    doc["id"] = generate_id()
    await db.community_posts.insert_one(doc)
    return {"id": doc["id"], "message": "Post created"}

@app.delete("/api/community-wall/{post_id}")
async def delete_community_post(post_id: str):
    result = await db.community_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Post not found")
    return {"message": "Post deleted"}

@app.get("/api/live-feed")
async def get_social_feed():
    items = await db.social_feed.find().to_list(100)
    return [{"id": i["id"], "platform": i["platform"], "content": i["content"], "author": i.get("author", ""), "timestamp": i.get("timestamp", "")} for i in items]

@app.post("/api/live-feed", response_model=dict)
async def create_social_feed_item(item: SocialFeedCreate):
    doc = item.model_dump()
    doc["id"] = generate_id()
    doc["timestamp"] = doc.get("timestamp") or datetime.utcnow().isoformat()
    await db.social_feed.insert_one(doc)
    return {"id": doc["id"], "message": "Item created"}

@app.delete("/api/live-feed/{item_id}")
async def delete_social_feed_item(item_id: str):
    result = await db.social_feed.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Item not found")
    return {"message": "Item deleted"}

@app.get("/api/submissions")
async def get_submissions():
    submissions = await db.creator_submissions.find().to_list(100)
    return [{"id": s["id"], "name": s["name"], "platform": s["platform"], "profile_url": s["profile_url"], "content_url": s["content_url"], "follower_count": s.get("follower_count"), "description": s.get("description", ""), "status": s.get("status", "pending")} for s in submissions]

@app.post("/api/submissions", response_model=dict)
async def create_submission(submission: SubmissionCreate):
    doc = submission.model_dump()
    doc["id"] = generate_id()
    doc["status"] = "pending"
    await db.creator_submissions.insert_one(doc)
    return {"id": doc["id"], "message": "Submission created"}

@app.put("/api/submissions/{submission_id}/approve")
async def approve_submission(submission_id: str):
    result = await db.creator_submissions.update_one({"id": submission_id}, {"$set": {"status": "approved"}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, message="Submission not found")
    return {"message": "Submission approved"}

@app.put("/api/submissions/{submission_id}/reject")
async def reject_submission(submission_id: str):
    result = await db.creator_submissions.update_one({"id": submission_id}, {"$set": {"status": "rejected"}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, message="Submission not found")
    return {"message": "Submission rejected"}

@app.get("/api/content")
async def get_site_content():
    content = await db.site_content.find_one({"type": "config"}) or {}
    return content

@app.put("/api/content/{key}")
async def update_content(key: str, update: ContentUpdate):
    result = await db.site_content.update_one(
        {"type": "config"},
        {"$set": {key: update.value}},
        upsert=True
    )
    return {"message": "Content updated"}

@app.get("/api/comments")
async def get_comments(game_id: Optional[str] = None):
    query = {} if not game_id else {"game_id": game_id}
    comments = await db.comments.find(query).to_list(100)
    return [{"id": c["id"], "text": c["text"], "author": c["author"], "game_id": c.get("game_id"), "likes": c.get("likes", 0), "timestamp": c.get("timestamp", ""), "replies": c.get("replies", [])} for c in comments]

@app.post("/api/comments", response_model=dict)
async def create_comment(comment: CommentCreate):
    doc = comment.model_dump()
    doc["id"] = generate_id()
    doc["likes"] = 0
    doc["timestamp"] = datetime.utcnow().isoformat()
    doc["replies"] = []
    await db.comments.insert_one(doc)
    return {"id": doc["id"], "message": "Comment created"}

@app.put("/api/comments/{comment_id}/like")
async def like_comment(comment_id: str):
    result = await db.comments.update_one({"id": comment_id}, {"$inc": {"likes": 1}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, message="Comment not found")
    return {"message": "Comment liked"}

@app.post("/api/comments/{comment_id}/reply")
async def reply_to_comment(comment_id: str, reply: ReplyCreate):
    reply_doc = {
        "id": generate_id(),
        "text": reply.text,
        "author": reply.author,
        "timestamp": datetime.utcnow().isoformat()
    }
    result = await db.comments.update_one({"id": comment_id}, {"$push": {"replies": reply_doc}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, message="Comment not found")
    return {"message": "Reply added"}

@app.delete("/api/comments/{comment_id}")
async def delete_comment(comment_id: str):
    result = await db.comments.delete_one({"id": comment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Comment not found")
    return {"message": "Comment deleted"}

@app.get("/api/subscribers")
async def get_subscribers():
    subscribers = await db.subscribers.find().to_list(100)
    return [{"id": s["id"], "email": s["email"], "timestamp": s.get("timestamp", "")} for s in subscribers]

@app.post("/api/subscribers", response_model=dict)
async def subscribe(subscriber: SubscriberCreate):
    existing = await db.subscribers.find_one({"email": subscriber.email})
    if existing:
        return {"message": "Already subscribed", "id": existing["id"]}
    doc = {"id": generate_id(), "email": subscriber.email, "timestamp": datetime.utcnow().isoformat()}
    await db.subscribers.insert_one(doc)
    return {"id": doc["id"], "message": "Subscribed successfully"}

@app.delete("/api/subscribers/{subscriber_id}")
async def unsubscribe(subscriber_id: str):
    result = await db.subscribers.delete_one({"id": subscriber_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, message="Subscriber not found")
    return {"message": "Unsubscribed"}

@app.get("/api/petition")
async def get_petition():
    signatures = await db.petition_signatures.find().to_list(100)
    count = len(signatures)
    return {"count": count, "signatures": [{"id": s["id"], "name": s["name"], "timestamp": s.get("timestamp", "")} for s in signatures[-50:]]}

@app.post("/api/petition/sign")
async def sign_petition(signature: SignatureCreate):
    doc = {"id": generate_id(), "name": signature.name, "timestamp": datetime.utcnow().isoformat()}
    await db.petition_signatures.insert_one(doc)
    count = await db.petition_signatures.count_documents({})
    return {"message": "Signature added", "count": count}

@app.post("/api/petition/bulk-add")
async def bulk_add_signatures(names: List[str]):
    docs = [{"id": generate_id(), "name": name, "timestamp": datetime.utcnow().isoformat()} for name in names]
    await db.petition_signatures.insert_many(docs)
    count = await db.petition_signatures.count_documents({})
    return {"message": f"Added {len(names)} signatures", "count": count}

@app.get("/api/votes")
async def get_votes():
    pipeline = [
        {"$group": {"_id": "$game_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    votes = await db.era_votes.aggregate(pipeline).to_list(100)
    return [{"game_id": v["_id"], "count": v["count"]} for v in votes]

@app.post("/api/votes")
async def cast_vote(vote: VoteCreate):
    valid_games = ["game-1", "game-2", "game-3", "game-4"]  # Will be validated against actual game IDs
    game = await db.games.find_one({"id": vote.game_id})
    if not game:
        raise HTTPException(status_code=400, message="Invalid game ID")
    
    doc = {"id": generate_id(), "game_id": vote.game_id, "timestamp": datetime.utcnow().isoformat()}
    await db.era_votes.insert_one(doc)
    
    total = await db.era_votes.count_documents({})
    game_votes = await db.era_votes.count_documents({"game_id": vote.game_id})
    
    return {"message": "Vote cast", "game_votes": game_votes, "total_votes": total}

# ============ ADMIN ROUTES ============

@app.post("/api/admin/login")
async def admin_login(request: Request):
    body = await request.json()
    password = body.get("password", "")
    if password == ADMIN_PASSWORD:
        return {"success": True, "token": "admin-session"}
    return {"success": False, "message": "Invalid password"}

# ============ AI ROUTES (Vault AI Chat) ============

async def fetch_url_content(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            soup = BeautifulSoup(response.text, "html.parser")
            return soup.get_text()[:5000]
    except Exception as e:
        return f"Error fetching URL: {str(e)}"

def detect_media_links(text: str) -> List[str]:
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, text)
    media_domains = ['youtube.com', 'youtu.be', 'tiktok.com', 'twitter.com', 'x.com', 'twitch.tv']
    return [u for u in urls if any(domain in u.lower() for domain in media_domains)]

@app.post("/api/chat")
async def vault_chat(request: Request):
    body = await request.json()
    session_id = body.get("session_id", generate_id())
    message = body.get("message", "")
    
    media_urls = detect_media_links(message)
    
    if media_urls:
        # Use Claude for media analysis
        context = ""
        for url in media_urls:
            content = await fetch_url_content(url)
            context += f"\n\nURL: {url}\nContent:\n{content}"
        
        response_text = f"I've analyzed the links you shared. This content relates to the NBA 2K Legacy Vault campaign to preserve classic NBA 2K games. Here's what I found:\n\n{context[:2000]}"
    else:
        response_text = f"As the Vault AI, I'm here to help you learn about the Legacy Vault campaign to preserve NBA 2K15, 2K16, 2K17, and 2K20. These games had amazing features like MyCareer, MyPark, and online connected leagues that meant so much to players. The Legacy Vault is a movement to bring these games back. How can I help you today?"
    
    # Store in chat history
    chat_entry = {
        "id": generate_id(),
        "session_id": session_id,
        "message": message,
        "response": response_text,
        "model": "vault-ai",
        "timestamp": datetime.utcnow().isoformat()
    }
    await db.vault_chat_history.insert_one(chat_entry)
    
    return {"response": response_text, "session_id": session_id}

# ============ EXPORT ROUTE ============

@app.get("/api/admin/export/emails/csv")
async def export_emails_csv():
    subscribers = await db.subscribers.find().to_list(1000)
    csv_content = "Email,Date\n"
    for s in subscribers:
        csv_content += f"{s['email']},{s.get('timestamp', '')}\n"
    
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=subscribers.csv"}
    )

# ============ VAULT GUIDE (Stateless Q&A) ============

@app.get("/api/vault-guide")
async def vault_guide(query: str = Query(...)):
    guides = {
        "games": "The games collection stores NBA 2K era data with fields: id, title, year, cover_image, hook_text, cover_athletes, description, youtube_embed, order, is_active. API: GET /api/games, POST /api/games, PUT /api/games/{id}, DELETE /api/games/{id}",
        "clips": "The clips collection stores video embeds with fields: id, game_id, platform, title, embed_url, description. API: GET /api/clips, POST /api/clips, PUT /api/clips/{id}, DELETE /api/clips/{id}",
        "admin": "Admin panel requires password 'A@070610' via POST /api/admin/login. Session stored client-side.",
        "content": "The site_content collection stores editable text as key-value pairs. Hero headline, subheadline, tagline, vault section content, features, and Google Doc link are all editable via the Content tab in admin.",
        "petition": "Petition signatures stored in petition_signatures collection. API: GET /api/petition, POST /api/petition/sign, POST /api/petition/bulk-add",
        "voting": "Era voting stored in era_votes collection. API: GET /api/votes, POST /api/votes"
    }
    
    query_lower = query.lower()
    for key, value in guides.items():
        if key in query_lower:
            return {"answer": value}
    
    return {"answer": "I don't have specific information about that. Try asking about: games, clips, admin, content, petition, or voting."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)