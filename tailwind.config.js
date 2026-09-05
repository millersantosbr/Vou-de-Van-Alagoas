/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        customBlue: {
          DEFAULT: "#0038A8",
          foreground: "#ffffff",
        },
        alagoas: {
          blue: {
            DEFAULT: "#0038A8",
            dark: "#002060",
            deep: "#0B1B3D",
            light: "#EBF2FF",
            glow: "rgba(0, 56, 168, 0.25)",
          },
          red: {
            DEFAULT: "#D62828",
            dark: "#9E1C1C",
            light: "#FDF2F2",
            glow: "rgba(214, 40, 40, 0.25)",
          },
          white: "#FFFFFF",
        },
        stitch: {
          primary: "#0038A8",
          secondary: "#002060",
          accent: "#D62828",
          surface: "#F8FAFC",
          darkSurface: "#0B1120",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(214, 40, 40, 0.7)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(214, 40, 40, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(214, 40, 40, 0)" },
        },
        "pulse-red": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(214, 40, 40, 0.7)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(214, 40, 40, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(214, 40, 40, 0)" },
        },
        "pulse-blue": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(0, 56, 168, 0.7)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(0, 56, 168, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(0, 56, 168, 0)" },
        },
        "pulse-pin": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(0, 56, 168, 0.4)" },
          "70%": { transform: "scale(1.08)", boxShadow: "0 0 0 12px rgba(0, 56, 168, 0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(0, 56, 168, 0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-red": "pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-blue": "pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-pin": "pulse-pin 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

