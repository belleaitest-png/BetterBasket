"""
In-memory session store (Phase 1 MVP).
Phase 2: replace with Redis.
"""

import uuid
from .models.session import Session


class SessionStore:
    def __init__(self):
        self._sessions: dict[str, Session] = {}

    def get_or_create(self, session_id: str) -> Session:
        if session_id not in self._sessions:
            self._sessions[session_id] = Session(id=session_id)
        return self._sessions[session_id]

    def get(self, session_id: str) -> Session | None:
        return self._sessions.get(session_id)

    def save(self, session: Session) -> None:
        self._sessions[session.id] = session

    def delete(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)

    def new_id(self) -> str:
        return str(uuid.uuid4())


# Singleton — shared across the app
session_store = SessionStore()
