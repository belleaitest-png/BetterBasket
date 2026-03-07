"use client";

import { BrandDirection } from "@/lib/types";

interface Props {
  dir: BrandDirection;
  userName: string;
  userRole: string;
}

export function PreviewStrategist({ dir, userName, userRole }: Props) {
  const c = dir.colors;

  return (
    <div style={{ background: c.bg.hex, minHeight: 600, fontFamily: "'Outfit', sans-serif", color: c.primary.hex }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: `1px solid rgba(24,25,26,0.08)` }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {userName.split(" ").map(n => n[0]).join("")}
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {["About", "Work", "Writing", "Speaking"].map(n => (
            <span key={n} style={{ fontSize: 13, color: c.muted.hex, cursor: "pointer", fontWeight: 500 }}>{n}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: c.accent.hex, fontWeight: 600, cursor: "pointer" }}>LinkedIn &rarr;</span>
          <span style={{ padding: "8px 18px", background: c.accent.hex, color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 6 }}>Connect</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "72px 48px 56px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent.hex, marginTop: 6, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: c.accent.hex, letterSpacing: "0.08em", textTransform: "uppercase" }}>{userRole}</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(44px, 6.5vw, 76px)", fontWeight: 700, lineHeight: 1.0, margin: "0 0 6px", letterSpacing: "-0.03em" }}>
          {dir.tagline.split(" ").slice(0, 2).join(" ")}
        </h1>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(44px, 6.5vw, 76px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.0, margin: "0 0 28px", letterSpacing: "-0.03em", color: c.accent.hex }}>
          {dir.tagline.split(" ").slice(2).join(" ")}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 720 }}>
          <p style={{ fontSize: 15, color: c.muted.hex, lineHeight: 1.8, margin: 0 }}>
            {dir.tone.examples[1]}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Connect &rarr;", true], ["Read my writing", false], ["Speak at my event", false]].map(([label, primary], i) => (
              <span
                key={i}
                dangerouslySetInnerHTML={{ __html: label as string }}
                style={{
                  padding: "11px 20px",
                  background: primary ? c.accent.hex : "transparent",
                  border: `1px solid ${primary ? c.accent.hex : "rgba(24,25,26,0.15)"}`,
                  color: primary ? "#fff" : c.muted.hex,
                  fontSize: 13,
                  fontWeight: primary ? 600 : 400,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Credential bar */}
      <div style={{ padding: "0 48px", borderTop: "1px solid rgba(24,25,26,0.07)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[["Brand", dir.label], ["Voice", dir.tone.attrs[0]], ["Vibe", dir.vibe.join(" \u00b7 ")], ["Style", dir.heroStyle]].map(([abbr, label], i) => (
            <div key={i} style={{ padding: "20px 0", borderRight: i < 3 ? "1px solid rgba(24,25,26,0.07)" : "none", paddingLeft: i === 0 ? 0 : 24 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{abbr}</div>
              <div style={{ fontSize: 11, color: c.muted.hex, marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
