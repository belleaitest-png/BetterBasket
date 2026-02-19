from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
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


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = datetime.utcnow()


class Session(BaseModel):
    id: str
    state: AgentState = "idle"
    user_profile: Optional[UserProfile] = None
    basket: Optional[Basket] = None
    messages: list[Message] = []
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
