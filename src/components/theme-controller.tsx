"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

// Detect client mount without triggering a synchronous setState in an effect
// (avoids the react-hooks/set-state-in-effect lint rule + hydration mismatch).
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

export default function ThemeController() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Avoid hydration mismatch — render a stable placeholder until mounted.
  if (!mounted) {
    return (
      <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
        {OPTIONS.map((o) => (
          <span
            key={o.value}
            className="flex h-7 w-7 items-center justify-center text-slate-400"
          >
            <o.icon className="h-3.5 w-3.5" />
          </span>
        ))}
      </div>
    );
  }

  const current = theme ?? "system";

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900"
      role="group"
      aria-label="Theme selector"
    >
      {OPTIONS.map((o) => {
        const active = current === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            aria-label={`${o.label} theme`}
            aria-pressed={active}
            title={`${o.label} mode`}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            )}
          >
            <o.icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
