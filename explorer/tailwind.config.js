/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--surface-primary)",
        borderCard: "var(--border)",
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          attestationData: "var(--surface-attestation-data)",
          magenta20: "var(--surface-magenta-20)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          quaternary: "var(--text-quaternary)",
          blue: "var(--text-blue)",
          magenta: "var(--text-magenta)",
        },
        border: {
          card: "var(--border-card)",
          table: "var(--border-table)",
        },
        indicator: {
          blue: "var(--indicator-blue)",
          magenta: "var(--indicator-magenta)",
          green: "var(--indicator-green)",
        },
        hover: {
          lime20: "var(--hover-lime20)",
        },
        button: {
          primary: {
            background: "var(--button-primary-background)",
            text: "var(--button-primary-text)",
            hover: "var(--button-primary-hover)",
          },
          secondary: {
            background: "var(--button-secondary-background)",
            text: "var(--button-secondary-text)",
            hover: "var(--button-secondary-hover)",
            border: "var(--button-secondary-border)",
          },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding, gap",
      },
      fontFamily: {
        IBMPlexMono: ["IBM Plex Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
