import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Crée un client Supabase avec le JWT de l'utilisateur (côté serveur).
 * Permet de vérifier la session dans les API routes.
 */
export async function getUserFromToken(accessToken: string | null): Promise<User | null> {
  if (!accessToken) return null;
  if (!url || !anonKey) return null;
  const client = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data: { user } } = await client.auth.getUser();
  return user;
}

/**
 * Vérifie si l'utilisateur est autorisé admin via env.
 * Configure ADMIN_EMAILS="admin@site.com,autre@site.com" (ou ADMIN_EMAIL).
 */
export function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  const allowed = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return false;
  return allowed.includes(user.email.toLowerCase());
}
