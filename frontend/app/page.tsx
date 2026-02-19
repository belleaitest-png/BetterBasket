"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const router = useRouter();
  const { setSessionId, setAppState } = useStore();

  useEffect(() => {
    // If session already exists in storage, restore it
    const existing = sessionStorage.getItem("betterbasket_session");
    if (existing) {
      setSessionId(existing);
    }
  }, [setSessionId]);

  function startShopping() {
    const id = generateSessionId();
    sessionStorage.setItem("betterbasket_session", id);
    setSessionId(id);
    setAppState("onboarding");
    router.push("/chat");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Logo / Brand */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-green-700">
            BetterBasket
          </h1>
          <p className="mt-3 text-xl text-stone-500">
            Smarter groceries, chosen for you.
          </p>
        </div>

        {/* Value props */}
        <ul className="text-left space-y-3 text-stone-600">
          {[
            "Tells you exactly which yogurt to buy — and why",
            "Balances price, nutrition, quality and taste",
            "Learns your diet, budget and preferences once",
            "Spits out a copy-paste shopping list for any AI agent",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={startShopping}
          className="w-full py-4 rounded-2xl bg-green-600 text-white text-lg font-semibold
                     hover:bg-green-700 active:bg-green-800 transition-colors shadow-md"
        >
          Start shopping smarter
        </button>

        <p className="text-sm text-stone-400">
          One quick setup, then just chat to build your basket.
        </p>
      </div>
    </main>
  );
}
