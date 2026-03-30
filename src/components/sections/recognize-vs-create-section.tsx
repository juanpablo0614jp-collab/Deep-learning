"use client";

import Image from "next/image";
import {
  ArrowRight,
  Cat,
  Dog,
  ImagePlus,
  LoaderCircle,
  Sparkles,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import { startTransition, useEffect, useState } from "react";

import {
  DEMO_IMAGE_USED_STORAGE_KEY,
  DEMO_IMAGE_USER_ID_STORAGE_KEY,
  MAX_IMAGE_GENERATIONS,
} from "@/lib/demo-image-limit";
import { SectionShell } from "@/components/ui/section-shell";

const prompts = [
  {
    id: "astronauta",
    title: "Crea un gato astronauta",
    subtitle: "La red inventa una versión nueva a partir de la idea.",
    accent: "from-fuchsia-500/30 via-sky-500/30 to-cyan-300/40",
    caption: "Gato astronauta",
    mood: "Casco brillante, fondo espacial y pose heroica.",
  },
  {
    id: "musico",
    title: "Crea un perro músico",
    subtitle: "La salida ya no es una etiqueta, sino un contenido nuevo.",
    accent: "from-amber-400/30 via-rose-400/25 to-fuchsia-500/30",
    caption: "Perro músico",
    mood: "Luces de escenario y energía de concierto.",
  },
  {
    id: "robot",
    title: "Crea un robot jardinero",
    subtitle: "La IA mezcla conceptos y produce una escena que no existía.",
    accent: "from-emerald-400/30 via-teal-400/25 to-sky-500/30",
    caption: "Robot jardinero",
    mood: "Macetas futuristas y ambiente amable.",
  },
] as const;

type PromptId = (typeof prompts)[number]["id"];

type GenerateImageResponse = {
  imageDataUrl?: string;
  generationsRemaining?: number;
  userId?: string;
  error?: string;
};

function getSafeUsedCount(value: string | null) {
  const parsedValue = Number(value ?? "0");

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.min(MAX_IMAGE_GENERATIONS, Math.floor(parsedValue));
}

function getCounterLabel(remainingGenerations: number) {
  if (remainingGenerations <= 0) {
    return "Ya usaste tus 2 generaciones";
  }

  if (remainingGenerations === 1) {
    return "Te queda 1 generación";
  }

  return `Te quedan ${remainingGenerations} generaciones`;
}

export function RecognizeVsCreateSection() {
  const [selectedPromptId, setSelectedPromptId] = useState<PromptId>("astronauta");
  const [promptValue, setPromptValue] = useState<string>(prompts[0].title);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string | null>(
    null,
  );
  const [remainingGenerations, setRemainingGenerations] = useState(
    MAX_IMAGE_GENERATIONS,
  );
  const [demoUserId, setDemoUserId] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId =
      window.localStorage.getItem(DEMO_IMAGE_USER_ID_STORAGE_KEY) ??
      crypto.randomUUID();

    window.localStorage.setItem(DEMO_IMAGE_USER_ID_STORAGE_KEY, storedUserId);

    const usedCount = getSafeUsedCount(
      window.localStorage.getItem(DEMO_IMAGE_USED_STORAGE_KEY),
    );

    setDemoUserId(storedUserId);
    setRemainingGenerations(Math.max(0, MAX_IMAGE_GENERATIONS - usedCount));
    setIsHydrated(true);
  }, []);

  const selectedPrompt =
    prompts.find((prompt) => prompt.id === selectedPromptId) ?? prompts[0];

  const persistGenerations = (nextRemainingGenerations: number) => {
    const safeRemaining = Math.max(
      0,
      Math.min(MAX_IMAGE_GENERATIONS, nextRemainingGenerations),
    );

    setRemainingGenerations(safeRemaining);
    window.localStorage.setItem(
      DEMO_IMAGE_USED_STORAGE_KEY,
      String(MAX_IMAGE_GENERATIONS - safeRemaining),
    );
  };

  const handlePromptSelection = (promptId: PromptId) => {
    const prompt = prompts.find((item) => item.id === promptId) ?? prompts[0];

    startTransition(() => {
      setSelectedPromptId(promptId);
      setPromptValue(prompt.title);
      setErrorMessage(null);
    });
  };

  const handleGenerateImage = async () => {
    const trimmedPrompt = promptValue.trim();

    if (!trimmedPrompt) {
      setErrorMessage("Escribe una idea antes de generar la imagen.");
      return;
    }

    if (!isHydrated || !demoUserId) {
      setErrorMessage("La demo aún se está preparando. Intenta de nuevo.");
      return;
    }

    if (remainingGenerations <= 0) {
      setErrorMessage("Ya alcanzaste el límite de 2 imágenes para esta demo.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-demo-user-id": demoUserId,
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
        }),
      });

      let data: GenerateImageResponse | undefined;

      try {
        data = (await response.json()) as GenerateImageResponse;
      } catch {
        data = undefined;
      }

      if (!response.ok) {
        if (typeof data?.generationsRemaining === "number") {
          persistGenerations(data.generationsRemaining);
        }

        setErrorMessage(
          typeof data?.error === "string"
            ? data.error
            : "No se pudo generar la imagen. Intenta de nuevo.",
        );
        return;
      }

      if (!data?.imageDataUrl) {
        setErrorMessage("No se pudo generar la imagen. Intenta de nuevo.");
        return;
      }

      if (typeof data.userId === "string" && data.userId) {
        window.localStorage.setItem(DEMO_IMAGE_USER_ID_STORAGE_KEY, data.userId);
        setDemoUserId(data.userId);
      }

      if (typeof data.generationsRemaining === "number") {
        persistGenerations(data.generationsRemaining);
      } else {
        persistGenerations(remainingGenerations - 1);
      }

      setGeneratedImage(data.imageDataUrl);
      setLastGeneratedPrompt(trimmedPrompt);
    } catch {
      setErrorMessage("No se pudo generar la imagen. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const counterLabel = isHydrated
    ? getCounterLabel(remainingGenerations)
    : "Preparando demo...";

  const counterClasses =
    remainingGenerations <= 0
      ? "border-amber-400/30 bg-amber-500/15 text-amber-100"
      : "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";

  const isGenerateDisabled =
    !isHydrated ||
    isGenerating ||
    remainingGenerations <= 0 ||
    promptValue.trim().length === 0;

  return (
    <SectionShell
      id="reconocer-vs-crear"
      eyebrow="Sección 4"
      title="Reconocer vs crear"
      description="Aquí está la gran diferencia. Una IA tradicional recibe datos y responde con una clasificación. Una IA generativa recibe una instrucción y produce contenido nuevo."
      badge={
        <div className="rounded-[1.5rem] border border-fuchsia-500/20 bg-fuchsia-500/[0.1] px-4 py-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-fuchsia-700 uppercase">
            Comparación clave
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold text-slate-900">
            Tradicional = reconoce. Generativa = crea.
          </p>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel-surface rounded-[1.8rem] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Cat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                IA tradicional
              </p>
              <h3 className="text-2xl font-semibold text-slate-950">
                Recibe datos y clasifica
              </h3>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-slate-200/80 bg-slate-50/80 p-5">
            <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
              Entrada
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Bigotes", "Maúlla", "Orejas puntiagudas"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 text-slate-400">
              <ArrowRight className="h-4 w-4" />
              <ArrowRight className="h-4 w-4" />
              <ArrowRight className="h-4 w-4" />
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-emerald-300/70 bg-emerald-500/[0.12] p-4 text-emerald-900">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] uppercase opacity-80">
                Salida
              </p>
              <p className="mt-3 text-2xl font-semibold">Esto es un gato</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            La IA tradicional mira señales, compara patrones y devuelve una
            etiqueta o decisión.
          </p>
        </div>

        <div className="panel-surface rounded-[1.8rem] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <WandSparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                IA generativa
              </p>
              <h3 className="text-2xl font-semibold text-slate-950">
                Recibe una idea y crea algo nuevo
              </h3>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {prompts.map((prompt) => {
              const isActive = prompt.id === selectedPromptId;

              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => handlePromptSelection(prompt.id)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                    isActive
                      ? "border-fuchsia-500/40 bg-fuchsia-500/[0.12] text-fuchsia-800"
                      : "border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-white",
                  ].join(" ")}
                >
                  {prompt.title}
                </button>
              );
            })}
          </div>

          <div
            className={`mt-6 overflow-hidden rounded-[1.8rem] border border-white/50 bg-linear-to-br ${selectedPrompt.accent} p-5`}
          >
            <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-700 uppercase">
              Prompt
            </p>
            <textarea
              value={promptValue}
              onChange={(event) => {
                setPromptValue(event.target.value);
                setErrorMessage(null);
              }}
              rows={3}
              className="mt-3 w-full rounded-[1.3rem] border border-white/60 bg-white/75 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-500/40 focus:bg-white"
              placeholder="Describe la imagen que quieres crear..."
            />
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-700">
              {selectedPrompt.subtitle}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${counterClasses}`}
              >
                {counterLabel}
              </div>

              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGenerateDisabled}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
                  isGenerateDisabled
                    ? "cursor-not-allowed bg-slate-300 text-slate-500"
                    : "bg-slate-950 text-white hover:bg-slate-800",
                ].join(" ")}
              >
                {isGenerating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {isGenerating ? "Generando..." : "Generar imagen"}
              </button>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-white/60 bg-slate-950/82 p-6 text-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.85)]">
              <div className="relative mx-auto flex h-64 max-w-sm items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-950">
                {generatedImage ? (
                  <Image
                    src={generatedImage}
                    alt={
                      lastGeneratedPrompt
                        ? `Imagen generada para: ${lastGeneratedPrompt}`
                        : "Imagen generada por la IA"
                    }
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 24rem, (min-width: 768px) 28rem, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div className="soft-orb left-6 top-8 h-20 w-20 bg-fuchsia-400/45" />
                    <div className="soft-orb bottom-8 right-8 h-24 w-24 bg-cyan-400/35" />
                    <div className="relative flex flex-col items-center gap-4 px-6 text-center">
                      <div className="float-gentle flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10">
                        {selectedPromptId === "astronauta" ? (
                          <Cat className="h-12 w-12" />
                        ) : selectedPromptId === "musico" ? (
                          <Dog className="h-12 w-12" />
                        ) : (
                          <Sparkles className="h-12 w-12" />
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-semibold">
                          Aún no hay imagen generada
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {selectedPrompt.mood}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/72 px-6 text-center">
                    <LoaderCircle className="h-8 w-8 animate-spin text-white" />
                    <p className="mt-4 text-base font-semibold text-white">
                      Generando imagen...
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      La IA generativa está creando contenido nuevo a partir del
                      prompt.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-300 uppercase">
                  Salida
                </p>
                <p className="mt-3 text-lg font-semibold">
                  {generatedImage
                    ? "Imagen real generada"
                    : "La IA generativa está lista para crear"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {lastGeneratedPrompt
                    ? `Última generación: ${lastGeneratedPrompt}`
                    : "Aquí aparecerá una imagen nueva creada a partir de tu instrucción."}
                </p>
              </div>

              {errorMessage ? (
                <div className="mt-4 rounded-[1.2rem] border border-amber-400/30 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            La IA generativa no se limita a decir “qué es”. Usa una instrucción y
            produce una nueva imagen.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
