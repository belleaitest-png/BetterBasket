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
      <div className="flex items-start justify-between mb-1">
        <label className="text-sm font-medium text-brand-text/90 leading-relaxed">
          {question.label}
        </label>
        {isPrefilled && (
          <span className="text-[9px] font-bold tracking-[0.1em] uppercase bg-brand-accent/15 text-brand-accent px-2 py-0.5 rounded-full ml-3 shrink-0">
            Pre-filled
          </span>
        )}
      </div>
      {question.sublabel && (
        <p className="text-xs text-brand-muted/60 mb-3 leading-relaxed">{question.sublabel}</p>
      )}
      {!question.sublabel && <div className="mb-3" />}

      {question.type === "text" && (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => setAnswer(qKey, e.target.value as QuestionnaireAnswers[typeof qKey])}
          placeholder={question.placeholder}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/40 focus:border-brand-accent/40 transition-colors"
        />
      )}

      {question.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => setAnswer(qKey, e.target.value as QuestionnaireAnswers[typeof qKey])}
          placeholder={question.placeholder}
          rows={3}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/40 focus:border-brand-accent/40 transition-colors resize-none leading-relaxed"
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
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt ? "border-brand-accent" : "border-white/20"}`}>
                  {value === opt && <span className="w-2 h-2 rounded-full bg-brand-accent" />}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}

      {question.type === "chips" && question.options && (
        <ChipsInput
          options={question.options}
          value={(value as string[]) || []}
          maxSelect={question.maxSelect}
          onChange={(next) => setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey])}
        />
      )}

      {question.type === "chips-custom" && question.options && (
        <ChipsWithCustomInput
          options={question.options}
          value={(value as string[]) || []}
          customValue={question.customFieldId ? (answers[question.customFieldId as keyof QuestionnaireAnswers] as string) || "" : ""}
          maxSelect={question.maxSelect}
          onChange={(next) => setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey])}
          onCustomChange={
            question.customFieldId
              ? (v) => setAnswer(question.customFieldId as keyof QuestionnaireAnswers, v as QuestionnaireAnswers[keyof QuestionnaireAnswers])
              : undefined
          }
        />
      )}

      {question.type === "this-or-that" && question.pairs && (
        <ThisOrThatInput
          pairs={question.pairs}
          value={(value as Record<string, "left" | "right">) || {}}
          onChange={(next) => setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey])}
        />
      )}

      {question.type === "spectrum" && question.spectrums && (
        <SpectrumInput
          spectrums={question.spectrums}
          value={(value as Record<string, number>) || {}}
          onChange={(next) => setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey])}
        />
      )}

      {question.type === "mood-board" && (
        <MoodBoardInput
          value={(value as number[]) || []}
          onChange={(next) => setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey])}
        />
      )}

      {question.type === "icon-grid" && (
        <IconGridInput
          value={(value as string[]) || []}
          maxSelect={question.maxSelect}
          customFieldId={question.customFieldId}
          customValue={question.customFieldId ? (answers[question.customFieldId as keyof QuestionnaireAnswers] as string) || "" : ""}
          onChange={(next) => setAnswer(qKey, next as QuestionnaireAnswers[typeof qKey])}
          onCustomChange={
            question.customFieldId
              ? (v) => setAnswer(question.customFieldId as keyof QuestionnaireAnswers, v as QuestionnaireAnswers[keyof QuestionnaireAnswers])
              : undefined
          }
        />
      )}
    </div>
  );
}

// ─── Chips ────────────────────────────────────────────────────────────────────
function ChipsInput({ options, value, maxSelect, onChange }: {
  options: string[];
  value: string[];
  maxSelect?: number;
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => {
              if (selected) {
                onChange(value.filter((v) => v !== opt));
              } else if (maxSelect && value.length >= maxSelect) {
                onChange([...value.slice(1), opt]);
              } else {
                onChange([...value, opt]);
              }
            }}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
              selected
                ? "bg-brand-accent/20 border-brand-accent/40 text-brand-accent"
                : "bg-white/[0.03] border-white/[0.08] text-brand-muted hover:border-white/[0.15] hover:text-brand-text"
            }`}
          >
            {opt}
          </button>
        );
      })}
      {maxSelect && (
        <span className="text-[10px] text-brand-muted/40 self-center ml-2">
          up to {maxSelect}
        </span>
      )}
    </div>
  );
}

// ─── Chips with Custom ────────────────────────────────────────────────────────
function ChipsWithCustomInput({ options, value, customValue, maxSelect, onChange, onCustomChange }: {
  options: string[];
  value: string[];
  customValue: string;
  maxSelect?: number;
  onChange: (v: string[]) => void;
  onCustomChange?: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map((opt) => {
          const selected = value.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => {
                if (selected) {
                  onChange(value.filter((v) => v !== opt));
                } else if (maxSelect && value.length >= maxSelect) {
                  onChange([...value.slice(1), opt]);
                } else {
                  onChange([...value, opt]);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selected
                  ? "bg-brand-accent/20 border-brand-accent/40 text-brand-accent"
                  : "bg-white/[0.03] border-white/[0.08] text-brand-muted hover:border-white/[0.15] hover:text-brand-text"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {onCustomChange && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Add your own\u2026"
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-xs text-brand-text placeholder:text-brand-muted/40 focus:border-brand-accent/40 transition-colors"
        />
      )}
    </div>
  );
}

// ─── This or That ─────────────────────────────────────────────────────────────
function ThisOrThatInput({ pairs, value, onChange }: {
  pairs: { left: string; right: string }[];
  value: Record<string, "left" | "right">;
  onChange: (v: Record<string, "left" | "right">) => void;
}) {
  return (
    <div className="space-y-2">
      {pairs.map((pair) => {
        const key = `${pair.left}|${pair.right}`;
        const choice = value[key];
        return (
          <div key={key} className="flex gap-2">
            <button
              onClick={() => onChange({ ...value, [key]: "left" })}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                choice === "left"
                  ? "bg-brand-accent/15 border-brand-accent/40 text-brand-text"
                  : "bg-white/[0.02] border-white/[0.06] text-brand-muted hover:border-white/[0.12] hover:text-brand-text"
              }`}
            >
              {pair.left}
            </button>
            <div className="flex items-center">
              <span className="text-brand-muted/30 text-xs font-medium">or</span>
            </div>
            <button
              onClick={() => onChange({ ...value, [key]: "right" })}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                choice === "right"
                  ? "bg-brand-accent/15 border-brand-accent/40 text-brand-text"
                  : "bg-white/[0.02] border-white/[0.06] text-brand-muted hover:border-white/[0.12] hover:text-brand-text"
              }`}
            >
              {pair.right}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Spectrum Sliders ─────────────────────────────────────────────────────────
function SpectrumInput({ spectrums, value, onChange }: {
  spectrums: { left: string; right: string }[];
  value: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
}) {
  return (
    <div className="space-y-5">
      {spectrums.map((s) => {
        const key = `${s.left}|${s.right}`;
        const val = value[key] ?? 50;
        return (
          <div key={key}>
            <div className="flex justify-between mb-2">
              <span className={`text-xs font-medium transition-colors ${val < 40 ? "text-brand-accent" : "text-brand-muted/60"}`}>{s.left}</span>
              <span className={`text-xs font-medium transition-colors ${val > 60 ? "text-brand-accent" : "text-brand-muted/60"}`}>{s.right}</span>
            </div>
            <div className="relative">
              <div className="h-1.5 bg-white/[0.06] rounded-full" />
              <div
                className="absolute top-0 left-0 h-1.5 bg-brand-accent/40 rounded-full transition-all"
                style={{ width: `${val}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) => onChange({ ...value, [key]: parseInt(e.target.value) })}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-accent border-2 border-brand-bg shadow-lg transition-all pointer-events-none"
                style={{ left: `calc(${val}% - 8px)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mood Board ───────────────────────────────────────────────────────────────
function MoodBoardInput({ value, onChange }: {
  value: number[];
  onChange: (v: number[]) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {MOOD_BOARD_IMAGES.map((img, idx) => {
        const selected = value.includes(idx);
        return (
          <button
            key={idx}
            onClick={() => {
              onChange(selected ? value.filter((i) => i !== idx) : [...value, idx]);
            }}
            className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
              selected ? "border-brand-accent ring-1 ring-brand-accent/30" : "border-transparent hover:border-white/[0.15]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
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
  );
}

// ─── Icon Grid ────────────────────────────────────────────────────────────────
function IconGridInput({ value, maxSelect, customFieldId, customValue, onChange, onCustomChange }: {
  value: string[];
  maxSelect?: number;
  customFieldId?: string;
  customValue: string;
  onChange: (v: string[]) => void;
  onCustomChange?: (v: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BRAND_ICONS.map((icon) => {
          const selected = value.includes(icon.name);
          return (
            <button
              key={icon.name}
              onClick={() => {
                if (selected) {
                  onChange(value.filter((v) => v !== icon.name));
                } else if (maxSelect && value.length >= maxSelect) {
                  onChange([...value.slice(1), icon.name]);
                } else {
                  onChange([...value, icon.name]);
                }
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
      </div>
      {maxSelect && (
        <div className="text-[10px] text-brand-muted/40 mt-2">
          Select up to {maxSelect}
        </div>
      )}
      {customFieldId && onCustomChange && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Who\u2019s missing? Add your own\u2026"
          className="mt-3 w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-xs text-brand-text placeholder:text-brand-muted/40 focus:border-brand-accent/40 transition-colors"
        />
      )}
    </div>
  );
}
