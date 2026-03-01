import { NextResponse } from "next/server";
import { getSupabaseUserClient, getUserFromToken } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";

type RouteParams = { params: { id: string } };

export async function DELETE(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const token = _request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "id requis." }, { status: 400 });
    }
    const db = getSupabaseUserClient(token);
    if (!db) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    const { error } = await db.from("skills").delete().eq("id", id);
    if (error) {
      if (isPermissionError(error)) {
        return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
      }
      throw error;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/skills/[id]", err);
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
