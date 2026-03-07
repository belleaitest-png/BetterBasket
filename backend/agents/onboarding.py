"""
Onboarding Agent
----------------
Runs a conversational interview to build a UserProfile.
Detects when enough information has been gathered and marks onboarding complete.
"""

import anthropic
import json
import os
import logging
from typing import AsyncIterator
from ..models.session import Session
from ..models.user import UserProfile, TastePreferences

logger = logging.getLogger(__name__)
client = anthropic.AsyncAnthropic()

ONBOARDING_MODEL = os.getenv("ONBOARDING_MODEL", "claude-sonnet-4-5")

SYSTEM_PROMPT = """You are the BetterBasket onboarding assistant. Your job is to learn about
the user so we can build them the perfect grocery basket.

Conduct a friendly, conversational interview to discover:
1. Dietary restrictions (vegan, vegetarian, gluten-free, dairy-free, nut allergy, halal, kosher, etc.)
2. Weekly grocery budget (approximate £/$ figure)
3. Household size (how many people you're shopping for)
4. Health goals (weight loss, high protein, low sugar, heart health, etc.)
5. Taste preferences (things they love and hate)
6. Any ingredients they want to avoid
7. Preferred supermarket / store

Ask naturally — you don't need to go in this exact order. Ask 1-2 questions at a time.
Once you have enough information (at least diet, budget, and household size), call the
extract_profile tool to save the profile and end onboarding.

Be warm, brief, and encouraging.
"""

TOOLS = [
    {
        "name": "extract_profile",
        "description": "Call this when you have gathered enough information to build the user's profile. This completes onboarding.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "User's first name if given"},
                "dietary_restrictions": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "e.g. ['vegan', 'gluten-free']",
                },
                "budget_weekly": {
                    "type": "number",
                    "description": "Weekly grocery budget in local currency",
                },
                "family_size": {"type": "integer", "description": "Number of people"},
                "health_goals": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "e.g. ['high protein', 'low sugar']",
                },
                "taste_likes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Foods/flavours they enjoy",
                },
                "taste_dislikes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Foods/flavours they dislike",
                },
                "disliked_ingredients": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Ingredients to always avoid",
                },
                "preferred_brands": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Brand names the user trusts",
                },
                "preferred_store": {
                    "type": "string",
                    "description": "Preferred supermarket or store",
                },
            },
            "required": ["dietary_restrictions", "budget_weekly", "family_size"],
        },
    }
]


class OnboardingAgent:
    async def run(self, session: Session, user_message: str) -> AsyncIterator[str]:
        """Stream the onboarding reply. Saves profile when extract_profile is called."""

        # Build conversation history for the API call
        messages = self._build_messages(session, user_message)

        async with client.messages.stream(
            model=ONBOARDING_MODEL,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        ) as stream:
            collected_text = ""
            tool_use_block = None

            async for event in stream:
                if hasattr(event, "type"):
                    if event.type == "content_block_start":
                        if hasattr(event.content_block, "type"):
                            if event.content_block.type == "tool_use":
                                tool_use_block = {
                                    "id": event.content_block.id,
                                    "name": event.content_block.name,
                                    "input": "",
                                }
                    elif event.type == "content_block_delta":
                        if hasattr(event.delta, "text"):
                            collected_text += event.delta.text
                            yield event.delta.text
                        elif hasattr(event.delta, "partial_json") and tool_use_block:
                            tool_use_block["input"] += event.delta.partial_json

            # If extract_profile was called, parse and save the profile
            if tool_use_block and tool_use_block["name"] == "extract_profile":
                try:
                    profile_data = json.loads(tool_use_block["input"])
                    profile = UserProfile(
                        id=session.id,
                        name=profile_data.get("name"),
                        dietary_restrictions=profile_data.get("dietary_restrictions", []),
                        budget_weekly=profile_data.get("budget_weekly"),
                        family_size=profile_data.get("family_size", 1),
                        health_goals=profile_data.get("health_goals", []),
                        taste_preferences=TastePreferences(
                            likes=profile_data.get("taste_likes", []),
                            dislikes=profile_data.get("taste_dislikes", []),
                        ),
                        disliked_ingredients=profile_data.get("disliked_ingredients", []),
                        preferred_brands=profile_data.get("preferred_brands", []),
                        preferred_store=profile_data.get("preferred_store"),
                        onboarding_complete=True,
                    )
                    session.user_profile = profile
                    logger.info("Profile saved for session %s", session.id)
                    completion_msg = (
                        "\n\nGreat — I've saved your profile! "
                        "Now tell me what you'd like to shop for. "
                        "For example: \"Plan my breakfasts for the week\" or "
                        "\"I need yogurt, oat milk, and some snacks\"."
                    )
                    yield completion_msg
                except (json.JSONDecodeError, KeyError) as e:
                    logger.error("Failed to parse profile: %s", e)
                    yield f"\n\n_(Could not save profile: {e}. Let's continue.)_"

    def _build_messages(self, session: Session, user_message: str) -> list[dict]:
        """Convert session message history to Anthropic API format.

        The orchestrator already appended the current user message to
        session.messages before calling this agent. We exclude it here
        to avoid sending it twice.
        """
        messages = []

        for msg in session.messages[:-1]:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": user_message})
        return messages
