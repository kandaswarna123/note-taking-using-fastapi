from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from models.user_model import User
from config.database import db
import bcrypt

auth_router = APIRouter()

security = HTTPBasic()

# Helper functions
async def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    user = await db.users.find_one({"username": credentials.username})
    if user and bcrypt.checkpw(credentials.password.encode(), user["password"]):
        return user
    raise HTTPException(status_code=401, detail="Invalid credentials")

@auth_router.post("/signup")
async def signup(user: User):
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    new_user = {"username": user.username, "password": hashed_password}
    result = await db.users.insert_one(new_user)
    return {"message": "User created successfully"}

@auth_router.post("/login")
async def login(user: HTTPBasicCredentials = Depends(security)):
    current_user = await get_current_user(user)
    return {"message": "Login successful"}
