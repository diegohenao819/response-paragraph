// Formato del response paragraph (Week 4 learning guide / class slides v2).
// Lo usan tanto la interfaz como las rutas de la API, para que todo hable del mismo formato.

export type SectionId = "topic" | "summary" | "reaction" | "conclusion";

export interface Section {
  id: SectionId;
  number: string;
  label: string;
  sentences: { min: number; max: number };
  points: number;
  hint: string;
  example: string;
  criteria: string;
}

export const SECTIONS: Section[] = [
  {
    id: "topic",
    number: "01",
    label: "Topic sentence",
    sentences: { min: 1, max: 1 },
    points: 2,
    hint: "Topic + your position. After this sentence alone, the reader must know the topic AND your opinion.",
    example:
      "Banning mobile phones for the whole school day may protect students' concentration, but a total ban is too extreme to be the best solution.",
    criteria: `
- Exactly ONE sentence = TOPIC (what the case is about, specific) + the student's POSITION (agree, partially agree or disagree). Any position is valid if it is clear.
- The 5-second test: after only this sentence, the reader knows the topic and the opinion.
- Common mistakes to flag:
  - It only ANNOUNCES the topic ("In this paragraph, I am going to talk about...").
  - It only REPORTS the speaker ("The principal says that..."): that is summary language, not a topic sentence.
  - It is TOO GENERAL ("Nowadays, technology is very important in our lives."): which case? what position?
  - A starter alone ("Nowadays, ...", "It is clear that ...") is not enough without a position.`,
  },
  {
    id: "summary",
    number: "02",
    label: "Summary",
    sentences: { min: 2, max: 4 },
    points: 4,
    hint: "Be a camera, not a judge. Report the speaker's main claim and 1–2 reasons in your own words. No opinion yet.",
    example:
      "In her statement, the principal argues that phones are the main source of distraction in the classroom. According to her, since phones entered the classroom, students have become less focused, their grades have declined, and online bullying has grown. For this reason, she has decided that students must leave their phones in lockers during school hours.",
    criteria: `
- 2–4 sentences, completely NEUTRAL: "a camera, not a judge". It describes; it does not evaluate.
- Must name the source (e.g. "In her statement, the principal...") and use reporting verbs (argues, claims, explains, points out, states, suggests, emphasizes) or "According to...".
- Must include the speaker's MAIN CLAIM + 1 or 2 REASONS (+ the decision/proposal, if there is one).
- Flag: any opinion words (I think, unfortunately, wrongly, an exaggeration, a terrible solution...), sentences copied from the source instead of the student's own words, and too many details or examples.
- If the source text is provided, check that the summary reports it accurately and does not invent information.`,
  },
  {
    id: "reaction",
    number: "03",
    label: "Reaction",
    sentences: { min: 5, max: 6 },
    points: 5,
    hint: "What do YOU think? A balanced analysis in four moves: recognize (pro) → refute (con) → consequences → propose a better idea.",
    example:
      "On one hand, her concern is understandable, since constant notifications make it difficult for teenagers to focus on complex tasks. Moreover, a clear rule is easier to enforce than individual warnings. On the other hand, this perspective overlooks the fact that phones are also learning tools, especially for students who do not have a computer at home. As a result, many students will never learn how to use technology responsibly, a skill they will need at university and at work. A more constructive solution would be to teach students when and how to use their phones for learning.",
    criteria: `
- 5–6 sentences, about half of the paragraph (~100 words). It is the most important part.
- Must be BALANCED and follow four moves, in this order:
  1. RECOGNIZE: what is valid in the speaker's view (pro). E.g. "On one hand, it is understandable that...", "The concern about ___ is legitimate, since..."
  2. REFUTE: what is weak or missing (con). E.g. "On the other hand, this perspective overlooks the fact that...", "However, this view fails to consider that..."
  3. CONSEQUENCES: what will happen. E.g. "As a result, many [students] will...", "In practice, this means that..."
  4. PROPOSE: a better, more constructive idea. E.g. "A more constructive solution would be to...", "Instead of [X], [the school] could..."
- At least one pro AND one con are required. Each claim needs a reason or an example.
- Name which moves are present and which are missing.`,
  },
  {
    id: "conclusion",
    number: "04",
    label: "Conclusion",
    sentences: { min: 1, max: 2 },
    points: 2,
    hint: "Two jobs: restate your position in new words + recommend an action (or a final reflection). No new arguments.",
    example:
      "Therefore, instead of a total ban, the school should allow phones only for guided academic activities, because responsible use is learned through practice, not prohibition.",
    criteria: `
- 1–2 sentences with two jobs: (1) RESTATE the position in NEW words, (2) RECOMMEND an action or give a final reflection. Both jobs can fit in one sentence.
- Frame: "In conclusion, [the case] shows that [your position]. To avoid [negative result], [who] should [main action]." Other starters: Therefore, Ultimately, For these reasons,
- Flag: NEW arguments (a conclusion closes; it does not open) and COPY-PASTE of the topic sentence (if the topic sentence is provided, compare them).`,
  },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export const WORD_LIMIT = { min: 190, max: 210 };

export const RUBRIC = [
  { label: "Topic sentence", points: 2 },
  { label: "Summary (synthesis)", points: 4 },
  { label: "Reaction & arguments", points: 5 },
  { label: "Conclusion", points: 2 },
  { label: "Language use (0–5 errors)", points: 5 },
  { label: "Word limit (190–210)", points: 2 },
] as const;

export const RUBRIC_TOTAL = RUBRIC.reduce((sum, r) => sum + r.points, 0);

export const CHECKLIST = [
  "Topic sentence = topic + my position",
  "Neutral summary in 2–4 sentences",
  "Reaction with at least one pro and one con",
  "Conclusion with no new arguments",
  "; or . before however / therefore",
  "One paragraph, 190–210 words, no contractions",
];

const HAS_WORD = /[A-Za-z0-9À-ɏ]/;

export function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => HAS_WORD.test(w)).length;
}

// Aproximado: cuenta fragmentos que terminan en . ! ? (o el último sin puntuación).
export function countSentences(text: string): number {
  return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).filter((s) => HAS_WORD.test(s)).length;
}

export function wordLimitScore(words: number): number {
  return words >= WORD_LIMIT.min && words <= WORD_LIMIT.max ? 2 : 0;
}

export function joinParagraph(inputs: Partial<Record<SectionId, string>>): string {
  return SECTIONS.map((s) => (inputs[s.id] ?? "").trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join(" ");
}
