"use client";
import ReactMarkdown from "react-markdown";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  SECTIONS,
  countSentences,
  countWords,
  joinParagraph,
  type SectionId,
} from "@/lib/responseParagraph";
import { splitPartFeedback, type Draft, type Marking } from "@/lib/marking";
import { useLocalStorage } from "@/lib/useLocalStorage";
import WordTrack from "./desk/WordTrack";
import WritingArea from "./desk/WritingArea";
import MarginNote from "./desk/MarginNote";
import MarkingReport from "./desk/MarkingReport";
import DraftHistory from "./desk/DraftHistory";
import { PenCircle, Scribble } from "./desk/PenMarks";
import { Plus } from "lucide-react";

type Mode = "parts" | "full";
type Inputs = Partial<Record<SectionId, string>>;

const MIN_WORDS_TO_MARK = 40;
const MAX_DRAFTS = 30;

const rangeLabel = (min: number, max: number) => (min === max ? `${min}` : `${min}–${max}`);
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

// Claves "v2": el formato anterior (6 secciones) no es compatible con el nuevo.
export default function ResponseParagraphAssistant() {
  const [mode, setModeState] = useLocalStorage<Mode>("rpV2Mode", "parts");
  const [caseText, setCaseText] = useLocalStorage<string>("rpV2Case", "");
  const [inputs, setInputs] = useLocalStorage<Inputs>("rpV2Inputs", {});
  const [fullText, setFullText] = useLocalStorage<string>("rpV2Full", "");
  const [feedback, setFeedback] = useLocalStorage<Partial<Record<SectionId, string>>>("rpV2Feedback", {});
  const [drafts, setDrafts] = useLocalStorage<Draft[]>("rpV2Drafts", []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<SectionId | null>(null);
  const [showModel, setShowModel] = useState<Partial<Record<SectionId, boolean>>>({});
  const [loading, setLoading] = useState<Partial<Record<SectionId, boolean>>>({});
  const [partError, setPartError] = useState<Partial<Record<SectionId, string>>>({});
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const paragraph = mode === "parts" ? joinParagraph(inputs) : normalize(fullText);
  const words = countWords(paragraph);
  const partCounts = useMemo(
    () => Object.fromEntries(SECTIONS.map((s) => [s.id, countWords(inputs[s.id] ?? "")])) as Record<SectionId, number>,
    [inputs]
  );

  const selected = drafts.find((d) => d.id === selectedId) ?? drafts[drafts.length - 1];
  const selectedIndex = selected ? drafts.indexOf(selected) : -1;
  const stale = !!selected && selectedIndex === drafts.length - 1 && normalize(selected.text) !== paragraph;

  const setMode = (next: Mode) => {
    if (next === mode) return;
    if (next === "full" && !fullText.trim()) setFullText(joinParagraph(inputs));
    if (next === "parts" && SECTIONS.every((s) => !inputs[s.id]?.trim()) && selected) {
      setInputs({ ...selected.marking.parts });
    }
    setModeState(next);
  };

  const checkPart = async (id: SectionId) => {
    setLoading((p) => ({ ...p, [id]: true }));
    setPartError((p) => ({ ...p, [id]: "" }));
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: id, text: inputs[id] ?? "", inputs, caseText }),
      });
      const data = await response.json();
      if (!response.ok || !data.feedback) throw new Error(data.error);
      setFeedback((prev) => ({ ...prev, [id]: data.feedback }));
    } catch {
      setPartError((p) => ({ ...p, [id]: "Couldn't check this part. Check your connection and try again." }));
    } finally {
      setLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const markParagraph = async () => {
    setMarking(true);
    setMarkError("");
    try {
      const response = await fetch("/api/general-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: paragraph, caseText, parts: mode === "parts" ? inputs : undefined }),
      });
      const data = await response.json();
      if (!response.ok || !data.marking) throw new Error(data.error);
      const result = data.marking as Marking;
      const draft: Draft = { id: crypto.randomUUID(), createdAt: Date.now(), text: paragraph, marking: result };
      setDrafts((prev) => [...prev, draft].slice(-MAX_DRAFTS));
      setSelectedId(draft.id);
      requestAnimationFrame(() =>
        reportRef.current?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        })
      );
    } catch (error) {
      setMarkError(
        error instanceof Error && error.message
          ? error.message
          : "Couldn't mark your paragraph. Check your connection and try again."
      );
    } finally {
      setMarking(false);
    }
  };

  const revisePartByPart = () => {
    if (!selected) return;
    const hasParts = SECTIONS.some((s) => inputs[s.id]?.trim());
    if (hasParts && !window.confirm("Replace the text in your parts with this draft, split into its four parts?")) return;
    setInputs({ ...selected.marking.parts });
    setFeedback({});
    setModeState("parts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restoreDraft = (draft: Draft) => {
    const current = mode === "parts" ? joinParagraph(inputs) : normalize(fullText);
    if (current && current !== normalize(draft.text) && !window.confirm("Replace what is in the editor with this draft?")) return;
    setFullText(draft.text);
    setInputs({ ...draft.marking.parts });
    setFeedback({});
    setSelectedId(draft.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearWriting = () => {
    if (!window.confirm("Delete your current text and part feedback? Your marked drafts stay saved.")) return;
    setInputs({});
    setFullText("");
    setFeedback({});
  };

  const clearHistory = () => {
    if (!window.confirm("Delete all your marked drafts from this device?")) return;
    setDrafts([]);
    setSelectedId(null);
  };

  const canMark = words >= MIN_WORDS_TO_MARK && !marking;

  const markButton = (
    <button
      type="button"
      onClick={markParagraph}
      disabled={!canMark}
      className="group inline-flex h-12 items-center justify-center gap-3 rounded-sm bg-[var(--ink)] px-6 font-semibold text-[var(--paper)] shadow-[0_4px_14px_-6px_rgba(28,37,51,0.45)] transition-[transform,box-shadow,opacity,background-color] duration-200 hover:-translate-y-px hover:bg-[var(--pen)] hover:shadow-[0_10px_22px_-10px_rgba(192,57,43,0.6)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:translate-y-0"
    >
      {marking ? (
        <>
          <Scribble className="text-[var(--pen)]" /> Marking…
        </>
      ) : (
        "Mark my paragraph"
      )}
    </button>
  );

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      <header className="-mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Write it.{" "}
            <span className="hl hl-swipe" data-part="reaction" style={{ "--delay": "200ms" } as CSSProperties}>
              Get it marked.
            </span>
          </h1>
          <p className="mt-1.5 text-[15px] text-[var(--ink-soft)]">
            Four parts, one paragraph, {rangeLabel(190, 210)} words, marked with the 20-point rubric from class.
          </p>
        </div>
        {selected && (
          <button
            type="button"
            onClick={() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="group flex items-center gap-4 pr-3 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            <span className="text-right leading-tight">
              Last marking
              <span className="block text-xs text-[var(--ink-faint)] group-hover:underline">Draft {drafts.length} · see notes</span>
            </span>
            <span className="nums text-[var(--pen)]">
              <span className="text-2xl font-semibold">{drafts[drafts.length - 1].marking.total}</span>
              <span className="text-xs">/20</span>
            </span>
          </button>
        )}
      </header>

      {/* ------------------------------ Hoja de escritura ------------------------------ */}
      <section aria-label="Your paragraph" className="sheet sheet-margin [--margin-x:16px] lg:[--margin-x:212px]">
        <div className="grid lg:grid-cols-[212px_1fr]">
          {/* Margen: cinta de palabras y partes */}
          <aside className="hidden px-5 py-7 lg:block">
            <div className="sticky top-6 space-y-6">
              <WordTrack counts={mode === "parts" ? partCounts : undefined} total={words} />
              <div className="[&>button]:w-full [&>button]:whitespace-nowrap [&>button]:px-2 [&>button]:text-[15px]">{markButton}</div>
              <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
                {words < MIN_WORDS_TO_MARK
                  ? `Write at least ${MIN_WORDS_TO_MARK} words to get your paragraph marked.`
                  : "You get a score out of 20, notes on each part, and your draft is saved."}
              </p>
              {markError && <p className="text-xs font-semibold text-[var(--pen)]" role="alert">{markError}</p>}
              {mode === "full" && (
                <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
                  When you mark it, each part is found and highlighted for you.
                </p>
              )}
            </div>
          </aside>

          <div className="min-w-0 px-7 py-7 lg:pl-6 lg:pr-10">
            {/* Barra de la hoja: modo + caso */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="How do you want to write?"
                className="relative grid w-full grid-cols-2 rounded-sm border border-[var(--rule)] bg-[var(--paper)] p-1 text-sm font-semibold sm:w-auto"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[2px] bg-[var(--ink)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: mode === "full" ? "translateX(100%)" : "none" }}
                />
                {(["parts", "full"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    type="button"
                    aria-selected={mode === m}
                    onClick={() => setMode(m)}
                    className={`relative z-10 px-4 py-1.5 transition-colors duration-300 ${
                      mode === m ? "text-[var(--paper)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {m === "parts" ? "Part by part" : "Whole paragraph"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={clearWriting}
                className="text-sm font-semibold text-[var(--ink-faint)] hover:text-[var(--pen)]"
              >
                Clear text
              </button>
            </div>

            <details className="group mt-6 rounded-sm border border-dashed border-[var(--rule)] bg-[var(--paper)] open:border-solid">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>
                  <span className="font-semibold">The case you are responding to</span>{" "}
                  <span className="text-[var(--ink-faint)]">
                    {caseText.trim() ? `· “${caseText.trim().slice(0, 50)}${caseText.trim().length > 50 ? "…" : ""}”` : "· optional, helps check your summary"}
                  </span>
                </span>
                <Plus aria-hidden className="h-4 w-4 shrink-0 text-[var(--ink-faint)] transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <div className="px-4 pb-4">
                <WritingArea
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  minRows={3}
                  aria-label="The case you are responding to"
                  placeholder="Paste the statement or text, e.g. “Phones are the main source of distraction in our classrooms…” (The principal)"
                />
              </div>
            </details>

            {mode === "parts" ? (
              <ol className="mt-8 space-y-10" key="parts">
                {SECTIONS.map((section, i) => {
                  const text = inputs[section.id] ?? "";
                  const sentences = text.trim() ? countSentences(text) : 0;
                  const ok = sentences >= section.sentences.min && sentences <= section.sentences.max;
                  const active = activePart === section.id;
                  const note = feedback[section.id] ? splitPartFeedback(feedback[section.id]!) : null;
                  return (
                    <li
                      key={section.id}
                      data-part={section.id}
                      className={`ink-in grid gap-x-8 gap-y-4 transition-opacity duration-300 xl:grid-cols-[1fr_300px] ${
                        activePart && !active ? "opacity-45 hover:opacity-100" : ""
                      }`}
                      style={{ "--delay": `${i * 70}ms` } as CSSProperties}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <label htmlFor={section.id} className="flex items-baseline gap-3">
                            <span className="nums text-sm font-semibold text-[var(--part-ink)]">{section.number}</span>
                            <span className="text-xl font-bold tracking-tight">
                              <span
                                key={active ? "on" : "off"}
                                className={active || text.trim() ? `hl ${active ? "hl-swipe" : ""}` : ""}
                              >
                                {section.label}
                              </span>
                            </span>
                          </label>
                          <span className="flex items-baseline gap-4 text-xs">
                            <span
                              className={`nums ${
                                sentences === 0 ? "text-[var(--ink-faint)]" : ok ? "text-[var(--ink-summary)]" : "font-semibold text-[var(--pen)]"
                              }`}
                            >
                              {sentences} of {rangeLabel(section.sentences.min, section.sentences.max)} sentence
                              {section.sentences.max > 1 ? "s" : ""}
                            </span>
                            <span className="nums text-[var(--ink-faint)]">{partCounts[section.id]} words</span>
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{section.hint}</p>
                        <WritingArea
                          id={section.id}
                          className="mt-3"
                          value={text}
                          minRows={section.id === "reaction" ? 6 : section.id === "summary" ? 4 : 2}
                          onFocus={() => setActivePart(section.id)}
                          onBlur={() => setActivePart((p) => (p === section.id ? null : p))}
                          onChange={(e) => setInputs((prev) => ({ ...prev, [section.id]: e.target.value }))}
                        />
                        <button
                          type="button"
                          aria-expanded={!!showModel[section.id]}
                          onClick={() => setShowModel((p) => ({ ...p, [section.id]: !p[section.id] }))}
                          className="mt-2 text-xs font-semibold text-[var(--ink-faint)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                        >
                          {showModel[section.id] ? "Hide the model" : "See the model from class"}
                        </button>
                        {showModel[section.id] && (
                          <p className="ink-in on-grid mt-2 text-[15px] italic text-[var(--ink-soft)]">
                            <span className="hl">{section.example}</span>
                          </p>
                        )}
                      </div>

                      {/* Columna de notas */}
                      <div className="min-w-0 xl:pt-9">
                        <button
                          type="button"
                          onClick={() => checkPart(section.id)}
                          disabled={loading[section.id] || !text.trim()}
                          className="inline-flex h-9 items-center gap-2 rounded-sm border border-[var(--ink)] px-3.5 text-sm font-semibold transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] disabled:cursor-not-allowed disabled:border-[var(--rule)] disabled:text-[var(--ink-faint)] disabled:hover:bg-transparent"
                        >
                          {loading[section.id] ? (
                            <>
                              <Scribble className="text-[var(--pen)]" /> Reading…
                            </>
                          ) : note ? (
                            "Check again"
                          ) : (
                            `Check my ${section.label.toLowerCase()}`
                          )}
                        </button>
                        {partError[section.id] && (
                          <p className="mt-2 text-sm text-[var(--pen)]">{partError[section.id]}</p>
                        )}
                        {note && (
                          <MarginNote key={feedback[section.id]} className="mt-4">
                            {note.score !== null && (
                              <div className="mb-2">
                                <PenCircle delayMs={150}>
                                  <span className="nums px-1 text-lg font-semibold text-[var(--pen)]">
                                    {note.score}/{note.max}
                                  </span>
                                </PenCircle>
                              </div>
                            )}
                            <div className="prose prose-sm max-w-none text-[var(--ink)] prose-headings:text-[var(--ink)] prose-strong:text-[var(--ink)] prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-li:marker:text-[var(--pen)] prose-del:text-[var(--pen)]">
                              <ReactMarkdown>{note.body}</ReactMarkdown>
                            </div>
                          </MarginNote>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="ink-in mt-8 grid gap-x-8 gap-y-6 xl:grid-cols-[1fr_300px]" key="full">
                <div>
                  <label htmlFor="full-paragraph" className="text-xl font-bold tracking-tight">
                    Your paragraph
                  </label>
                  <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
                    One paragraph, no line breaks. Paste it or write it here.
                  </p>
                  <WritingArea
                    id="full-paragraph"
                    className="mt-3"
                    value={fullText}
                    minRows={10}
                    onChange={(e) => setFullText(e.target.value)}
                    placeholder="Banning mobile phones for the whole school day may protect students' concentration, but…"
                  />
                  {/\n\s*\S/.test(fullText.trim()) && (
                    <p className="mt-2 text-sm text-[var(--pen)]">
                      Your text has line breaks. A response paragraph is one single paragraph.
                    </p>
                  )}
                </div>
                <div className="xl:pt-9">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">What the marking looks for</p>
                  <ol className="mt-3 space-y-3">
                    {SECTIONS.map((s) => (
                      <li key={s.id} data-part={s.id} className="text-sm">
                        <span className="font-semibold">
                          <span className="hl">{s.label}</span>
                        </span>{" "}
                        <span className="nums text-xs text-[var(--ink-faint)]">
                          · {rangeLabel(s.sentences.min, s.sentences.max)} sentence{s.sentences.max > 1 ? "s" : ""}
                        </span>
                        <p className="mt-0.5 leading-relaxed text-[var(--ink-soft)]">{s.hint}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ------------------------------ Hoja corregida ------------------------------ */}
      <div ref={reportRef} className="scroll-mt-6">
        {selected && (
          <MarkingReport
            draft={selected}
            number={selectedIndex + 1}
            previousTotal={selectedIndex > 0 ? drafts[selectedIndex - 1].marking.total : undefined}
            stale={stale}
            onRevisePartByPart={mode === "full" ? revisePartByPart : undefined}
          />
        )}
      </div>

      <DraftHistory
        drafts={drafts}
        selectedId={selected?.id ?? null}
        onSelect={(id) => {
          setSelectedId(id);
          reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        onRestore={restoreDraft}
        onClear={clearHistory}
      />

      {/* Barra fija en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--rule)] bg-[var(--paper)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur lg:hidden">
        {markError && <p className="mb-2 text-xs font-semibold text-[var(--pen)]" role="alert">{markError}</p>}
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <WordTrack counts={mode === "parts" ? partCounts : undefined} total={words} compact />
          </div>
          {markButton}
        </div>
      </div>
    </div>
  );
}
