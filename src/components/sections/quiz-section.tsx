"use client";

import { BrainCircuit, CheckCircle2, CircleAlert, CircleHelp } from "lucide-react";
import { useState } from "react";

import { SectionShell } from "@/components/ui/section-shell";

const questions = [
  {
    id: "clasifica",
    question: "¿Cuál IA clasifica?",
    options: [
      { id: "tradicional", label: "La IA tradicional" },
      { id: "generativa", label: "La IA generativa" },
      { id: "ambas", label: "Las dos hacen lo mismo" },
    ],
    correct: "tradicional",
    success: "Correcto. La IA tradicional reconoce y clasifica patrones.",
    error: "Intenta otra vez. Piensa en la IA que devuelve una etiqueta.",
  },
  {
    id: "crea",
    question: "¿Cuál IA crea contenido nuevo?",
    options: [
      { id: "tradicional", label: "La IA tradicional" },
      { id: "generativa", label: "La IA generativa" },
      { id: "ninguna", label: "Ninguna" },
    ],
    correct: "generativa",
    success:
      "Correcto. La IA generativa produce imágenes, texto u otros contenidos nuevos.",
    error:
      "Intenta otra vez. Busca la IA que responde a un prompt creando algo.",
  },
  {
    id: "deep-learning",
    question: "¿Qué significa deep learning?",
    options: [
      { id: "muchos-datos", label: "Solo tener muchos datos" },
      { id: "muchas-capas", label: "Usar muchas capas" },
      { id: "muchas-preguntas", label: "Hacer muchas preguntas" },
    ],
    correct: "muchas-capas",
    success: "Correcto. Deep learning significa trabajar con redes de muchas capas.",
    error: "Intenta otra vez. La pista principal está en la cantidad de capas.",
  },
] as const;

export function QuizSection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const correctCount = questions.filter(
    (question) => answers[question.id] === question.correct,
  ).length;

  return (
    <SectionShell
      id="mini-quiz"
      eyebrow="Sección 5"
      title="Mini quiz final"
      description="Tres preguntas rápidas para comprobar si las ideas esenciales quedaron claras. La idea es reforzar, no complicar."
      badge={
        <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/[0.1] px-4 py-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-emerald-700 uppercase">
            Meta
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold text-slate-900">
            Salir de la demo con las ideas básicas bien diferenciadas.
          </p>
        </div>
      }
    >
      <div className="grid gap-4">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correct;
          const hasAnswer = Boolean(selected);

          return (
            <article
              key={question.id}
              className="rounded-[1.7rem] border border-slate-200/80 bg-white/75 p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                    Pregunta {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">
                    {question.question}
                  </h3>
                </div>
                <div
                  className={[
                    "rounded-2xl border p-3",
                    hasAnswer
                      ? isCorrect
                        ? "border-emerald-300/70 bg-emerald-500/[0.12] text-emerald-800"
                        : "border-amber-300/70 bg-amber-500/[0.14] text-amber-900"
                      : "border-slate-200/80 bg-slate-50 text-slate-500",
                  ].join(" ")}
                >
                  {hasAnswer ? (
                    isCorrect ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <CircleAlert className="h-6 w-6" />
                    )
                  ) : (
                    <CircleHelp className="h-6 w-6" />
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option.id,
                        }))
                      }
                      className={[
                        "rounded-[1.4rem] border px-4 py-4 text-left text-sm font-medium transition-all",
                        isSelected
                          ? isCorrect
                            ? "border-emerald-400/70 bg-emerald-500/[0.12] text-emerald-900"
                            : "border-amber-400/70 bg-amber-500/[0.14] text-amber-900"
                          : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-white",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <p
                className={[
                  "mt-4 text-sm leading-6",
                  hasAnswer
                    ? isCorrect
                      ? "text-emerald-800"
                      : "text-amber-900"
                    : "text-slate-500",
                ].join(" ")}
              >
                {hasAnswer
                  ? isCorrect
                    ? question.success
                    : question.error
                  : "Selecciona una opción para comprobar tu idea."}
              </p>
            </article>
          );
        })}

        <div className="rounded-[1.8rem] border border-slate-200/80 bg-slate-950 p-6 text-white">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-300 uppercase">
                Resultado rápido
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {correctCount} de {questions.length} correctas
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {correctCount === questions.length
                  ? "Muy bien. Ya distingues qué reconoce una red tradicional, qué crea una red generativa y por qué deep learning significa muchas capas."
                  : "Todavía puedes reforzar alguna idea. Revisa las secciones y vuelve a intentar las preguntas."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
