"use client";

import {
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { SectionShell } from "@/components/ui/section-shell";

const questions = [
  {
    id: "clasifica",
    category: "Idea básica",
    question: "¿Cuál IA clasifica?",
    hint: "Busca la IA que devuelve una etiqueta o decisión.",
    options: [
      { id: "tradicional", label: "La IA tradicional" },
      { id: "generativa", label: "La IA generativa" },
      { id: "ambas", label: "Las dos hacen lo mismo" },
    ],
    correct: "tradicional",
    success: "Correcto. La IA tradicional reconoce y clasifica patrones.",
    error: "Intenta otra vez. La IA tradicional es la que clasifica.",
  },
  {
    id: "crea",
    category: "Idea básica",
    question: "¿Cuál IA crea contenido nuevo?",
    hint: "Piensa en la IA que responde a un prompt.",
    options: [
      { id: "tradicional", label: "La IA tradicional" },
      { id: "generativa", label: "La IA generativa" },
      { id: "ninguna", label: "Ninguna" },
    ],
    correct: "generativa",
    success:
      "Correcto. La IA generativa produce imágenes, texto u otros contenidos nuevos.",
    error:
      "Intenta otra vez. La IA generativa es la que crea contenido nuevo.",
  },
  {
    id: "perceptron-multicapa",
    category: "Redes",
    question: "¿Qué es un perceptrón multicapa?",
    hint: "La pista está en la palabra multicapa.",
    options: [
      { id: "una-neurona", label: "Una sola neurona sin capas" },
      { id: "varias-capas", label: "Una red con varias neuronas y capas" },
      { id: "una-imagen", label: "Una imagen creada por IA" },
    ],
    correct: "varias-capas",
    success:
      "Correcto. Un perceptrón multicapa es una red con varias neuronas organizadas en capas.",
    error:
      "Intenta otra vez. Un perceptrón multicapa tiene varias neuronas y varias capas.",
  },
  {
    id: "deep-learning",
    category: "Profundidad",
    question: "¿Qué significa deep learning?",
    hint: "No habla de muchas preguntas, sino de muchas capas.",
    options: [
      { id: "muchos-datos", label: "Solo tener muchos datos" },
      { id: "muchas-capas", label: "Usar muchas capas" },
      { id: "muchas-preguntas", label: "Hacer muchas preguntas" },
    ],
    correct: "muchas-capas",
    success:
      "Correcto. Deep learning significa trabajar con redes de muchas capas.",
    error:
      "Intenta otra vez. La idea principal de deep learning está en la profundidad de la red.",
  },
  {
    id: "capas-etapas",
    category: "Profundidad",
    question: "¿Para qué ayudan más capas en una red?",
    hint: "Piensa en mirar el problema por pasos.",
    options: [
      { id: "decorar", label: "Solo hacen que el diagrama se vea más grande" },
      { id: "etapas", label: "Permiten analizar el problema por etapas" },
      { id: "velocidad", label: "Siempre hacen todo instantáneo" },
    ],
    correct: "etapas",
    success:
      "Correcto. Más capas permiten analizar el problema en más etapas.",
    error:
      "Intenta otra vez. La idea es que la red revise el problema paso a paso.",
  },
  {
    id: "caso-patrones",
    category: "Aplicación",
    question:
      "Si una IA recibe bigotes, maúlla y orejas puntiagudas, ¿qué está haciendo?",
    hint: "Observa pistas y trata de decidir a qué se parece.",
    options: [
      { id: "clasificar", label: "Reconocer un patrón para clasificar" },
      { id: "crear", label: "Crear una imagen nueva" },
      { id: "dibujar", label: "Dibujar automáticamente un animal" },
    ],
    correct: "clasificar",
    success:
      "Correcto. Está usando pistas para reconocer un patrón y clasificar.",
    error:
      "Intenta otra vez. Ese ejemplo corresponde a reconocimiento y clasificación.",
  },
  {
    id: "prompt-gato",
    category: "Aplicación",
    question:
      "Si escribes 'Crea un gato astronauta', ¿qué resultado esperas?",
    hint: "Aquí la IA no dice qué es, sino que genera algo nuevo.",
    options: [
      { id: "etiqueta", label: "Una etiqueta como 'esto es un gato'" },
      { id: "imagen", label: "Una imagen nueva a partir del prompt" },
      { id: "nada", label: "Nada, porque la IA solo clasifica" },
    ],
    correct: "imagen",
    success:
      "Correcto. La IA generativa responde creando una imagen nueva.",
    error:
      "Intenta otra vez. Un prompt así se usa para generar contenido nuevo.",
  },
] as const;

export function QuizSection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const correctCount = questions.filter(
    (question) => answers[question.id] === question.correct,
  ).length;
  const completion = (answeredCount / questions.length) * 100;

  const resetQuiz = () => {
    setAnswers({});
  };

  const performanceMessage =
    correctCount === questions.length
      ? "Excelente. Ya distingues con claridad qué reconoce una red tradicional, qué crea una red generativa y por qué deep learning significa muchas capas."
      : correctCount >= 5
        ? "Muy bien. Ya tienes una base sólida; solo te faltan algunos matices por afinar."
        : correctCount >= 3
          ? "Vas bien. Ya captaste varias ideas, pero todavía conviene repasar algunas diferencias."
          : "Todavía puedes reforzar varias ideas. Recorre otra vez la demo y vuelve a intentarlo.";

  const levelLabel =
    correctCount === questions.length
      ? "Dominio completo"
      : correctCount >= 5
        ? "Buen nivel"
        : correctCount >= 3
          ? "En progreso"
          : "Inicio";

  return (
    <SectionShell
      id="mini-quiz"
      eyebrow="Sección 5"
      title="Mini quiz final"
      description="Ahora el repaso es más completo: responde varias preguntas para comprobar si las ideas clave realmente quedaron claras."
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
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.8rem] border border-slate-200/80 bg-white/75 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Progreso del quiz
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                  {answeredCount} de {questions.length} respondidas
                </h3>
              </div>
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar quiz
              </button>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 via-teal-500 to-sky-500 transition-[width] duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Correctas
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {correctCount}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Nivel
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {levelLabel}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Enfoque
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  Ideas clave
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200/80 bg-slate-950 p-6 text-white">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-300 uppercase">
                  Lectura rápida
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {correctCount} de {questions.length} correctas
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {performanceMessage}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                      Pregunta {index + 1}
                    </p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-slate-600 uppercase">
                      {question.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {question.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {question.hint}
                  </p>
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
                Resultado final
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {correctCount} de {questions.length} correctas
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {performanceMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
