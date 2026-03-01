import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;
let _public: SupabaseClient | null = null;

/** Client Supabase côté serveur (API routes) — bypass RLS. Lance si les variables d'env sont absentes. */
export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  _admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _admin;
}

/** Client Supabase côté serveur (lecture publique) avec la clé anon + RLS. */
export function getSupabasePublic(): SupabaseClient {
  if (_public) return _public;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  _public = createClient(url, anonKey, { auth: { persistSession: false } });
  return _public;
}
