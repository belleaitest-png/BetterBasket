from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..session_store import session_store
from ..agents.list_generator import ListGeneratorAgent

router = APIRouter()
list_generator = ListGeneratorAgent()


@router.get("/list/{session_id}/stream")
async def stream_list(session_id: str):
    """Stream the shopping list generation."""
    session = session_store.get(session_id)
    if not session:
        async def error():
            yield "data: Session not found\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(error(), media_type="text/event-stream")

    async def event_stream():
        async for chunk in list_generator.generate(session):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
