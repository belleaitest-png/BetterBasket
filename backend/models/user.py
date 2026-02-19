from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TastePreferences(BaseModel):
    likes: list[str] = []
    dislikes: list[str] = []


class UserProfile(BaseModel):
    id: str
    name: Optional[str] = None
    dietary_restrictions: list[str] = []   # e.g. ["vegan", "gluten-free"]
    budget_weekly: Optional[float] = None  # £/$ per week
    family_size: int = 1
    health_goals: list[str] = []           # e.g. ["high protein", "low sugar"]
    taste_preferences: TastePreferences = TastePreferences()
    disliked_ingredients: list[str] = []
    preferred_brands: list[str] = []
    preferred_store: Optional[str] = None
    onboarding_complete: bool = False
    created_at: datetime = datetime.utcnow()


class CriteriaWeights(BaseModel):
    """Derived from the user's profile; drives product scoring."""
    price: float = 0.25
    nutrition: float = 0.25
    quality: float = 0.25
    taste: float = 0.25

    @classmethod
    def from_profile(cls, profile: UserProfile) -> "CriteriaWeights":
        price_w = 0.25
        nutrition_w = 0.25
        quality_w = 0.25
        taste_w = 0.25

        if profile.budget_weekly and profile.budget_weekly < 50:
            price_w = 0.40
            nutrition_w = 0.20
            quality_w = 0.20
            taste_w = 0.20

        if any(g in ["high protein", "low sugar", "low sodium", "weight loss"]
               for g in profile.health_goals):
            nutrition_w = 0.40
            price_w = 0.20
            quality_w = 0.20
            taste_w = 0.20

        total = price_w + nutrition_w + quality_w + taste_w
        return cls(
            price=price_w / total,
            nutrition=nutrition_w / total,
            quality=quality_w / total,
            taste=taste_w / total,
        )
