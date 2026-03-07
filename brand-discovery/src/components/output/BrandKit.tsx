"use client";

import { useState } from "react";
import { BrandDirection } from "@/lib/types";

function generateBrief(dir: BrandDirection, userName: string): string {
  return `PERSONAL BRAND: ${userName}
DIRECTION: ${dir.label}
TAGLINE: "${dir.tagline}"

COLOUR PALETTE:
${Object.values(dir.colors).map(c => `  ${c.hex}  ${c.name}  (${c.role})`).join("\n")}

TYPOGRAPHY:
  Display: ${dir.fonts.display.name} ${dir.fonts.display.weight} — ${dir.fonts.display.use}
  Body:    ${dir.fonts.body.name} ${dir.fonts.body.weight} — ${dir.fonts.body.use}
  Accent:  ${dir.fonts.accent.name} — ${dir.fonts.accent.use}

TONE OF VOICE:
  Attributes: ${dir.tone.attrs.join(" · ")}
  Power words: ${dir.tone.power.join(", ")}
  Never use: ${dir.tone.avoid.join(", ")}

VOICE EXAMPLES:
${dir.tone.examples.map((e, i) => `  ${i + 1}. "${e}"`).join("\n")}

VIBE: ${dir.vibe.join(", ")}

USE THIS BRIEF TO:
- Generate brand photography prompts (Midjourney, DALL-E)
- Brief a web designer or Figma template
- Prompt Claude/ChatGPT to write in-brand copy
- Set up a Canva brand kit
- Create LinkedIn banners, email signatures, presentation decks`;
}

export { generateBrief };

export function BrandKit({ dir, userName }: { dir: BrandDirection; userName: string }) {
  const [copied, setCopied] = useState(false);
  const brief = generateBrief(dir, userName);

  const copy = () => {
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-brand-muted">
          Brand Brief — Copy for AI / Design Tools
        </span>
        <button
          onClick={copy}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            copied
              ? "bg-green-700 text-white"
              : "bg-brand-text text-brand-bg hover:brightness-90"
          }`}
        >
          {copied ? "\u2713 Copied!" : "Copy Brief"}
        </button>
      </div>
      <pre className="bg-brand-bg border border-white/[0.06] rounded-xl p-4 text-[11px] leading-relaxed text-brand-muted/60 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
        {brief}
      </pre>
    </div>
  );
}
