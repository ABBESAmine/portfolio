import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase-server";
import { getUserFromToken, isAdminUser } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getSupabasePublic();
    const { data, error } = await db
      .from("projects")
      .select("id, title, stack, description, link, featured, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/projects", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return NextResponse.json({ error: "Accès interdit (admin requis)." }, { status: 403 });
    }
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const stack = typeof body.stack === "string" ? body.stack.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const linkResult = parseProjectLink(body.link);
    if (!linkResult.ok) {
      return NextResponse.json({ error: linkResult.error }, { status: 400 });
    }
    const link = linkResult.value;
    const featured = Boolean(body.featured);
    const sortOrder =
      typeof body.sort_order === "number" && Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0;
    if (!title) {
      return NextResponse.json({ error: "title requis." }, { status: 400 });
    }
    if (title.length > 140 || stack.length > 220 || description.length > 5000) {
      return NextResponse.json({ error: "Un ou plusieurs champs sont trop longs." }, { status: 400 });
    }
    if (sortOrder < 0 || sortOrder > 10000) {
      return NextResponse.json({ error: "sort_order invalide." }, { status: 400 });
    }
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("projects")
      .insert({
        title,
        stack,
        description,
        link,
        featured,
        sort_order: sortOrder,
      })
      .select("id, title, stack, link, featured")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/projects", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

function parseProjectLink(input: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof input !== "string") return { ok: true, value: "#" };
  const trimmed = input.trim();
  if (!trimmed) return { ok: true, value: "#" };
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "Lien invalide." };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, error: "Le protocole du lien doit être http(s)." };
  }
  return { ok: true, value: url.toString() };
}
