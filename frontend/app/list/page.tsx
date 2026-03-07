"use client";

import { useEffect, useCallback, useState } from "react";
import { useStore } from "@/lib/store";
import { streamList } from "@/lib/api";
import Link from "next/link";

export default function ListPage() {
  const { sessionId, basket, totalEstimate } = useStore();
  const [listText, setListText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    if (!sessionId) return;
    setGenerating(true);
    setListText("");
    try {
      for await (const chunk of streamList(sessionId)) {
        setListText((prev) => prev + chunk);
      }
    } finally {
      setGenerating(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    generate();
  }, [sessionId, generate]);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(listText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 bg-white">
        <Link href="/chat" className="text-xl font-bold text-green-700">
          BetterBasket
        </Link>
        <span className="text-stone-400 text-sm ml-auto">Shopping List</span>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Your Shopping List</h1>
            <p className="text-stone-500 text-sm mt-1">
              {basket.length} items · est. £{totalEstimate.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generate}
              disabled={generating}
              className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600
                         hover:bg-stone-100 disabled:opacity-40"
            >
              Regenerate
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!listText || generating}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium
                         hover:bg-green-700 disabled:opacity-40 transition-colors"
            >
              {copied ? "Copied!" : "Copy list"}
            </button>
          </div>
        </div>

        {/* List display */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          {generating && !listText && (
            <div className="text-stone-400 text-sm animate-pulse">
              Generating your shopping list...
            </div>
          )}
          {listText ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-stone-700 leading-relaxed">
              {listText}
              {generating && (
                <span className="animate-pulse text-green-500">▌</span>
              )}
            </pre>
          ) : null}
        </div>

        <div className="text-xs text-stone-400 text-center">
          Copy and paste this list into Claude Code or any browser AI agent to fill your basket automatically.
        </div>

        <div className="text-center">
          <Link
            href="/chat"
            className="text-sm text-green-600 hover:underline"
          >
            Back to chat to edit your basket
          </Link>
        </div>
      </main>
    </div>
  );
}
