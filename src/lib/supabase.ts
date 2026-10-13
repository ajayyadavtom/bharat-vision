import { createClient } from '@supabase/supabase-js';

// We use a safe fallback URL so the app NEVER hard-crashes the UI.
// If it can't find your real .env keys, it just idles safely.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pending-setup.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "pending_key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);