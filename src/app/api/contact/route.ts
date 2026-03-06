import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();
    const { name, email, message } = body;

    // [C1] IP réel — x-real-ip est injecté par Vercel, non falsifiable par le client
    const ip = getClientIp(request);
    // [C2] Rate limiting persistent via Supabase (survivre aux cold starts serverless)
    const allowed = await consumeRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanMessage = String(message).trim();
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }
    if (cleanName.length > 80 || cleanMessage.length > 4000) {
      return NextResponse.json({ error: "Message trop long." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY manquante");
      return NextResponse.json(
        { error: "Configuration email manquante." },
        { status: 500 }
      );
    }

    // [M1] Email de destination lu depuis les variables d'environnement
    const toEmail = process.env.CONTACT_TO_EMAIL;
    if (!toEmail) {
      console.error("CONTACT_TO_EMAIL manquante");
      return NextResponse.json(
        { error: "Configuration email manquante." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: toEmail,
      replyTo: cleanEmail,
      subject: `Contact portfolio : ${cleanName.slice(0, 50)}`,
      text: `Nom : ${cleanName}\nEmail : ${cleanEmail}\n\nMessage :\n${cleanMessage}`,
      html: `
        <p><strong>Nom :</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>Email :</strong> ${escapeHtml(cleanEmail)}</p>
        <p><strong>Message :</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(cleanMessage)}</pre>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Échec de l'envoi de l'email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// [C1] x-real-ip est injecté par Vercel côté edge et ne peut pas être falsifié par le client.
// Contrairement à x-forwarded-for qui est un header modifiable par n'importe qui.
function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  // Fallback pour les environnements non-Vercel (ex: dev local)
  const xff = request.headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  return xff.split(",")[0]?.trim() || "unknown";
}

// [C2] Rate limiting persistent via Supabase.
// Prérequis : exécuter migrations/001_contact_rate_limit.sql dans le SQL Editor Supabase.
// En cas d'erreur DB, le request est autorisé (fail-open) pour éviter de bloquer les utilisateurs légitimes.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

async function consumeRateLimit(ip: string): Promise<boolean> {
  try {
    const db = getSupabaseAdmin();
    const now = Date.now();
    const resetAt = new Date(now + RATE_WINDOW_MS).toISOString();

    const { data } = await db
      .from("contact_rate_limit")
      .select("count, reset_at")
      .eq("ip", ip)
      .maybeSingle();

    if (!data || new Date(data.reset_at).getTime() < now) {
      // Aucune entrée ou fenêtre expirée — démarrer à 1
      await db.from("contact_rate_limit").upsert(
        { ip, count: 1, reset_at: resetAt },
        { onConflict: "ip" }
      );
      return true;
    }

    if (data.count >= RATE_LIMIT_MAX) return false;

    await db
      .from("contact_rate_limit")
      .update({ count: data.count + 1 })
      .eq("ip", ip);

    return true;
  } catch {
    console.error("Rate limit DB error — failing open");
    return true;
  }
}
