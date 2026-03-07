"""
Orchestrator Agent
------------------
The top-level agent. It receives every user message, decides which sub-agent
should handle it, calls that agent, and streams a response back to the UI.

State machine transitions live here.
"""

import anthropic
import json
import os
import logging
from typing import AsyncIterator
from ..models.session import Session, Message, AgentState
from ..session_store import session_store
from .onboarding import OnboardingAgent
from .product_researcher import ProductResearcherAgent
from .evaluator import EvaluatorAgent
from .basket_manager import BasketManagerAgent
from .list_generator import ListGeneratorAgent

logger = logging.getLogger(__name__)
client = anthropic.AsyncAnthropic()

SUMMARY_MODEL = os.getenv("SUMMARY_MODEL", "claude-sonnet-4-5")

SYSTEM_PROMPT = """You are BetterBasket, a friendly and knowledgeable grocery shopping assistant.
Your job is to help users build the perfect grocery basket tailored to their dietary needs,
health goals, taste preferences, and budget.

You lead a team of specialised AI agents:
- Onboarding Agent: gathers user preferences on first use
- Product Researcher: finds candidate products for each need
- Evaluator: scores and selects the best product based on price, nutrition, quality and taste
- Basket Manager: tracks what's in the basket
- List Generator: produces a hyper-specific shopping list ready for copy-paste

Be warm, concise, and proactive. When the user hasn't been onboarded, initiate onboarding.
After onboarding, help them build their basket. Always explain your product choices clearly.
"""


class OrchestratorAgent:
    def __init__(self):
        self.onboarding = OnboardingAgent()
        self.researcher = ProductResearcherAgent()
        self.evaluator = EvaluatorAgent()
        self.basket_manager = BasketManagerAgent()
        self.list_generator = ListGeneratorAgent()

    async def handle_message(
        self,
        session_id: str,
        user_message: str,
    ) -> AsyncIterator[str]:
        """
        Main entry point. Yields streaming text chunks.
        """
        session = session_store.get_or_create(session_id)

        # Append user message to history
        session.messages.append(Message(role="user", content=user_message))

        # Route to the right agent based on state
        if not session.user_profile or not session.user_profile.onboarding_complete:
            async for chunk in self._handle_onboarding(session, user_message):
                yield chunk
        elif self._wants_list(user_message):
            async for chunk in self._handle_list_generation(session):
                yield chunk
        else:
            async for chunk in self._handle_shopping(session, user_message):
                yield chunk

        session_store.save(session)

    async def _handle_onboarding(
        self, session: Session, user_message: str
    ) -> AsyncIterator[str]:
        session.state = "onboarding"
        response_text = ""
        async for chunk in self.onboarding.run(session, user_message):
            response_text += chunk
            yield chunk

        # Check if onboarding completed this turn
        if session.user_profile and session.user_profile.onboarding_complete:
            session.state = "onboarding_complete"

        session.messages.append(Message(role="assistant", content=response_text))

    async def _handle_shopping(
        self, session: Session, user_message: str
    ) -> AsyncIterator[str]:
        session.state = "shopping"
        response_text = ""

        # Step 1: research products mentioned
        yield "_Researching products for your request..._\n\n"
        candidates = await self.researcher.find_candidates(session, user_message)

        if not candidates:
            response = "I couldn't find matching products in my catalogue. Try being more specific (e.g. \"Greek yogurt\" or \"oat milk\")."
            session.messages.append(Message(role="assistant", content=response))
            yield response
            return

        # Step 2: evaluate and pick winners
        yield "_Evaluating options based on your preferences..._\n\n"
        session.state = "evaluating"
        evaluated = await self.evaluator.rank(session, candidates)

        # Step 3: add winners to basket
        session.state = "basket_review"
        added_items = self.basket_manager.add_items(session, evaluated)

        # Step 4: summarise what was added
        summary = self._format_additions(added_items)
        async for chunk in self._stream_summary(session, summary):
            response_text += chunk
            yield chunk

        session.messages.append(Message(role="assistant", content=response_text))

    async def _handle_list_generation(self, session: Session) -> AsyncIterator[str]:
        session.state = "generating_list"
        response_text = ""
        async for chunk in self.list_generator.generate(session):
            response_text += chunk
            yield chunk
        session.state = "list_ready"
        session.messages.append(Message(role="assistant", content=response_text))

    def _wants_list(self, message: str) -> bool:
        triggers = ["generate list", "shopping list", "show list",
                    "finalize", "finalise", "i'm done", "im done", "ready to shop"]
        return any(t in message.lower() for t in triggers)

    def _format_additions(self, added_items: list) -> str:
        if not added_items:
            return "Nothing was added to the basket."
        lines = [f"Added {len(added_items)} item(s) to your basket:\n"]
        for item in added_items:
            lines.append(
                f"- **{item.product.brand} {item.product.name}** ({item.product.size}) "
                f"× {item.quantity} — £{item.product.price:.2f}\n"
                f"  _{item.reasoning}_"
            )
        return "\n".join(lines)

    async def _stream_summary(
        self, session: Session, summary: str
    ) -> AsyncIterator[str]:
        """Use Claude to deliver the summary in a natural, conversational way."""
        profile_json = session.user_profile.model_dump_json() if session.user_profile else "{}"
        basket_count = session.basket.item_count if session.basket else 0

        async with client.messages.stream(
            model=SUMMARY_MODEL,
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"User profile: {profile_json}\n"
                        f"Basket now has {basket_count} items.\n\n"
                        f"Here is a summary of what was just added:\n{summary}\n\n"
                        "Present this to the user in a friendly 2-3 sentence summary. "
                        "Mention why the top pick was chosen. Ask if they want to add more "
                        "or generate their shopping list."
                    ),
                }
            ],
        ) as stream:
            async for text in stream.text_stream:
                yield text
