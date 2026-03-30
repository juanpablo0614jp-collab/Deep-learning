import type { ReactNode } from "react";

type PillToggleProps = {
  label: string;
  description?: string;
  active?: boolean;
  icon?: ReactNode;
  onClick: () => void;
};

export function PillToggle({
  label,
  description,
  active = false,
  icon,
  onClick,
}: PillToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none",
        active
          ? "border-teal-500/40 bg-teal-500/[0.12] shadow-[0_20px_45px_-30px_rgba(13,148,136,0.8)]"
          : "border-slate-200/70 bg-white/75 hover:-translate-y-0.5 hover:border-slate-300/90 hover:bg-white",
      ].join(" ")}
      aria-pressed={active}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
            active
              ? "border-teal-500/30 bg-teal-500/15 text-teal-700"
              : "border-slate-200 bg-slate-50 text-slate-500",
          ].join(" ")}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 sm:text-base">
              {label}
            </span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[0.64rem] font-semibold tracking-[0.2em] uppercase transition-colors",
                active
                  ? "bg-teal-500/15 text-teal-700"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {active ? "activo" : "apagado"}
            </span>
          </div>
          {description ? (
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
