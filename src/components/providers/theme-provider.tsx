"use client";

import * as React from "react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: string;
  storageKey?: string;
  disableTransitionOnChange?: boolean;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme | undefined;
  systemTheme: ResolvedTheme | undefined;
}

const DEFAULT_STORAGE_KEY = "theme";

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw === "light" || raw === "dark" || raw === "system" ? raw : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function applyTheme(theme: Theme, storageKey: string, enableSystem: boolean) {
  const root = document.documentElement;
  const resolved = theme === "system" && enableSystem ? getSystemTheme() : (theme as ResolvedTheme);
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // storage unavailable (private mode, blocked cookies, etc.)
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = DEFAULT_STORAGE_KEY,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme(storageKey, defaultTheme));
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme | undefined>(() =>
    typeof window === "undefined" ? undefined : getSystemTheme()
  );
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setSystemTheme(getSystemTheme());
      if (themeRef.current === "system") applyTheme("system", storageKey, enableSystem);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [storageKey, enableSystem]);

  const changeTheme = useCallback(
    (next: Theme) => {
      if (!enableSystem && next === "system") return;
      if (disableTransitionOnChange) {
        const el = document.createElement("style");
        el.textContent = "*{transition:none !important}";
        document.head.appendChild(el);
        window.setTimeout(() => el.remove(), 0);
      }
      setTheme(next);
      applyTheme(next, storageKey, enableSystem);
    },
    [enableSystem, storageKey, disableTransitionOnChange]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: changeTheme,
      resolvedTheme: theme === "system" ? systemTheme : theme,
      systemTheme,
    }),
    [theme, systemTheme, changeTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
