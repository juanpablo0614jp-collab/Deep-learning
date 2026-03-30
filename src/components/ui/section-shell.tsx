import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badge?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  badge,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="panel-surface panel-grid relative rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="soft-orb -left-10 top-12 h-28 w-28 bg-cyan-300/40" />
        <div className="soft-orb right-6 top-6 h-24 w-24 bg-emerald-300/30" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-slate-950 px-3 py-1 text-[0.68rem] font-medium tracking-[0.24em] text-white uppercase">
              {eyebrow}
            </span>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {title}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {description}
              </p>
            </div>
          </div>
          {badge ? <div className="relative">{badge}</div> : null}
        </div>

        <div className="relative mt-8">{children}</div>
      </div>
    </section>
  );
}
