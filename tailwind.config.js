// tailwind.config.js
module.exports = {
    darkMode: "class", // Karanlık modu class tabanlı kullanmak için
    content: [
        "./public/**/*.html",
        "./public/**/*.js",
        "./src/**/*.html",
        "./src/**/*.js",
    ],
    safelist: [
        "bg-day",
        "bg-night",
        "dark:bg-night",
        "text-black",
        "text-text-dark",
        "dark:text-text-dark",
    ],
    theme: {
        extend: {
            colors: {
                // Gündüz modu renkleri
                day: "#f0f2f5",
                "div-light-bg": "#91a9ba", // Büyük divlerin arka plan rengi gündüz modu
                "input-light-bg": "#ffffff", // Input arka plan rengi gündüz modu
                "text-light": "#000000", // Gündüz modunda metin rengi
                "border-error-light": "#ff0000", // Hata durumundaki border rengi gündüz modu

                // Gece modu renkleri
                night: "#202c33",
                "div-dark-bg": "#111b21",
                "input-dark-bg": "#2a3942",
                "text-dark": "#f9f9f9",
                "border-error-dark": "#f9f9f9",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        require("tailwindcss-filters"),
    ],
};
