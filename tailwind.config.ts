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
        extend: {
            colors: {
                primary: "#4CB050",
                dark: "#2F3028",
                darker: "#0E1503",
                accent: "#8BC24A",
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
