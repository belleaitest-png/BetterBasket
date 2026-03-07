import { ThisOrThatPair, SpectrumItem } from "./types";

export interface Question {
  id: string;
  label: string;
  sublabel?: string;
  type: "text" | "textarea" | "radio" | "chips" | "chips-custom" | "mood-board" | "icon-grid" | "this-or-that" | "spectrum";
  placeholder?: string;
  options?: string[];
  maxSelect?: number;
  pairs?: ThisOrThatPair[];
  spectrums?: SpectrumItem[];
  customFieldId?: string; // for chips-custom, the answer key that stores custom entries
}

export interface Section {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

export const THIS_OR_THAT_PAIRS: ThisOrThatPair[] = [
  { left: "Early riser", right: "Night owl" },
  { left: "Plan every detail", right: "Figure it out as I go" },
  { left: "Big group energy", right: "Deep 1-on-1 conversations" },
  { left: "Lead from the front", right: "Empower from behind" },
  { left: "Show me the data", right: "Trust your gut" },
  { left: "Overdressed", right: "Underdressed" },
  { left: "Say more", right: "Say less" },
  { left: "Blends in then surprises you", right: "Fills the room immediately" },
];

export const SPECTRUM_ITEMS: SpectrumItem[] = [
  { left: "Serious", right: "Playful" },
  { left: "Polished", right: "Raw & unfiltered" },
  { left: "Quiet authority", right: "Loud energy" },
  { left: "Warm & emotional", right: "Sharp & analytical" },
  { left: "Traditional", right: "Unconventional" },
];

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
  { name: "Jenna Kutcher", desc: "Warm editorial, strategic clarity" },
  { name: "Reshma Saujani", desc: "Mission-driven authority" },
  { name: "Marie Forleo", desc: "Directness, confident energy" },
  { name: "Sahil Bloom", desc: "Frameworks, clarity, modern thought leadership" },
];

export const SECTIONS: Section[] = [
  {
    id: 1,
    title: "The Quick-Fire Round",
    subtitle: "No overthinking. On your best, highest-energy day\u2026",
    questions: [
      {
        id: "q1",
        label: "This or that \u2014 go with your gut",
        sublabel: "On your best, highest-energy day, which feels more like you?",
        type: "this-or-that",
        pairs: THIS_OR_THAT_PAIRS,
      },
      {
        id: "q2",
        label: "Describe your perfect Sunday morning.",
        sublabel: "Don't overthink it \u2014 just walk us through it.",
        type: "textarea",
        placeholder: "Wake up slowly, coffee on the balcony, a long run through the park\u2026",
      },
      {
        id: "q3",
        label: "What could you talk about for 3 hours without notes?",
        type: "chips-custom",
        customFieldId: "q3_custom",
        options: [
          "Nutrition & food science", "Building a startup", "Fitness & training",
          "Behavioural psychology", "Investing & markets", "Design & aesthetics",
          "Travel & culture", "Cooking", "Climate & sustainability",
          "Tech & AI", "Music", "Books", "Sport strategy",
          "Philosophy", "Health systems", "Education", "Parenting",
          "Fashion", "Science", "History",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Your World Online",
    subtitle: "What you consume says more about you than what you say about yourself.",
    questions: [
      {
        id: "q4",
        label: "What does your social media feed look like?",
        sublabel: "What keeps showing up? Tap all that apply.",
        type: "chips-custom",
        customFieldId: "q4_custom",
        options: [
          "Food & recipes", "Fitness & training", "Interior design", "Fashion",
          "Travel", "Founders & startups", "Science & research", "Art & photography",
          "News & politics", "Finance & investing", "Nature & outdoors",
          "Architecture", "Books & reading", "Wellness & mindfulness",
          "Comedy & memes", "Tech & AI", "Beauty", "Music", "Sport",
          "Parenting",
        ],
      },
      {
        id: "q5",
        label: "The content you\u2019re drawn to \u2014 what does it look like?",
        sublabel: "Not who \u2014 what visual style pulls you in?",
        type: "chips",
        options: [
          "Clean & minimal", "Dark & moody", "Bright & colourful",
          "Earthy & warm", "Editorial & polished", "Raw & unfiltered",
          "Text-heavy / quote-led", "Photo-led / visual-first",
          "Data & infographics", "Video-first",
        ],
        maxSelect: 4,
      },
      {
        id: "q6",
        label: "What do you actually post about?",
        sublabel: "Or what would you post about if you were more active?",
        type: "chips-custom",
        customFieldId: "q6_custom",
        options: [
          "My work / business", "Behind-the-scenes of building",
          "Industry insights", "Personal life moments",
          "Health & fitness", "Food & cooking", "Travel",
          "Opinions & hot takes", "Educational content",
          "Book / podcast recs", "Rarely post / mostly lurk",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Your People & Your Edges",
    subtitle: "Who you admire, who you\u2019re not, and where you sit.",
    questions: [
      {
        id: "q8",
        label: "People you admire \u2014 whose brand energy do you respect?",
        sublabel: "Select up to 5, then add anyone we missed.",
        type: "icon-grid",
        maxSelect: 5,
        customFieldId: "q8_custom",
      },
      {
        id: "q9",
        label: "What do they have in common?",
        sublabel: "One sentence. What\u2019s the pattern?",
        type: "text",
        placeholder: "They\u2019re all builders who lead with substance over hype\u2026",
      },
      {
        id: "q10",
        label: "Brand tropes that make you cringe",
        sublabel: "Tap every archetype that makes you wince.",
        type: "chips",
        options: [
          "The hustle-porn guru",
          "The wellness fairy",
          "The corporate robot",
          "The \u201Cthought leader\u201D who says nothing",
          "The humble-brag founder",
          "The aesthetic-over-substance influencer",
          "The motivational poster account",
          "The always-positive toxic optimist",
          "The jargon machine",
          "The oversharer",
          "The \u201CI just work harder\u201D bro",
        ],
      },
      {
        id: "q11",
        label: "Where do you fall?",
        sublabel: "Drag each slider to where feels right. There\u2019s no wrong answer.",
        type: "spectrum",
        spectrums: SPECTRUM_ITEMS,
      },
    ],
  },
  {
    id: 4,
    title: "Your Visual World",
    subtitle: "The colours, textures, and feeling you want your brand to carry.",
    questions: [
      {
        id: "q12",
        label: "How do you want people to feel when they land on your site?",
        type: "chips",
        options: ["Credible", "Warm", "Ambitious", "Grounded", "Inspiring", "Approachable", "Bold", "Calm", "Exciting", "Trustworthy", "Innovative", "Premium"],
        maxSelect: 4,
      },
      {
        id: "q13",
        label: "What words describe your aesthetic?",
        type: "chips",
        options: ["Editorial", "Warm", "Minimal", "Earthy", "Clean", "Modern", "Geometric", "Natural", "Bold", "Understated", "Textured", "Refined"],
        maxSelect: 4,
      },
      {
        id: "q14",
        label: "Visual mood board \u2014 tap the images that feel right",
        type: "mood-board",
      },
      {
        id: "q15",
        label: "People whose visual identity you admire",
        type: "icon-grid",
        maxSelect: 5,
      },
    ],
  },
  {
    id: 5,
    title: "Your Voice & What Makes You Different",
    subtitle: "The things only you can say, and the lines you\u2019ll never cross.",
    questions: [
      {
        id: "q16",
        label: "What two things do you combine that don\u2019t usually go together?",
        sublabel: "This is often your entire brand in one sentence.",
        type: "textarea",
        placeholder: "e.g. Chartered accountant + competitive athlete. Corporate restructuring + food science.",
      },
      {
        id: "q17",
        label: "What do people actually come to you for?",
        sublabel: "Not your job title \u2014 what do friends, colleagues, even strangers ask you about?",
        type: "textarea",
        placeholder: "e.g. Breaking down complex problems. Honest feedback. Making a plan when everything feels chaotic.",
      },
      {
        id: "q18",
        label: "Write one sentence the way you\u2019d actually say it. About anything you believe.",
        sublabel: "This calibrates your natural voice.",
        type: "textarea",
        placeholder: "Don\u2019t overthink it \u2014 just write how you\u2019d say something at a dinner table.",
      },
      {
        id: "q19",
        label: "\u201CI never want to come across as\u2026\u201D",
        type: "textarea",
        placeholder: "e.g. Preachy. Trying too hard. Like I\u2019m selling something. Cold or unapproachable.",
      },
      {
        id: "q20",
        label: "Words that are permanently banned from your brand",
        type: "textarea",
        placeholder: "Game-changing, passionate about, hustle, authentic journey, leveraging synergies\u2026",
      },
    ],
  },
  {
    id: 6,
    title: "Ground It",
    subtitle: "The practical details that anchor everything above.",
    questions: [
      {
        id: "q21",
        label: "What\u2019s your name?",
        type: "text",
        placeholder: "Your full name",
      },
      {
        id: "q22",
        label: "What do you do today?",
        sublabel: "Role, company, or however you\u2019d introduce yourself at a dinner.",
        type: "textarea",
        placeholder: "e.g. Founder of Verifood. Building AI-powered nutrition at the point of grocery purchase.",
      },
      {
        id: "q23",
        label: "The quick backstory \u2014 education, career highlights, the CV reel",
        type: "textarea",
        placeholder: "Degrees, companies, roles \u2014 bullet points fine.",
      },
      {
        id: "q24",
        label: "Where do you show up online?",
        type: "chips",
        options: ["LinkedIn", "Instagram", "Twitter / X", "Newsletter", "Podcast", "YouTube", "Personal website", "Substack", "TikTok"],
      },
      {
        id: "q25",
        label: "After encountering your brand, what should people do?",
        type: "chips",
        options: ["Follow my build", "Connect on LinkedIn", "Learn about my company", "Book a call", "Join my waitlist", "Read my writing", "Hire me", "Invest in me"],
        maxSelect: 3,
      },
      {
        id: "q26",
        label: "Anything else that matters?",
        sublabel: "Timeline, constraints, context the brand should account for.",
        type: "textarea",
        placeholder: "e.g. Graduating HBS May 2026. Need brand locked before then. Actively fundraising.",
      },
    ],
  },
];
