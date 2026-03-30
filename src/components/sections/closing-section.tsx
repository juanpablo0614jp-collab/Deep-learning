import {
  BrainCircuit,
  CheckCircle2,
  Layers3,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { SectionShell } from "@/components/ui/section-shell";

const takeaways = [
  {
    title: "Una IA puede reconocer patrones",
    icon: BrainCircuit,
  },
  {
    title: "Una red neuronal aprende a decidir o clasificar",
    icon: CheckCircle2,
  },
  {
    title: "Un perceptrón multicapa tiene varias neuronas y capas",
    icon: Layers3,
  },
  {
    title: "Deep learning significa usar muchas capas",
    icon: Sparkles,
  },
  {
    title: "Una red generativa crea contenido nuevo",
    icon: WandSparkles,
  },
] as const;

type ClosingSectionProps = {
  onReset: () => void;
};

export function ClosingSection({ onReset }: ClosingSectionProps) {
  return (
    <SectionShell
      id="cierre"
      eyebrow="Sección 6"
      title="Tú ya entendiste que..."
      description="Con estas ideas ya puedes explicar la diferencia entre una red que reconoce y una red que crea. Ese es el objetivo de esta demo."
      badge={
        <div className="rounded-[1.5rem] border border-slate-900/10 bg-slate-900/[0.06] px-4 py-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-700 uppercase">
            Cierre
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold text-slate-900">
            Ya tienes una base visual y simple para seguir aprendiendo.
          </p>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {takeaways.map((takeaway) => {
            const Icon = takeaway.icon;

            return (
              <div
                key={takeaway.title}
                className="rounded-[1.6rem] border border-slate-200/80 bg-white/75 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-lg font-semibold leading-8 text-slate-950">
                  {takeaway.title}
                </p>
              </div>
            );
          })}
        </div>

        <div className="panel-surface rounded-[1.8rem] p-6">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Para clase en vivo
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            Usa la demo, conversa y vuelve a empezar
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            La app está pensada para explicar de forma visual, repetir ejemplos y
            comparar ideas sin entrar en matemáticas. Puedes reiniciarla y usarla
            otra vez en clase.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Reiniciar demo
          </button>
        </div>
      </div>
    </SectionShell>
  );
}
