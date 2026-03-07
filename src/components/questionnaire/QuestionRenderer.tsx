"use client";

import { useBrandStore } from "@/store/brand-store";
import { Question, MOOD_BOARD_IMAGES, BRAND_ICONS } from "@/lib/questions";
import { QuestionnaireAnswers } from "@/lib/types";

export function QuestionRenderer({ question }: { question: Question }) {
  const answers = useBrandStore((s) => s.answers);
  const setAnswer = useBrandStore((s) => s.setAnswer);
  const prefilled = useBrandStore((s) => s.prefilled);

  const qKey = question.id as keyof QuestionnaireAnswers;
  const value = answers[qKey];
  const isPrefilled = prefilled.has(question.id);

  const wrapperClass = `rounded-xl border transition-all ${
    isPrefilled
      ? "border-brand-accent/30 bg-brand-accent/[0.03]"
      : "border-white/5 bg-white/[0.02]"
  } p-5`;

  return (
    <div className={wrapperClass}>
      <div className="flex items-start justify-between mb-3">
        <label className="text-sm font-medium text-brand-text/90 leading-relaxed">
          {question.label}
        </label>
        {isPrefilled && (
          <span className="text-[9px] font-bold tracking-[0.1em] uppercase bg-brand-accent/15 text-brand-accent px-2 py-0.5 rounded-full ml-3 shrink-0">
            Pre-filled
          </span>
        )}
      </div>

      {question.type === "text" && (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => setAnswer(qKey, e.target.value as QuestionnaireAnswers[typeof qKey])}
          placeholder={question.placeholder}
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/40 focus:border-brand-accent/40 transition-colors"
        />
      )}

      {question.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => setAnswer(qKey, e.target.value as QuestionnaireAnswers[typeof qKey])}
          placeholder={question.placeholder}
          rows={3}
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/40 focus:border-brand-accent/40 transition-colors resize-none leading-relaxed"
        />
      )}

      {question.type === "radio" && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setAnswer(qKey, opt as QuestionnaireAnswers[typeof qKey])}
              className={`text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                value === opt
                  ? "bg-brand-accent/15 border-brand-accent/40 text-brand-text"
                  : "bg-white/[0.02] border-white/5 text-brand-muted hover:border-white/10 hover:text-brand-text"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    value === opt ? "border-brand-accent" : "border-white/20"
                  }`}
                >
                  {value === opt && (
                    <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  )}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}

      {question.type === "chips" && question.options && (
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt) => {
            const selected = Array.isArray(value) && (value as string[]).includes(opt);
            return (
              <button
                key={opt}
                onClick={() => {
                  const current = (value as string[]) || [];
                  let next: string[];
                  if (selected) {
                    next = current.filter((v) => v !== opt);
                  } else if (question.maxSelect && current.length >= question.maxSelect) {
                    next = [...current.slice(1), opt];
                  } else {
                    next = [...current, opt];
                  }
                  setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey]);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                  selected
                    ? "bg-brand-accent/20 border-brand-accent/40 text-brand-accent"
                    : "bg-white/[0.03] border-white/8 text-brand-muted hover:border-white/15 hover:text-brand-text"
                }`}
              >
                {opt}
              </button>
            );
          })}
          {question.maxSelect && (
            <span className="text-[10px] text-brand-muted/40 self-center ml-2">
              Select up to {question.maxSelect}
            </span>
          )}
        </div>
      )}

      {question.type === "mood-board" && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {MOOD_BOARD_IMAGES.map((img, idx) => {
            const selected = Array.isArray(value) && (value as number[]).includes(idx);
            return (
              <button
                key={idx}
                onClick={() => {
                  const current = (value as number[]) || [];
                  const next = selected
                    ? current.filter((i) => i !== idx)
                    : [...current, idx];
                  setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey]);
                }}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                  selected ? "border-brand-accent ring-1 ring-brand-accent/30" : "border-transparent hover:border-white/15"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {selected && (
                  <div className="absolute inset-0 bg-brand-accent/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <span className="text-[9px] text-white/80 font-medium">{img.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "icon-grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BRAND_ICONS.map((icon) => {
            const selected = Array.isArray(value) && (value as string[]).includes(icon.name);
            return (
              <button
                key={icon.name}
                onClick={() => {
                  const current = (value as string[]) || [];
                  let next: string[];
                  if (selected) {
                    next = current.filter((v) => v !== icon.name);
                  } else if (question.maxSelect && current.length >= question.maxSelect) {
                    next = [...current.slice(1), icon.name];
                  } else {
                    next = [...current, icon.name];
                  }
                  setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey]);
                }}
                className={`p-3 rounded-xl text-left transition-all border ${
                  selected
                    ? "bg-brand-accent/10 border-brand-accent/40"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 text-lg">
                  {icon.name.charAt(0)}
                </div>
                <p className={`text-xs font-medium mb-0.5 ${selected ? "text-brand-accent" : "text-brand-text/80"}`}>
                  {icon.name}
                </p>
                <p className="text-[10px] text-brand-muted/60 leading-relaxed">{icon.desc}</p>
              </button>
            );
          })}
          {question.maxSelect && (
            <div className="col-span-full text-[10px] text-brand-muted/40 mt-1">
              Select up to {question.maxSelect}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
