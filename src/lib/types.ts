export interface ColorToken {
  hex: string;
  name: string;
  role: string;
}

export interface FontToken {
  name: string;
  weight: string;
  css: string;
  use: string;
}

export interface ToneSystem {
  attrs: string[];
  examples: string[];
  power: string[];
  avoid: string[];
}

export interface BrandDirection {
  id: string;
  label: string;
  tagline: string;
  desc: string;
  vibe: string[];
  colors: {
    bg: ColorToken;
    surface: ColorToken;
    primary: ColorToken;
    accent: ColorToken;
    muted: ColorToken;
  };
  fonts: {
    display: FontToken;
    body: FontToken;
    accent: FontToken;
  };
  gfonts: string;
  tone: ToneSystem;
  heroStyle: string;
}

// This-or-That pair choice: "left" | "right" | null
export interface ThisOrThatPair {
  left: string;
  right: string;
}

// Spectrum slider: 0-100 value
export interface SpectrumItem {
  left: string;
  right: string;
}

export interface QuestionnaireAnswers {
  // Section 1 — The Quick-Fire Round
  q1: Record<string, "left" | "right">;  // this-or-that pairs
  q2: string;                             // perfect sunday morning
  q3: string[];                           // 3-hour topics (chips + custom)
  q3_custom: string;                      // custom additions

  // Section 2 — Your World Online
  q4: string[];                           // social feed content
  q4_custom: string;
  q5: string[];                           // visual style drawn to
  q6: string[];                           // what you post about
  q6_custom: string;

  // Section 3 — Your People & Edges
  q8: string[];                           // people you admire (icon grid)
  q8_custom: string;                      // add your own
  q9: string;                             // what they have in common
  q10: string[];                          // cringe brand tropes
  q11: Record<string, number>;            // spectrum sliders (0-100)

  // Section 4 — Your Visual World (KEPT)
  q12: string[];                          // feeling chips
  q13: string[];                          // aesthetic chips
  q14: number[];                          // mood board indices
  q15: string[];                          // visual identity admire (icon grid)

  // Section 5 — Voice & Difference
  q16: string;                            // unusual combination
  q17: string;                            // what people come to you for
  q18: string;                            // one sentence voice sample
  q19: string;                            // never come across as
  q20: string;                            // banned words

  // Section 6 — Ground It
  q21: string;                            // name
  q22: string;                            // what you do today
  q23: string;                            // professional backstory
  q24: string[];                          // platforms
  q25: string[];                          // CTAs
  q26: string;                            // anything else
}

export type AppScreen = "splash" | "questionnaire" | "loading" | "results";
