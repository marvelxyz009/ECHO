import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        echo: {
          background: "#05060f",
          surface: "#111325",
          accent: "#a6d0ff",
          glow: "#ffe29f",
          glitch: "#ff4d8d",
        },
      },
      fontFamily: {
        display: ["'IBM Plex Sans', sans-serif"],
        mono: ["'JetBrains Mono', monospace"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(166, 208, 255, 0.35)",
      },
      animation: {
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        heartbeat: "heartbeat 2.2s ease-in-out infinite",
        glitch: "glitch 1.3s infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(166, 208, 255, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 226, 159, 0.35)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.06)" },
          "60%": { transform: "scale(0.98)" },
        },
        glitch: {
          "0%": { clipPath: "inset(0 0 0 0)" },
          "33%": { clipPath: "inset(10% 0 15% 0)" },
          "66%": { clipPath: "inset(5% 0 5% 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

