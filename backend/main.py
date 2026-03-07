"""
BetterBasket API — FastAPI entry point.

Run with:  uvicorn backend.main:app --reload
"""

from dotenv import load_dotenv
load_dotenv()  # loads .env from the project root before anything else

import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)

if not os.getenv("ANTHROPIC_API_KEY"):
    print("ERROR: ANTHROPIC_API_KEY is not set. Add it to your .env file.", file=sys.stderr)
    sys.exit(1)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.chat import router as chat_router
from .api.basket import router as basket_router
from .api.list import router as list_router

app = FastAPI(
    title="BetterBasket API",
    description="Agentic grocery shopping powered by Claude",
    version="0.1.0",
)

# CORS: accept comma-separated origins from env, default to localhost for dev
_cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
cors_origins = [o.strip() for o in _cors_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(basket_router, prefix="/api")
app.include_router(list_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "BetterBasket API"}
