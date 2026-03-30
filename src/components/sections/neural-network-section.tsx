"use client";

import {
  ArrowRight,
  BrainCircuit,
  CircleDot,
  Layers3,
  Play,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { NetworkDiagram } from "@/components/network-diagram";
import { SectionShell } from "@/components/ui/section-shell";

type ViewMode = "single" | "network" | "mlp";
type FocusStep = "entrada" | "centro" | "salida";
type ScenarioId = "gato" | "perro" | "mezcla";

const viewOptions = {
  single: {
    title: "Vista 1: una neurona",
    description: "Mira pocas señales y toma una decisión simple.",
    layers: [3, 1, 1],
    labels: ["Entradas", "Neurona", "Salida"],
    icon: CircleDot,
    summary:
      "Una neurona sola puede separar casos muy básicos, pero se queda corta cuando el patrón se complica.",
    centerTitle: "Una sola neurona decide",
    centerText:
      "Aquí todo pasa por un único punto de decisión. Sirve para algo simple, pero tiene poco margen para matices.",
  },
  network: {
    title: "Vista 2: pequeña red",
    description: "Varias neuronas colaboran y comparan más pistas.",
    layers: [3, 4, 2],
    labels: ["Entradas", "Capa oculta", "Salida"],
    icon: Share2,
    summary:
      "Cuando varias neuronas trabajan juntas, la red puede combinar mejor las señales y reconocer patrones más ricos.",
    centerTitle: "Las neuronas colaboran",
    centerText:
      "La capa oculta mezcla las pistas, compara posibilidades y ayuda a que la salida sea más clara.",
  },
  mlp: {
    title: "Vista 3: perceptrón multicapa",
    description: "Una red con varias neuronas y varias capas.",
    layers: [3, 4, 3, 2],
    labels: ["Entradas", "Capa 1", "Capa 2", "Salida"],
    icon: Layers3,
    summary:
      "Un perceptrón multicapa es una red donde las señales pasan por varias neuronas y capas antes de llegar a la salida.",
    centerTitle: "Aquí aparece el perceptrón multicapa",
    centerText:
      "No es magia: son varias neuronas organizadas por capas para mirar el problema por pasos.",
  },
} as const;

const scenarios = {
  gato: {
    title: "Caso gato",
    description: "Las señales apuntan claramente a un patrón felino.",
    inputs: ["Bigotes", "Maúlla", "Orejas puntiagudas"],
    hidden: ["Combina forma", "Compara sonido", "Refuerza patrón felino"],
    outputs: {
      single: "Parece gato",
      network: "Parece gato",
      mlp: "Patrón de gato muy claro",
    },
    tone: "emerald",
  },
  perro: {
    title: "Caso perro",
    description: "Las señales empujan la decisión hacia perro.",
    inputs: ["Ladra", "Hocico largo", "Orejas puntiagudas"],
    hidden: ["Reconoce hocico", "Compara sonido", "Refuerza patrón canino"],
    outputs: {
      single: "Parece perro",
      network: "Parece perro",
      mlp: "Patrón de perro muy claro",
    },
    tone: "sky",
  },
  mezcla: {
    title: "Caso confuso",
    description: "Hay señales mezcladas y la red necesita compararlas.",
    inputs: ["Bigotes", "Ladra", "Orejas puntiagudas"],
    hidden: ["Detecta señales cruzadas", "Pesa pistas opuestas", "Busca contexto"],
    outputs: {
      single: "Se confunde",
      network: "No está claro",
      mlp: "Detecta mezcla de patrones",
    },
    tone: "amber",
  },
} as const;

const focusCards = {
  entrada: {
    title: "1. Entradas",
    description: "La red recibe pistas o características.",
  },
  centro: {
    title: "2. Centro de decisión",
    description: "Las neuronas internas comparan y combinan señales.",
  },
  salida: {
    title: "3. Salida",
    description: "La red devuelve una clasificación o decisión.",
  },
} as const;

export function NeuralNetworkSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("network");
  const [focusStep, setFocusStep] = useState<FocusStep>("centro");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("mezcla");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    const timeout = window.setTimeout(() => setIsAnimating(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [isAnimating]);

  const selectedView = viewOptions[viewMode];
  const selectedScenario = scenarios[scenarioId];

  const activeLayerIndex =
    focusStep === "entrada"
      ? 0
      : focusStep === "salida"
        ? selectedView.layers.length - 1
        : 1;

  const outputToneClasses =
    selectedScenario.tone === "emerald"
      ? "border-emerald-300/70 bg-emerald-500/[0.12] text-emerald-900"
      : selectedScenario.tone === "sky"
        ? "border-sky-300/70 bg-sky-500/[0.12] text-sky-900"
        : "border-amber-300/70 bg-amber-500/[0.14] text-amber-900";

  return (
    <SectionShell
      id="de-una-neurona-a-una-red"
      eyebrow="Sección 2"
      title="De una neurona a una red"
      description="Aquí vemos el salto importante: una neurona sola decide algo simple; varias neuronas conectadas forman una red. Y cuando esa red tiene varias capas, hablamos de un perceptrón multicapa."
      badge={
        <div className="rounded-[1.5rem] border border-sky-500/20 bg-sky-500/[0.1] px-4 py-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-sky-700 uppercase">
            Idea clave
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold text-slate-900">
            Perceptrón multicapa = varias neuronas organizadas en capas.
          </p>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-3">
            {(Object.entries(viewOptions) as Array<[ViewMode, (typeof viewOptions)[ViewMode]]>).map(
              ([key, option]) => {
                const Icon = option.icon;
                const isActive = key === viewMode;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setViewMode(key)}
                    className={[
                      "rounded-[1.5rem] border p-5 text-left transition-all",
                      isActive
                        ? "border-teal-500/40 bg-teal-500/[0.12]"
                        : "border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5 text-teal-700" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">
                      {option.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {option.description}
                    </p>
                  </button>
                );
              },
            )}
          </div>

          <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Elige un caso para mirar la red por dentro
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Usa un ejemplo guiado y luego enfoca una parte del recorrido:
                  entradas, capas internas o salida.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(Object.entries(scenarios) as Array<
                [ScenarioId, (typeof scenarios)[ScenarioId]]
              >).map(([key, scenario]) => {
                const isActive = key === scenarioId;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScenarioId(key)}
                    className={[
                      "rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                      isActive
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-white",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold">{scenario.title}</p>
                    <p
                      className={[
                        "mt-2 text-sm leading-6",
                        isActive ? "text-slate-200" : "text-slate-500",
                      ].join(" ")}
                    >
                      {scenario.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(Object.entries(focusCards) as Array<
                [FocusStep, (typeof focusCards)[FocusStep]]
              >).map(([key, item]) => {
                const isActive = key === focusStep;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFocusStep(key)}
                    className={[
                      "rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                      isActive
                        ? "border-sky-500/40 bg-sky-500/[0.12]"
                        : "border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Lo importante en esta vista
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">
                {focusStep === "entrada"
                  ? "Las entradas son las pistas que recibe la red."
                  : focusStep === "centro"
                    ? selectedView.centerTitle
                    : "La salida es la decisión final de la red."}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {focusStep === "entrada"
                  ? "En una clase podrías decir: estas señales llegan a la red y le dan información sobre el caso."
                  : focusStep === "centro"
                    ? selectedView.centerText
                    : "Después de comparar señales, la red produce una etiqueta o una respuesta sencilla."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <NetworkDiagram
            layers={selectedView.layers}
            labels={selectedView.labels}
            animate={isAnimating}
            activeLayerIndex={activeLayerIndex}
            className="min-h-[22rem]"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsAnimating(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Play className="h-4 w-4" />
              Ver cómo piensa la red
            </button>
            <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600">
              {selectedView.summary}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Recorrido del caso
              </p>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-950">Entrada</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedScenario.inputs.map((input) => (
                    <span
                      key={input}
                      className="rounded-full bg-slate-950 px-3 py-2 text-sm font-medium text-white"
                    >
                      {input}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 text-slate-400">
                <ArrowRight className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-950">
                  ¿Qué ocurre dentro?
                </p>
                <div className="mt-3 grid gap-2">
                  {selectedScenario.hidden.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Salida
              </p>
              <div className={`mt-4 rounded-[1.5rem] border p-5 ${outputToneClasses}`}>
                <p className="text-sm font-medium uppercase tracking-[0.18em] opacity-80">
                  Resultado con esta vista
                </p>
                <p className="mt-3 text-2xl font-semibold">
                  {selectedScenario.outputs[viewMode]}
                </p>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  ¿Qué cambia al pasar de una neurona a una red?
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Con una neurona hay una sola decisión. Con varias neuronas y
                  capas, la red puede comparar mejor las pistas antes de responder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
