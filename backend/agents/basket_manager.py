"""
Basket Manager Agent
--------------------
Lightweight stateful agent that handles CRUD on the user's basket.
No LLM calls here — pure deterministic logic.
"""

from ..models.session import Session
from ..models.basket import Basket, BasketItem
from ..models.product import ProductScore


class BasketManagerAgent:
    def add_items(self, session: Session, scored_items: list[ProductScore]) -> list[BasketItem]:
        """Add evaluated products to the basket. Returns the list of added items."""
        if session.basket is None:
            session.basket = Basket(
                session_id=session.id,
                user_id=session.id,
                preferred_store=session.user_profile.preferred_store
                if session.user_profile else None,
            )

        added: list[BasketItem] = []
        for scored in scored_items:
            # Check for duplicates (same product already in basket)
            existing = next(
                (item for item in session.basket.items
                 if item.product.id == scored.product.id),
                None,
            )
            if existing:
                existing.quantity += 1
            else:
                item = BasketItem(
                    product=scored.product,
                    quantity=1,
                    score_price=scored.score_price,
                    score_nutrition=scored.score_nutrition,
                    score_quality=scored.score_quality,
                    score_taste=scored.score_taste,
                    total_score=scored.total_score,
                    reasoning=scored.reasoning,
                )
                session.basket.items.append(item)
                added.append(item)

        return added

    def remove_item(self, session: Session, product_id: str) -> bool:
        """Remove a product from the basket. Returns True if found and removed."""
        if not session.basket:
            return False
        before = len(session.basket.items)
        session.basket.items = [
            item for item in session.basket.items if item.product.id != product_id
        ]
        return len(session.basket.items) < before

    def update_quantity(self, session: Session, product_id: str, quantity: int) -> bool:
        """Update the quantity of a basket item."""
        if not session.basket:
            return False
        for item in session.basket.items:
            if item.product.id == product_id:
                if quantity <= 0:
                    return self.remove_item(session, product_id)
                item.quantity = quantity
                return True
        return False

    def clear(self, session: Session) -> None:
        if session.basket:
            session.basket.items = []
