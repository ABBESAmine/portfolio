import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase-server";
import { getUserFromToken, isAdminUser } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getSupabasePublic();
    const { data, error } = await db
      .from("skills")
      .select("id, name, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/skills", err);
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
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const sortOrder =
      typeof body.sort_order === "number" && Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0;
    if (!name) {
      return NextResponse.json({ error: "name requis." }, { status: 400 });
    }
    if (name.length > 80) {
      return NextResponse.json({ error: "name trop long (80 caractères max)." }, { status: 400 });
    }
    if (sortOrder < 0 || sortOrder > 10000) {
      return NextResponse.json({ error: "sort_order invalide." }, { status: 400 });
    }
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("skills")
      .insert({ name, sort_order: sortOrder })
      .select("id, name")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/skills", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
