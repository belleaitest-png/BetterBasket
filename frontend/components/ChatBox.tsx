"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { streamChat, getBasket } from "@/lib/api";
import { MessageBubble } from "./MessageBubble";

const WELCOME_MESSAGE =
  "Hi! I'm BetterBasket. I'll help you build a grocery list perfectly tailored to you. " +
  "First, let me learn a little about you — it only takes a minute. " +
  "What dietary preferences or restrictions do you have? (e.g. vegan, gluten-free, no nuts — or just say 'none')";

export function ChatBox() {
  const {
    sessionId,
    messages,
    isStreaming,
    addMessage,
    appendToLastAssistantMessage,
    setBasket,
    setStreaming,
  } = useStore();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Show welcome message on mount
  useEffect(() => {
    if (!initialized.current && messages.length === 0) {
      initialized.current = true;
      addMessage({ role: "assistant", content: WELCOME_MESSAGE });
    }
  }, [addMessage, messages.length]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isStreaming || !sessionId) return;

    const text = input.trim();
    setInput("");
    addMessage({ role: "user", content: text });
    setStreaming(true);

    try {
      // Start empty assistant bubble
      appendToLastAssistantMessage("");

      for await (const chunk of streamChat(sessionId, text)) {
        appendToLastAssistantMessage(chunk);
      }

      // Refresh basket after each turn
      const basketData = await getBasket(sessionId);
      if (basketData.items) {
        setBasket(basketData.items, basketData.total_estimate);
      }
    } catch (err) {
      appendToLastAssistantMessage(
        "\n\n_(Sorry, something went wrong. Please try again.)_"
      );
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-messages">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2 items-center text-stone-400 text-sm pl-2">
            <span className="animate-pulse">BetterBasket is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-stone-200 bg-white px-4 py-3">
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <textarea
            className="flex-1 resize-none rounded-xl border border-stone-200 px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-green-500 text-sm
                       placeholder-stone-400 max-h-40"
            rows={1}
            placeholder={
              isStreaming
                ? "Waiting for response..."
                : "Tell me what you need, or ask about any product..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="px-5 py-3 rounded-xl bg-green-600 text-white font-medium text-sm
                       hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors shrink-0"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-stone-400 text-center mt-2">
          Try: &quot;I need breakfast foods for the week&quot; · &quot;Find me a high-protein yogurt&quot; · &quot;Generate my shopping list&quot;
        </p>
      </div>
    </div>
  );
}
