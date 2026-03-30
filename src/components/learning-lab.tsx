"use client";

import {
  ArrowRight,
  BrainCircuit,
  Layers3,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ProgressNav } from "@/components/progress-nav";
import { ClosingSection } from "@/components/sections/closing-section";
import { DeepLearningSection } from "@/components/sections/deep-learning-section";
import { NeuralNetworkSection } from "@/components/sections/neural-network-section";
import { PatternRecognitionSection } from "@/components/sections/pattern-recognition-section";
import { QuizSection } from "@/components/sections/quiz-section";
import { RecognizeVsCreateSection } from "@/components/sections/recognize-vs-create-section";
import { learningSections, type SectionId } from "@/lib/learning-sections";

export function LearningLab() {
  const [activeSection, setActiveSection] = useState<SectionId>(
    learningSections[0].id,
  );
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const visibleSection = visibleEntries[0]?.target.id as SectionId | undefined;

        if (visibleSection) {
          setActiveSection(visibleSection);
        }
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7],
      },
    );

    learningSections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [resetCounter]);

  const activeIndex = learningSections.findIndex(
    (section) => section.id === activeSection,
  );
  const progress = ((activeIndex + 1) / learningSections.length) * 100;

  const handleReset = () => {
    setResetCounter((current) => current + 1);
    setActiveSection(learningSections[0].id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_45%)]" />

      <ProgressNav
        sections={learningSections}
        activeSection={activeSection}
        progress={progress}
        onReset={handleReset}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:gap-12">
        <section className="panel-surface panel-grid relative overflow-hidden rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="soft-orb left-8 top-10 h-24 w-24 bg-cyan-300/45" />
          <div className="soft-orb bottom-8 right-8 h-28 w-28 bg-emerald-300/35" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-white uppercase">
                <Rocket className="h-4 w-4" />
                Laboratorio visual
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Redes neuronales sin fórmulas, con una experiencia para clase.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Explora cómo una IA reconoce patrones, qué cambia cuando una red
                tiene más capas y por qué una IA generativa crea contenido nuevo.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#ia-reconoce"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Empezar demo
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#mini-quiz"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Ir al mini quiz
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "5 ideas clave", detail: "Para principiantes absolutos" },
                  { label: "6 secciones", detail: "Cortas e interactivas" },
                  { label: "0 fórmulas", detail: "Aprendizaje visual" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.4rem] border border-slate-200/80 bg-white/75 p-4"
                  >
                    <p className="text-lg font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_30px_70px_-45px_rgba(15,23,42,0.9)]">
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-slate-300 uppercase">
                Lo que te llevarás
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  {
                    icon: Target,
                    title: "Reconocer patrones",
                    text: "Una IA puede mirar señales y decidir a qué se parece algo.",
                  },
                  {
                    icon: BrainCircuit,
                    title: "Pensar en red",
                    text: "Un perceptrón multicapa une varias neuronas y capas.",
                  },
                  {
                    icon: Layers3,
                    title: "Profundidad",
                    text: "Deep learning significa sumar más capas a esa red.",
                  },
                  {
                    icon: Sparkles,
                    title: "Crear",
                    text: "La IA generativa no solo reconoce: también produce contenido nuevo.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">{item.title}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <PatternRecognitionSection key={`pattern-${resetCounter}`} />
        <NeuralNetworkSection key={`network-${resetCounter}`} />
        <DeepLearningSection key={`deep-${resetCounter}`} />
        <RecognizeVsCreateSection key={`compare-${resetCounter}`} />
        <QuizSection key={`quiz-${resetCounter}`} />
        <ClosingSection key={`closing-${resetCounter}`} onReset={handleReset} />
      </main>
    </div>
  );
}
