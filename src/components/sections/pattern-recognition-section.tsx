"use client";

import {
  Cat,
  Dog,
  MessageCircle,
  MoveRight,
  PawPrint,
  Sparkles,
  Triangle,
  Volume2,
} from "lucide-react";
import { useState } from "react";

import { PillToggle } from "@/components/ui/pill-toggle";
import { SectionShell } from "@/components/ui/section-shell";

const features = [
  {
    id: "bigotes",
    label: "Tiene bigotes",
    description: "Una pista muy fuerte para pensar en un gato.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "ladra",
    label: "Ladra",
    description: "Hace pensar que es un perro.",
    icon: <Volume2 className="h-4 w-4" />,
  },
  {
    id: "orejas",
    label: "Tiene orejas puntiagudas",
    description: "Puede aparecer en ambos, así que ayuda pero no decide sola.",
    icon: <Triangle className="h-4 w-4" />,
  },
  {
    id: "maulla",
    label: "Maúlla",
    description: "Otra señal muy típica de un gato.",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "hocico",
    label: "Tiene hocico largo",
    description: "Suma puntos para parecer un perro.",
    icon: <MoveRight className="h-4 w-4" />,
  },
] as const;

type FeatureState = Record<(typeof features)[number]["id"], boolean>;

const emptyState = features.reduce((accumulator, feature) => {
  accumulator[feature.id] = false;
  return accumulator;
}, {} as FeatureState);

export function PatternRecognitionSection() {
  const [activeFeatures, setActiveFeatures] = useState<FeatureState>(emptyState);

  const toggleFeature = (featureId: keyof FeatureState) => {
    setActiveFeatures((current) => ({
      ...current,
      [featureId]: !current[featureId],
    }));
  };

  const selectedCount = Object.values(activeFeatures).filter(Boolean).length;
  const catScore =
    (activeFeatures.bigotes ? 2 : 0) +
    (activeFeatures.maulla ? 3 : 0) +
    (activeFeatures.orejas ? 1 : 0);
  const dogScore =
    (activeFeatures.ladra ? 3 : 0) +
    (activeFeatures.hocico ? 2 : 0) +
    (activeFeatures.orejas ? 1 : 0);

  let verdict = "Activa algunas pistas";
  let explanation =
    "La IA compara señales. Cuando todavía no tiene pistas, no puede decidir.";
  let toneClasses = "border-slate-200 bg-slate-50 text-slate-700";
  let ResultIcon = PawPrint;

  if (selectedCount > 0) {
    if (catScore >= dogScore + 2 && catScore >= 3) {
      verdict = "Parece gato";
      explanation =
        "Hay varias pistas alineadas con la idea de gato. La IA reconoce un patrón.";
      toneClasses = "border-emerald-300/70 bg-emerald-500/[0.12] text-emerald-800";
      ResultIcon = Cat;
    } else if (dogScore >= catScore + 2 && dogScore >= 3) {
      verdict = "Parece perro";
      explanation =
        "Las pistas encajan mejor con un perro, así que la red se inclina por esa clase.";
      toneClasses = "border-sky-300/70 bg-sky-500/[0.12] text-sky-800";
      ResultIcon = Dog;
    } else {
      verdict = "No está claro";
      explanation =
        "Las pistas se mezclan o son pocas. La IA reconoce que todavía no ve un patrón claro.";
      toneClasses = "border-amber-300/70 bg-amber-500/[0.14] text-amber-900";
      ResultIcon = PawPrint;
    }
  }

  const confidence =
    selectedCount === 0
      ? 12
      : verdict === "No está claro"
        ? 48
        : Math.min(96, 54 + Math.abs(catScore - dogScore) * 10 + selectedCount * 6);

  const activeLabels = features
    .filter((feature) => activeFeatures[feature.id])
    .map((feature) => feature.label);

  return (
    <SectionShell
      id="ia-reconoce"
      eyebrow="Sección 1"
      title="IA que reconoce"
      description="Prueba una IA tradicional muy simple. Activa pistas y mira cómo intenta clasificar. Aquí la idea clave es esta: la IA no inventa nada, solo intenta reconocer patrones."
      badge={
        <div className="rounded-[1.5rem] border border-teal-500/20 bg-teal-500/[0.12] px-4 py-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-teal-700 uppercase">
            Idea clave
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold text-slate-900">
            Esta IA no crea nada. Solo intenta reconocer patrones.
          </p>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <PillToggle
              key={feature.id}
              label={feature.label}
              description={feature.description}
              icon={feature.icon}
              active={activeFeatures[feature.id]}
              onClick={() => toggleFeature(feature.id)}
            />
          ))}
        </div>

        <div className="panel-surface rounded-[1.8rem] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Salida simulada
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                ¿Qué patrón reconoció?
              </h3>
            </div>
            <div className={`rounded-2xl border p-3 ${toneClasses}`}>
              <ResultIcon className="h-7 w-7" />
            </div>
          </div>

          <div className={`mt-6 rounded-[1.6rem] border p-5 ${toneClasses}`}>
            <p className="text-sm font-medium uppercase tracking-[0.18em] opacity-80">
              Resultado
            </p>
            <p className="mt-3 text-3xl font-semibold">{verdict}</p>
            <p className="mt-3 max-w-md text-sm leading-6 opacity-90">{explanation}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Seguridad visual</span>
              <span>{confidence}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-linear-to-r from-sky-500 via-teal-500 to-emerald-400 transition-[width] duration-300"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
              Pistas activas
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeLabels.length > 0 ? (
                activeLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {label}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-500">
                  Aún no hay pistas encendidas
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
