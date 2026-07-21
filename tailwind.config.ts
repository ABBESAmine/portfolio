import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
      transitionTimingFunction: {
        "out-strong": "var(--ease-out)",
        "in-out-strong": "var(--ease-in-out)",
      },
    },
  },
  plugins: [],
};
export default config;
