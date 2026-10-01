const groups = [
  {
    part: "topic",
    title: "Topic sentence starters",
    note: "A starter is not enough: always add your position!",
    items: [
      "It is clear that …",
      "Although … may seem reasonable, …",
      "The main point of [the speaker]'s statement is that …, but …",
      "The most important message in this text is …",
      "This situation demonstrates …",
    ],
  },
  {
    part: "summary",
    title: "Summary: reporting language",
    note: "Name the source and report. No opinion.",
    items: [
      "In her/his statement, [the speaker] …",
      "According to her/him, …",
      "argues · claims · explains · points out · states · suggests · emphasizes",
      "For this reason, she/he has decided that …",
    ],
  },
  {
    part: "reaction",
    title: "Reaction: four moves",
    note: "In this order: pro first, then con, then consequences, then a better idea.",
    moves: [
      { move: "1 Recognize", items: ["On one hand, it is understandable that …", "The concern about ___ is legitimate, since …", "Moreover, …"] },
      { move: "2 Refute", items: ["On the other hand, this perspective overlooks the fact that …", "However, this view fails to consider that …"] },
      { move: "3 Consequences", items: ["As a result, many [students] will …", "In practice, this means that …"] },
      { move: "4 Propose", items: ["A more constructive solution would be to …", "Instead of [X], [the school] could …"] },
    ],
  },
  {
    part: "conclusion",
    title: "Conclusion",
    note: "Restate your position in new words + recommend an action. No new arguments.",
    items: [
      "In conclusion, [the case] shows that [your position].",
      "To avoid [negative result], [who] should [main action].",
      "Therefore, … · Ultimately, … · For these reasons, …",
    ],
  },
];

const connectors = [
  { family: "Addition", items: "Moreover, · Furthermore, · In addition," },
  { family: "Contrast", items: "However, · On the other hand, · although …" },
  { family: "Cause", items: "because … · since … · due to + noun" },
  { family: "Effect", items: "Therefore, · As a result, · Consequently," },
  { family: "Example", items: "for example, · for instance, · such as" },
  { family: "Conclusion", items: "In conclusion, · Ultimately, · For these reasons," },
];

const academic = [
  ["thing", "factor"],
  ["good", "effective"],
  ["bad", "harmful"],
  ["don't", "do not"],
  ["a lot of", "many"],
];

export default function Page() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl pt-2">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Expressions</h1>
        <p className="mt-3 text-[17px] text-[var(--ink-soft)]">The language toolkit from the learning guide, part by part.</p>
      </header>

      <section className="sheet grid gap-x-12 gap-y-10 px-7 py-8 md:grid-cols-2 lg:px-10">
        {groups.map((g) => (
          <div key={g.title} data-part={g.part} className={g.moves ? "md:col-span-2" : ""}>
            <h2 className="text-xl font-bold tracking-tight">
              <span className="hl">{g.title}</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{g.note}</p>
            {g.items && (
              <ul className="on-grid mt-2 text-[16px]">
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
            {g.moves && (
              <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {g.moves.map((m) => (
                  <div key={m.move}>
                    <h3 className="text-sm font-bold text-[var(--part-ink)]">{m.move}</h3>
                    <ul className="mt-1 space-y-1.5 text-[15px] leading-snug">
                      {m.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="sheet px-7 py-8 lg:px-10">
        <h2 className="text-xl font-bold tracking-tight">Connect your ideas</h2>
        <dl className="mt-4 grid gap-x-10 gap-y-4 text-[15px] sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((c) => (
            <div key={c.family}>
              <dt className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">{c.family}</dt>
              <dd className="mt-0.5">{c.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="sheet px-7 py-8">
          <h2 className="text-xl font-bold tracking-tight">Fix the punctuation</h2>
          <ul className="on-grid mt-3 text-[15px]">
            <li className="text-[var(--ink-soft)] line-through decoration-[var(--pen)] decoration-2">
              He never came to class, therefore, he failed.
            </li>
            <li>He never came to class; therefore, he failed.</li>
            <li>He never came to class. Therefore, he failed.</li>
            <li>He never came to class, so he failed.</li>
          </ul>
          <p className="mt-3 text-sm font-semibold text-[var(--pen)]">
            Use ; or . before however, therefore, moreover when they join two sentences.
          </p>
        </section>
        <section className="sheet px-7 py-8">
          <h2 className="text-xl font-bold tracking-tight">Sound academic</h2>
          <ul className="on-grid mt-3 text-[15px]">
            {academic.map(([from, to]) => (
              <li key={from}>
                <span className="text-[var(--ink-soft)] line-through decoration-[var(--pen)] decoration-2">{from}</span>{" "}
                <span className="font-semibold text-[var(--pen)]">→ {to}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
