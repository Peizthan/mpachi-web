import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);

  const handleSwitch = (checked: boolean) => setTheme(checked ? "dark" : "light");

  const getAriaLabel = (currentTheme: Theme) => {
    switch (currentTheme) {
      case "dark":
        return "Cambiar a modo claro";
      case "light":
        return "Cambiar a modo oscuro";
      default:
        return "Seguir la preferencia del sistema";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 transition-colors ${isDark ? "text-foreground/40" : "text-primary"}`} />
      <Switch checked={isDark} onCheckedChange={handleSwitch} aria-label={getAriaLabel(theme)} />
      <Moon className={`h-4 w-4 transition-colors ${isDark ? "text-primary" : "text-foreground/40"}`} />
    </div>
  );
};

export default ThemeToggle;
