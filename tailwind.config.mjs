export default {
  theme: {
    extend: {
      colors: {
        layout: {
          navbar: "#131313",
          body: "#010409",
          border: "#30363D",
          overlay: "rgba(0,0,0,0.6)",
        },
        card: {
          top: "#0D1117",
          bottom: "#131313",
        },
        surface: {
          base: "#010409",
          muted: "#161B22",
        },

        brand: {
          primary: {
            DEFAULT: "#1F6FEB",
            hover: "#388BFD",
            subtle: "#0A3069",
          },
          secondary: "#8B949E",
          accent: "#F78166",
        },

        state: {
          success: {
            DEFAULT: "#238636",
            subtle: "#0F5132",
          },
          warning: {
            DEFAULT: "#D29922",
            subtle: "#664D03",
          },
          danger: {
            DEFAULT: "#DA3633",
            subtle: "#842029",
          },
          info: {
            DEFAULT: "#58A6FF",
            subtle: "#084298",
          },
        },

        button: {
          green: {
            DEFAULT: "#29903B",
            hover: "#258134",
            active: "#1f6f2e",
          },
        },

        text: {
          primary: "#C9D1D9",
          secondary: "#8B949E",
          muted: "#6E7681",
          inverse: "#010409",
        },
      },

      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.6)",
        cardHover: "0 6px 30px rgba(0,0,0,0.8)",
        glow: "0 0 15px rgba(56, 139, 253, 0.5)",
        glowStrong: "0 0 25px rgba(56, 139, 253, 0.8)",
      },

      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },

      backgroundImage: {
        cardGradient: "linear-gradient(180deg, #0D1117 0%, #2e2e2e 100%)",
        cardGradientSoft:
          "linear-gradient(180deg, rgba(13,17,23,0.9) 0%, rgba(46,46,46,0.9) 100%)",
        btnGradient: "linear-gradient(90deg, #238636 0%, #2ea043 100%)",
        btnGradientHover: "linear-gradient(90deg, #2ea043 0%, #3fb950 100%)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
      },

      transitionDuration: {
        200: "200ms",
        300: "300ms",
        400: "400ms",
        600: "600ms",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
}
