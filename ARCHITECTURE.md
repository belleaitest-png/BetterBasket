# BetterBasket — Architecture

## Vision

An agentic grocery shopping experience powered by a team of Claude AI agents. The user chats naturally, gets onboarded once, then has a personalised grocery basket built for them — with every product decision justified by price, nutrition, quality and taste. The final output is a hyper-specific, copy-paste-ready shopping list that can be dropped directly into Claude Code or any browser AI agent to fill a real basket.

---

## User Journey

```
1. ONBOARDING (one-time)
   └─ Chat interview → User Profile stored (diet, budget, family, health goals, taste)

2. SHOPPING SESSION
   └─ User describes what they need ("plan my week", "I need breakfast foods")
   └─ Agents research products, score them, build basket
   └─ User reviews, overrides, asks questions

3. OUTPUT
   └─ Hyper-specific shopping list (brand, product, size, qty, price, reasoning)
   └─ Formatted for copy-paste into Claude Code / browser agent
```

---

## Agent Team

Six specialised agents coordinate via an Orchestrator. All agents are powered by the Claude API and share a conversation context object.

```
┌──────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                       │
│  Routes messages · Manages state machine · Context    │
└──────────┬───────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
ONBOARDING    BASKET LOOP
  Agent         │
                ├──► PRODUCT RESEARCHER  (finds candidates)
                ├──► EVALUATOR           (scores on 4 criteria)
                ├──► BASKET MANAGER      (tracks state, edits)
                └──► LIST GENERATOR      (formats final output)
```

### Agent Responsibilities

| Agent | Model | Responsibility |
|---|---|---|
| **Orchestrator** | claude-opus-4 | State machine, routing, user-facing replies, conversation memory |
| **Onboarding** | claude-sonnet-4 | Structured interview, builds & stores UserProfile |
| **Product Researcher** | claude-sonnet-4 | For each need, finds 3–5 candidate products with raw data |
| **Evaluator** | claude-opus-4 | Scores each candidate on price/nutrition/quality/taste, selects winner |
| **Basket Manager** | claude-haiku-4 | CRUD on basket items, running total, duplicate detection |
| **List Generator** | claude-sonnet-4 | Produces final formatted shopping list |

### State Machine

```
IDLE ──► ONBOARDING ──► ONBOARDING_COMPLETE
                                │
                                ▼
                        SHOPPING (loop)
                         ├─ RESEARCHING
                         ├─ EVALUATING
                         ├─ BASKET_REVIEW
                         └─ EDITING
                                │
                                ▼
                           GENERATING_LIST
                                │
                                ▼
                            LIST_READY
```

---

## Product Decision Framework

For every product category, the Evaluator scores each candidate out of 100:

```
Score = (Price × W_price) + (Nutrition × W_nutrition) + (Quality × W_quality) + (Taste × W_taste)
```

Weights are derived from the user's profile at onboarding:
- Budget-sensitive user → W_price = 0.4
- Health-focused user   → W_nutrition = 0.4
- Defaults             → equal weighting (0.25 each)

Each score dimension:

| Dimension | Signals |
|---|---|
| **Price** | Unit price vs. category average, on-sale status, value per serving |
| **Nutrition** | Macro balance, sugar/sodium levels, alignment with health goals |
| **Quality** | Ingredients list length, organic status, additives, brand reputation |
| **Taste** | User's stated preferences, brand history, review signals |

The Evaluator outputs a ranked list with a plain-English justification for the winner. The user can always override.

---

## Data Models

```typescript
UserProfile {
  id: string
  dietary_restrictions: string[]   // e.g. ["vegan", "gluten-free"]
  budget_weekly: number            // £/$ per week
  family_size: number
  health_goals: string[]           // e.g. ["high protein", "low sugar"]
  taste_preferences: {
    likes: string[]
    dislikes: string[]
  }
  disliked_ingredients: string[]
  preferred_brands: string[]
  preferred_store: string
  created_at: datetime
}

Product {
  id: string
  name: string
  brand: string
  category: string
  size: string                     // "500g", "1L"
  price: number
  price_per_unit: number
  nutrition_per_100g: NutritionFacts
  ingredients: string[]
  tags: string[]                   // ["organic", "low-sugar"]
  store_availability: string[]
}

BasketItem {
  product: Product
  quantity: number
  score_breakdown: {
    price: number
    nutrition: number
    quality: number
    taste: number
    total: number
  }
  reasoning: string
}

ShoppingList {
  user_id: string
  session_id: string
  items: BasketItem[]
  total_estimate: number
  store: string
  generated_at: datetime
  formatted_text: string           // ready for copy-paste
}
```

---

## Tech Stack

### Frontend — `frontend/`
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR, streaming, file-based routing |
| Language | TypeScript | Type safety across the stack |
| Styling | Tailwind CSS | Rapid UI, no CSS overhead |
| State | Zustand | Lightweight, no boilerplate |
| Streaming | Vercel AI SDK | First-class streaming chat primitives |

**Key pages:**
```
/                  → Landing + start onboarding
/chat              → Main chat interface (streaming)
/basket            → Live basket preview panel
/list              → Final shopping list + copy button
```

### Backend — `backend/`
| Layer | Choice | Reason |
|---|---|---|
| Framework | FastAPI | Async, auto-docs, streaming support |
| Language | Python 3.12 | Best Anthropic SDK support |
| AI | Anthropic SDK (claude-opus-4 / sonnet-4) | Multi-agent orchestration |
| Database | SQLite → PostgreSQL | SQLite for MVP; migrate via SQLAlchemy |
| Session state | In-memory dict → Redis | Simple for MVP |
| Product data | Seeded JSON → Open Food Facts API | Start with curated data |

**Key endpoints:**
```
POST /api/chat             → Main streaming chat endpoint
GET  /api/session/{id}     → Session state
GET  /api/basket/{id}      → Current basket
POST /api/basket/{id}/edit → Override a basket item
GET  /api/list/{id}        → Generate + retrieve shopping list
POST /api/user/profile     → Save user profile
```

---

## Project Structure

```
BetterBasket/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing / onboarding entry
│   │   ├── chat/
│   │   │   └── page.tsx          # Chat interface
│   │   ├── basket/
│   │   │   └── page.tsx          # Live basket preview
│   │   └── list/
│   │       └── page.tsx          # Final shopping list
│   ├── components/
│   │   ├── ChatBox.tsx           # Streaming chat UI
│   │   ├── MessageBubble.tsx     # User / agent message
│   │   ├── BasketPanel.tsx       # Sidebar basket preview
│   │   ├── ProductCard.tsx       # Product with score breakdown
│   │   ├── ShoppingList.tsx      # Formatted list + copy button
│   │   └── OnboardingFlow.tsx    # Step-by-step onboarding UI
│   ├── lib/
│   │   ├── api.ts                # Backend API client
│   │   └── store.ts              # Zustand store
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── agents/
│   │   ├── orchestrator.py       # Main agent, state machine
│   │   ├── onboarding.py         # User interview agent
│   │   ├── product_researcher.py # Find candidate products
│   │   ├── evaluator.py          # Score + rank products
│   │   ├── basket_manager.py     # Basket CRUD
│   │   └── list_generator.py     # Format final output
│   ├── models/
│   │   ├── user.py               # UserProfile schema
│   │   ├── product.py            # Product schema
│   │   ├── basket.py             # Basket + BasketItem schema
│   │   └── session.py            # Session state schema
│   ├── data/
│   │   ├── products.json         # Seeded product catalogue
│   │   └── seed.py               # DB seeder
│   ├── api/
│   │   ├── chat.py               # /api/chat streaming endpoint
│   │   ├── basket.py             # /api/basket endpoints
│   │   └── list.py               # /api/list endpoint
│   ├── db.py                     # SQLAlchemy setup
│   ├── session_store.py          # In-memory session state
│   ├── main.py                   # FastAPI app entry
│   └── requirements.txt
│
├── ARCHITECTURE.md               # This file
└── README.md
```

---

## Shopping List Output Format

The final output is optimised for copy-paste into Claude Code or a browser AI agent:

```
=== BETTERBASKET SHOPPING LIST ===
Store: Whole Foods Market
Estimated Total: £67.40
Generated: 2026-02-19

DAIRY & ALTERNATIVES
─────────────────────────────────────────────────────
[ ] Chobani Plain Greek Yogurt, 0% Fat, 907g × 1    £4.99
    → Best nutrition score (20g protein/serving), lowest sugar in category
    → Aisle 4, refrigerated dairy section

[ ] Oatly Oat Milk, Barista Edition, 1L × 2         £3.50 each
    → Matches vegan preference, best taste rating for coffee use
    → Aisle 7, plant milks

PRODUCE
─────────────────────────────────────────────────────
[ ] Organic Braeburn Apples, loose × 6              £2.10
    → Organic, within budget, high fibre per your health goals
    → Fresh produce, apple display

...

=== AGENT INSTRUCTIONS (for browser AI) ===
Search each item by exact brand + product name + size.
If unavailable, substitute with the nearest match in the same brand family.
Budget limit: £80. Do not substitute dairy for non-dairy without user confirmation.
```

---

## Build Phases

### Phase 1 — MVP (current)
- [x] Architecture design
- [ ] Frontend: Next.js scaffold + chat UI with streaming
- [ ] Backend: FastAPI + Orchestrator + Onboarding agent
- [ ] Product Researcher + Evaluator agents with seeded product data
- [ ] Basket Manager + List Generator
- [ ] Formatted shopping list output

### Phase 2 — Product Data
- [ ] Integrate Open Food Facts API for real product data
- [ ] Add supermarket pricing APIs (Tesco, Sainsbury's, Kroger, etc.)
- [ ] Persistent user profiles (SQLite → PostgreSQL)
- [ ] Redis session state

### Phase 3 — Retailer Integration
- [ ] Browser agent integration (Claude Code tool use)
- [ ] Direct retailer API (Tesco, Instacart, etc.)
- [ ] One-click basket fill

---

## Key Design Decisions

**Why a team of agents instead of one?**
Each agent has a focused system prompt and context window. The Evaluator doesn't need to know the user's conversation history — it just needs candidate products and the user profile. Separation keeps each agent's reasoning sharp and the token cost predictable.

**Why stream the response?**
Grocery decisions take time. Streaming means the user sees the agent thinking ("Researching yogurt options…", "Comparing on nutrition…") rather than a loading spinner. This builds trust and lets the user interrupt.

**Why seeded product data first?**
Real retailer APIs are rate-limited, require partnerships, and vary by region. A curated JSON catalogue (200–500 products across key categories) lets us prove the decision-making loop before adding live data complexity.

**Why plain-text list output?**
The immediate goal is a format that any AI agent — Claude Code, Perplexity, a browser extension — can parse and act on without custom integration. A structured plain-text format with exact product names, sizes and quantities is universally actionable.
