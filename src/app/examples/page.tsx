// src/app/examples/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SECTIONS, countWords, joinParagraph } from "@/lib/responseParagraph";
import { segmentParagraph } from "@/lib/marking";
import Highlighted from "@/components/desk/Highlighted";
import MarginNote from "@/components/desk/MarginNote";

const modelParts = Object.fromEntries(SECTIONS.map((s) => [s.id, s.example]));
const modelParagraph = joinParagraph(modelParts);

const positions = [
  {
    case: "Phones banned at school",
    items: [
      {
        stance: "Agree",
        text: "It is clear that phones distract students, so keeping them in lockers during the school day is a reasonable decision.",
      },
      {
        stance: "Partially agree",
        text: "Although banning phones may seem reasonable, a total ban is too extreme to be the best solution.",
      },
      {
        stance: "Disagree",
        text: "The main point of the principal's statement is that phones damage learning, but the real problem is how students use them.",
      },
    ],
  },
  {
    case: "No AI in written assignments",
    items: [
      {
        stance: "Agree",
        text: "Banning AI tools in written assignments is a necessary decision, because students only learn to think when they write by themselves.",
      },
      {
        stance: "Partially agree",
        text: "Although banning AI tools may protect honest work, a total ban ignores the fact that students must learn to use AI responsibly.",
      },
      {
        stance: "Disagree",
        text: "Banning AI tools will not make students more honest; it will only push them to use these tools in secret.",
      },
    ],
  },
];

const mistakes = [
  {
    part: "topic",
    label: "Topic sentence",
    wrong: "In this paragraph, I am going to talk about the phone ban.",
    why: "It announces the topic, but it says nothing about it. Add your position.",
  },
  {
    part: "topic",
    label: "Topic sentence",
    wrong: "Nowadays, technology is very important in our lives.",
    why: "Too general: which case? What do you think?",
  },
  {
    part: "summary",
    label: "Summary",
    wrong: "In her statement, the principal wrongly argues that phones are the main source of distraction…",
    why: "A judge, not a camera: “wrongly”, “unfortunately”, “I think” are opinions. Save them for the reaction.",
  },
  {
    part: "conclusion",
    label: "Conclusion",
    wrong: "In conclusion, phones also damage students' eyes and sleep, so parents should control screen time at home.",
    why: "New arguments (eyes, sleep, parents). A conclusion closes; it does not open.",
  },
];

export default function ExamplesPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl pt-2">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Examples</h1>
        <p className="mt-3 text-[17px] text-[var(--ink-soft)]">
          The model paragraph from class, strong topic sentences and the mistakes to avoid.
        </p>
      </header>

      <section aria-labelledby="model-heading" className="sheet sheet-margin px-7 py-8 [--margin-x:16px] lg:[--margin-x:212px] lg:pl-[236px] lg:pr-10">
        <h2 id="model-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
          Model paragraph: phones banned at school
        </h2>
        <blockquote className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-soft)]">
          The principal: “Phones are the main source of distraction in our classrooms. Since students started
          using them in class, their concentration and grades have dropped, and cyberbullying has increased. From
          now on, phones must stay in lockers from 7 a.m. to 1 p.m. This is not a punishment; it is a way to protect
          learning.”
        </blockquote>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <Highlighted segments={segmentParagraph(modelParagraph, modelParts)} baseDelay={200} />
            <p className="nums mt-3 text-sm text-[var(--ink-faint)]">
              {countWords(modelParagraph)} words · 1 + 3 + 5 + 1 sentences · one paragraph
            </p>
          </div>
          <ol className="space-y-4">
            {SECTIONS.map((s, i) => (
              <li key={s.id} data-part={s.id}>
                <MarginNote delayMs={500 + i * 120}>
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--part-ink)]">
                    <span className="hl px-1">{s.label}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{s.hint}</p>
                </MarginNote>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="positions-heading" className="sheet px-7 py-8 lg:px-10">
        <h2 id="positions-heading" className="text-2xl font-bold tracking-tight">One topic, three strong positions</h2>
        <p className="mt-1 text-[var(--ink-soft)]">Agree, disagree or partially agree: just be clear. Topic + position.</p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {positions.map((group) => (
            <div key={group.case}>
              <h3 className="text-lg font-bold">{group.case}</h3>
              <ul className="mt-3 divide-y divide-[var(--rule)]" data-part="topic">
                {group.items.map((item) => (
                  <li key={item.stance} className="py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">{item.stance}</p>
                    <p className="mt-1 leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="mistakes-heading" className="sheet px-7 py-8 lg:px-10">
        <h2 id="mistakes-heading" className="text-2xl font-bold tracking-tight">Common mistakes</h2>
        <ul className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {mistakes.map((m) => (
            <li key={m.wrong} data-part={m.part}>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--part-ink)]">{m.label}</p>
              <p className="mt-1 leading-relaxed text-[var(--ink-soft)] line-through decoration-[var(--pen)] decoration-2">
                {m.wrong}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--pen)]">{m.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/" className="inline-block font-semibold underline decoration-[var(--pen)] decoration-2 underline-offset-4">
        <ArrowLeft aria-hidden className="mr-1 inline h-4 w-4 align-[-3px]" />
        Back to writing
      </Link>
    </div>
  );
}
