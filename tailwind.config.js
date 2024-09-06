const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "pip-drop-effect": "pipDropEffect 1s ease-out",
        "iframe-drop-effect": "iframeDropEffect 1s ease-out",
      },
      keyframes: {
        pipDropEffect: {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
          "30%": {
            transform: "scale(0.75)",
            opacity: "0.3",
          },
          "60%": {
            transform: "scale(0.9)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        iframeDropEffect: {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
          "30%": {
            transform: "scale(0.75)",
            opacity: "0.3",
          },
          "60%": {
            transform: "scale(0.9)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
