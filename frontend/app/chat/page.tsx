"use client";

import { useStore } from "@/lib/store";
import { ChatBox } from "@/components/ChatBox";
import { BasketPanel } from "@/components/BasketPanel";

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 bg-white">
          <a href="/" className="text-xl font-bold text-green-700">
            BetterBasket
          </a>
          <span className="text-stone-400 text-sm ml-auto">
            Powered by Claude
          </span>
        </header>
        <ChatBox />
      </div>

      {/* Basket sidebar */}
      <BasketPanel />
    </div>
  );
}
