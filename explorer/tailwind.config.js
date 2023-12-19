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
        whiteDefault: "var(--white-default)",
        blackDefault: "var(--black-default)",
        jumbotron: "var(--jumbotron)",
        jumbotronDark: "var(--jumbotron-dark)",
        background: "var(--surface-primary)",
        borderCard: "var(--border)",
        skeleton: "var(--skeleton)",
        grey400: "var(--grey-400)",
        surface: {
          lime: "var(--surface-lime)",
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          darkGrey: "var(--surface-dark-grey)",
          lightBlack: "var(--surface-light-black)",
          attestationData: "var(--surface-attestation-data)",
          magenta20: "var(--surface-magenta-20)",
        },
        text: {
          input: "var(--text-input)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          quaternary: "var(--text-quaternary)",
          darkGrey: "var(--text-dark-grey)",
          darkBlue: "var(--text-dark-blue)",
        },
        border: {
          card: "var(--border-card)",
          cardHover: "var(--border-card-hover)",
          table: "var(--border-table)",
          input: "var(--border-input)",
          inputFocus: "var(--border-input-focus)",
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
          primaryWhite: {
            background: "var(--button-primary-white-background)",
            text: "var(--button-primary-white-text)",
            hover: "var(--button-primary-white-hover)",
          },
          primaryBlack: {
            background: "var(--button-primary-black-background)",
            text: "var(--button-primary-black-text)",
            hover: "var(--button-primary-black-hover)",
          },
          secondary: {
            background: "var(--button-secondary-background)",
            text: "var(--button-secondary-text)",
            hover: "var(--button-secondary-hover)",
            border: "var(--button-secondary-border)",
            borderHover: "var(--button-secondary-border-hover)",
          },
          outlined: {
            text: "var(--button-outlined-text)",
            border: "var(--button-outlined-border)",
            borderHover: "var(--button-secondary-border-hover)",
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
