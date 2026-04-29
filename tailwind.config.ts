import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            boxShadow: {
                DEFAULT: 'none',
                sm: 'none',
                md: 'none',
                lg: 'none',
                xl: 'none',
                '2xl': 'none',
                inner: 'none',
                none: 'none',
            },
        },
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        background: "#fafaf9",
                        foreground: "#1c1c1c",
                        primary: {
                            DEFAULT: "#0d7a6b",
                            foreground: "#ffffff",
                        },
                        focus: "#0d7a6b",
                    },
                },
                dark: {
                    colors: {
                        background: "#0a0a0a",
                        foreground: "#e8e8e6",
                        primary: {
                            DEFAULT: "#2dccc0",
                            foreground: "#0a0a0a",
                        },
                        focus: "#2dccc0",
                    },
                },
            },
        }),
    ],
};

export default config;
