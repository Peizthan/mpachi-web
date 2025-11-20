import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "theme-preference";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored ?? "system";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyThemeClass = (value: Theme, prefersDark = mediaQuery.matches) => {
      const resolvedTheme = value === "system" ? (prefersDark ? "dark" : "light") : value;
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    };

    applyThemeClass(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        applyThemeClass("system", event.matches);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
