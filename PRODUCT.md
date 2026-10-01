# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Upper-Intermediate (B2) English students at Universidad Tecnológica de Pereira (UTP), in Diego Henao's course. They use the tool while drafting the Week 4 writing activity: a response paragraph to a short case (usually someone's statement). They use it equally on computers (to write) and phones (to write or review feedback). The professor is a secondary user who maintains the content.

## Product Purpose

An AI writing coach for one specific genre: the response paragraph. Students write (part by part or by pasting a full draft), get rubric-aligned AI feedback, revise, and resubmit. Success: students hand in paragraphs that follow the four-part structure and score higher on the 20-point rubric, and they understand why.

## Positioning

The feedback is built on the exact format taught in class (Week 4 learning guide and class slides): four parts (topic sentence, summary, reaction, conclusion), 190–210 words in one paragraph, and the 20-point rubric. A generic grammar checker cannot judge "camera, not a judge" summaries or the recognize → refute → consequences → propose reaction moves.

## Operating Context

- Used alongside the self-study learning guide and the live class (slides v2, Week 4).
- Students may paste the case/statement they respond to.
- Model case used in class: "Phones banned at school" (the principal's statement); practice case: "No AI in written assignments".
- Drafts and feedback live in the student's browser (localStorage); no accounts.

## Capabilities and Constraints

- Next.js 16 app, Tailwind 3, shadcn/ui primitives, deployed on Vercel; OpenAI model `gpt-6-luna` via `/api/feedback` (one part) and `/api/general-feedback` (whole paragraph, rubric /20).
- Format source of truth: `src/lib/responseParagraph.ts`.
- Two ways to work: part by part, or paste the full paragraph.
- Draft history: each general review is saved with its /20 score so students can see progress between drafts.
- UI language: English.
- The AI must not rewrite the paragraph for the student.

## Brand Commitments

- Part colours from the class slides: topic = blue, summary = green, reaction = orange, conclusion = lilac/purple.
- Footer credit: Diego Henao, Professor of Upper-Intermediate English, UTP.

## Evidence on Hand

- Class slides v2 (Week 4) content, model paragraph (203 words), rubric, checklist and language toolkit, all encoded in `src/lib/responseParagraph.ts` and the Examples/Expressions/Rubrics pages.
- No testimonials, usage data or outcomes exist; do not fabricate any.

## Product Principles

1. Teach the format, not just fix the text: every piece of feedback points back to a part, a move or a rubric line.
2. The student writes; the AI coaches. Never hand over a rewritten paragraph.
3. Writing comes first: the text the student is working on is always the most prominent thing.
4. Progress is visible: drafts, scores and what changed.

## Accessibility & Inclusion

Students write on phones and laptops, sometimes on slow connections; keep it light, readable at 320px, keyboard-usable, and respect reduced-motion.
