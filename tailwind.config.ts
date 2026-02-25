import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx,js,jsx}",
        "node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
        "node_modules/flowbite/**/*.js",
    ],
    theme: {
        // Al ponerlo directamente aquí (fuera de extend), sobrescribes las predeterminadas
        fontFamily: {
            // Reemplaza la fuente 'sans' de Tailwind (la que usa por defecto en <body>)
            sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            // Fuente secundaria para usar como utilidad (font-lato)
            lato: ['Lato', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: "#4CAF50",
                dark: "#545454",
                darker: "#2F3027",
                accent: "#8BC34A",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out forwards",
            },
        },
    },
    plugins: [flowbite],
};

export default config;
