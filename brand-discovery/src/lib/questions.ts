export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "radio" | "chips" | "mood-board" | "icon-grid";
  placeholder?: string;
  options?: string[];
  maxSelect?: number;
}

export interface Section {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

export const MOOD_BOARD_IMAGES = [
  { src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop", label: "Warm food flat lay" },
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop", label: "Editorial portrait" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", label: "Clean white workspace" },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop", label: "Earthy textures" },
  { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop", label: "Athletic lifestyle" },
  { src: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&h=300&fit=crop", label: "Urban editorial" },
  { src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop", label: "Dark moody still life" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", label: "Pale minimal" },
  { src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop", label: "Nature close-up" },
  { src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop", label: "Bold graphic" },
  { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop", label: "Warm portrait" },
  { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", label: "Data / tech" },
];

export const BRAND_ICONS = [
  { name: "Michelle Obama", desc: "Power, grace, warmth at scale" },
  { name: "Oprah", desc: "Storytelling, authority, emotional depth" },
  { name: "Melinda Gates", desc: "Philanthropy, measured ambition" },
  { name: "Beyonce", desc: "Mastery, discipline, cultural leadership" },
  { name: "Taylor Swift", desc: "Narrative control, reinvention" },
  { name: "Rihanna", desc: "Bold brand extensions, unfiltered identity" },
  { name: "Barack Obama", desc: "Intellectual warmth, aspirational calm" },
  { name: "Sara Blakely", desc: "Founder hustle, relatable origin story" },
  { name: "Brene Brown", desc: "Vulnerability as strength, research + humanity" },
  { name: "Naval Ravikant", desc: "Aphoristic clarity, intellectual authority" },
  { name: "Steve Jobs", desc: "Minimalism, product religion" },
  { name: "Arianna Huffington", desc: "Reinvention, wellness authority" },
  { name: "Tim Ferriss", desc: "Systematic thinking, lifestyle design" },
  { name: "Yvon Chouinard", desc: "Values-led brand, anti-corporate" },
  { name: "Esther Perel", desc: "Depth, nuance, European intellectual warmth" },
  { name: "Alex Hormozi", desc: "Direct response, no-fluff execution" },
];

export const SECTIONS: Section[] = [
  {
    id: 1,
    title: "About You",
    subtitle: "Let's start with who you are and who you're building for.",
    questions: [
      { id: "q1", label: "What is your name?", type: "text", placeholder: "Your full name" },
      { id: "q2", label: "What do you do?", type: "text", placeholder: "e.g. Founder · Investor · Creative Director" },
      {
        id: "q3",
        label: "Who is your primary audience?",
        type: "chips",
        options: ["Investors", "Potential co-founders", "Industry partners", "Customers / clients", "General public", "Media / press", "Hiring talent", "Community"],
      },
      {
        id: "q4",
        label: "What stage are you at?",
        type: "radio",
        options: ["Idea / exploring", "Pre-seed / seed stage founder", "Series A+ founder", "Established executive", "Investor / advisor", "Creative / freelancer"],
      },
    ],
  },
  {
    id: 2,
    title: "Your Story",
    subtitle: "The narrative that makes you memorable.",
    questions: [
      { id: "q5", label: "What is your professional background?", type: "textarea", placeholder: "Degrees, companies, roles — bullet points fine." },
      { id: "q6", label: "What is the one thing you want people to know about you?", type: "textarea", placeholder: "Your thesis, your mission, your point of view." },
      { id: "q7", label: "What makes your path unusual or interesting?", type: "textarea", placeholder: "Career pivots, unconventional combinations, counterintuitive backstory." },
    ],
  },
  {
    id: 3,
    title: "Your Work",
    subtitle: "What you're building and why it matters.",
    questions: [
      { id: "q8", label: "What are you building or working on?", type: "textarea", placeholder: "Your startup, project, role, or portfolio." },
      { id: "q9", label: "What problem does it solve?", type: "textarea", placeholder: "What pain does your work remove? For whom?" },
      { id: "q10", label: "What is your thesis or point of view?", type: "textarea", placeholder: "One sentence that represents your worldview." },
    ],
  },
  {
    id: 4,
    title: "Your Aesthetic",
    subtitle: "The visual world you want to inhabit.",
    questions: [
      {
        id: "q11",
        label: "How do you want to feel when someone lands on your site?",
        type: "chips",
        options: ["Credible", "Warm", "Ambitious", "Grounded", "Inspiring", "Approachable", "Bold", "Calm", "Exciting", "Trustworthy", "Innovative", "Premium"],
        maxSelect: 4,
      },
      {
        id: "q12",
        label: "What words describe your aesthetic?",
        type: "chips",
        options: ["Editorial", "Warm", "Minimal", "Earthy", "Clean", "Modern", "Geometric", "Natural", "Bold", "Understated", "Textured", "Refined"],
        maxSelect: 4,
      },
      {
        id: "q13",
        label: "Visual mood board — tap the images that feel right",
        type: "mood-board",
      },
      {
        id: "q14",
        label: "Brands or people whose visual identity you admire",
        type: "icon-grid",
        maxSelect: 5,
      },
    ],
  },
  {
    id: 5,
    title: "Your Voice",
    subtitle: "How you sound — and how you never want to.",
    questions: [
      {
        id: "q15",
        label: "How would you describe your communication style?",
        type: "radio",
        options: ["Warm and conversational", "Direct and evidence-based", "Visionary and inspirational", "Strategic and analytical", "Playful and relatable", "Calm and thoughtful"],
      },
      {
        id: "q16",
        label: "What tone do you want to avoid?",
        type: "chips",
        options: ["Hustle culture", "Wellness cliche", "Corporate jargon", "Diet culture", "Overly academic", "Celebrity lifestyle", "Tech bro", "Self-help generic"],
      },
      { id: "q17", label: "Write one sentence that sounds like you", type: "textarea", placeholder: "Don't overthink it — just write how you'd say something you believe." },
      { id: "q18", label: "What words do you never want associated with your brand?", type: "textarea", placeholder: "Cliches, buzzwords, tones that aren't you." },
    ],
  },
  {
    id: 6,
    title: "Your Platforms",
    subtitle: "Where you show up and what you want people to do.",
    questions: [
      {
        id: "q19",
        label: "Where do you primarily show up online?",
        type: "chips",
        options: ["LinkedIn", "Instagram", "Twitter / X", "Newsletter", "Podcast", "YouTube", "Personal website", "Substack"],
      },
      { id: "q20", label: "What is your Instagram handle?", type: "text", placeholder: "@yourhandle" },
      {
        id: "q21",
        label: "What do you want people to do after visiting your site?",
        type: "chips",
        options: ["Follow my build", "Connect on LinkedIn", "Learn about Verifood", "Book a call", "Join my waitlist", "Read my writing", "Hire me", "Invest in me"],
        maxSelect: 3,
      },
      { id: "q22", label: "Anything else you want to share?", type: "textarea", placeholder: "Context, constraints, things you want the brand to account for." },
    ],
  },
];
