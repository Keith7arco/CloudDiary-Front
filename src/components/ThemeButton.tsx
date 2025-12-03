import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:text-blue-700 dark:hover:text-yellow-400 transition"
    >
      {theme === "dark" ? <Sun className="size-5"/> : <Moon className="size-5"/>}
    </button>
  );
}