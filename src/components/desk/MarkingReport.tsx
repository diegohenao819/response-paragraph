"use client";
// La hoja corregida: párrafo resaltado, notas al margen, rúbrica y siguiente borrador.
import type { CSSProperties } from "react";
import { RUBRIC_TOTAL, SECTIONS } from "@/lib/responseParagraph";
import { MOVES, SCORE_ROWS, segmentParagraph, type Draft } from "@/lib/marking";
import Highlighted from "./Highlighted";
import MarginNote from "./MarginNote";
import { Cross, PenCircle, Tick } from "./PenMarks";
import { ArrowRight } from "lucide-react";

const fmt = (ts: number) =>
  new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function MarkingReport({
  draft,
  number,
  previousTotal,
  stale,
  onRevisePartByPart,
}: {
  draft: Draft;
  number: number;
  previousTotal?: number;
  stale: boolean;
  onRevisePartByPart?: () => void;
}) {
  const { marking } = draft;
  const segments = segmentParagraph(draft.text, marking.parts);
  const delta = previousTotal === undefined ? null : marking.total - previousTotal;

  return (
    <section
      key={draft.id}
      aria-labelledby="marked-heading"
      className="sheet sheet-margin overflow-hidden [--margin-x:16px] lg:[--margin-x:212px]"
    >
      {/* Encabezado: número de borrador + nota encerrada en rojo */}
      <header className="flex flex-wrap items-start justify-between gap-6 px-7 pt-7 pb-5 lg:pl-[236px] lg:pr-10">
        <div>
          <h2 id="marked-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Draft {number}, marked
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {fmt(draft.createdAt)} · <span className="nums">{marking.words}</span> words
          </p>
          {stale && (
            <p className="mt-2 text-sm font-semibold text-[var(--pen)]">
              You changed your text after this marking. Mark it again to see your new score.
            </p>
          )}
        </div>
        <div className="flex items-center gap-8 pr-4 lg:absolute lg:left-0 lg:top-9 lg:w-[212px] lg:flex-col-reverse lg:gap-4 lg:pr-0">
          {delta !== null && delta !== 0 && (
            <span className="ink-in nums text-sm font-semibold text-[var(--pen)]" style={{ "--delay": "900ms" } as CSSProperties}>
              {delta > 0 ? `+${delta}` : delta} since draft {number - 1}
            </span>
          )}
          <PenCircle delayMs={200}>
            <span className="nums block px-1 text-[var(--pen)]">
              <span className="text-5xl font-semibold leading-none">{marking.total}</span>
              <span className="text-lg">/{RUBRIC_TOTAL}</span>
            </span>
          </PenCircle>
        </div>
      </header>

      {/* Margen: puntaje por parte */}
      <ul className="absolute left-0 top-[210px] hidden w-[212px] space-y-2 px-7 text-sm lg:block" aria-label="Score by part">
        {SECTIONS.map((s) => (
          <li key={s.id} data-part={s.id} className="flex items-baseline justify-between gap-2">
            <span className="hl px-1 text-[var(--ink)]">{s.label}</span>
            <span className="nums text-xs text-[var(--pen)]">
              {marking.scores[s.id].score}/{s.points}
            </span>
          </li>
        ))}
      </ul>

      {/* Párrafo resaltado + notas al margen */}
      <div className="grid gap-8 px-7 pb-8 lg:grid-cols-[1fr_320px] lg:pl-[236px] lg:pr-10">
        <div>
          <Highlighted segments={segments} baseDelay={500} />
          {SECTIONS.some((s) => !marking.parts[s.id]) && (
            <p className="mt-3 text-sm text-[var(--pen)]">
              Missing:{" "}
              {SECTIONS.filter((s) => !marking.parts[s.id])
                .map((s) => s.label.toLowerCase())
                .join(", ")}
              .
            </p>
          )}
          {onRevisePartByPart && (
            <button
              type="button"
              onClick={onRevisePartByPart}
              className="mt-5 text-sm font-semibold text-[var(--ink)] underline decoration-[var(--pen)] decoration-2 underline-offset-4 hover:text-[var(--pen)]"
            >
              Revise it part by part <ArrowRight aria-hidden className="ml-1 inline h-4 w-4 align-[-3px]" />
            </button>
          )}
        </div>
        <ol className="space-y-4" aria-label="Margin notes">
          {SECTIONS.map((s, i) => (
            <li key={s.id} data-part={s.id}>
              <MarginNote delayMs={900 + i * 140}>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--part-ink)]">
                  <span className="hl px-1">{s.label}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]">{marking.partNotes[s.id]}</p>
              </MarginNote>
            </li>
          ))}
        </ol>
      </div>

      {/* Rúbrica, movimientos, errores y prioridades */}
      <div className="grid gap-10 border-t border-[var(--rule)] bg-[var(--paper)] px-7 py-8 lg:grid-cols-[1fr_320px] lg:pl-[236px] lg:pr-10">
        <div>
          <h3 className="text-lg font-bold">Rubric</h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {SCORE_ROWS.map((row, i) => {
                const s = marking.scores[row.key];
                const full = s.score === row.max;
                return (
                  <tr key={row.key} className="border-b border-[var(--rule)] align-top last:border-0">
                    <th scope="row" className="py-2.5 pr-3 text-left font-semibold sm:w-[40%]">
                      {row.label}
                      <span className="mt-0.5 block font-normal text-[var(--ink-soft)] sm:hidden">{s.comment}</span>
                    </th>
                    <td className="hidden py-2.5 pr-3 text-[var(--ink-soft)] sm:table-cell">{s.comment}</td>
                    <td className="nums w-16 whitespace-nowrap py-2.5 text-right">
                      <span className="inline-flex items-center gap-1.5">
                        {full ? <Tick delayMs={1200 + i * 120} /> : null}
                        <span className={full ? "text-[var(--ink)]" : "font-semibold text-[var(--pen)]"}>
                          {s.score}/{row.max}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 className="mt-8 text-lg font-bold">For your next draft</h3>
          <ol className="mt-3 space-y-2.5">
            {marking.priorities.map((p, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="nums mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--pen)] text-xs font-semibold text-[var(--pen)]">
                  {i + 1}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold">Reaction moves</h3>
            <ul className="mt-3 space-y-2" data-part="reaction">
              {MOVES.map((m, i) => {
                const ok = marking.moves[m.key];
                return (
                  <li key={m.key} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm border border-[var(--rule)]">
                      {ok ? <Tick delayMs={1300 + i * 120} /> : <Cross delayMs={1300 + i * 120} className="h-3.5 w-3.5" />}
                    </span>
                    <span>
                      <span className={`font-semibold ${ok ? "" : "text-[var(--pen)]"}`}>{m.label}</span>
                      <span className="text-[var(--ink-soft)]"> · {m.hint}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Language <span className="nums text-sm font-normal text-[var(--ink-soft)]">({marking.languageErrors.length} {marking.languageErrors.length === 1 ? "error" : "errors"})</span>
            </h3>
            {marking.languageErrors.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--ink-soft)]">No language errors found. Well done.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {marking.languageErrors.map((e, i) => (
                  <li key={i}>
                    <span className="text-[var(--ink-soft)] line-through decoration-[var(--pen)] decoration-2">{e.wrong}</span>{" "}
                    <span className="font-semibold text-[var(--pen)]">→ {e.correct}</span>
                    <span className="block text-xs text-[var(--ink-faint)]">{e.reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
