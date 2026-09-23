import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
import app.models # Registers all tables with Base
from app.routes import auth, donors, requests

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bloodlink Management System API", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(donors.router, prefix="/api")
app.include_router(requests.router, prefix="/api")

@app.get("/")
def root():
    return {"service": "Bloodlink Management API", "status": "online"}