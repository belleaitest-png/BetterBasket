from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from .product import Product


class BasketItem(BaseModel):
    product: Product
    quantity: int = 1
    score_price: float
    score_nutrition: float
    score_quality: float
    score_taste: float
    total_score: float
    reasoning: str


class Basket(BaseModel):
    session_id: str
    user_id: str
    items: list[BasketItem] = []
    preferred_store: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def total_estimate(self) -> float:
        return sum(item.product.price * item.quantity for item in self.items)

    @property
    def item_count(self) -> int:
        return sum(item.quantity for item in self.items)
