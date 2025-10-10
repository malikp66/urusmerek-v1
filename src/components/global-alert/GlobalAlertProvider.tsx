"use client";

import * as React from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "success" | "error" | "warning" | "info";

export type ShowAlertOptions = {
  id?: string;
  tone?: AlertTone;
  title: string;
  description?: string;
  duration?: number;
};

type AlertItem = {
  id: string;
  tone: AlertTone;
  title: string;
  description?: string;
  duration: number;
};

type GlobalAlertContextValue = {
  alerts: AlertItem[];
  showAlert: (options: ShowAlertOptions) => string;
  dismissAlert: (id: string) => void;
  clearAlerts: () => void;
};

const DEFAULT_DURATION = 6000;

const GlobalAlertContext = React.createContext<GlobalAlertContextValue | null>(
  null,
);

export function useGlobalAlert() {
  const context = React.useContext(GlobalAlertContext);
  if (!context) {
    throw new Error("useGlobalAlert must be used within GlobalAlertProvider");
  }
  return context;
}

const toneTheme: Record<
  AlertTone,
  {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    container: string;
    iconWrapper: string;
    title: string;
    text: string;
    close: string;
  }
> = {
  error: {
    Icon: AlertOctagon,
    container:
      "border-rose-200/70 shadow-[0_22px_60px_-32px_rgba(225,29,72,0.55)] bg-gradient-to-br from-rose-50 via-[#fff8f8] to-rose-100/70",
    iconWrapper:
      "bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20 shadow-[0_10px_25px_-18px_rgba(225,29,72,0.55)]",
    title: "text-rose-900",
    text: "text-rose-700/90",
    close: "text-rose-400 hover:text-rose-600 hover:bg-rose-50",
  },
  warning: {
    Icon: AlertTriangle,
    container:
      "border-amber-200/70 shadow-[0_22px_60px_-32px_rgba(217,119,6,0.45)] bg-gradient-to-br from-amber-50 via-[#fff9ec] to-amber-100/70",
    iconWrapper:
      "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20 shadow-[0_10px_25px_-18px_rgba(217,119,6,0.45)]",
    title: "text-amber-900",
    text: "text-amber-700/90",
    close: "text-amber-400 hover:text-amber-600 hover:bg-amber-50",
  },
  success: {
    Icon: CheckCircle2,
    container:
      "border-emerald-200/70 shadow-[0_22px_60px_-32px_rgba(16,185,129,0.45)] bg-gradient-to-br from-emerald-50 via-[#f4fffa] to-emerald-100/70",
    iconWrapper:
      "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20 shadow-[0_10px_25px_-18px_rgba(16,185,129,0.45)]",
    title: "text-emerald-900",
    text: "text-emerald-700/90",
    close: "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50",
  },
  info: {
    Icon: Info,
    container:
      "border-sky-200/70 shadow-[0_22px_60px_-32px_rgba(14,165,233,0.45)] bg-gradient-to-br from-sky-50 via-[#f1f8ff] to-sky-100/70",
    iconWrapper:
      "bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/20 shadow-[0_10px_25px_-18px_rgba(14,165,233,0.45)]",
    title: "text-sky-900",
    text: "text-sky-700/90",
    close: "text-sky-400 hover:text-sky-600 hover:bg-sky-50",
  },
};

export function GlobalAlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alerts, setAlerts] = React.useState<AlertItem[]>([]);
  const timeouts = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismissAlert = React.useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    const timeoutId = timeouts.current.get(id);
    if (typeof timeoutId !== "undefined") {
      clearTimeout(timeoutId);
      timeouts.current.delete(id);
    }
  }, []);

  const showAlert = React.useCallback(
    ({
      id: providedId,
      tone = "info",
      title,
      description,
      duration = DEFAULT_DURATION,
    }: ShowAlertOptions) => {
      const id =
        providedId ??
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${tone}-${Date.now()}-${Math.random()}`);

      setAlerts((prev) => {
        const next = prev.filter((item) => item.id !== id);
        next.push({ id, tone, title, description, duration });
        return next;
      });

      if (duration > 0) {
        const timeoutId = setTimeout(() => dismissAlert(id), duration);
        timeouts.current.set(id, timeoutId);
      }

      return id;
    },
    [dismissAlert],
  );

  const clearAlerts = React.useCallback(() => {
    timeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeouts.current.clear();
    setAlerts([]);
  }, []);

  React.useEffect(
    () => () => {
      timeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.current.clear();
    },
    [],
  );

  const value = React.useMemo(
    () => ({ alerts, showAlert, dismissAlert, clearAlerts }),
    [alerts, showAlert, dismissAlert, clearAlerts],
  );

  return (
    <GlobalAlertContext.Provider value={value}>
      {children}
      <GlobalAlertViewport alerts={alerts} onDismiss={dismissAlert} />
    </GlobalAlertContext.Provider>
  );
}

function GlobalAlertViewport({
  alerts,
  onDismiss,
}: {
  alerts: AlertItem[];
  onDismiss: (id: string) => void;
}) {
  if (!alerts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[70] flex flex-col items-center gap-4 px-4 sm:items-end sm:pr-6">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function AlertCard({
  alert,
  onDismiss,
}: {
  alert: AlertItem;
  onDismiss: (id: string) => void;
}) {
  const theme = toneTheme[alert.tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto relative w-full max-w-[420px] overflow-hidden rounded-[28px] border px-6 py-5 shadow-sm ring-1 ring-black/5 transition-transform duration-300 sm:px-7 sm:py-6",
        "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 hover:-translate-y-[1px]",
        theme.container,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_65%)]" />
      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-transform duration-300",
            theme.iconWrapper,
          )}
        >
          <theme.Icon className="h-6 w-6" strokeWidth={2.2} />
        </div>

        <div className="flex-1">
          <p className={cn("text-base font-semibold leading-tight", theme.title)}>
            {alert.title}
          </p>
          {alert.description ? (
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed tracking-normal",
                theme.text,
              )}
            >
              {alert.description}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(alert.id)}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-colors duration-200",
            theme.close,
          )}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
