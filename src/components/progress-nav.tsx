import { Gauge, RotateCcw } from "lucide-react";

import type { SectionId } from "@/lib/learning-sections";

type ProgressNavProps = {
  sections: Array<{
    id: SectionId;
    shortLabel: string;
    title: string;
  }>;
  activeSection: SectionId;
  progress: number;
  onReset: () => void;
};

export function ProgressNav({
  sections,
  activeSection,
  progress,
  onReset,
}: ProgressNavProps) {
  const activeIndex = sections.findIndex((section) => section.id === activeSection);

  const handleNavigate = (sectionId: SectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8">
      <div className="panel-surface mx-auto max-w-7xl rounded-[1.6rem] p-3 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] sm:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Ruta guiada
                </p>
                <p className="text-sm font-semibold text-slate-900 sm:text-base">
                  Sección activa: {sections[activeIndex]?.title}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Progreso
                </p>
                <p className="text-sm font-semibold text-teal-700">
                  {Math.round(progress)}% completado al recorrer la demo
                </p>
              </div>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar demo
              </button>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
            <div
              className="h-full rounded-full bg-linear-to-r from-sky-500 via-teal-500 to-emerald-400 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {sections.map((section, index) => {
              const isActive = section.id === activeSection;
              const isCompleted = index < activeIndex;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavigate(section.id)}
                  className={[
                    "rounded-2xl border px-3 py-3 text-left transition-all duration-200",
                    isActive
                      ? "border-teal-500/40 bg-teal-500/[0.12] shadow-[0_16px_30px_-24px_rgba(13,148,136,0.9)]"
                      : isCompleted
                        ? "border-sky-200 bg-sky-50/80"
                        : "border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold",
                        isActive
                          ? "bg-slate-950 text-white"
                          : isCompleted
                            ? "bg-sky-500 text-white"
                            : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {section.shortLabel}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {section.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
