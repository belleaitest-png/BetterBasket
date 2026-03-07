"use client";

import { useEffect, useState } from "react";
import { useBrandStore } from "@/store/brand-store";

const STAGES = [
  "Analysing your responses",
  "Mapping colour psychology",
  "Pairing typography systems",
  "Crafting tone of voice",
  "Generating brand directions",
  "Rendering visual previews",
  "Finalising your brand identity",
];

export function LoadingScreen() {
  const setScreen = useBrandStore((s) => s.setScreen);
  const answers = useBrandStore((s) => s.answers);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const duration = 8000; // 8 seconds total
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = Math.min((step / steps) * 100, 100);
      setProgress(pct);
      setStageIndex(Math.min(Math.floor((pct / 100) * STAGES.length), STAGES.length - 1));

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => setScreen("results"), 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [setScreen]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Animated ring */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#C9973A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              className="transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-brand-text font-display">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Stage text */}
        <div className="mb-8">
          <p className="text-sm text-brand-accent font-medium mb-2">
            {STAGES[stageIndex]}
          </p>
          <p className="text-xs text-brand-muted/50">
            Building {answers.q1 ? `${answers.q1}'s` : "your"} personal brand system
          </p>
        </div>

        {/* Stage dots */}
        <div className="flex items-center justify-center gap-2">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i <= stageIndex
                  ? "bg-brand-accent"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Preview text */}
        <div className="mt-10 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="text-[10px] text-brand-muted/40 tracking-[0.1em] uppercase mb-2">
            Live Preview
          </div>
          <p className="text-xs text-brand-muted/70 leading-relaxed font-mono">
            {progress < 30
              ? `Analysing: "${answers.q6 || "Your thesis statement"}"`
              : progress < 60
              ? `Mapping aesthetic: ${(answers.q12 as string[])?.join(", ") || "Editorial, Warm, Minimal"}`
              : progress < 85
              ? `Voice: ${answers.q15 || "Direct and evidence-based"}`
              : "Rendering 3 distinct brand directions..."}
          </p>
        </div>
      </div>
    </div>
  );
}
