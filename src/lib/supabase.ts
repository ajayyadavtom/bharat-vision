import { createClient } from '@supabase/supabase-js';

// We use a safe fallback URL so the app NEVER hard-crashes the UI.
// If it can't find your real .env keys, it just idles safely.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sqbaoeqyzwubhkcszgaj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_BhmGPi_NNz7afXLfKCzINA_DgvtDI3g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});