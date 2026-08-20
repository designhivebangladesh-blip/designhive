import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Legacy keys, repointed to the new premium blue system ---
        // (kept so existing bg-ink / text-gold-400 / bg-parchment classes
        // across the codebase don't break — only their values change)
        ink: {
          DEFAULT: "#0B1020", // background
          soft: "#111827",    // surface
          surface: "#111827",
          card: "#151B2E",
          border: "#1E293B",
          hover: "#1A2236",
          line: "#24304A",
        },
        gold: {
          100: "#EFF6FF",
          200: "#DBEAFE",
          300: "#93C5FD",
          400: "#60A5FA", // secondary accent
          500: "#3B82F6",
          600: "#2563EB", // primary accent
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#172554",
        },
        parchment: {
          DEFAULT: "#F8FAFC", // primary text
          dim: "#E2E8F0",
          muted: "#94A3B8",   // secondary text
          line: "#334155",
        },
        status: {
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#60A5FA",
        },

        // --- New semantic tokens ---
        background: "#0B1020",
        surface: "#111827",
        "surface-elevated": "#151B2E",
        accent: {
          DEFAULT: "#2563EB",
          secondary: "#60A5FA",
        },
        "text-primary": "#F8FAFC",
        "text-secondary": "#94A3B8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs: "0.25rem",   // 4px
        sm: "0.375rem",  // 6px
        md: "0.75rem",   // 12px
        lg: "1rem",      // 16px
        xl: "1.5rem",    // 24px
        "2xl": "2rem",   // 32px
        "3xl": "2.5rem", // 40px
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        card: "0 0 0 1px rgba(37, 99, 235, 0.12), 0 4px 20px -2px rgba(0, 0, 0, 0.55)",
        "card-hover": "0 0 0 1px rgba(37, 99, 235, 0.35), 0 12px 40px -8px rgba(37, 99, 235, 0.25)",
        gold: "0 0 0 1px rgba(37,99,235,0.25), 0 8px 30px -8px rgba(37,99,235,0.35)",
        "gold-lg": "0 0 0 1px rgba(37,99,235,0.3), 0 30px 80px -20px rgba(37,99,235,0.45)",
        "glow-sm": "0 0 15px rgba(37, 99, 235, 0.25)",
        "glow-lg": "0 0 50px rgba(96, 165, 250, 0.35)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #60A5FA 0%, #2563EB 45%, #1D4ED8 100%)",
        "gold-gradient-soft": "linear-gradient(135deg, #93C5FD 0%, #2563EB 100%)",
        "gold-gradient-radial": "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(11,16,32,0) 70%)",
        "glass-dark": "linear-gradient(180deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 16, 32, 0.95) 100%)",
        "border-gradient": "linear-gradient(135deg, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0.05) 50%, rgba(29, 78, 216, 0.3) 100%)",
        "hero-glow": "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,0.25) 0%, rgba(11,16,32,0) 70%)",
        "mesh-glow": "radial-gradient(40% 40% at 15% 20%, rgba(96,165,250,0.18) 0%, transparent 70%), radial-gradient(35% 35% at 85% 80%, rgba(37,99,235,0.16) 0%, transparent 70%)",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotateY(0deg) rotateX(6deg)" },
          "100%": { transform: "rotateY(360deg) rotateX(6deg)" },
        },
        "spin-reverse": {
          "0%": { transform: "translateZ(-40px) rotateY(360deg)" },
          "100%": { transform: "translateZ(-40px) rotateY(0deg)" },
        },
        "orbit-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit-spin-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 16s linear infinite",
        "spin-reverse": "spin-reverse 16s linear infinite",
        "orbit-spin": "orbit-spin 24s linear infinite",
        "orbit-spin-rev": "orbit-spin-rev 30s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
