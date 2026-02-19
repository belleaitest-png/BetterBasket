"""
BetterBasket API — FastAPI entry point.

Run with:  uvicorn backend.main:app --reload
"""

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
