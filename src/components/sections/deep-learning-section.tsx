"use client";

import {
  CircleGauge,
  Layers3,
  Play,
  Route,
  SlidersHorizontal,
} from "lucide-react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";

import { NetworkDiagram } from "@/components/network-diagram";
import { SectionShell } from "@/components/ui/section-shell";

type CaseId = "facil" | "detalles" | "confuso";

const caseOptions = {
  facil: {
    title: "Caso fácil",
    description: "El patrón es obvio y se distingue rápido.",
    signals: ["Pista fuerte", "Forma clara", "Pocas dudas"],
  },
  detalles: {
    title: "Caso con detalles",
    description: "Hay varios rasgos y conviene mirar por partes.",
    signals: ["Rasgos finos", "Varias pistas", "Comparación"],
  },
  confuso: {
    title: "Caso confuso",
    description: "Hay señales mezcladas y hace falta más contexto.",
    signals: ["Pistas cruzadas", "Señales opuestas", "Más contexto"],
  },
} as const;

const stageLibrary = [
  {
    label: "Capa 1",
    title: "Mira rasgos básicos",
    description:
      "La red detecta señales muy simples. Es una primera mirada rápida.",
  },
  {
    label: "Capa 2",
    title: "Combina pistas",
    description:
      "Ahora junta varias señales para formar una idea más clara.",
  },
  {
    label: "Capa 3",
    title: "Reconoce partes importantes",
    description:
      "Empieza a notar grupos de rasgos que suelen aparecer juntos.",
  },
  {
    label: "Capa 4",
    title: "Entiende mejor el contexto",
    description:
      "Relaciona lo que ya vio para interpretar el caso con más cuidado.",
  },
  {
    label: "Capa 5",
    title: "Refina la decisión",
    description:
      "Se queda con las pistas más útiles antes de llegar a la salida.",
  },
] as const;

export function DeepLearningSection() {
  const [hiddenLayers, setHiddenLayers] = useState(3);
  const deferredHiddenLayers = useDeferredValue(hiddenLayers);
  const [selectedCaseId, setSelectedCaseId] = useState<CaseId>("detalles");
  const [focusStageIndex, setFocusStageIndex] = useState(1);
  const [isTourPlaying, setIsTourPlaying] = useState(false);

  const deepLayers = [
    3,
    ...Array.from({ length: deferredHiddenLayers }, (_, index) =>
      index % 2 === 0 ? 4 : 3,
    ),
    2,
  ];

  const stageCards = [
    {
      label: "Entrada",
      title: "Llegan las pistas",
      description:
        "La red recibe información inicial. Todavía no decide, solo observa.",
    },
    ...stageLibrary.slice(0, deferredHiddenLayers),
    {
      label: "Salida",
      title: "Toma una decisión",
      description:
        "Después de pasar por varias capas, la red responde con una clasificación.",
    },
  ];

  useEffect(() => {
    if (!isTourPlaying) {
      return;
    }

    let currentIndex = 0;

    const interval = window.setInterval(() => {
      currentIndex += 1;

      if (currentIndex >= stageCards.length) {
        window.clearInterval(interval);
        setIsTourPlaying(false);
        return;
      }

      setFocusStageIndex(currentIndex);
    }, 850);

    return () => window.clearInterval(interval);
  }, [isTourPlaying, stageCards.length]);

  const selectedCase = caseOptions[selectedCaseId];
  const visibleFocusStageIndex = Math.min(
    focusStageIndex,
    stageCards.length - 1,
  );
  const focusStage = stageCards[visibleFocusStageIndex] ?? stageCards[0];

  const depthLevelLabel =
    hiddenLayers <= 2
      ? "Profundidad corta"
      : hiddenLayers === 3
        ? "Profundidad media"
        : "Profundidad alta";

  const depthMessage =
    hiddenLayers <= 2
      ? "La red todavía tiene pocas etapas. Ve lo esencial, pero no entra tanto en detalles."
      : hiddenLayers === 3
        ? "La red ya puede dividir mejor el problema en varios pasos."
        : "La red tiene varias etapas para revisar detalles y relaciones con más calma.";

  const simpleOutcome =
    selectedCaseId === "facil"
      ? "La red simple suele alcanzar porque el patrón ya es bastante evidente."
      : selectedCaseId === "detalles"
        ? "La red simple ve lo general, pero puede perder matices importantes."
        : "La red simple se queda corta cuando las señales se mezclan.";

  const deepOutcome =
    selectedCaseId === "facil"
      ? hiddenLayers <= 2
        ? "También lo resuelve bien, aunque aquí no necesita tanta profundidad."
        : "Tiene profundidad de sobra para un caso fácil."
      : selectedCaseId === "detalles"
        ? hiddenLayers <= 2
          ? "Ayuda un poco, pero aún analiza el caso en pocas etapas."
          : "La red profunda separa mejor los detalles y gana claridad."
        : hiddenLayers <= 2
          ? "Todavía puede costarle porque tiene pocas etapas intermedias."
          : "La profundidad le permite revisar señales cruzadas paso a paso.";

  return (
    <SectionShell
      id="que-es-deep-learning"
      eyebrow="Sección 3"
      title="¿Qué es deep learning?"
      description="Aquí la idea se descubre jugando: cuando una red tiene más capas, puede mirar el problema por etapas. Eso es deep learning de forma muy simple."
      badge={
        <div className="rounded-[1.5rem] border border-indigo-500/20 bg-indigo-500/[0.1] px-4 py-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-indigo-700 uppercase">
            Idea clave
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold text-slate-900">
            Deep learning significa usar muchas capas para analizar por etapas.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Control de profundidad
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Mueve el control y mira cómo aparecen más capas. Cada capa
                    agrega una etapa de análisis.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                      Capas intermedias
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      {hiddenLayers}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.1] p-3 text-teal-700">
                    <SlidersHorizontal className="h-6 w-6" />
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={hiddenLayers}
                  onChange={(event) =>
                    startTransition(() => {
                      setHiddenLayers(Number(event.target.value));
                    })
                  }
                  className="range-slider mt-6 w-full"
                  aria-label="Número de capas intermedias"
                />

                <div className="mt-4 flex items-center justify-between text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                  <span>Más simple</span>
                  <span>Más profundo</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <CircleGauge className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Elige qué tan difícil es el caso
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Así se nota mejor cuándo una red simple alcanza y cuándo una
                    red profunda ayuda más.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(Object.entries(caseOptions) as Array<
                  [CaseId, (typeof caseOptions)[CaseId]]
                >).map(([key, option]) => {
                  const isActive = key === selectedCaseId;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        startTransition(() => {
                          setSelectedCaseId(key);
                        })
                      }
                      className={[
                        "rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-white",
                      ].join(" ")}
                    >
                      <p className="text-sm font-semibold">{option.title}</p>
                      <p
                        className={[
                          "mt-2 text-sm leading-6",
                          isActive ? "text-slate-200" : "text-slate-500",
                        ].join(" ")}
                      >
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Caso actual
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCase.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Route className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Descúbrelo por etapas
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Pulsa una etapa o reproduce el recorrido. Así se entiende que
                    una red profunda no ve todo de golpe: lo va procesando paso a
                    paso.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFocusStageIndex(0);
                  setIsTourPlaying(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Play className="h-4 w-4" />
                Recorrer capas
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stageCards.map((stage, index) => {
                const isActive = index === visibleFocusStageIndex;

                return (
                  <button
                    key={`${stage.label}-${index}`}
                    type="button"
                    onClick={() =>
                      startTransition(() => {
                        setFocusStageIndex(index);
                        setIsTourPlaying(false);
                      })
                    }
                    className={[
                      "rounded-[1.3rem] border px-4 py-4 text-left transition-all",
                      isActive
                        ? "border-teal-500/40 bg-teal-500/[0.12]"
                        : "border-slate-200/80 bg-slate-50/80 hover:border-slate-300 hover:bg-white",
                    ].join(" ")}
                  >
                    <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                      {stage.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {stage.title}
                    </p>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-5 rounded-[1.6rem] border border-indigo-500/20 bg-indigo-500/[0.1] p-5"
              aria-live="polite"
            >
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-indigo-700 uppercase">
                Etapa activa
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                {focusStage.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
                {focusStage.description}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Ahora mismo tu red profunda tiene {deferredHiddenLayers} capas
                intermedias, así que analiza el caso en {stageCards.length} etapas
                visibles contando entrada y salida.
              </p>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-950">
                {depthLevelLabel}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {depthMessage}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-4">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Red simple
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Pocas capas, pocas etapas
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tiene una mirada más corta. Puede servir en casos sencillos, pero
                ve menos detalles por el camino.
              </p>
            </div>

            <NetworkDiagram
              layers={[3, 3, 2]}
              labels={["Entrada", "Una capa", "Salida"]}
              activeLayerIndex={1}
            />

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-950">
                ¿Qué pasa con el caso actual?
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {simpleOutcome}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-teal-500/20 bg-teal-500/[0.1] p-4">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-teal-700 uppercase">
                Red profunda
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Más capas, más pasos para mirar detalles
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La profundidad permite revisar el problema por etapas antes de dar
                una salida.
              </p>
            </div>

            <NetworkDiagram
              layers={deepLayers}
              labels={stageCards.map((stage) => stage.label)}
              activeLayerIndex={visibleFocusStageIndex}
              animate={isTourPlaying}
            />

            <div className="rounded-[1.5rem] border border-teal-500/20 bg-teal-500/[0.1] p-4">
              <p className="text-sm font-semibold text-slate-950">
                ¿Qué pasa con el caso actual?
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {deepOutcome}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-slate-200/80 bg-slate-950 px-5 py-4 text-white sm:px-6">
          <p className="text-sm leading-7 text-slate-200 sm:text-base">
            La idea importante no es matemática: deep learning significa usar
            muchas capas. Eso le da a la red más etapas para revisar el problema.
            Una red simple ve menos detalles. Una red profunda puede analizar más
            antes de decidir.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
