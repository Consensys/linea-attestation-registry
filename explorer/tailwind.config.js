/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--surface-primary)",
        borderCard: "var(--border)",
        skeleton: "var(--skeleton)",
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
        },
        border: {
          card: "var(--border-card)",
          table: "var(--border-table)",
        },
        page: {
          attestation: "var(--indicator-blue)",
          schema: "var(--indicator-magenta)",
          portal: "var(--indicator-green)",
          module: "var(--indicator-orange)",
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
      boxShadow: {
        column: "3px 0px 10px 0px rgba(197,197,197,0.19)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
