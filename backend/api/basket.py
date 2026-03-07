from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..session_store import session_store
from ..agents.basket_manager import BasketManagerAgent

router = APIRouter()
basket_manager = BasketManagerAgent()


class UpdateQuantityRequest(BaseModel):
    product_id: str
    quantity: int



@router.get("/basket/{session_id}")
async def get_basket(session_id: str):
    session = session_store.get(session_id)
    if not session or not session.basket:
        return {"items": [], "total_estimate": 0.0, "item_count": 0}
    return {
        "items": [item.model_dump() for item in session.basket.items],
        "total_estimate": session.basket.total_estimate,
        "item_count": session.basket.item_count,
        "preferred_store": session.basket.preferred_store,
    }


@router.post("/basket/{session_id}/quantity")
async def update_quantity(session_id: str, request: UpdateQuantityRequest):
    session = session_store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    success = basket_manager.update_quantity(session, request.product_id, request.quantity)
    session_store.save(session)
    return {"success": success}


@router.delete("/basket/{session_id}/item/{product_id}")
async def remove_item(session_id: str, product_id: str):
    session = session_store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    success = basket_manager.remove_item(session, product_id)
    session_store.save(session)
    return {"success": success}


@router.delete("/basket/{session_id}")
async def clear_basket(session_id: str):
    session = session_store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    basket_manager.clear(session)
    session_store.save(session)
    return {"success": True}
