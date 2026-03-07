"use client";

import { useState, useCallback } from "react";
import { useBrandStore } from "@/store/brand-store";
import { generateBrief } from "./BrandKit";

export function BrandBriefFooter() {
  const selectedDirection = useBrandStore((s) => s.selectedDirection);
  const setSelectedDirection = useBrandStore((s) => s.setSelectedDirection);
  const directions = useBrandStore((s) => s.directions);
  const answers = useBrandStore((s) => s.answers);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const dir = directions.find((d) => d.id === selectedDirection);
  const userName = answers.q1 || "Your Name";

  const handleCopy = () => {
    if (!dir) return;
    const brief = generateBrief(dir, userName);
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!dir) return;
    setDownloading(true);
    try {
      const brief = generateBrief(dir, userName);

      // Generate a styled HTML document and trigger print/save as PDF
      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${userName} — Brand Guidelines (${dir.label})</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; color: #1a1a17; background: #fff; }
  .page { max-width: 720px; margin: 0 auto; padding: 60px 48px; }
  .header { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid #e8e4dc; }
  .badge { display: inline-block; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: ${dir.colors.accent.hex}; border: 1px solid ${dir.colors.accent.hex}40; border-radius: 20px; padding: 4px 14px; margin-bottom: 16px; font-weight: 600; }
  h1 { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em; }
  h1 em { font-weight: 400; color: ${dir.colors.accent.hex}; }
  .subtitle { font-size: 14px; color: #7d7060; }
  .section { margin-bottom: 36px; }
  .section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${dir.colors.accent.hex}; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #f0ece4; }
  .swatches { display: flex; gap: 12px; margin-bottom: 8px; }
  .swatch { flex: 1; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4dc; }
  .swatch-color { height: 48px; display: flex; align-items: flex-end; padding: 6px 8px; }
  .swatch-color span { font-size: 9px; font-weight: 700; font-family: monospace; }
  .swatch-info { padding: 8px 10px; background: #fafaf8; }
  .swatch-name { font-size: 11px; font-weight: 700; }
  .swatch-role { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
  .font-row { padding: 12px 16px; background: #fafaf8; border-radius: 8px; margin-bottom: 8px; border: 1px solid #f0ece4; }
  .font-label { font-size: 10px; font-weight: 700; color: ${dir.colors.accent.hex}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
  .font-name { font-size: 13px; font-weight: 600; }
  .font-use { font-size: 11px; color: #888; margin-top: 2px; }
  .attr { padding: 8px 14px; background: ${dir.colors.accent.hex}12; border: 1px solid ${dir.colors.accent.hex}30; border-radius: 6px; margin-bottom: 6px; font-size: 13px; }
  .quote { padding: 10px 14px; border-left: 2px solid ${dir.colors.accent.hex}60; margin-bottom: 6px; font-style: italic; font-size: 13px; color: #5a5450; background: #fafaf8; border-radius: 0 6px 6px 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { padding: 4px 10px; border-radius: 4px; font-size: 11px; background: #f0ece4; }
  .tag-avoid { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
  .brief-block { background: #0f0e0c; color: #8a8480; padding: 16px 20px; border-radius: 10px; font-family: monospace; font-size: 11px; line-height: 1.8; white-space: pre-wrap; margin-top: 24px; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e8e4dc; text-align: center; font-size: 11px; color: #b0a8a0; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="badge">Brand Guidelines</div>
    <h1>${userName}<br><em>${dir.label}</em></h1>
    <p class="subtitle">${dir.tagline} — ${dir.vibe.join(" · ")}</p>
  </div>

  <div class="section">
    <div class="section-title">Colour Palette</div>
    <div class="swatches">
      ${Object.values(dir.colors).map(c => {
        const lum = parseInt(c.hex.slice(1,3),16)*0.299 + parseInt(c.hex.slice(3,5),16)*0.587 + parseInt(c.hex.slice(5,7),16)*0.114;
        const tc = lum > 145 ? '#111' : '#fff';
        return `<div class="swatch"><div class="swatch-color" style="background:${c.hex}"><span style="color:${tc}">${c.hex}</span></div><div class="swatch-info"><div class="swatch-name">${c.name}</div><div class="swatch-role">${c.role}</div></div></div>`;
      }).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Typography</div>
    ${([['Display', dir.fonts.display], ['Body', dir.fonts.body], ['Accent', dir.fonts.accent]] as const).map(([role, font]) =>
      `<div class="font-row"><div class="font-label">${role}</div><div class="font-name">${font.name} (${font.weight})</div><div class="font-use">${font.use}</div></div>`
    ).join('')}
  </div>

  <div class="section">
    <div class="section-title">Voice Attributes</div>
    ${dir.tone.attrs.map(a => `<div class="attr">✦ ${a}</div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">Example Copy</div>
    ${dir.tone.examples.map(ex => `<div class="quote">"${ex}"</div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">Power Words</div>
    <div class="tags">${dir.tone.power.map(w => `<div class="tag">${w}</div>`).join('')}</div>
  </div>

  <div class="section">
    <div class="section-title">Words to Avoid</div>
    <div class="tags">${dir.tone.avoid.map(w => `<div class="tag tag-avoid">${w}</div>`).join('')}</div>
  </div>

  <div class="section">
    <div class="section-title">LLM-Ready Brand Brief</div>
    <div class="brief-block">${brief.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  </div>

  <div class="footer">
    ${userName} — ${dir.label} — Brand Guidelines<br>
    Generated by Brand Image Discovery
  </div>
</div>
</body>
</html>`;

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${userName.replace(/\s+/g, "-")}-brand-guidelines-${dir.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, [dir, userName]);

  if (!dir) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-surface border-t border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-brand-text">
            \u2726 {dir.label} selected
          </div>
          <div className="text-[11px] text-brand-muted mt-0.5">
            Scroll up &rarr; Voice tab &rarr; Copy Brand Brief
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setSelectedDirection(null)}
            className="px-4 py-2.5 rounded-lg text-sm bg-white/[0.06] border border-white/10 text-brand-muted hover:border-white/20 hover:text-brand-text transition-all"
          >
            &larr; Change
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/[0.08] border border-white/10 text-brand-text hover:bg-white/[0.12] transition-all disabled:opacity-50"
          >
            {downloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={handleCopy}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              copied
                ? "bg-green-700 text-white"
                : "bg-brand-accent text-brand-bg hover:brightness-110"
            }`}
          >
            {copied ? "\u2713 Copied!" : "Copy Brief \u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}
