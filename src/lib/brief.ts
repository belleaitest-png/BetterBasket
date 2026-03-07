import { BrandDirection, QuestionnaireAnswers } from "./types";
import { THIS_OR_THAT_PAIRS, SPECTRUM_ITEMS } from "./questions";

export function generateBrief(dir: BrandDirection, answers: QuestionnaireAnswers): string {
  const userName = answers.q21 || "Your Name";

  const brandBrief = `PERSONAL BRAND: ${userName}
DIRECTION: ${dir.label}
TAGLINE: "${dir.tagline}"

COLOUR PALETTE:
${Object.values(dir.colors).map(c => `  ${c.hex}  ${c.name}  (${c.role})`).join("\n")}

TYPOGRAPHY:
  Display: ${dir.fonts.display.name} ${dir.fonts.display.weight} \u2014 ${dir.fonts.display.use}
  Body:    ${dir.fonts.body.name} ${dir.fonts.body.weight} \u2014 ${dir.fonts.body.use}
  Accent:  ${dir.fonts.accent.name} \u2014 ${dir.fonts.accent.use}

TONE OF VOICE:
  Attributes: ${dir.tone.attrs.join(" \u00b7 ")}
  Power words: ${dir.tone.power.join(", ")}
  Never use: ${dir.tone.avoid.join(", ")}

VOICE EXAMPLES:
${dir.tone.examples.map((e, i) => `  ${i + 1}. "${e}"`).join("\n")}

VIBE: ${dir.vibe.join(", ")}`;

  const discoveryProfile = generateDiscoveryProfile(answers);

  return `${brandBrief}

${"=".repeat(60)}
DISCOVERY PROFILE \u2014 Full Questionnaire Answers
${"=".repeat(60)}

${discoveryProfile}

USE THIS BRIEF TO:
- Generate brand photography prompts (Midjourney, DALL-E)
- Brief a web designer or Figma template
- Prompt Claude/ChatGPT to write in-brand copy
- Set up a Canva brand kit
- Create LinkedIn banners, email signatures, presentation decks`;
}

function generateDiscoveryProfile(a: QuestionnaireAnswers): string {
  const sections: string[] = [];

  // Quick-Fire Round
  const quickFire: string[] = [];
  if (a.q1 && Object.keys(a.q1).length > 0) {
    quickFire.push("THIS OR THAT:");
    for (const pair of THIS_OR_THAT_PAIRS) {
      const key = `${pair.left}|${pair.right}`;
      const choice = a.q1[key];
      if (choice) {
        const picked = choice === "left" ? pair.left : pair.right;
        quickFire.push(`  ${pair.left} vs ${pair.right} \u2192 ${picked}`);
      }
    }
  }
  if (a.q2) quickFire.push(`\nPERFECT SUNDAY MORNING:\n  ${a.q2}`);
  const topics = [...(a.q3 || []), ...(a.q3_custom ? [a.q3_custom] : [])];
  if (topics.length) quickFire.push(`\n3-HOUR TOPICS: ${topics.join(", ")}`);
  if (quickFire.length) sections.push(quickFire.join("\n"));

  // World Online
  const online: string[] = [];
  const feed = [...(a.q4 || []), ...(a.q4_custom ? [a.q4_custom] : [])];
  if (feed.length) online.push(`SOCIAL FEED: ${feed.join(", ")}`);
  if (a.q5?.length) online.push(`VISUAL STYLE DRAWN TO: ${a.q5.join(", ")}`);
  const posts = [...(a.q6 || []), ...(a.q6_custom ? [a.q6_custom] : [])];
  if (posts.length) online.push(`POSTS ABOUT: ${posts.join(", ")}`);
  if (online.length) sections.push(online.join("\n"));

  // People & Edges
  const people: string[] = [];
  const admired = [...(a.q8 || []), ...(a.q8_custom ? [a.q8_custom] : [])];
  if (admired.length) people.push(`ADMIRED: ${admired.join(", ")}`);
  if (a.q9) people.push(`WHAT THEY HAVE IN COMMON: ${a.q9}`);
  if (a.q10?.length) people.push(`CRINGE TROPES: ${a.q10.join(", ")}`);
  if (a.q11 && Object.keys(a.q11).length > 0) {
    people.push("SPECTRUMS:");
    for (const s of SPECTRUM_ITEMS) {
      const key = `${s.left}|${s.right}`;
      const val = a.q11[key];
      if (val !== undefined) {
        const bar = "\u2588".repeat(Math.round(val / 10)) + "\u2591".repeat(10 - Math.round(val / 10));
        people.push(`  ${s.left} ${bar} ${s.right} (${val}/100)`);
      }
    }
  }
  if (people.length) sections.push(people.join("\n"));

  // Visual World
  const visual: string[] = [];
  if (a.q12?.length) visual.push(`SITE FEELING: ${a.q12.join(", ")}`);
  if (a.q13?.length) visual.push(`AESTHETIC: ${a.q13.join(", ")}`);
  if (a.q15?.length) visual.push(`VISUAL IDENTITY ADMIRED: ${a.q15.join(", ")}`);
  if (visual.length) sections.push(visual.join("\n"));

  // Voice & Difference
  const voice: string[] = [];
  if (a.q16) voice.push(`UNUSUAL COMBINATION: ${a.q16}`);
  if (a.q17) voice.push(`WHAT PEOPLE COME TO ME FOR: ${a.q17}`);
  if (a.q18) voice.push(`VOICE SAMPLE: "${a.q18}"`);
  if (a.q19) voice.push(`NEVER COME ACROSS AS: ${a.q19}`);
  if (a.q20) voice.push(`BANNED WORDS: ${a.q20}`);
  if (voice.length) sections.push(voice.join("\n"));

  // Ground It
  const ground: string[] = [];
  if (a.q21) ground.push(`NAME: ${a.q21}`);
  if (a.q22) ground.push(`ROLE: ${a.q22}`);
  if (a.q23) ground.push(`BACKSTORY: ${a.q23}`);
  if (a.q24?.length) ground.push(`PLATFORMS: ${a.q24.join(", ")}`);
  if (a.q25?.length) ground.push(`CTA GOALS: ${a.q25.join(", ")}`);
  if (a.q26) ground.push(`ADDITIONAL CONTEXT: ${a.q26}`);
  if (ground.length) sections.push(ground.join("\n"));

  return sections.join("\n\n" + "-".repeat(40) + "\n\n");
}
