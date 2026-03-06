import { NextRequest, NextResponse } from "next/server";

// [H3] Protection de la route /admin côté serveur.
// La session Supabase étant stockée en localStorage (client-side), on ne peut pas
// vérifier le JWT en middleware sans migrer vers @supabase/ssr (cookie-based).
// Ce middleware ajoute deux protections :
//   1. X-Robots-Tag pour empêcher l'indexation par les moteurs de recherche
//   2. HTTP Basic Auth optionnel via la variable ADMIN_PATH_SECRET (ASCII uniquement)
//      → Définir ADMIN_PATH_SECRET dans .env.local pour activer la double protection

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Empêcher l'indexation de la page admin
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  const secret = process.env.ADMIN_PATH_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization") ?? "";
    const expected = `Basic ${btoa(`admin:${secret}`)}`;
    if (authHeader !== expected) {
      return new NextResponse("Accès non autorisé.", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin"',
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }
  }

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
