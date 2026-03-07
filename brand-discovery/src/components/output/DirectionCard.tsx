"use client";

import { useState } from "react";
import { BrandDirection } from "@/lib/types";
import { PreviewArchitect } from "./previews/PreviewArchitect";
import { PreviewCultivator } from "./previews/PreviewCultivator";
import { PreviewStrategist } from "./previews/PreviewStrategist";
import { BrandKit } from "./BrandKit";

const PREVIEWS: Record<string, React.FC<{ dir: BrandDirection; userName: string; userRole: string }>> = {
  architect: PreviewArchitect,
  cultivator: PreviewCultivator,
  strategist: PreviewStrategist,
};

type Tab = "preview" | "palette" | "type" | "voice";

interface Props {
  dir: BrandDirection;
  selected: boolean;
  onSelect: () => void;
  userName: string;
  userRole: string;
}

function Swatch({ hex, name, role }: { hex: string; name: string; role: string }) {
  const lum = (() => {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    } catch {
      return 128;
    }
  })();
  const tc = lum > 145 ? "#111" : "#fff";

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] flex-1 min-w-[80px]">
      <div
        className="h-16 flex items-end px-2 pb-1.5"
        style={{ background: hex }}
      >
        <span className="text-[10px] font-bold font-mono" style={{ color: tc }}>
          {hex}
        </span>
      </div>
      <div className="px-2.5 py-2 bg-brand-surface">
        <div className="text-[11px] font-bold text-brand-text/90 mb-0.5">{name}</div>
        <div className="text-[10px] text-brand-muted/60 uppercase tracking-[0.06em]">{role}</div>
      </div>
    </div>
  );
}

export function DirectionCard({ dir, selected, onSelect, userName, userRole }: Props) {
  const [tab, setTab] = useState<Tab>("preview");
  const Preview = PREVIEWS[dir.id];
  const c = dir.colors;

  const tabs: [Tab, string][] = [
    ["preview", "Website Preview"],
    ["palette", "Colour Palette"],
    ["type", "Typography"],
    ["voice", "Voice & Tone"],
  ];

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all border-2 ${
        selected
          ? "border-brand-accent gold-glow"
          : "border-white/[0.06] hover:border-white/[0.1]"
      } bg-brand-surface`}
    >
      {/* Header */}
      <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06]">
        <div>
          <div className="flex gap-2 mb-2 flex-wrap">
            {dir.vibe.map((v, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-1 rounded bg-white/[0.06] text-brand-muted tracking-[0.05em]"
              >
                {v}
              </span>
            ))}
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-text mb-1">
            {dir.label}
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed max-w-md">
            {dir.desc}
          </p>
        </div>
        <button
          onClick={onSelect}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all shrink-0 ${
            selected
              ? "bg-brand-accent text-brand-bg"
              : "bg-white/[0.06] border border-white/10 text-brand-muted hover:border-white/20 hover:text-brand-text"
          }`}
        >
          {selected ? "\u2713 Selected" : "Select"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] px-5 md:px-6 overflow-x-auto">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-3 text-xs font-semibold tracking-[0.03em] border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === key
                ? "border-brand-accent text-brand-text"
                : "border-transparent text-brand-muted/60 hover:text-brand-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === "preview" && Preview && (
          <div>
            <link
              href={`https://fonts.googleapis.com/css2?family=${dir.gfonts}&display=swap`}
              rel="stylesheet"
            />
            <div className="origin-top-left scale-[0.72]" style={{ width: "138.9%" }}>
              <Preview dir={dir} userName={userName} userRole={userRole} />
            </div>
          </div>
        )}

        {tab === "palette" && (
          <div className="p-5 md:p-6">
            <div className="flex gap-2.5 flex-wrap mb-5">
              {Object.values(c).map((col, i) => (
                <Swatch key={i} {...col} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(c).map((col, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg"
                >
                  <div
                    className="w-6 h-6 rounded shrink-0 border border-white/10"
                    style={{ background: col.hex }}
                  />
                  <div>
                    <div className="text-xs font-bold text-brand-text/85">{col.name}</div>
                    <div className="text-[10px] text-brand-muted/50 font-mono">
                      {col.hex} \u00b7 {col.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "type" && (
          <div className="p-5 md:p-6">
            <link
              href={`https://fonts.googleapis.com/css2?family=${dir.gfonts}&display=swap`}
              rel="stylesheet"
            />
            {(
              [
                ["Display", dir.fonts.display, "Making nutrition inevitable.", 32],
                ["Accent", dir.fonts.accent, '"Scientific rigour meets ruthless clarity."', 22],
                ["Body", dir.fonts.body, "Building the AI nutrition layer the grocery industry didn't know it needed.", 16],
              ] as const
            ).map(([role, font, sample, size]) => (
              <div
                key={role}
                className="mb-5 p-4 md:p-5 bg-white/[0.03] rounded-xl border border-white/[0.06]"
              >
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-brand-accent mb-2">
                  {role}
                </div>
                <div
                  className="text-brand-text leading-snug mb-2"
                  style={{
                    fontFamily: font.css,
                    fontSize: size,
                    fontStyle: font.name.toLowerCase().includes("italic")
                      ? "italic"
                      : "normal",
                    fontWeight: role === "Display" ? 700 : 400,
                  }}
                >
                  {sample}
                </div>
                <div className="text-[11px] text-brand-muted/50">
                  {font.name} \u00b7 {font.use}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "voice" && (
          <div className="p-5 md:p-6">
            {/* Voice attributes */}
            <div className="mb-6">
              <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-brand-accent mb-3">
                Voice Attributes
              </div>
              <div className="space-y-2">
                {dir.tone.attrs.map((a, i) => (
                  <div
                    key={i}
                    className="px-4 py-2.5 bg-brand-accent/[0.08] border border-brand-accent/20 rounded-lg text-[13px] text-brand-text/85 font-medium"
                  >
                    \u2726 {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="mb-6">
              <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-brand-accent mb-3">
                Example Copy
              </div>
              {dir.tone.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-white/[0.02] border-l-2 border-brand-accent/40 mb-2 rounded-r-lg"
                >
                  <p className="text-[13px] text-brand-muted/80 italic leading-relaxed">
                    &ldquo;{ex}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Power words & avoid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-brand-muted/50 mb-2">
                  Power Words
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dir.tone.power.map((w, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white/[0.05] rounded text-[11px] text-brand-muted/80"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-brand-muted/50 mb-2">
                  Never Use
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dir.tone.avoid.map((w, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-red-500/[0.06] border border-red-500/15 rounded text-[11px] text-red-400/70"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Kit — visible when selected */}
      {selected && (
        <div className="border-t border-white/[0.06] p-5 md:p-6 bg-brand-bg">
          <BrandKit dir={dir} userName={userName} />
        </div>
      )}
    </div>
  );
}
