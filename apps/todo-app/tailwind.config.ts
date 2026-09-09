import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-line": "var(--color-paper-line)",
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        sage: "var(--color-sage)",
        "sage-deep": "var(--color-sage-deep)",
        lilac: "var(--color-lilac)",
        blush: "var(--color-blush)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-ui)"],
      },
    },
  },
  plugins: [],
};
export default config;
