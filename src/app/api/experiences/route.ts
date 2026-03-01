import { NextResponse } from "next/server";
import { getSupabasePublic } from "@/lib/supabase-server";
import { getSupabaseUserClient, getUserFromToken } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getSupabasePublic();
    const { data, error } = await db
      .from("experiences")
      .select("id, role, company, period, description, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/experiences", err);
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
    const body = await request.json();
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const period = typeof body.period === "string" ? body.period.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const sortOrder =
      typeof body.sort_order === "number" && Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0;
    if (!role || !company || !period || !description) {
      return NextResponse.json(
        { error: "role, company, period et description requis." },
        { status: 400 }
      );
    }
    if (
      role.length > 120 ||
      company.length > 120 ||
      period.length > 80 ||
      description.length > 4000
    ) {
      return NextResponse.json({ error: "Un ou plusieurs champs sont trop longs." }, { status: 400 });
    }
    if (sortOrder < 0 || sortOrder > 10000) {
      return NextResponse.json({ error: "sort_order invalide." }, { status: 400 });
    }
    const db = getSupabaseUserClient(token);
    if (!db) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    const { data, error } = await db
      .from("experiences")
      .insert({ role, company, period, description, sort_order: sortOrder })
      .select("id, role, company, period")
      .single();
    if (error) {
      if (isPermissionError(error)) {
        return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
      }
      throw error;
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/experiences", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

function isPermissionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  const message =
    "message" in error ? String((error as { message?: unknown }).message ?? "") : "";
  return code === "42501" || /row-level security|permission denied/i.test(message);
}
