from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime, timezone
from .user import UserProfile
from .basket import Basket

AgentState = Literal[
    "idle",
    "onboarding",
    "onboarding_complete",
    "shopping",
    "researching",
    "evaluating",
    "basket_review",
    "editing",
    "generating_list",
    "list_ready",
]


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = Field(default_factory=_utcnow)


class Session(BaseModel):
    id: str
    state: AgentState = "idle"
    user_profile: Optional[UserProfile] = None
    basket: Optional[Basket] = None
    messages: list[Message] = []
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
