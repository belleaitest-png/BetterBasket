import type { Product } from '@/types/product';
import type { AgentScore } from '@/types/scoring';

/**
 * Thrift Agent — deterministic price/value scoring
 * Pure TypeScript, $0 API cost.
 */

export function scoreThrift(
  product: Product,
  categoryAveragePrice: number
): AgentScore {
  const price = product.price;
  const ratio = price / categoryAveragePrice; // 1.0 = at average
  const pctDiff = (price - categoryAveragePrice) / categoryAveragePrice; // negative = cheaper

  let score: number;
  let reasoning: string;

  if (pctDiff <= -0.3) {
    score = 100;
    reasoning = `${product.name} is ${Math.abs(pctDiff * 100).toFixed(0)}% below category average — exceptional value.`;
  } else if (pctDiff <= -0.1) {
    score = 75;
    reasoning = `${product.name} is ${Math.abs(pctDiff * 100).toFixed(0)}% below category average — good value.`;
  } else if (pctDiff <= 0.1) {
    score = 50;
    reasoning = `${product.name} is within 10% of category average — fair price.`;
  } else if (pctDiff <= 0.3) {
    score = 25;
    reasoning = `${product.name} is ${(pctDiff * 100).toFixed(0)}% above category average — poor value.`;
  } else {
    score = 0;
    reasoning = `${product.name} is ${(pctDiff * 100).toFixed(0)}% above category average — overpriced.`;
  }

  // Bonus: price-per-unit efficiency
  let bonus = 0;
  if (product.price_per_unit !== undefined && product.price_per_unit !== null) {
    // If price_per_unit is provided, it signals unit pricing is available → reward transparency
    bonus = 10;
    reasoning += ' Price-per-unit info available (+10 efficiency bonus).';
  }

  score = Math.min(100, score + bonus);

  return {
    agent_name: 'thrift',
    score,
    reasoning,
  };
}
