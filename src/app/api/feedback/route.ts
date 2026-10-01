// ⬇️ al inicio del archivo
export const runtime = "nodejs"; // usa runtime Node (más flexible para llamadas largas)
export const maxDuration = 60; // extiende el límite (prueba 60s en Hobby)
export const dynamic = "force-dynamic"; // evita caché agresiva

import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  SECTIONS,
  countSentences,
  countWords,
  type SectionId,
} from "@/lib/responseParagraph";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Instrucciones fijas primero (prompt caching), luego los criterios de cada parte.
const DEVELOPER_PROMPT = `
You are a strict but supportive writing coach for Upper-Intermediate (B2) English learners at a Colombian university. Students write a RESPONSE PARAGRAPH: they read or watch a short case (usually someone's statement), then (1) LISTEN: show they understood the argument, and (2) ANSWER: evaluate it with reasons and examples. It is ONE paragraph of 190–210 words with four parts:
01 Topic sentence (1 sentence) · 02 Summary (2–4 sentences, neutral) · 03 Reaction (5–6 sentences, balanced) · 04 Conclusion (1–2 sentences).

You evaluate ONE part at a time. You may receive the case and the student's other parts as context: use them only to judge the requested part (for example, to check summary accuracy or a copied conclusion). Never give feedback on the other parts.

CRITERIA FOR EACH PART
${SECTIONS.map((s) => `### ${s.number} ${s.label} (${s.points} points in the rubric)${s.criteria}`).join("\n\n")}

GENERAL LANGUAGE RULES (all parts)
- Academic register: no contractions (don't → do not), avoid vague words (thing → factor, good → effective, bad → harmful, a lot of → many).
- Use ; or . before however / therefore / moreover when they join two sentences ("..., therefore, ..." is a comma splice).
- Your own corrections must follow these rules too: never suggest a contraction.

OUTPUT FORMAT (markdown, exactly this structure, in English):
**What works** (1–2 bullets)
- ...

**What to improve** (max 3 bullets, ≤40 words each; concrete actions, use the key phrases above when helpful)
- ...

**Grammar & vocabulary** (max 5 bullets, format: ~~wrong~~ → correct, plus a 3–8 word reason)
- ...

Score: X/<points of this part>

RULES
- No preamble, no extra sections, do not rewrite the whole part for the student.
- Use simple, clear language.
- If grammar is perfect, write "No grammar issues found." under Grammar & vocabulary.
- If the number of sentences is outside the required range, mention it in "What to improve".
- If the text is missing or has fewer than 8 words: write only "Please write a fuller version of this part (at least one complete sentence)." then "Score: 0/<points>".
`.trim();

export async function POST(req: Request) {
  const { section, text, inputs, caseText } = (await req.json()) as {
    section: SectionId;
    text: string;
    inputs?: Partial<Record<SectionId, string>>;
    caseText?: string;
  };

  const current = SECTIONS.find((s) => s.id === section);
  if (!current) {
    return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  }

  const others = SECTIONS.filter((s) => s.id !== section && inputs?.[s.id]?.trim())
    .map((s) => `${s.label}: ${inputs![s.id]!.trim()}`)
    .join("\n");

  const userContent = [
    `Part to evaluate: ${current.number} ${current.label} (max ${current.points} points; required: ${current.sentences.min === current.sentences.max ? current.sentences.min : `${current.sentences.min}–${current.sentences.max}`} sentence(s))`,
    `Measured length: ${countWords(text ?? "")} words, about ${countSentences(text ?? "")} sentence(s)`,
    `Case / source text: ${caseText?.trim() || "(not provided)"}`,
    `Student's other parts (context only):\n${others || "(none yet)"}`,
    `TEXT TO EVALUATE:\n${text?.trim() || "(empty)"}`,
  ].join("\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-6-luna",
      // Automatic prompt caching uses the unchanged instructions before user input.
      messages: [
        { role: "developer", content: DEVELOPER_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    console.info("OpenAI usage (feedback):", {
      model: completion.model,
      ...completion.usage,
    });

    const feedback = completion.choices[0].message.content;
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error generating feedback" },
      { status: 500 }
    );
  }
}
