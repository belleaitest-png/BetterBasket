"use client";

import { useBrandStore } from "@/store/brand-store";
import { DirectionCard } from "./DirectionCard";
import { BrandBriefFooter } from "./BrandBriefFooter";

export function ResultsScreen() {
  const directions = useBrandStore((s) => s.directions);
  const selectedDirection = useBrandStore((s) => s.selectedDirection);
  const setSelectedDirection = useBrandStore((s) => s.setSelectedDirection);
  const setScreen = useBrandStore((s) => s.setScreen);
  const answers = useBrandStore((s) => s.answers);

  return (
    <div className="min-h-screen pb-24">
      {/* Top bar */}
      <div className="border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
        <span className="text-xs text-brand-muted/60 tracking-[0.08em] uppercase">
          Brand Discovery {answers.q21 ? `\u00b7 ${answers.q21}` : ""}
        </span>
        <button
          onClick={() => setScreen("questionnaire")}
          className="text-xs text-brand-muted hover:text-brand-text transition-colors"
        >
          Edit Answers
        </button>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/25 rounded-full px-4 py-1.5 mb-6">
          <span className="text-brand-accent text-[10px] font-semibold tracking-[0.12em] uppercase">
            Your Brand Identity \u00b7 3 Directions
          </span>
        </div>
        <h1 className="animate-fade-up-delay font-display text-3xl md:text-5xl font-bold tracking-tight mb-3 leading-[1.1]">
          Three directions. One you.
          <br />
          <span className="font-display italic font-normal text-brand-accent">
            Pick the one that feels inevitable.
          </span>
        </h1>
        <p className="animate-fade-up-delay-2 text-sm text-brand-muted max-w-lg mx-auto leading-relaxed">
          Each direction has a complete colour system, font pairing, and tone of
          voice — ready to copy into Figma, Canva, Midjourney, or any AI tool.
          Select one to reveal your full brand brief.
        </p>
      </div>

      {/* Direction cards */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
        {directions.map((dir) => (
          <DirectionCard
            key={dir.id}
            dir={dir}
            selected={selectedDirection === dir.id}
            onSelect={() =>
              setSelectedDirection(
                dir.id === selectedDirection ? null : dir.id
              )
            }
            userName={answers.q21 || "Your Name"}
            userRole={answers.q22 || "Your Role"}
          />
        ))}
      </div>

      {/* Sticky footer */}
      {selectedDirection && <BrandBriefFooter />}
    </div>
  );
}
