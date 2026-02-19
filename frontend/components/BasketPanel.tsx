"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, BasketItem } from "@/lib/store";
import { removeBasketItem, updateBasketQuantity } from "@/lib/api";

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.round(score);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-stone-400 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-stone-500 w-6 text-right">{pct}</span>
    </div>
  );
}

function BasketItemRow({ item }: { item: BasketItem }) {
  const { sessionId, setBasket, basket, totalEstimate } = useStore();
  const [expanded, setExpanded] = useState(false);

  async function handleRemove() {
    if (!sessionId) return;
    await removeBasketItem(sessionId, item.product.id);
    const newItems = basket.filter((b) => b.product.id !== item.product.id);
    const newTotal = newItems.reduce(
      (sum, b) => sum + b.product.price * b.quantity,
      0
    );
    setBasket(newItems, newTotal);
  }

  async function handleQtyChange(delta: number) {
    if (!sessionId) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) return handleRemove();
    await updateBasketQuantity(sessionId, item.product.id, newQty);
    const newItems = basket.map((b) =>
      b.product.id === item.product.id ? { ...b, quantity: newQty } : b
    );
    const newTotal = newItems.reduce(
      (sum, b) => sum + b.product.price * b.quantity,
      0
    );
    setBasket(newItems, newTotal);
  }

  return (
    <div className="border border-stone-100 rounded-xl p-3 bg-white space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-800 truncate">
            {item.product.brand} {item.product.name}
          </p>
          <p className="text-xs text-stone-400">{item.product.size}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-green-700">
            £{(item.product.price * item.quantity).toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={() => handleQtyChange(-1)}
              className="w-5 h-5 rounded bg-stone-100 text-stone-600 text-xs hover:bg-stone-200"
            >
              −
            </button>
            <span className="text-xs w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQtyChange(1)}
              className="w-5 h-5 rounded bg-stone-100 text-stone-600 text-xs hover:bg-stone-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Expand/collapse scores */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-green-600 hover:underline"
      >
        {expanded ? "Hide scores" : "Why this product?"}
      </button>

      {expanded && (
        <div className="space-y-1.5 pt-1 border-t border-stone-50">
          <ScoreBar label="Price" score={item.score_price} />
          <ScoreBar label="Nutrition" score={item.score_nutrition} />
          <ScoreBar label="Quality" score={item.score_quality} />
          <ScoreBar label="Taste" score={item.score_taste} />
          <p className="text-xs text-stone-500 italic pt-1">{item.reasoning}</p>
        </div>
      )}

      <button
        onClick={handleRemove}
        className="text-xs text-red-400 hover:text-red-600"
      >
        Remove
      </button>
    </div>
  );
}

export function BasketPanel() {
  const { basket, totalEstimate, sessionId } = useStore();
  const router = useRouter();

  return (
    <aside className="w-80 border-l border-stone-200 bg-stone-50 flex flex-col">
      <div className="px-4 py-4 border-b border-stone-200 bg-white">
        <h2 className="font-semibold text-stone-800">Your Basket</h2>
        <p className="text-xs text-stone-400">
          {basket.length} item{basket.length !== 1 ? "s" : ""} · est. £
          {totalEstimate.toFixed(2)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {basket.length === 0 ? (
          <p className="text-xs text-stone-400 text-center mt-8">
            Your basket is empty.
            <br />
            Tell the assistant what you need!
          </p>
        ) : (
          basket.map((item) => (
            <BasketItemRow key={item.product.id} item={item} />
          ))
        )}
      </div>

      {basket.length > 0 && (
        <div className="px-4 py-4 border-t border-stone-200 bg-white space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span>Estimated total</span>
            <span className="text-green-700">£{totalEstimate.toFixed(2)}</span>
          </div>
          <button
            onClick={() => router.push("/list")}
            className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-semibold
                       hover:bg-green-700 transition-colors"
          >
            Generate Shopping List
          </button>
        </div>
      )}
    </aside>
  );
}
