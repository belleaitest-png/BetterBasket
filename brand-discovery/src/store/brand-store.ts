import { create } from "zustand";
import { AppScreen, BrandDirection, QuestionnaireAnswers } from "@/lib/types";
import { DEFAULT_ANSWERS } from "@/lib/prefill";
import { DIRECTIONS } from "@/lib/directions";

interface BrandStore {
  screen: AppScreen;
  setScreen: (s: AppScreen) => void;

  currentSection: number;
  setSection: (n: number) => void;

  answers: QuestionnaireAnswers;
  setAnswer: <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => void;
  prefilled: Set<string>;
  loadPrefill: (data: Partial<QuestionnaireAnswers>) => void;

  directions: BrandDirection[];
  selectedDirection: string | null;
  setSelectedDirection: (id: string | null) => void;

  uploadedFile: File | null;
  setUploadedFile: (f: File | null) => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  screen: "splash",
  setScreen: (s) => set({ screen: s }),

  currentSection: 1,
  setSection: (n) => set({ currentSection: n }),

  answers: { ...DEFAULT_ANSWERS },
  setAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),
  prefilled: new Set<string>(),
  loadPrefill: (data) =>
    set((state) => {
      const newAnswers = { ...state.answers };
      const newPrefilled = new Set(state.prefilled);
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0)) {
          (newAnswers as Record<string, unknown>)[key] = value;
          newPrefilled.add(key);
        }
      }
      return { answers: newAnswers, prefilled: newPrefilled };
    }),

  directions: DIRECTIONS,
  selectedDirection: null,
  setSelectedDirection: (id) => set({ selectedDirection: id }),

  uploadedFile: null,
  setUploadedFile: (f) => set({ uploadedFile: f }),
}));
