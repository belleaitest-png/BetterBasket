from pydantic import BaseModel
from typing import Optional


class NutritionFacts(BaseModel):
    calories: Optional[float] = None       # kcal per 100g
    protein: Optional[float] = None        # g per 100g
    carbohydrates: Optional[float] = None
    of_which_sugars: Optional[float] = None
    fat: Optional[float] = None
    of_which_saturates: Optional[float] = None
    fibre: Optional[float] = None
    sodium: Optional[float] = None


class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: str                          # e.g. "dairy", "produce"
    subcategory: str                       # e.g. "yogurt", "apples"
    size: str                              # e.g. "500g", "1L", "6 pack"
    price: float
    price_per_100g: Optional[float] = None
    nutrition: NutritionFacts = NutritionFacts()
    ingredients: list[str] = []
    tags: list[str] = []                   # ["organic", "low-sugar", "vegan"]
    store_availability: list[str] = []     # ["Whole Foods", "Tesco"]
    aisle: Optional[str] = None
    image_url: Optional[str] = None


class ProductScore(BaseModel):
    product: Product
    score_price: float       # 0–100
    score_nutrition: float   # 0–100
    score_quality: float     # 0–100
    score_taste: float       # 0–100
    total_score: float       # weighted sum
    reasoning: str
