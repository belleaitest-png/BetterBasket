/**
 * BetterBasket — Cost Cap Type Definitions
 * All types related to usage tracking, cost control, and degradation levels.
 */

// ─── Degradation Levels ───────────────────────────────────────────────────────

/**
 * full    → 0–70% of daily cap consumed. All 8 agents, Sonnet for chat.
 * lite    → 70–90% consumed. 4 deterministic agents only, Haiku for chat.
 * cache   → 90–100% consumed. Return cached/fallback responses only.
 * blocked → 100%+ consumed. Reject with friendly message; browse-only mode.
 */
export type DegradationLevel = 'full' | 'lite' | 'cache' | 'blocked';

// ─── Usage Record ─────────────────────────────────────────────────────────────

/** Row shape from public.usage_tracking in Supabase. */
export interface UsageRecord {
  id: string;
  user_id: string;
  date: string; // ISO date string e.g. '2025-01-15'
  input_tokens: number;
  output_tokens: number;
  /** Stored as integer cents (multiply dollars × 100). */
  estimated_cost_cents: number;
  query_count: number;
  /** Keyed by model name, value is { input_tokens, output_tokens, cost_cents }. */
  model_breakdown: Record<string, ModelBreakdown>;
  cap_hit: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModelBreakdown {
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  call_count: number;
}

// ─── Cost-Aware Message Params ────────────────────────────────────────────────

/** Use case determines max_tokens ceiling — scoring is tighter than chat. */
export type UseCase = 'scoring' | 'chat';

export interface CostAwareParams {
  /** Authenticated user ID from Supabase Auth. */
  userId: string;
  /** The model to attempt (may be downgraded based on budget). */
  model: 'claude-sonnet-4-5' | 'claude-haiku-4-5';
  /** System prompt string. */
  system?: string;
  /** Message array matching Anthropic Messages API shape. */
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  /** Drives max_tokens ceiling: scoring=500, chat=1500. */
  useCase: UseCase;
  /**
   * Optional: pre-fetched usage record to avoid a double Supabase round-trip
   * when the caller already has it (e.g., inside a request that checked budget).
   */
  existingUsage?: UsageRecord | null;
}

// ─── Cost-Aware Response ──────────────────────────────────────────────────────

export interface CostAwareResponse {
  /** The text content returned by Claude (or the cached fallback). */
  content: string;
  /** Actual model used (may differ from requested due to downgrade). */
  model: string;
  /** Tokens consumed in this call. */
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  /** Estimated cost of THIS call in cents. */
  cost_cents: number;
  /** Degradation level that was in effect when the call was made. */
  degradation_level: DegradationLevel;
  /** True if the model was downgraded from the originally requested one. */
  was_downgraded: boolean;
  /** True if this response came from a cached/fallback path, not a live API call. */
  from_cache: boolean;
}

// ─── Budget Summary (for UI / health endpoint) ────────────────────────────────

export interface BudgetSummary {
  user_id: string;
  date: string;
  query_count: number;
  query_cap: number;
  query_pct: number;
  cost_cents: number;
  cost_cap_cents: number;
  cost_pct: number;
  /** The binding constraint (whichever percentage is higher). */
  utilisation_pct: number;
  degradation_level: DegradationLevel;
  cap_hit: boolean;
}
