import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Crée un client Supabase avec le JWT de l'utilisateur (côté serveur).
 * Permet de vérifier la session dans les API routes.
 */
export function getSupabaseUserClient(accessToken: string | null): SupabaseClient | null {
  if (!accessToken) return null;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/**
 * Vérifie le token utilisateur (côté serveur) et retourne l'utilisateur.
 */
export async function getUserFromToken(accessToken: string | null): Promise<User | null> {
  const client = getSupabaseUserClient(accessToken);
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  return user;
}
