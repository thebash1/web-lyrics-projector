module.exports = {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 40%, 55%)",
        accent: "hsl(260, 40%, 65%)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
