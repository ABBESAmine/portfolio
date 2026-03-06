/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  async headers() {
    // [H1] Content Security Policy
    // unsafe-inline requis : Next.js injecte des scripts/styles inline pour le rendu,
    // et le script de détection de thème est inline dans le layout.
    // unsafe-eval ajouté uniquement en développement pour React Refresh (hot reload).
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // next/font/google télécharge les polices au build et les sert localement
      "font-src 'self'",
      // Appels Supabase côté client (auth, lecture données)
      "connect-src 'self' https://*.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // [H2] HSTS — force HTTPS et prévient les attaques downgrade
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // [H1] CSP
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
