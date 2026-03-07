"""
List Generator Agent
--------------------
Takes the finalised basket and produces a hyper-specific, formatted shopping
list ready to be copy-pasted into Claude Code or any browser AI agent.
"""

import anthropic
import os
import logging
from typing import AsyncIterator
from datetime import datetime, timezone
from ..models.session import Session

logger = logging.getLogger(__name__)
client = anthropic.AsyncAnthropic()

LIST_MODEL = os.getenv("LIST_MODEL", "claude-sonnet-4-5")

SYSTEM_PROMPT = """You are a precision grocery list formatter. Given a basket of items,
produce a clean, structured shopping list that is immediately usable by a human or an AI agent
to fill a shopping basket at a supermarket.

The list must include for each item:
- [ ] checkbox
- Brand name + exact product name + size
- Quantity
- Estimated price
- A single-line reason why this product was chosen
- Aisle or section if known

End the list with an === AGENT INSTRUCTIONS === section with notes for an AI agent
filling the basket (dietary constraints, substitution rules, budget limit).

Use plain text with markdown formatting. Be precise — no vague descriptions.
"""


class ListGeneratorAgent:
    async def generate(self, session: Session) -> AsyncIterator[str]:
        if not session.basket or not session.basket.items:
            yield "Your basket is empty. Add some items first by telling me what you need."
            return

        basket_data = self._format_basket_for_prompt(session)
        profile_data = self._format_profile_for_prompt(session)

        async with client.messages.stream(
            model=LIST_MODEL,
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"User Profile:\n{profile_data}\n\n"
                        f"Basket Contents:\n{basket_data}\n\n"
                        f"Store: {session.basket.preferred_store or 'any'}\n"
                        f"Estimated Total: £{session.basket.total_estimate:.2f}\n"
                        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}\n\n"
                        "Generate the shopping list now."
                    ),
                }
            ],
        ) as stream:
            async for text in stream.text_stream:
                yield text

    def _format_basket_for_prompt(self, session: Session) -> str:
        lines = []
        for item in session.basket.items:
            p = item.product
            lines.append(
                f"- {p.brand} {p.name} ({p.size}) × {item.quantity} @ £{p.price:.2f}\n"
                f"  Aisle: {p.aisle or 'unknown'}\n"
                f"  Reason: {item.reasoning}\n"
                f"  Tags: {', '.join(p.tags)}"
            )
        return "\n".join(lines)

    def _format_profile_for_prompt(self, session: Session) -> str:
        if not session.user_profile:
            return "No profile"
        p = session.user_profile
        return (
            f"Dietary restrictions: {', '.join(p.dietary_restrictions) or 'none'}\n"
            f"Health goals: {', '.join(p.health_goals) or 'none'}\n"
            f"Budget: £{p.budget_weekly}/week\n"
            f"Household size: {p.family_size}\n"
            f"Avoid ingredients: {', '.join(p.disliked_ingredients) or 'none'}"
        )
