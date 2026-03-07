"use client";

import { BrandDirection } from "@/lib/types";

interface Props {
  dir: BrandDirection;
  userName: string;
  userRole: string;
}

export function PreviewArchitect({ dir, userName, userRole }: Props) {
  const c = dir.colors;
  const firstName = userName.split(" ")[0]?.toUpperCase() || "YOU";

  return (
    <div style={{ background: c.bg.hex, minHeight: 600, fontFamily: "'DM Sans', sans-serif", color: c.primary.hex, position: "relative", overflow: "hidden" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid rgba(242,237,228,0.07)` }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{userName}</span>
        <div style={{ display: "flex", gap: 32 }}>
          {["About", "Work", "Writing", "Speaking"].map(n => (
            <span key={n} style={{ fontSize: 12, color: c.muted.hex, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>{n}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, color: c.accent.hex, border: `1px solid ${c.accent.hex}`, padding: "7px 16px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Connect &rarr;</span>
      </nav>

      {/* Hero */}
      <div style={{ padding: "80px 48px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: 40, right: -20, fontFamily: "'Playfair Display', serif", fontSize: "clamp(120px,18vw,220px)", fontWeight: 700, color: "rgba(242,237,228,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none", letterSpacing: "-0.04em" }}>{firstName}</div>
        <div style={{ maxWidth: 640, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: c.accent.hex }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.accent.hex, fontWeight: 600 }}>{userRole}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            {dir.tagline.split(" ").slice(0, 3).join(" ")}
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.05, margin: "0 0 28px", color: c.accent.hex, letterSpacing: "-0.02em" }}>
            {dir.tagline.split(" ").slice(3).join(" ") || "meets ruthless clarity."}
          </h1>
          <p style={{ fontSize: 16, color: c.muted.hex, lineHeight: 1.8, maxWidth: 480, margin: "0 0 36px" }}>
            {dir.tone.examples[1]}
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ padding: "12px 24px", background: c.accent.hex, color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 4, letterSpacing: "0.04em" }}>Follow the build</span>
            <span style={{ padding: "12px 24px", border: "1px solid rgba(242,237,228,0.15)", color: c.muted.hex, fontSize: 13, borderRadius: 4 }}>Read my writing</span>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ borderTop: "1px solid rgba(242,237,228,0.07)", borderBottom: "1px solid rgba(242,237,228,0.07)", padding: "12px 0", display: "flex", gap: 48, overflow: "hidden", background: c.surface.hex }}>
        {[...dir.vibe, ...dir.tone.power].map((w, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: c.muted.hex, whiteSpace: "nowrap" }}>{w}</span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid rgba(242,237,228,0.07)" }}>
        {[["30+", "Customer discovery\ninterviews"], ["3\u00d7", "Career disciplines\ncombined"], ["1", "Thesis that drives\neverything"]].map(([n, l], i) => (
          <div key={i} style={{ padding: "32px 48px", borderRight: i < 2 ? "1px solid rgba(242,237,228,0.07)" : "none" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: c.accent.hex, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 12, color: c.muted.hex, marginTop: 8, lineHeight: 1.6, whiteSpace: "pre-line" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
