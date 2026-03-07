import { useState } from "react";

// ─── 3 BRAND DIRECTIONS ───────────────────────────────────────────────────────
const DIRECTIONS = [
  {
    id: "architect",
    label: "The Architect",
    tagline: "Scientific rigour meets ruthless clarity.",
    desc: "Dark, editorial, authoritative. Built for investors and serious founders. Thinks Reshma Saujani meets a Pentagram-designed science journal.",
    vibe: ["Editorial", "Dark", "Authoritative", "Minimal"],
    colors: {
      bg:      { hex: "#0E0E0C", name: "Carbon",        role: "Background" },
      surface: { hex: "#1A1A17", name: "Obsidian",      role: "Surface" },
      primary: { hex: "#F2EDE4", name: "Warm Ivory",    role: "Primary text" },
      accent:  { hex: "#C9973A", name: "Raw Amber",     role: "Accent / CTA" },
      muted:   { hex: "#6B6560", name: "Ash",           role: "Secondary text" },
    },
    fonts: {
      display: { name: "Playfair Display", weight: "700", css: "'Playfair Display', serif", use: "All headlines" },
      body:    { name: "DM Sans",          weight: "400", css: "'DM Sans', sans-serif",     use: "Body copy, UI" },
      accent:  { name: "Playfair Display Italic", weight: "400i", css: "'Playfair Display', serif", use: "Pull quotes, taglines" },
    },
    gfonts: "Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600",
    tone: {
      attrs: ["Precise without being cold", "Ambitious without being loud", "Authoritative with warmth"],
      examples: [
        "The research doesn't suggest this helps. It shows it does — repeatedly, across populations, under rigorous conditions.",
        "We're not building another nutrition app. We're building the infrastructure that makes the grocery store a health system.",
        "I moved faster than the institution was comfortable with. I'd do it again.",
      ],
      avoid: ["Game-changing", "Passionate about", "Hustle", "Authentic journey", "Leveraging synergies"],
      power: ["Inevitable", "Rigorous", "System", "Evidence", "Precision", "Uncommon", "Deliberate", "Sharp"],
    },
    heroStyle: "dark-editorial",
  },
  {
    id: "cultivator",
    label: "The Cultivator",
    tagline: "Making nutrition inevitable.",
    desc: "Warm, earthy, editorial. The food-meets-science intersection. Feels like Jenna Kutcher's strategic clarity meets a high-end food journal.",
    vibe: ["Warm", "Earthy", "Grounded", "Editorial"],
    colors: {
      bg:      { hex: "#F7F2E8", name: "Linen",         role: "Background" },
      surface: { hex: "#EDE5D4", name: "Warm Sand",     role: "Surface / cards" },
      primary: { hex: "#1F2B1C", name: "Deep Forest",   role: "Primary text" },
      accent:  { hex: "#A0612A", name: "Harvest Amber", role: "Accent / CTA" },
      muted:   { hex: "#7D7060", name: "River Stone",   role: "Secondary text" },
    },
    fonts: {
      display: { name: "Cormorant Garamond", weight: "600", css: "'Cormorant Garamond', serif", use: "Headlines, hero" },
      body:    { name: "DM Sans",            weight: "400", css: "'DM Sans', sans-serif",        use: "Body copy" },
      accent:  { name: "Cormorant Garamond Italic", weight: "400i", css: "'Cormorant Garamond', serif", use: "Taglines, pull quotes" },
    },
    gfonts: "Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600",
    tone: {
      attrs: ["Warm without being soft", "Accessible without losing rigour", "Grounded and ambitious"],
      examples: [
        "Eating well isn't complicated. The system around it is. That's what we're fixing.",
        "I've modelled the cap table and read the nutrition study. Usually before 7am.",
        "The grocery store is the most underutilised health intervention on the planet.",
      ],
      avoid: ["Wellness journey", "Nourish your body", "Holistic", "Transform", "Toxic"],
      power: ["Nourish", "Root", "Build", "Real", "System", "Evidence", "Ground", "Cultivate"],
    },
    heroStyle: "warm-editorial",
  },
  {
    id: "strategist",
    label: "The Strategist",
    tagline: "Where biology meets business.",
    desc: "Crisp, modern, confident. Built for the HBS-to-founder arc. Marie Forleo's directness meets a McKinsey deck that actually has personality.",
    vibe: ["Clean", "Confident", "Modern", "Strategic"],
    colors: {
      bg:      { hex: "#FAFAF8", name: "Off White",     role: "Background" },
      surface: { hex: "#F0EDE6", name: "Cream",         role: "Surface / cards" },
      primary: { hex: "#18191A", name: "Near Black",    role: "Primary text" },
      accent:  { hex: "#2D6A4F", name: "Sage Authority",role: "Accent / CTA" },
      muted:   { hex: "#888580", name: "Warm Grey",     role: "Secondary text" },
    },
    fonts: {
      display: { name: "Fraunces",  weight: "700", css: "'Fraunces', serif",      use: "Big headlines only" },
      body:    { name: "Outfit",    weight: "400", css: "'Outfit', sans-serif",    use: "All body & UI" },
      accent:  { name: "Fraunces Italic", weight: "300i", css: "'Fraunces', serif", use: "Subheads, callouts" },
    },
    gfonts: "Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;600",
    tone: {
      attrs: ["Direct without being blunt", "Strategic with humanity", "Confident, never arrogant"],
      examples: [
        "Most founders talk about their mission. I'd rather show you the model.",
        "Six years restructuring broken businesses taught me one thing: systems beat intentions every time.",
        "Harvard gave me the network. Exeter gave me the science. AlixPartners gave me the ruthlessness. Verifood gets all three.",
      ],
      avoid: ["Crushing it", "My why", "Empower", "Circle back", "Move the needle"],
      power: ["Model", "System", "Ruthless", "Evidence", "Strategy", "Build", "Uncommon", "Precise"],
    },
    heroStyle: "clean-modern",
  },
];

// ─── COLOUR SWATCH ────────────────────────────────────────────────────────────
function Swatch({ hex, name, role, size = "md" }) {
  const lum = (() => { try { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return 0.299*r+0.587*g+0.114*b; } catch { return 128; } })();
  const tc = lum > 145 ? "#111" : "#fff";
  const h = size === "sm" ? 44 : 64;
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", flex: "1 1 90px", minWidth: 80 }}>
      <div style={{ background: hex, height: h, display: "flex", alignItems: "flex-end", padding: "5px 8px" }}>
        <span style={{ color: tc, fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>{hex}</span>
      </div>
      <div style={{ padding: "8px 10px", background: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#111", marginBottom: 1 }}>{name}</div>
        <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>{role}</div>
      </div>
    </div>
  );
}

// ─── COPYABLE BRAND KIT ───────────────────────────────────────────────────────
function BrandKit({ dir }) {
  const [copied, setCopied] = useState(false);
  const brief = `PERSONAL BRAND: Belle Body (Annabelle Body)
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
${dir.tone.examples.map((e,i) => `  ${i+1}. "${e}"`).join("\n")}

VIBE: ${dir.vibe.join(", ")}

USE THIS BRIEF TO:
- Generate brand photography prompts (Midjourney, DALL-E)
- Brief a web designer or Figma template
- Prompt Claude/ChatGPT to write in-brand copy
- Set up a Canva brand kit
- Create LinkedIn banners, email signatures, presentation decks`;

  const copy = () => { navigator.clipboard.writeText(brief); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>Brand Brief — Copy for AI / Design Tools</span>
        <button onClick={copy} style={{ padding: "7px 16px", borderRadius: 6, cursor: "pointer", background: copied ? "#2D6A4F" : "#111", border: "none", color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "background 0.2s" }}>
          {copied ? "✓ Copied!" : "Copy Brief"}
        </button>
      </div>
      <pre style={{ background: "#0f0e0c", border: "1px solid #2a2a28", borderRadius: 10, padding: "16px 18px", fontSize: 11, lineHeight: 1.8, color: "#8a8480", fontFamily: "monospace", whiteSpace: "pre-wrap", margin: 0, maxHeight: 200, overflowY: "auto" }}>{brief}</pre>
    </div>
  );
}

// ─── WEBSITE PREVIEW: DARK EDITORIAL ─────────────────────────────────────────
function PreviewArchitect({ dir }) {
  const c = dir.colors;
  return (
    <div style={{ background: c.bg.hex, minHeight: 600, fontFamily: "'DM Sans', sans-serif", color: c.primary.hex, position: "relative", overflow: "hidden" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid rgba(242,237,228,0.07)` }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: c.primary.hex, letterSpacing: "-0.01em" }}>Belle Body</span>
        <div style={{ display: "flex", gap: 32 }}>
          {["About", "Verifood", "Writing", "Speaking"].map(n => (
            <span key={n} style={{ fontSize: 12, color: c.muted.hex, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>{n}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, color: c.accent.hex, border: `1px solid ${c.accent.hex}`, padding: "7px 16px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Verifood →</span>
      </nav>

      {/* Hero */}
      <div style={{ padding: "80px 48px 60px", position: "relative" }}>
        {/* Big background text */}
        <div style={{ position: "absolute", top: 40, right: -20, fontFamily: "'Playfair Display', serif", fontSize: "clamp(120px,18vw,220px)", fontWeight: 700, color: "rgba(242,237,228,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none", letterSpacing: "-0.04em" }}>BELLE</div>

        <div style={{ maxWidth: 640, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: c.accent.hex }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.accent.hex, fontWeight: 600 }}>Founder · Scientist · Athlete</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 8px", color: c.primary.hex, letterSpacing: "-0.02em" }}>
            Scientific rigour
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.05, margin: "0 0 28px", color: c.accent.hex, letterSpacing: "-0.02em" }}>
            meets ruthless clarity.
          </h1>
          <p style={{ fontSize: 16, color: c.muted.hex, lineHeight: 1.8, maxWidth: 480, margin: "0 0 36px" }}>
            Founder of Verifood. HBS MBA '26. Building the AI nutrition layer the grocery industry didn't know it needed.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ padding: "12px 24px", background: c.accent.hex, color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 4, letterSpacing: "0.04em", cursor: "pointer" }}>Follow the build</span>
            <span style={{ padding: "12px 24px", border: `1px solid rgba(242,237,228,0.15)`, color: c.muted.hex, fontSize: 13, borderRadius: 4, cursor: "pointer" }}>Read my writing</span>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div style={{ borderTop: `1px solid rgba(242,237,228,0.07)`, borderBottom: `1px solid rgba(242,237,228,0.07)`, padding: "12px 0", display: "flex", gap: 48, overflow: "hidden", background: c.surface.hex }}>
        {[...dir.vibe, "HBS MBA '26", "ICAEW ACA", "Hyrox Athlete", ...dir.tone.power].map((w, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: c.muted.hex, whiteSpace: "nowrap" }}>{w}</span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, margin: "0", borderBottom: `1px solid rgba(242,237,228,0.07)` }}>
        {[["30+", "Customer discovery\ninterviews"], ["3×", "Career disciplines\ncombined"], ["1", "Thesis: the grocery\nstore is the answer"]].map(([n, l], i) => (
          <div key={i} style={{ padding: "32px 48px", borderRight: i < 2 ? `1px solid rgba(242,237,228,0.07)` : "none" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: c.accent.hex, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 12, color: c.muted.hex, marginTop: 8, lineHeight: 1.6, whiteSpace: "pre-line" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WEBSITE PREVIEW: WARM EDITORIAL ─────────────────────────────────────────
function PreviewCultivator({ dir }) {
  const c = dir.colors;
  return (
    <div style={{ background: c.bg.hex, minHeight: 600, fontFamily: "'DM Sans', sans-serif", color: c.primary.hex }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid rgba(31,43,28,0.1)` }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: c.primary.hex, lineHeight: 1 }}>Belle Body</div>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: c.muted.hex, marginTop: 2 }}>Founder · Scientist</div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["About", "Verifood", "Writing", "Speaking", "Contact"].map(n => (
            <span key={n} style={{ fontSize: 13, color: c.muted.hex, cursor: "pointer" }}>{n}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: c.accent.hex, padding: "9px 20px", borderRadius: 4, cursor: "pointer" }}>Verifood →</span>
      </nav>

      {/* Hero — split layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 380 }}>
        <div style={{ padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${c.accent.hex}18`, border: `1px solid ${c.accent.hex}40`, borderRadius: 40, padding: "5px 14px", fontSize: 11, color: c.accent.hex, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 24, width: "fit-content" }}>
            ✦ Harvard · Exeter · ICAEW
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 300, lineHeight: 1.1, margin: "0 0 20px", color: c.primary.hex, letterSpacing: "-0.01em" }}>
            Making nutrition<br /><em style={{ fontWeight: 600, color: c.accent.hex }}>inevitable.</em>
          </h1>
          <p style={{ fontSize: 15, color: c.muted.hex, lineHeight: 1.8, margin: "0 0 32px", maxWidth: 380 }}>
            Building Verifood — the AI nutrition layer that belongs in every grocery store on earth.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ padding: "12px 22px", background: c.primary.hex, color: c.bg.hex, fontSize: 13, fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>Follow the build</span>
            <span style={{ padding: "12px 22px", border: `1px solid ${c.primary.hex}30`, color: c.muted.hex, fontSize: 13, borderRadius: 4, cursor: "pointer" }}>@iambeangirl</span>
          </div>
        </div>
        {/* Right — editorial text block */}
        <div style={{ background: c.primary.hex, padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: `${c.bg.hex}60`, letterSpacing: "0.08em" }}>— the thesis</div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,2.5vw,28px)", color: c.bg.hex, lineHeight: 1.5, fontWeight: 300, margin: "0 0 24px" }}>
              "The grocery store is the most underutilised health intervention on the planet. We're fixing that."
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {Object.values(c).slice(0, 4).map((col, i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: col.hex, border: "2px solid rgba(255,255,255,0.2)" }} title={col.name} />
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: `${c.bg.hex}40`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Verifood · HBS '26 · Hyrox</div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: `1px solid rgba(31,43,28,0.1)` }}>
        {[["⚗️", "The Science", "Evidence-based nutrition, no fads"], ["🏗️", "The Build", "Transparent Verifood founder journey"], ["🏋️", "The Athlete", "Hyrox, performance, lived experiment"]].map(([icon, t, s], i) => (
          <div key={i} style={{ padding: "28px 36px", borderRight: i < 2 ? `1px solid rgba(31,43,28,0.1)` : "none", cursor: "pointer" }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: c.primary.hex, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12, color: c.muted.hex, lineHeight: 1.6 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WEBSITE PREVIEW: CLEAN MODERN ───────────────────────────────────────────
function PreviewStrategist({ dir }) {
  const c = dir.colors;
  return (
    <div style={{ background: c.bg.hex, minHeight: 600, fontFamily: "'Outfit', sans-serif", color: c.primary.hex }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: `1px solid rgba(24,25,26,0.08)`, background: c.bg.hex }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: c.primary.hex, letterSpacing: "-0.02em" }}>BB</span>
        <div style={{ display: "flex", gap: 28 }}>
          {["About", "Verifood", "Writing", "Speaking"].map(n => (
            <span key={n} style={{ fontSize: 13, color: c.muted.hex, cursor: "pointer", fontWeight: 500 }}>{n}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: c.accent.hex, fontWeight: 600, cursor: "pointer" }}>LinkedIn →</span>
          <span style={{ padding: "8px 18px", background: c.accent.hex, color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>Verifood</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "72px 48px 56px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent.hex, marginTop: 6, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: c.accent.hex, letterSpacing: "0.08em", textTransform: "uppercase" }}>Founder, Verifood · HBS MBA '26</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(44px, 6.5vw, 76px)", fontWeight: 700, lineHeight: 1.0, margin: "0 0 6px", letterSpacing: "-0.03em", color: c.primary.hex }}>
          Where biology
        </h1>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(44px, 6.5vw, 76px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.0, margin: "0 0 28px", letterSpacing: "-0.03em", color: c.accent.hex }}>
          meets business.
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 720 }}>
          <p style={{ fontSize: 15, color: c.muted.hex, lineHeight: 1.8, margin: 0 }}>
            Six years restructuring broken companies. One degree in biological sciences. One Harvard MBA. One question: why is the grocery store the last place anyone looks for health advice?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Verifood →", true], ["Read my writing", false], ["Speak at my event", false]].map(([label, primary], i) => (
              <span key={i} style={{ padding: "11px 20px", background: primary ? c.accent.hex : "transparent", border: `1px solid ${primary ? c.accent.hex : `rgba(24,25,26,0.15)`}`, color: primary ? "#fff" : c.muted.hex, fontSize: 13, fontWeight: primary ? 600 : 400, borderRadius: 6, cursor: "pointer", textAlign: "center" }}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Credential bar */}
      <div style={{ padding: "0 48px 0", margin: "0", borderTop: `1px solid rgba(24,25,26,0.07)` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[["HBS", "MBA Candidate 2026"], ["ACA", "Chartered Accountant"], ["BSc", "Biological Sciences"], ["Hyrox", "Competitive Athlete"]].map(([abbr, label], i) => (
            <div key={i} style={{ padding: "20px 0", borderRight: i < 3 ? `1px solid rgba(24,25,26,0.07)` : "none", paddingLeft: i === 0 ? 0 : 24 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: c.primary.hex, letterSpacing: "-0.02em" }}>{abbr}</div>
              <div style={{ fontSize: 11, color: c.muted.hex, marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = { architect: PreviewArchitect, cultivator: PreviewCultivator, strategist: PreviewStrategist };

// ─── DIRECTION CARD ───────────────────────────────────────────────────────────
function DirectionCard({ dir, selected, onSelect }) {
  const c = dir.colors;
  const Preview = PREVIEWS[dir.id];
  const [tab, setTab] = useState("preview"); // preview | palette | type | voice

  return (
    <div style={{ border: selected ? "2px solid #C9973A" : "2px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s", background: "#141412" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            {dir.vibe.map((v, i) => <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "#6a6460", letterSpacing: "0.05em" }}>{v}</span>)}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f0ece4", margin: "0 0 3px" }}>{dir.label}</h2>
          <p style={{ fontSize: 12, color: "#6a6460", margin: 0, lineHeight: 1.5 }}>{dir.desc}</p>
        </div>
        <button onClick={onSelect} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: selected ? "#C9973A" : "rgba(255,255,255,0.06)", border: selected ? "none" : "1px solid rgba(255,255,255,0.1)", color: selected ? "#0f0e0c" : "#6a6460", fontSize: 13, fontWeight: 700, fontFamily: "inherit", flexShrink: 0, marginLeft: 20, transition: "all 0.2s" }}>
          {selected ? "✓ Selected" : "Select"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        {[["preview", "Website Preview"], ["palette", "Colour Palette"], ["type", "Typography"], ["voice", "Voice & Tone"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: tab === key ? "2px solid #C9973A" : "2px solid transparent", color: tab === key ? "#f0ece4" : "#5a5450", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.03em", marginBottom: -1, transition: "color 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* PREVIEW TAB */}
        {tab === "preview" && (
          <div>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=${dir.gfonts}&display=swap');`}</style>
            <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "138.9%", pointerEvents: "none" }}>
              <Preview dir={dir} />
            </div>
          </div>
        )}

        {/* PALETTE TAB */}
        {tab === "palette" && (
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
              {Object.values(c).map((col, i) => <Swatch key={i} {...col} />)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.values(c).map((col, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: col.hex, flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#d8d0c8" }}>{col.name}</div>
                    <div style={{ fontSize: 10, color: "#5a5450", fontFamily: "monospace" }}>{col.hex} · {col.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPOGRAPHY TAB */}
        {tab === "type" && (
          <div style={{ padding: "24px" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=${dir.gfonts}&display=swap');`}</style>
            {[
              ["Display", dir.fonts.display],
              ["Body", dir.fonts.body],
              ["Accent", dir.fonts.accent],
            ].map(([role, font]) => (
              <div key={role} style={{ marginBottom: 20, padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9973A", marginBottom: 8 }}>{role}</div>
                <div style={{ fontFamily: font.css, fontSize: role === "Display" ? 32 : role === "Accent" ? 22 : 16, fontStyle: font.name.toLowerCase().includes("italic") ? "italic" : "normal", fontWeight: role === "Display" ? 700 : 400, color: "#f0ece4", lineHeight: 1.2, marginBottom: 6 }}>
                  {role === "Display" ? "Making nutrition inevitable." : role === "Accent" ? "\"Scientific rigour meets ruthless clarity.\"" : "Building the AI nutrition layer the grocery industry didn't know it needed."}
                </div>
                <div style={{ fontSize: 11, color: "#5a5450" }}>{font.name} · {font.use}</div>
              </div>
            ))}
          </div>
        )}

        {/* VOICE TAB */}
        {tab === "voice" && (
          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9973A", marginBottom: 12 }}>Voice Attributes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {dir.tone.attrs.map((a, i) => (
                  <div key={i} style={{ padding: "10px 14px", background: "rgba(201,151,58,0.08)", border: "1px solid rgba(201,151,58,0.2)", borderRadius: 8, fontSize: 13, color: "#d8d0c8", fontWeight: 500 }}>✦ {a}</div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9973A", marginBottom: 12 }}>Example Copy</div>
              {dir.tone.examples.map((ex, i) => (
                <div key={i} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderLeft: "2px solid rgba(201,151,58,0.4)", marginBottom: 8, borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 13, color: "#b0a8a0", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>"{ex}"</p>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5450", marginBottom: 8 }}>Power Words</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {dir.tone.power.map((w, i) => <span key={i} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 4, fontSize: 11, color: "#8a8480" }}>{w}</span>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5450", marginBottom: 8 }}>Never Use</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {dir.tone.avoid.map((w, i) => <span key={i} style={{ padding: "4px 10px", background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.15)", borderRadius: 4, fontSize: 11, color: "#885050" }}>{w}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Kit — always visible at bottom */}
      {selected && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px", background: "#0f0e0c" }}>
          <BrandKit dir={dir} />
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", fontFamily: "'DM Sans', -apple-system, sans-serif", color: "#f0ece4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#2a2820;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.5s ease both}
        .fu2{animation:fadeUp 0.5s 0.1s ease both}
        .fu3{animation:fadeUp 0.5s 0.2s ease both}
      `}</style>

      {/* Top bar */}
      <div style={{ padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#4a4840", letterSpacing: "0.08em", textTransform: "uppercase" }}>Personal Brand Studio · Belle Body</span>
        <span style={{ fontSize: 11, color: "#3a3830" }}>3 directions · Select one to export</span>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 40px 32px", textAlign: "center" }}>
        <div className="fu" style={{ display: "inline-block", background: "rgba(201,151,58,0.1)", border: "1px solid rgba(201,151,58,0.25)", borderRadius: 40, padding: "4px 14px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9973A", marginBottom: 18 }}>
          Your Brand Identity · 3 Directions
        </div>
        <h1 className="fu2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Three directions. One you.<br />
          <span style={{ fontWeight: 400, fontStyle: "italic", color: "#C9973A" }}>Pick the one that feels inevitable.</span>
        </h1>
        <p className="fu3" style={{ fontSize: 14, color: "#5a5450", margin: "0 auto", maxWidth: 520, lineHeight: 1.75 }}>
          Each direction has a complete colour system, font pairing, and tone of voice — ready to copy into Figma, Canva, Midjourney, or any AI tool. Select one to reveal your full brand brief.
        </p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
        {DIRECTIONS.map(dir => (
          <DirectionCard key={dir.id} dir={dir} selected={selected === dir.id} onSelect={() => setSelected(dir.id === selected ? null : dir.id)} />
        ))}
      </div>

      {/* Sticky bottom CTA when selected */}
      {selected && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 40px", background: "#0f0e0c", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0ece4" }}>
              ✦ {DIRECTIONS.find(d => d.id === selected)?.label} selected
            </div>
            <div style={{ fontSize: 11, color: "#5a5450", marginTop: 2 }}>Scroll up → Voice tab → Copy Brand Brief</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { const d = DIRECTIONS.find(x => x.id === selected); const el = document.querySelector(`[data-id="${selected}"]`); }} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#8a8480", fontSize: 13, fontFamily: "inherit" }}>
              ← Change direction
            </button>
            <button onClick={() => { const d = DIRECTIONS.find(x => x.id === selected); const brief = `PERSONAL BRAND: Belle Body\nDIRECTION: ${d.label}\nTAGLINE: "${d.tagline}"\n\nCOLOUR PALETTE:\n${Object.values(d.colors).map(c=>`  ${c.hex}  ${c.name}  (${c.role})`).join("\n")}\n\nTYPOGRAPHY:\n  Display: ${d.fonts.display.name} — ${d.fonts.display.use}\n  Body: ${d.fonts.body.name} — ${d.fonts.body.use}\n  Accent: ${d.fonts.accent.name} — ${d.fonts.accent.use}\n\nTONE: ${d.tone.attrs.join(" · ")}\nPOWER WORDS: ${d.tone.power.join(", ")}\nNEVER USE: ${d.tone.avoid.join(", ")}\n\nEXAMPLE COPY:\n${d.tone.examples.map((e,i)=>`  ${i+1}. "${e}"`).join("\n")}`; navigator.clipboard.writeText(brief); }} style={{ padding: "10px 22px", borderRadius: 8, cursor: "pointer", background: "#C9973A", border: "none", color: "#0f0e0c", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              Copy Brand Brief →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
