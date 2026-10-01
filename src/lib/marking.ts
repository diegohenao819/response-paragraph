// Tipos y utilidades compartidas para la corrección general (rubric /20) y el historial.
import { RUBRIC_TOTAL, SECTIONS, type SectionId } from "./responseParagraph";

export type ScoreKey = SectionId | "language" | "wordLimit";

export const SCORE_ROWS: { key: ScoreKey; label: string; max: number }[] = [
  { key: "topic", label: "Topic sentence", max: 2 },
  { key: "summary", label: "Summary (synthesis)", max: 4 },
  { key: "reaction", label: "Reaction & arguments", max: 5 },
  { key: "conclusion", label: "Conclusion", max: 2 },
  { key: "language", label: "Language use", max: 5 },
  { key: "wordLimit", label: "Word limit (190–210)", max: 2 },
];

export type Moves = { recognize: boolean; refute: boolean; consequences: boolean; propose: boolean };

export const MOVES: { key: keyof Moves; label: string; hint: string }[] = [
  { key: "recognize", label: "Recognize", hint: "what is valid (pro)" },
  { key: "refute", label: "Refute", hint: "what is weak or missing (con)" },
  { key: "consequences", label: "Consequences", hint: "what will happen" },
  { key: "propose", label: "Propose", hint: "a better idea" },
];

export interface LanguageError {
  wrong: string;
  correct: string;
  reason: string;
}

export interface Marking {
  parts: Record<SectionId, string>;
  scores: Record<ScoreKey, { score: number; comment: string }>;
  partNotes: Record<SectionId, string>;
  moves: Moves;
  languageErrors: LanguageError[];
  priorities: string[];
  total: number;
  words: number;
}

export interface Draft {
  id: string;
  createdAt: number;
  text: string;
  marking: Marking;
}

export function totalOf(scores: Marking["scores"]): number {
  return Math.min(
    RUBRIC_TOTAL,
    SCORE_ROWS.reduce((sum, r) => sum + (scores[r.key]?.score ?? 0), 0)
  );
}

// ---------------------------------------------------------------------------
// Ubica cada parte dentro del párrafo para poder resaltarla.
// La IA copia las partes del texto; si cambia algo, buscamos por el inicio.
// ---------------------------------------------------------------------------
export type Segment = { part: SectionId | null; text: string };

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

export function segmentParagraph(text: string, parts: Partial<Record<SectionId, string>>): Segment[] {
  const source = norm(text);
  const lower = source.toLowerCase();
  const starts: { part: SectionId; at: number }[] = [];
  let cursor = 0;

  for (const s of SECTIONS) {
    const p = norm(parts[s.id] ?? "");
    if (!p) continue;
    let at = lower.indexOf(p.toLowerCase(), cursor);
    if (at < 0) at = lower.indexOf(p.slice(0, 30).toLowerCase(), cursor);
    if (at < 0) continue;
    starts.push({ part: s.id, at });
    cursor = at + 1;
  }

  if (starts.length === 0) return [{ part: null, text: source }];

  const segments: Segment[] = [];
  if (starts[0].at > 0) segments.push({ part: null, text: source.slice(0, starts[0].at) });
  starts.forEach((s, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].at : source.length;
    segments.push({ part: s.part, text: source.slice(s.at, end) });
  });
  return segments;
}

// ---------------------------------------------------------------------------
// Diferencia palabra por palabra entre dos borradores (LCS).
// ---------------------------------------------------------------------------
export type DiffToken = { type: "same" | "added" | "removed"; text: string };

export function diffWords(before: string, after: string): DiffToken[] {
  const a = norm(before).split(" ").filter(Boolean);
  const b = norm(after).split(" ").filter(Boolean);
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffToken[] = [];
  const push = (type: DiffToken["type"], word: string) => {
    const last = out[out.length - 1];
    if (last && last.type === type) last.text += " " + word;
    else out.push({ type, text: word });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push("same", a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push("removed", a[i++]);
    } else {
      push("added", b[j++]);
    }
  }
  while (i < n) push("removed", a[i++]);
  while (j < m) push("added", b[j++]);
  return out;
}

// "Score: 3/4" al final del feedback por parte.
export function splitPartFeedback(markdown: string): { body: string; score: number | null; max: number | null } {
  const match = markdown.match(/\**\s*Score:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+)\s*\**\s*$/i);
  if (!match) return { body: markdown.trim(), score: null, max: null };
  return {
    body: markdown.slice(0, match.index).trim(),
    score: Number(match[1]),
    max: Number(match[2]),
  };
}
