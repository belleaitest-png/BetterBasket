/**
 * BetterBasket — Browser-Side Supabase Client
 *
 * Use this in Client Components ('use client') and browser-side hooks.
 * Server Components / API Routes must use lib/supabase-server.ts instead.
 *
 * Relies on @supabase/ssr which handles cookie-based session persistence
 * automatically in the browser.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing env var NEXT_PUBLIC_SUPABASE_URL. ' +
    'Add it to .env.local and redeploy.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing env var NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Add it to .env.local and redeploy.'
  );
}

/**
 * Singleton browser client.
 * createBrowserClient is already memoised per (url, key) pair;
 * safe to call at module scope.
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Re-exported for convenience so callers that need a fresh client
 * (e.g. in tests) can create one explicitly.
 */
export { createBrowserClient };
