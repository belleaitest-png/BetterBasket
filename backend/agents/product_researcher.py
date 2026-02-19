"""
Product Researcher Agent
------------------------
Given a user request ("I need yogurt"), finds 3-5 candidate products from the
product catalogue that match the user's dietary restrictions.

In Phase 1, searches a seeded JSON catalogue.
In Phase 2, this becomes an Open Food Facts / retailer API call.
"""

import json
import os
from pathlib import Path
from ..models.session import Session
from ..models.product import Product

CATALOGUE_PATH = Path(__file__).parent.parent / "data" / "products.json"


class ProductResearcherAgent:
    def __init__(self):
        self._catalogue: list[Product] = []
        self._load_catalogue()

    def _load_catalogue(self):
        if CATALOGUE_PATH.exists():
            with open(CATALOGUE_PATH) as f:
                raw = json.load(f)
            self._catalogue = [Product(**p) for p in raw]

    async def find_candidates(
        self, session: Session, user_message: str
    ) -> dict[str, list[Product]]:
        """
        Returns a dict mapping category/need to a list of candidate Products.
        e.g. {"yogurt": [Product(...), Product(...)], "oat milk": [Product(...)]}
        """
        needs = self._extract_needs(user_message)
        results: dict[str, list[Product]] = {}

        restrictions = (
            session.user_profile.dietary_restrictions
            if session.user_profile else []
        )

        for need in needs:
            candidates = self._search(need, restrictions)
            if candidates:
                results[need] = candidates[:5]  # max 5 candidates per need

        return results

    def _extract_needs(self, message: str) -> list[str]:
        """
        Simple keyword extraction for Phase 1.
        Phase 2: replace with an LLM call to extract structured needs.
        """
        # Common grocery keywords to look for
        keywords = [
            "yogurt", "yoghurt", "milk", "oat milk", "almond milk",
            "bread", "eggs", "butter", "cheese", "chicken", "beef",
            "pasta", "rice", "cereal", "granola", "oats", "apple",
            "banana", "spinach", "broccoli", "tomato", "onion",
            "olive oil", "coffee", "tea", "orange juice", "juice",
            "protein bar", "snack", "chocolate", "biscuit", "cracker",
        ]
        msg_lower = message.lower()
        found = [kw for kw in keywords if kw in msg_lower]

        # If nothing found, return message as a single need for LLM fallback
        return found if found else [message.strip()]

    def _search(self, need: str, restrictions: list[str]) -> list[Product]:
        """Search catalogue by subcategory or name match, filtered by restrictions."""
        need_lower = need.lower()
        matches = [
            p for p in self._catalogue
            if need_lower in p.subcategory.lower()
            or need_lower in p.name.lower()
            or need_lower in p.category.lower()
        ]

        # Filter out products incompatible with dietary restrictions
        filtered = []
        for product in matches:
            if self._is_compatible(product, restrictions):
                filtered.append(product)

        return filtered

    def _is_compatible(self, product: Product, restrictions: list[str]) -> bool:
        product_tags = [t.lower() for t in product.tags]
        product_ingredients = [i.lower() for i in product.ingredients]

        restriction_map = {
            "vegan": lambda: "vegan" in product_tags or not any(
                animal in " ".join(product_ingredients)
                for animal in ["milk", "egg", "honey", "gelatin", "meat", "beef", "chicken"]
            ),
            "vegetarian": lambda: "vegetarian" in product_tags or not any(
                meat in " ".join(product_ingredients)
                for meat in ["beef", "chicken", "pork", "fish", "meat", "gelatin"]
            ),
            "gluten-free": lambda: "gluten-free" in product_tags or not any(
                g in " ".join(product_ingredients)
                for g in ["wheat", "barley", "rye", "spelt", "gluten"]
            ),
            "dairy-free": lambda: "dairy-free" in product_tags or not any(
                d in " ".join(product_ingredients)
                for d in ["milk", "cream", "butter", "cheese", "whey", "casein"]
            ),
        }

        for restriction in restrictions:
            check = restriction_map.get(restriction.lower())
            if check and not check():
                return False
        return True
