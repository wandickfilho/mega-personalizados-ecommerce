import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

type BrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserClient | null = null;

export function getSupabaseBrowserClient(): BrowserClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}
