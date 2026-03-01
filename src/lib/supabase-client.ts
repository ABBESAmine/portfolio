import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Client Supabase côté navigateur (auth + lecture si RLS). */
export const supabase = url && anonKey ? createClient(url, anonKey) : (null as unknown as ReturnType<typeof createClient>);
