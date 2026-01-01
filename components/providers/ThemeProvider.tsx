"use client";

import { useEffect, createContext, useContext } from "react";
import { useSettings, Density } from "@/hooks/useSettings";

// Density Context for components to consume
interface DensityContextType {
    density: Density;
    isCompact: boolean;
}

const DensityContext = createContext<DensityContextType>({
    density: "comfortable",
    isCompact: false,
});

export const useDensity = () => useContext(DensityContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, appIcon, density } = useSettings();

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Remove existing theme classes
        root.classList.remove("light", "dark");

        if (theme === "system") {
            // Check system preference
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.add(systemDark ? "dark" : "light");

            // Listen for system theme changes
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = (e: MediaQueryListEvent) => {
                root.classList.remove("light", "dark");
                root.classList.add(e.matches ? "dark" : "light");
            };
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // Apply density to document as a data attribute (for CSS targeting)
    useEffect(() => {
        document.documentElement.setAttribute("data-density", density);
    }, [density]);

    // Apply favicon based on app icon
    useEffect(() => {
        const faviconMap: Record<string, string> = {
            default: "🔖",
            mint: "📗",
            coral: "📕",
            lavender: "📘",
        };

        // Create emoji favicon using canvas
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.font = "28px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(faviconMap[appIcon] || "🔖", 16, 18);

            // Find or create favicon link
            let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
            if (!favicon) {
                favicon = document.createElement("link");
                favicon.rel = "icon";
                document.head.appendChild(favicon);
            }
            favicon.href = canvas.toDataURL();
        }
    }, [appIcon]);

    return (
        <DensityContext.Provider value={{ density, isCompact: density === "compact" }}>
            {children}
        </DensityContext.Provider>
    );
}
