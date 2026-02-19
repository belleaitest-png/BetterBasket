"""
POST /api/chat  — Streaming chat endpoint.

The frontend sends a message and session_id, receives a Server-Sent Events
(SSE) stream of text chunks from the Orchestrator.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ..agents.orchestrator import OrchestratorAgent
from ..session_store import session_store

router = APIRouter()
orchestrator = OrchestratorAgent()


class ChatRequest(BaseModel):
    session_id: str
    message: str


@router.post("/chat")
async def chat(request: ChatRequest):
    async def event_stream():
        async for chunk in orchestrator.handle_message(
            session_id=request.session_id,
            user_message=request.message,
        ):
            # SSE format: data: <chunk>\n\n
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    session = session_store.get(session_id)
    if not session:
        return {"error": "Session not found"}
    return {
        "id": session.id,
        "state": session.state,
        "onboarding_complete": session.user_profile.onboarding_complete
        if session.user_profile else False,
        "message_count": len(session.messages),
    }
