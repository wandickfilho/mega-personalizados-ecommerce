import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from './config';

export function createSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured()) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
