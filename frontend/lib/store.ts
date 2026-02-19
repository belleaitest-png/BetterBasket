import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface BasketItem {
  product: {
    id: string;
    name: string;
    brand: string;
    size: string;
    price: number;
    category: string;
    aisle?: string;
    tags: string[];
  };
  quantity: number;
  reasoning: string;
  total_score: number;
  score_price: number;
  score_nutrition: number;
  score_quality: number;
  score_taste: number;
}

export type AppState =
  | "idle"
  | "onboarding"
  | "shopping"
  | "list_ready";

interface BetterBasketStore {
  sessionId: string | null;
  messages: Message[];
  basket: BasketItem[];
  totalEstimate: number;
  appState: AppState;
  isStreaming: boolean;

  setSessionId: (id: string) => void;
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  appendToLastAssistantMessage: (chunk: string) => void;
  setBasket: (items: BasketItem[], total: number) => void;
  setAppState: (state: AppState) => void;
  setStreaming: (v: boolean) => void;
}

let _msgCounter = 0;

export const useStore = create<BetterBasketStore>((set) => ({
  sessionId: null,
  messages: [],
  basket: [],
  totalEstimate: 0,
  appState: "idle",
  isStreaming: false,

  setSessionId: (id) => set({ sessionId: id }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: String(++_msgCounter), timestamp: new Date() },
      ],
    })),

  appendToLastAssistantMessage: (chunk) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
      } else {
        msgs.push({
          id: String(++_msgCounter),
          role: "assistant",
          content: chunk,
          timestamp: new Date(),
        });
      }
      return { messages: msgs };
    }),

  setBasket: (items, total) =>
    set({ basket: items, totalEstimate: total }),

  setAppState: (appState) => set({ appState }),
  setStreaming: (isStreaming) => set({ isStreaming }),
}));
