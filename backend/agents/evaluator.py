"""
Evaluator Agent
---------------
Given a dict of {need: [candidate products]}, scores each product on 4 dimensions
(price, nutrition, quality, taste) using the user's weighted criteria, then selects
the winner for each need.

Uses Claude with structured tool use so scores are always parseable.
"""

import anthropic
import json
import os
import logging
from ..models.session import Session
from ..models.product import Product, ProductScore
from ..models.user import CriteriaWeights

logger = logging.getLogger(__name__)
client = anthropic.AsyncAnthropic()

EVALUATOR_MODEL = os.getenv("EVALUATOR_MODEL", "claude-sonnet-4-5")

SCORE_TOOL = {
    "name": "score_products",
    "description": "Score a list of candidate products on 4 dimensions and select the best one.",
    "input_schema": {
        "type": "object",
        "properties": {
            "scores": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "product_id": {"type": "string"},
                        "score_price": {"type": "number", "description": "0-100"},
                        "score_nutrition": {"type": "number", "description": "0-100"},
                        "score_quality": {"type": "number", "description": "0-100"},
                        "score_taste": {"type": "number", "description": "0-100"},
                        "reasoning": {"type": "string", "description": "1-2 sentence plain English justification"},
                    },
                    "required": ["product_id", "score_price", "score_nutrition", "score_quality", "score_taste", "reasoning"],
                },
            },
            "winner_id": {"type": "string", "description": "product_id of the recommended product"},
        },
        "required": ["scores", "winner_id"],
    },
}


class EvaluatorAgent:
    async def rank(
        self,
        session: Session,
        candidates: dict[str, list[Product]],
    ) -> list[ProductScore]:
        """
        For each need, score candidates and return a list of winning ProductScores.
        """
        weights = (
            CriteriaWeights.from_profile(session.user_profile)
            if session.user_profile
            else CriteriaWeights()
        )

        winners: list[ProductScore] = []
        for need, products in candidates.items():
            if not products:
                continue
            winner = await self._evaluate_need(need, products, weights, session)
            if winner:
                winners.append(winner)

        return winners

    async def _evaluate_need(
        self,
        need: str,
        products: list[Product],
        weights: CriteriaWeights,
        session: Session,
    ) -> ProductScore | None:
        profile_summary = ""
        if session.user_profile:
            p = session.user_profile
            profile_summary = (
                f"User: {p.family_size} person household, "
                f"budget £{p.budget_weekly}/week, "
                f"restrictions: {', '.join(p.dietary_restrictions) or 'none'}, "
                f"health goals: {', '.join(p.health_goals) or 'none'}, "
                f"likes: {', '.join(p.taste_preferences.likes[:3]) or 'none'}."
            )

        products_text = json.dumps(
            [p.model_dump() for p in products], indent=2, default=str
        )

        prompt = (
            f"You are evaluating products for the need: '{need}'.\n\n"
            f"{profile_summary}\n\n"
            f"Scoring weights: price={weights.price:.2f}, nutrition={weights.nutrition:.2f}, "
            f"quality={weights.quality:.2f}, taste={weights.taste:.2f}.\n\n"
            f"Products to evaluate:\n{products_text}\n\n"
            "Score each product 0-100 on each dimension. "
            "Consider the weights when deciding the winner. "
            "Call the score_products tool with your results."
        )

        response = await client.messages.create(
            model=EVALUATOR_MODEL,
            max_tokens=2048,
            tools=[SCORE_TOOL],
            tool_choice={"type": "tool", "name": "score_products"},
            messages=[{"role": "user", "content": prompt}],
        )

        # Extract tool result
        for block in response.content:
            if block.type == "tool_use" and block.name == "score_products":
                data = block.input
                winner_id = data["winner_id"]
                score_map = {s["product_id"]: s for s in data["scores"]}
                winner_product = next((p for p in products if p.id == winner_id), products[0])
                score_data = score_map.get(winner_id, score_map.get(products[0].id, {}))

                total = (
                    score_data.get("score_price", 50) * weights.price
                    + score_data.get("score_nutrition", 50) * weights.nutrition
                    + score_data.get("score_quality", 50) * weights.quality
                    + score_data.get("score_taste", 50) * weights.taste
                )

                return ProductScore(
                    product=winner_product,
                    score_price=score_data.get("score_price", 50),
                    score_nutrition=score_data.get("score_nutrition", 50),
                    score_quality=score_data.get("score_quality", 50),
                    score_taste=score_data.get("score_taste", 50),
                    total_score=total,
                    reasoning=score_data.get("reasoning", "Best overall match for your profile."),
                )

        logger.warning("No score_products tool call in response for need: %s", need)
        return None
