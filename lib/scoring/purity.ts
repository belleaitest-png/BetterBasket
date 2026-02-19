import type { Product } from '@/types/product';
import type { AgentScore } from '@/types/scoring';

/**
 * Purity Agent — deterministic ingredient quality scoring
 * Pure TypeScript, $0 API cost.
 */

const ADDITIVE_BLACKLIST: string[] = [
  'high fructose corn syrup',
  'hfcs',
  'sodium nitrate',
  'sodium nitrite',
  'msg',
  'monosodium glutamate',
  'aspartame',
  'saccharin',
  'sucralose',
  'acesulfame potassium',
  'acesulfame-k',
  'bha',
  'butylated hydroxyanisole',
  'bht',
  'butylated hydroxytoluene',
  'tbhq',
  'tertiary butylhydroquinone',
  'potassium bromate',
  'brominated vegetable oil',
  'bvo',
  'red 40',
  'yellow 5',
  'yellow 6',
  'blue 1',
  'blue 2',
  'red 3',
  'titanium dioxide',
  'carrageenan',
  'propyl gallate',
];

export function scorePurity(product: Product): AgentScore {
  const ingredients: string[] = product.ingredients ?? [];
  const tags: string[] = product.tags ?? [];
  const lowerTags = tags.map((t: string) => t.toLowerCase());

  let score = 100;
  const reasons: string[] = [];

  // -5 per ingredient over 5
  if (ingredients.length > 5) {
    const excess = ingredients.length - 5;
    const penalty = excess * 5;
    score -= penalty;
    reasons.push(`${ingredients.length} ingredients (-${penalty} for complexity)`);
  }

  // -15 for each blacklisted additive
  const foundAdditives: string[] = [];
  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase().trim();
    for (const additive of ADDITIVE_BLACKLIST) {
      if (lower.includes(additive)) {
        foundAdditives.push(ingredient);
        score -= 15;
        break; // only penalise once per ingredient
      }
    }
  }
  if (foundAdditives.length > 0) {
    reasons.push(`contains ${foundAdditives.join(', ')} (-${foundAdditives.length * 15})`);
  }

  // +20 if organic tag
  if (lowerTags.includes('organic')) {
    score += 20;
    reasons.push('certified organic (+20)');
  }

  // +10 if 3 or fewer ingredients (whole food)
  if (ingredients.length <= 3 && ingredients.length > 0) {
    score += 10;
    reasons.push(`only ${ingredients.length} ingredient(s) — whole food (+10)`);
  }

  // Clamp 0–100
  score = Math.max(0, Math.min(100, score));

  const reasoning =
    reasons.length > 0
      ? `${product.name}: ${reasons.join('; ')}.`
      : `${product.name}: standard ingredient profile.`;

  return {
    agent_name: 'purity',
    score,
    reasoning,
  };
}
