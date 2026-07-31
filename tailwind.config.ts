import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { duration, ease } from "./src/lib/motion";

/** `{ fast: 150 }` → `{ "--duration-fast": "150ms" }` */
const durationVars = Object.fromEntries(
  Object.entries(duration).map(([name, ms]) => [`--duration-${name}`, `${ms}ms`])
);

/** `{ fast: 150 }` → `{ fast: "var(--duration-fast)" }` — utilitaires `duration-fast`, etc. */
const durationUtilities = Object.fromEntries(
  Object.keys(duration).map((name) => [name, `var(--duration-${name})`])
);

const config: Config = {
  darkMode: "class",
  future: {
    // Enveloppe toutes les variantes `hover:` dans
    // `@media (hover: hover) and (pointer: fine)`. Sans ça, un tap sur mobile
    // colle l'état hover à l'élément jusqu'au tap suivant : une carte reste
    // agrandie après que le doigt l'a quittée.
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        "section-alt": "var(--section-alt)",
        "dark-section": "var(--dark-section)",
        heading: "var(--heading)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        border: "var(--border)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
        "on-dark": "var(--on-dark)",
        red: "var(--red)",
      },
      transitionDuration: durationUtilities,
      transitionTimingFunction: {
        "out-strong": "var(--ease-out)",
        "in-out-strong": "var(--ease-in-out)",
      },
    },
  },
  plugins: [
    // Les tokens de motion sont émis depuis `src/lib/motion.ts` plutôt que
    // recopiés dans globals.css : le CSS et le JS lisent la même définition.
    plugin(({ addBase }) => {
      addBase({
        ":root": {
          ...durationVars,
          "--ease-out": ease.out,
          "--ease-in-out": ease.inOut,
        },
      });
    }),
  ],
};
export default config;
