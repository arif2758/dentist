"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function ThemeToggle({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
} = {}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center p-0 opacity-70 border border-transparent ${className || ""}`}
      >
        <Sun className={`h-5 w-5 ${iconClassName || ""}`} />
      </button>
    );
  }

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center p-0 border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] hover:bg-[var(--antd-bg-layout)] text-[var(--antd-text)] transition-all cursor-pointer shadow-xs ${className || ""}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className={`h-5 w-5 text-amber-400 hover:text-amber-300 transition-transform hover:rotate-12 ${iconClassName || ""}`} />
      ) : (
        <Moon className={`h-5 w-5 text-slate-700 dark:text-slate-200 hover:text-slate-900 transition-transform hover:-rotate-12 ${iconClassName || ""}`} />
      )}
    </button>
  );
}
