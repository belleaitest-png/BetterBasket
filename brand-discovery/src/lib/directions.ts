import { BrandDirection } from "./types";

export const DIRECTIONS: BrandDirection[] = [
  {
    id: "architect",
    label: "The Architect",
    tagline: "Scientific rigour meets ruthless clarity.",
    desc: "Dark, editorial, authoritative. Built for investors and serious founders. Thinks Reshma Saujani meets a Pentagram-designed science journal.",
    vibe: ["Editorial", "Dark", "Authoritative", "Minimal"],
    colors: {
      bg: { hex: "#0E0E0C", name: "Carbon", role: "Background" },
      surface: { hex: "#1A1A17", name: "Obsidian", role: "Surface" },
      primary: { hex: "#F2EDE4", name: "Warm Ivory", role: "Primary text" },
      accent: { hex: "#C9973A", name: "Raw Amber", role: "Accent / CTA" },
      muted: { hex: "#6B6560", name: "Ash", role: "Secondary text" },
    },
    fonts: {
      display: { name: "Playfair Display", weight: "700", css: "'Playfair Display', serif", use: "All headlines" },
      body: { name: "DM Sans", weight: "400", css: "'DM Sans', sans-serif", use: "Body copy, UI" },
      accent: { name: "Playfair Display Italic", weight: "400i", css: "'Playfair Display', serif", use: "Pull quotes, taglines" },
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
      bg: { hex: "#F7F2E8", name: "Linen", role: "Background" },
      surface: { hex: "#EDE5D4", name: "Warm Sand", role: "Surface / cards" },
      primary: { hex: "#1F2B1C", name: "Deep Forest", role: "Primary text" },
      accent: { hex: "#A0612A", name: "Harvest Amber", role: "Accent / CTA" },
      muted: { hex: "#7D7060", name: "River Stone", role: "Secondary text" },
    },
    fonts: {
      display: { name: "Cormorant Garamond", weight: "600", css: "'Cormorant Garamond', serif", use: "Headlines, hero" },
      body: { name: "DM Sans", weight: "400", css: "'DM Sans', sans-serif", use: "Body copy" },
      accent: { name: "Cormorant Garamond Italic", weight: "400i", css: "'Cormorant Garamond', serif", use: "Taglines, pull quotes" },
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
      bg: { hex: "#FAFAF8", name: "Off White", role: "Background" },
      surface: { hex: "#F0EDE6", name: "Cream", role: "Surface / cards" },
      primary: { hex: "#18191A", name: "Near Black", role: "Primary text" },
      accent: { hex: "#2D6A4F", name: "Sage Authority", role: "Accent / CTA" },
      muted: { hex: "#888580", name: "Warm Grey", role: "Secondary text" },
    },
    fonts: {
      display: { name: "Fraunces", weight: "700", css: "'Fraunces', serif", use: "Big headlines only" },
      body: { name: "Outfit", weight: "400", css: "'Outfit', sans-serif", use: "All body & UI" },
      accent: { name: "Fraunces Italic", weight: "300i", css: "'Fraunces', serif", use: "Subheads, callouts" },
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
