"use client";
// Índice de borradores: puntaje, progreso y qué cambió entre versiones.
import { useState } from "react";
import { RUBRIC_TOTAL } from "@/lib/responseParagraph";
import { diffWords, type Draft } from "@/lib/marking";

const fmt = (ts: number) =>
  new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function DraftHistory({
  drafts,
  selectedId,
  onSelect,
  onRestore,
  onClear,
}: {
  drafts: Draft[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRestore: (draft: Draft) => void;
  onClear: () => void;
}) {
  const [compareId, setCompareId] = useState<string | null>(null);
  if (drafts.length === 0) return null;

  const best = Math.max(...drafts.map((d) => d.marking.total));

  return (
    <section aria-labelledby="drafts-heading" className="relative">
      {/* Hojas apiladas detrás: una por borrador anterior (máx. 2) */}
      {drafts.length > 1 && (
        <div aria-hidden className="sheet absolute inset-0 translate-x-2 translate-y-2 rotate-[0.6deg] opacity-70" />
      )}
      {drafts.length > 2 && (
        <div aria-hidden className="sheet absolute inset-0 -translate-x-1 translate-y-4 -rotate-[0.5deg] opacity-50" />
      )}
      <div className="sheet relative px-5 py-6 sm:px-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="drafts-heading" className="text-2xl font-bold tracking-tight">
          Your drafts
        </h2>
        <p className="text-sm text-[var(--ink-soft)]">
          Best so far: <span className="nums font-semibold text-[var(--pen)]">{best}/{RUBRIC_TOTAL}</span>
        </p>
      </div>

      <ol className="mt-4 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
        {drafts
          .map((d, i) => ({ d, n: i + 1, prev: drafts[i - 1] }))
          .reverse()
          .map(({ d, n, prev }) => {
            const delta = prev ? d.marking.total - prev.marking.total : null;
            const selected = d.id === selectedId;
            const comparing = compareId === d.id && prev;
            return (
              <li key={d.id} className={selected ? "bg-[var(--pen-soft)]" : ""}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-2 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(d.id)}
                    aria-pressed={selected}
                    className="flex w-full min-w-0 flex-col text-left sm:w-auto sm:flex-1 sm:flex-row sm:items-baseline sm:gap-3"
                  >
                    <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-lg font-bold">Draft {n}</span>
                    <span className="text-sm text-[var(--ink-soft)]">
                      {fmt(d.createdAt)} · <span className="nums">{d.marking.words}</span> words
                    </span>
                  </button>
                  <span className="nums flex items-baseline gap-2">
                    {delta !== null && delta !== 0 && (
                      <span className={`text-xs font-semibold ${delta > 0 ? "text-[var(--ink-summary)]" : "text-[var(--pen)]"}`}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                    <span className="text-lg font-semibold text-[var(--pen)]">{d.marking.total}</span>
                    <span className="text-xs text-[var(--ink-faint)]">/{RUBRIC_TOTAL}</span>
                  </span>
                  <span className="flex gap-3 text-sm">
                    {prev && (
                      <button
                        type="button"
                        onClick={() => setCompareId(comparing ? null : d.id)}
                        aria-expanded={!!comparing}
                        className="font-semibold text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                      >
                        {comparing ? "Hide changes" : `Changes since ${n - 1}`}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRestore(d)}
                      className="font-semibold text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                    >
                      Open in editor
                    </button>
                  </span>
                </div>
                {comparing && prev && (
                  <p className="ink-in on-grid px-2 pb-4 text-[15px]">
                    {diffWords(prev.text, d.text).map((t, i) =>
                      t.type === "same" ? (
                        <span key={i}>{t.text} </span>
                      ) : t.type === "added" ? (
                        <span key={i}>
                          <ins className="rounded-sm bg-[var(--hl-summary)] px-0.5 no-underline">{t.text}</ins>{" "}
                        </span>
                      ) : (
                        <span key={i}>
                          <del className="text-[var(--ink-faint)] decoration-[var(--pen)] decoration-2">{t.text}</del>{" "}
                        </span>
                      )
                    )}
                  </p>
                )}
              </li>
            );
          })}
      </ol>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--ink-faint)]">
        <span>
          <ins className="rounded-sm bg-[var(--hl-summary)] px-1 no-underline text-[var(--ink)]">added</ins>{" "}
          <del className="decoration-[var(--pen)] decoration-2">removed</del> · drafts are saved on this device only
        </span>
        <button type="button" onClick={onClear} className="font-semibold hover:text-[var(--pen)]">
          Clear history
        </button>
      </div>
      </div>
    </section>
  );
}
