export type SectionId =
  | "ia-reconoce"
  | "de-una-neurona-a-una-red"
  | "que-es-deep-learning"
  | "reconocer-vs-crear"
  | "mini-quiz"
  | "cierre";

export const learningSections: Array<{
  id: SectionId;
  shortLabel: string;
  title: string;
}> = [
  {
    id: "ia-reconoce",
    shortLabel: "IA",
    title: "IA que reconoce",
  },
  {
    id: "de-una-neurona-a-una-red",
    shortLabel: "Red",
    title: "De una neurona a una red",
  },
  {
    id: "que-es-deep-learning",
    shortLabel: "Capas",
    title: "¿Qué es deep learning?",
  },
  {
    id: "reconocer-vs-crear",
    shortLabel: "Crear",
    title: "Reconocer vs crear",
  },
  {
    id: "mini-quiz",
    shortLabel: "Quiz",
    title: "Mini quiz final",
  },
  {
    id: "cierre",
    shortLabel: "Cierre",
    title: "Cierre",
  },
];
