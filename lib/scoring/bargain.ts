import type { Product } from '@/types/product';
import type { AgentScore } from '@/types/scoring';

/**
 * Bargain Agent — deterministic deal detection
 * Pure TypeScript, $0 API cost.
 */

export function scoreBargain(product: Product): AgentScore {
  let score = 0;
  const reasons: string[] = [];

  // +40 if on sale
  if (product.on_sale === true) {
    score += 40;
    reasons.push('currently on sale (+40)');
  }

  // +20 if sale price is 20%+ off regular price
  if (
    product.on_sale === true &&
    product.sale_price !== undefined &&
    product.sale_price !== null &&
    product.price > 0
  ) {
    const discount = (product.price - product.sale_price) / product.price;
    if (discount >= 0.2) {
      score += 20;
      reasons.push(`${(discount * 100).toFixed(0)}% discount off regular price (+20)`);
    }
  }

  // +20 if 'bulk' or 'value' in tags
  const tags = product.tags ?? [];
  const lowerTags = tags.map((t: string) => t.toLowerCase());

  if (lowerTags.includes('bulk') || lowerTags.includes('value')) {
    score += 20;
    reasons.push('bulk/value pack (+20)');
  }

  // +10 if 'multipack' in tags
  if (lowerTags.includes('multipack')) {
    score += 10;
    reasons.push('multipack (+10)');
  }

  // +10 bonus for store-brand products
  if (product.is_store_brand === true) {
    score += 10;
    reasons.push('store brand (+10)');
  }

  score = Math.min(100, score);

  const reasoning =
    reasons.length > 0
      ? `${product.name}: ${reasons.join(', ')}.`
      : `${product.name}: no active deals detected.`;

  return {
    agent_name: 'bargain',
    score,
    reasoning,
  };
}
