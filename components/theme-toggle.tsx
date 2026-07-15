"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "vouch-theme";

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const META: Record<ThemeChoice, { icon: typeof Sun; label: string }> = {
  system: { icon: Monitor, label: "Matching your system" },
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
};

// A tiny local pub/sub: writing localStorage in the same tab doesn't fire the
// native "storage" event there, so useSyncExternalStore needs its own signal
// to know the snapshot changed right after applyTheme() runs.
const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function emitChange() {
  for (const listener of listeners) listener();
}

function getSnapshot(): ThemeChoice {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function getServerSnapshot(): ThemeChoice {
  return "system";
}

function applyTheme(theme: ThemeChoice) {
  document.documentElement.classList.remove("light", "dark");
  if (theme === "system") {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    document.documentElement.classList.add(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
  emitChange();
}

/**
 * Cycles system -> light -> dark -> system. The icon always reflects the
 * saved choice, not the resolved color scheme, so "system" reliably shows
 * the monitor glyph even when the OS happens to be in dark mode.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { icon: Icon, label } = META[theme];

  return (
    <button
      type="button"
      onClick={() => applyTheme(NEXT[theme])}
      aria-label={`Theme: ${label}. Tap to change.`}
      title={label}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-sm border border-line bg-transparent text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
