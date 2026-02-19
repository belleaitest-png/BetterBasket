# BetterBasket

An agentic grocery shopping experience powered by a team of Claude AI agents.

Chat naturally to build a grocery basket tailored to your diet, budget, health goals and taste. Every product choice is reasoned and justified. The final output is a hyper-specific shopping list — copy-paste it into Claude Code or any browser AI agent to fill a real basket.

---

## How it works

1. **Onboard once** — a chat interview captures your dietary restrictions, budget, household size, health goals, and taste preferences.
2. **Shop by chatting** — "I need breakfast foods for the week" or "find me a high-protein yogurt". Agents research products, score them on price / nutrition / quality / taste, and add the winner to your basket.
3. **Review & override** — the live basket panel shows every item with its score breakdown and reasoning. Edit quantities or remove items any time.
4. **Get your list** — "Generate my shopping list" produces a formatted, product-level list ready to paste into Claude Code or a browser agent.

---

## Agent team

| Agent | Role |
|---|---|
| **Orchestrator** | Routes messages, manages state, streams responses |
| **Onboarding** | Interview → UserProfile (diet, budget, goals, taste) |
| **Product Researcher** | Finds 3–5 candidates per need from the product catalogue |
| **Evaluator** | Scores candidates on 4 weighted dimensions, picks the winner |
| **Basket Manager** | Deterministic CRUD on basket state |
| **List Generator** | Formats the final copy-paste shopping list |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full design.

---

## Quickstart

### Prerequisites
- Python 3.12+
- Node.js 20+
- An Anthropic API key

### Backend

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
# API running at http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# UI running at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

---

## Project structure

```
BetterBasket/
├── backend/
│   ├── agents/          # Orchestrator + 5 sub-agents
│   ├── api/             # FastAPI routes (chat, basket, list)
│   ├── models/          # Pydantic schemas
│   ├── data/            # Seeded product catalogue (JSON)
│   ├── session_store.py # In-memory session state
│   └── main.py          # FastAPI entry point
├── frontend/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # ChatBox, BasketPanel, MessageBubble, ShoppingList
│   └── lib/             # Zustand store + API client
├── ARCHITECTURE.md      # Full technical design
└── .env.example
```

---

## Build phases

- **Phase 1 (current)** — seeded product catalogue, in-memory sessions, full agent loop, formatted list output
- **Phase 2** — Open Food Facts / retailer pricing APIs, PostgreSQL, Redis sessions
- **Phase 3** — retailer API integration or Claude Code browser agent for one-click basket fill
