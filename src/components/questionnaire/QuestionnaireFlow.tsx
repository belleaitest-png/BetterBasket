"use client";

import { useBrandStore } from "@/store/brand-store";
import { SECTIONS } from "@/lib/questions";
import { QuestionRenderer } from "./QuestionRenderer";

export function QuestionnaireFlow() {
  const currentSection = useBrandStore((s) => s.currentSection);
  const setSection = useBrandStore((s) => s.setSection);
  const setScreen = useBrandStore((s) => s.setScreen);
  const answers = useBrandStore((s) => s.answers);

  const section = SECTIONS[currentSection - 1];
  const totalSections = SECTIONS.length;
  const isFirst = currentSection === 1;
  const isLast = currentSection === totalSections;

  const handleNext = () => {
    if (isLast) {
      setScreen("loading");
    } else {
      setSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (isFirst) {
      setScreen("splash");
    } else {
      setSection(currentSection - 1);
    }
  };

  const handleGenerateNow = () => {
    setScreen("loading");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
        <button
          onClick={() => setScreen("splash")}
          className="text-xs text-brand-muted/60 tracking-[0.08em] uppercase hover:text-brand-muted transition-colors"
        >
          Brand Discovery
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-2 h-2 rounded-full transition-all ${
                s.id === currentSection
                  ? "bg-brand-accent w-6"
                  : s.id < currentSection
                  ? "bg-brand-accent/40"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {currentSection > 1 && (
          <button
            onClick={handleGenerateNow}
            className="text-xs text-brand-accent font-medium tracking-wide hover:brightness-125 transition-all"
          >
            Generate Now
          </button>
        )}
        {currentSection === 1 && <div className="w-20" />}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 md:px-10 py-12 md:py-16">
        {/* Section header */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent">
              Section {section.id} of {totalSections}
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {section.title}
          </h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8 animate-fade-up-delay">
          {section.questions.map((q) => (
            <QuestionRenderer key={q.id} question={q} />
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-white/5 px-6 md:px-10 py-5 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2.5 text-sm text-brand-muted border border-white/10 rounded-lg hover:border-white/20 hover:text-brand-text transition-all"
        >
          {isFirst ? "Home" : "Back"}
        </button>

        <span className="text-xs text-brand-muted/40">
          {answers.q1 ? `${answers.q1}'s brand` : "Your brand"}
        </span>

        <button
          onClick={handleNext}
          className="px-6 py-2.5 text-sm font-semibold bg-brand-accent text-brand-bg rounded-lg hover:brightness-110 transition-all"
        >
          {isLast ? "Generate My Brand" : "Next"}
        </button>
      </div>
    </div>
  );
}
