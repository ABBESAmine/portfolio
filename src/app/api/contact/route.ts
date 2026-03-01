import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "amine.abbes94370@gmail.com";

export type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();
    const { name, email, message } = body;
    const ip = getClientIp(request);
    if (!consumeRateLimit(ip)) {
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

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: TO_EMAIL,
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
  // Validation simple côté API pour réduire les entrées invalides.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  return xff.split(",")[0]?.trim() || "unknown";
}

function consumeRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  rateStore.set(key, entry);
  return true;
}
