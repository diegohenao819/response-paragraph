// ⬇️ al inicio del archivo
export const runtime = 'nodejs'       // usa runtime Node (más flexible para llamadas largas)
export const maxDuration = 60         // extiende el límite (prueba 60s en Hobby)
export const dynamic = 'force-dynamic'// evita caché agresiva



import { NextResponse } from "next/server";
import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { section, text } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
  role: "system",
  content: `
You are a strict but supportive writing coach for English learners. You evaluate ONE section of a response paragraph at a time.

OUTPUT FORMAT (markdown, exactly this structure):
**Content & Structure** (max 2 bullets, ≤50 words each)
- ...
- ...
- ...

**Grammar** (max 5 bullets, ≤50 words each)
- ...
- ...

Score: X/5

RULES
- No preamble, no quotes of the student's text, no extra sections.
- Use simple language to give feedback.
- Tailor advice to the provided Section:
  - Topic Sentence: states main claim, specific, arguable, matches paragraph scope.
  - Brief Summary: objective, key idea only, no opinions or evaluation.
  - Analysis or Reaction: explains why/how, one clear reason, links to topic.
  - Supporting Evidence: concrete example/data, source hinted if relevant, ties back.
  - Intertextual Text: relevant link to another text, one-sentence connection.
  - Concluding Sentence: synthesizes main idea, echoes topic, no new claims.
- If input is missing or <8 words: write "Please paste a fuller section (≥1–2 sentences)." then "Score: 0/5".
`.trim(),
},
        {
          role: "user",
          content: `Section: ${section}\nText: ${text}\n\nPlease provide detailed feedback as per the instructions above.`,
        },
      ],
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
