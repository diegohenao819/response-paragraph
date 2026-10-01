// ⬇️ al inicio del archivo
export const runtime = 'nodejs'       // usa runtime Node (más flexible para llamadas largas)
export const maxDuration = 60         // extiende el límite (prueba 60s en Hobby)
export const dynamic = 'force-dynamic'// evita caché agresiva


import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  CHECKLIST,
  RUBRIC,
  RUBRIC_TOTAL,
  SECTIONS,
  WORD_LIMIT,
  countWords,
  wordLimitScore,
  type SectionId,
} from "@/lib/responseParagraph";
import { SCORE_ROWS, totalOf, type Marking } from "@/lib/marking";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_PARAGRAPH = SECTIONS.map((s) => s.example).join(" ");

const DEVELOPER_PROMPT = `
You are an experienced writing coach marking a COMPLETE response paragraph written by an Upper-Intermediate (B2) English student at a Colombian university. A response paragraph has two steps: LISTEN (show you understood the speaker's argument) and ANSWER (evaluate it with reasons and examples). It is about how well the student thinks about the text, not whether they liked it.

REQUIRED FORMAT
- ONE paragraph, no line breaks, ${WORD_LIMIT.min}–${WORD_LIMIT.max} words, four parts in this order:
${SECTIONS.map((s) => `### ${s.number} ${s.label} (${s.sentences.min === s.sentences.max ? s.sentences.min : `${s.sentences.min}–${s.sentences.max}`} sentence(s), ${s.points} points)${s.criteria}`).join("\n\n")}

RUBRIC (${RUBRIC_TOTAL} points)
${RUBRIC.map((r) => `- ${r.label}: ${r.points}`).join("\n")}
- Language use: list every language error you count (grammar, spelling, punctuation, contractions, comma splices before however/therefore). The app scores it as 5 minus the number of errors.
- Word limit: measured by the app; do not score it, only comment on it using the measured count.

STUDENT CHECKLIST
${CHECKLIST.map((c) => `- ${c}`).join("\n")}

MODEL PARAGRAPH (case: a school bans mobile phones; 1 + 3 + 5 + 1 sentences, 203 words):
"${MODEL_PARAGRAPH}"

WHAT TO RETURN (JSON, all text in English, simple and clear, strict but encouraging)
- parts: split the student's paragraph into the four parts. If the student already labeled the parts, return exactly those parts and evaluate each one as the part the student says it is (e.g. a missing proposal is a weakness of the reaction, not a reason to move the conclusion). Copy each part EXACTLY as written (character for character, consecutive sentences). Use "" for a part that is missing.
- scores: an integer score and a comment (max 15 words) for topic (0–2), summary (0–4), reaction (0–5) and conclusion (0–2). For language and wordLimit, the score is ignored (use 0) but write the comment.
- partNotes: one margin note per part (max 35 words): what works and the single most useful change. If the part is missing, say what it needs.
- moves: which reaction moves are present.
- languageErrors: each error once, quoting only the wrong words (max 8 words), the correction and a 3–8 word reason. Empty list if none. Corrections must follow academic register: never use contractions in a correction (doesn't → does not, never → don't).
- priorities: exactly 3 short, concrete actions for the next draft, most important first.
- Never rewrite the whole paragraph or a whole part for the student.
`.trim();

const scoreSchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "comment"],
  properties: { score: { type: "integer" }, comment: { type: "string" } },
};

const partsSchema = (description: string) => ({
  type: "object",
  additionalProperties: false,
  description,
  required: SECTIONS.map((s) => s.id),
  properties: Object.fromEntries(SECTIONS.map((s) => [s.id, { type: "string" }])),
});

const MARKING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["parts", "scores", "partNotes", "moves", "languageErrors", "priorities"],
  properties: {
    parts: partsSchema("Exact text of each part"),
    scores: {
      type: "object",
      additionalProperties: false,
      required: SCORE_ROWS.map((r) => r.key),
      properties: Object.fromEntries(SCORE_ROWS.map((r) => [r.key, scoreSchema])),
    },
    partNotes: partsSchema("One margin note per part"),
    moves: {
      type: "object",
      additionalProperties: false,
      required: ["recognize", "refute", "consequences", "propose"],
      properties: {
        recognize: { type: "boolean" },
        refute: { type: "boolean" },
        consequences: { type: "boolean" },
        propose: { type: "boolean" },
      },
    },
    languageErrors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["wrong", "correct", "reason"],
        properties: {
          wrong: { type: "string" },
          correct: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    priorities: { type: "array", items: { type: "string" } },
  },
};

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, Math.round(n)));

export async function POST(req: Request) {
  const { text, caseText, parts } = (await req.json()) as {
    text: string;
    caseText?: string;
    parts?: Partial<Record<SectionId, string>>;
  };

  const words = countWords(text ?? "");
  if (words < 40) {
    return NextResponse.json(
      { error: "Write at least 40 words before asking for marking." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-6-luna",
      // Automatic prompt caching uses the unchanged instructions before user input.
      messages: [
        { role: "developer", content: DEVELOPER_PROMPT },
        {
          role: "user",
          content: [
            `Measured word count: ${words} (required ${WORD_LIMIT.min}–${WORD_LIMIT.max})`,
            `Case / source text: ${caseText?.trim() || "(not provided)"}`,
            parts
              ? `The student labeled the parts (use exactly this split):\n${SECTIONS.map((s) => `${s.label}: ${parts[s.id]?.trim() || "(empty)"}`).join("\n")}`
              : "The student pasted the whole paragraph: find the four parts yourself.",
            `COMPLETE PARAGRAPH:\n${text.trim()}`,
          ].join("\n\n"),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "marking", strict: true, schema: MARKING_SCHEMA },
      },
    });

    console.info("OpenAI usage (general-feedback):", {
      model: completion.model,
      ...completion.usage,
    });

    const raw = JSON.parse(completion.choices[0].message.content ?? "{}") as Omit<
      Marking,
      "total" | "words"
    >;

    // Los puntajes medibles los decide la app, no el modelo.
    const scores = { ...raw.scores };
    for (const row of SCORE_ROWS) {
      scores[row.key] = { ...scores[row.key], score: clamp(scores[row.key]?.score ?? 0, row.max) };
    }
    scores.language.score = Math.max(0, 5 - raw.languageErrors.length);
    scores.wordLimit.score = wordLimitScore(words);

    const marking: Marking = {
      ...raw,
      parts: (parts
        ? Object.fromEntries(SECTIONS.map((s) => [s.id, parts[s.id]?.trim() ?? ""]))
        : raw.parts) as Record<SectionId, string>,
      scores,
      priorities: raw.priorities.slice(0, 3),
      total: totalOf(scores),
      words,
    };
    return NextResponse.json({ marking });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error generating general feedback" },
      { status: 500 }
    );
  }
}
