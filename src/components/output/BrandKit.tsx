"use client";

import { useState } from "react";
import { useBrandStore } from "@/store/brand-store";
import { BrandDirection } from "@/lib/types";
import { generateBrief } from "@/lib/brief";

export function BrandKit({ dir }: { dir: BrandDirection }) {
  const answers = useBrandStore((s) => s.answers);
  const [copied, setCopied] = useState(false);
  const brief = generateBrief(dir, answers);

  const copy = () => {
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-brand-muted">
          Brand Brief + Discovery Profile \u2014 Copy for AI / Design Tools
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
