import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: ["src/**/*.tsx"],
  theme: {
    extend: {
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600"
      },
      fontSize: {
        "body-base": "1rem",
        "body-small": "0.875rem"
      },
      textColor: {
        "body": colors.gray[900],
        "body-secondary": colors.gray[600]
      },
      borderColor: {
        DEFAULT: colors.gray[300]
      },
      colors: {
        primary: {
          light: "#e6eaf7",
          DEFAULT: "#0f52bd",
          dark: "#002487"
        },
        danger: {
          light: colors.red[50],
          DEFAULT: colors.red[600],
          dark: colors.red[800]
        },
        success: {
          light: colors.green[50],
          DEFAULT: colors.green[600]
        }
      },
      boxShadow: {
        DEFAULT: "rgba(0,0,0,0.1) 0 2px 4px",
        inset: "rgba(0,0,0,0.05) 0 2px 4px inset"
      }
    }
  },
  darkMode: "class"
};
export default config;
