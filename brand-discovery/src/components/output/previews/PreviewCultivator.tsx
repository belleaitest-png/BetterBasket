"use client";

import { BrandDirection } from "@/lib/types";

interface Props {
  dir: BrandDirection;
  userName: string;
  userRole: string;
}

export function PreviewCultivator({ dir, userName, userRole }: Props) {
  const c = dir.colors;

  return (
    <div style={{ background: c.bg.hex, minHeight: 600, fontFamily: "'DM Sans', sans-serif", color: c.primary.hex }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid rgba(31,43,28,0.1)` }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{userName}</div>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: c.muted.hex, marginTop: 2 }}>{userRole}</div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["About", "Work", "Writing", "Speaking", "Contact"].map(n => (
            <span key={n} style={{ fontSize: 13, color: c.muted.hex, cursor: "pointer" }}>{n}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: c.accent.hex, padding: "9px 20px", borderRadius: 4, cursor: "pointer" }}>Connect &rarr;</span>
      </nav>

      {/* Hero split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 380 }}>
        <div style={{ padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${c.accent.hex}18`, border: `1px solid ${c.accent.hex}40`, borderRadius: 40, padding: "5px 14px", fontSize: 11, color: c.accent.hex, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 24, width: "fit-content" }}>
            \u2726 {userRole}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 300, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
            {dir.tagline.split(" ").slice(0, -1).join(" ")}<br />
            <em style={{ fontWeight: 600, color: c.accent.hex }}>{dir.tagline.split(" ").slice(-1)[0]}</em>
          </h1>
          <p style={{ fontSize: 15, color: c.muted.hex, lineHeight: 1.8, margin: "0 0 32px", maxWidth: 380 }}>
            {dir.tone.examples[0]}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ padding: "12px 22px", background: c.primary.hex, color: c.bg.hex, fontSize: 13, fontWeight: 600, borderRadius: 4 }}>Follow the build</span>
            <span style={{ padding: "12px 22px", border: `1px solid ${c.primary.hex}30`, color: c.muted.hex, fontSize: 13, borderRadius: 4 }}>Connect</span>
          </div>
        </div>

        {/* Right editorial */}
        <div style={{ background: c.primary.hex, padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: `${c.bg.hex}60`, letterSpacing: "0.08em" }}>&mdash; the thesis</div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,2.5vw,28px)", color: c.bg.hex, lineHeight: 1.5, fontWeight: 300, margin: "0 0 24px" }}>
              &ldquo;{dir.tone.examples[2]}&rdquo;
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {Object.values(c).slice(0, 4).map((col, i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: col.hex, border: "2px solid rgba(255,255,255,0.2)" }} title={col.name} />
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: `${c.bg.hex}40`, letterSpacing: "0.1em", textTransform: "uppercase" }}>{userName}</div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: `1px solid rgba(31,43,28,0.1)` }}>
        {[
          ["\u2697\ufe0f", "The Science", dir.tone.attrs[1]],
          ["\ud83c\udfd7\ufe0f", "The Build", dir.tone.attrs[2]],
          ["\ud83c\udfcb\ufe0f", "The Athlete", dir.tone.attrs[0]],
        ].map(([icon, t, s], i) => (
          <div key={i} style={{ padding: "28px 36px", borderRight: i < 2 ? `1px solid rgba(31,43,28,0.1)` : "none" }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12, color: c.muted.hex, lineHeight: 1.6 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
