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

export interface QuestionnaireAnswers {
  // Section 1 — About You
  q1: string;   // name
  q2: string;   // role
  q3: string[]; // audience (multi)
  q4: string;   // stage

  // Section 2 — Your Story
  q5: string;   // background
  q6: string;   // one thing
  q7: string;   // unusual path

  // Section 3 — Your Work
  q8: string;   // building
  q9: string;   // problem
  q10: string;  // thesis

  // Section 4 — Your Aesthetic
  q11: string[]; // feeling chips
  q12: string[]; // aesthetic chips
  q13: number[]; // mood board selections (indices)
  q14: string[]; // admired brands

  // Section 5 — Your Voice
  q15: string;   // communication style
  q16: string[]; // tone to avoid
  q17: string;   // sample sentence
  q18: string;   // banned words

  // Section 6 — Your Platforms
  q19: string[]; // platforms
  q20: string;   // instagram handle
  q21: string[]; // CTA goals
  q22: string;   // anything else
}

export type AppScreen = "splash" | "questionnaire" | "loading" | "results";
