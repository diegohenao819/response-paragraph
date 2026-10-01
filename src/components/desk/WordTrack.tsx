// La "cinta" de palabras: 190–210 palabras, llenada parte por parte.
import { SECTIONS, WORD_LIMIT, type SectionId } from "@/lib/responseParagraph";

// Reparto aproximado que enseñan las diapositivas (≈200 palabras).
export const WORD_SHARE: Record<SectionId, number> = {
  topic: 25,
  summary: 50,
  reaction: 100,
  conclusion: 25,
};

const SCALE = 240; // palabras que representa la cinta completa

export default function WordTrack({
  counts,
  total,
  compact = false,
}: {
  counts?: Partial<Record<SectionId, number>>;
  total: number;
  compact?: boolean;
}) {
  const inRange = total >= WORD_LIMIT.min && total <= WORD_LIMIT.max;
  const over = total > WORD_LIMIT.max;
  const pct = (n: number) => `${(Math.min(n, SCALE) / SCALE) * 100}%`;
  const status = total === 0 ? "Start writing" : inRange ? "On target" : over ? `${total - WORD_LIMIT.max} over` : `${WORD_LIMIT.min - total} to go`;

  return (
    <div className="w-full" role="group" aria-label={`Word count ${total}, target ${WORD_LIMIT.min} to ${WORD_LIMIT.max}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={`nums whitespace-nowrap font-semibold leading-none text-[var(--ink)] ${compact ? "text-lg" : "text-2xl"}`}>
          {total}
          <span className="text-sm font-normal text-[var(--ink-faint)]"> words</span>
        </span>
        <span
          className={`whitespace-nowrap text-xs font-semibold ${
            inRange ? "text-[var(--ink-summary)]" : total === 0 ? "text-[var(--ink-faint)]" : "text-[var(--pen)]"
          }`}
          aria-live="polite"
        >
          {status}
        </span>
      </div>

      <div className="relative mt-2.5 h-3">
        {/* Zona objetivo 190–210 */}
        <div
          className="absolute -top-1 -bottom-1 rounded-sm border border-dashed border-[color:var(--margin-rule)] bg-[var(--pen-soft)]"
          style={{ left: pct(WORD_LIMIT.min), width: `${((WORD_LIMIT.max - WORD_LIMIT.min) / SCALE) * 100}%` }}
          aria-hidden
        />
        <div className="absolute inset-0 overflow-hidden rounded-sm bg-[var(--rule)]" aria-hidden>
          {counts ? (
            <div className="flex h-full">
              {SECTIONS.map((s) => (
                <div
                  key={s.id}
                  data-part={s.id}
                  className="h-full bg-[var(--hl)] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: pct(counts[s.id] ?? 0) }}
                />
              ))}
            </div>
          ) : (
            <div
              className="h-full bg-[var(--ink-faint)] opacity-60 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: pct(total) }}
            />
          )}
        </div>
      </div>
      <div className={`nums relative mt-1.5 h-4 text-[10px] text-[var(--ink-faint)] ${compact ? "hidden" : ""}`} aria-hidden>
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: pct((WORD_LIMIT.min + WORD_LIMIT.max) / 2) }}
        >
          {WORD_LIMIT.min}–{WORD_LIMIT.max}
        </span>
      </div>

      {counts && !compact && (
        <dl className="mt-2 space-y-1 text-xs">
          {SECTIONS.map((s) => (
            <div key={s.id} data-part={s.id} className="flex items-center justify-between gap-2">
              <dt className="flex items-center gap-1.5 text-[var(--ink-soft)]">
                <span className="h-2 w-2 rounded-full bg-[var(--hl)] ring-1 ring-[var(--part-ink)]" />
                {s.label}
              </dt>
              <dd className="nums text-[var(--ink-soft)]">
                {counts[s.id] ?? 0}
                <span className="text-[var(--ink-faint)]">/~{WORD_SHARE[s.id]}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
