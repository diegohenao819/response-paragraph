import { CHECKLIST, RUBRIC, RUBRIC_TOTAL } from "@/lib/responseParagraph";

export default function Page() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl pt-2">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Rubric</h1>
        <p className="mt-3 text-[17px] text-[var(--ink-soft)]">
          How your paragraph is graded: {RUBRIC_TOTAL} points. Reaction + language use = 10 of {RUBRIC_TOTAL}. Think
          carefully, and write carefully.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="rubric-heading" className="sheet px-7 py-8 lg:px-10">
          <h2 id="rubric-heading" className="text-2xl font-bold tracking-tight">
            {RUBRIC_TOTAL} points
          </h2>
          {/* Una barra con el peso de cada criterio sobre los 20 puntos */}
          <div className="mt-5 flex h-4 overflow-hidden rounded-sm" aria-hidden>
            {RUBRIC.map((r, i) => (
              <div
                key={r.label}
                className="border-r-2 border-[var(--paper)] last:border-0"
                style={{
                  width: `${(r.points / RUBRIC_TOTAL) * 100}%`,
                  background: ["var(--hl-topic)", "var(--hl-summary)", "var(--hl-reaction)", "var(--hl-conclusion)", "var(--ink)", "var(--ink-faint)"][i],
                }}
              />
            ))}
          </div>
          <table className="mt-6 w-full text-[16px]">
            <tbody>
              {RUBRIC.map((r) => (
                <tr key={r.label} className="border-b border-[var(--rule)] last:border-0">
                  <th scope="row" className="py-3 text-left font-semibold">
                    {r.label}
                  </th>
                  <td className="nums py-3 text-right text-lg font-semibold text-[var(--pen)]">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="checklist-heading" className="sheet px-7 py-8">
          <h2 id="checklist-heading" className="text-2xl font-bold tracking-tight">
            Before you submit
          </h2>
          <ul className="mt-4 space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug">
                <span aria-hidden className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-[1.5px] border-[var(--ink-soft)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
