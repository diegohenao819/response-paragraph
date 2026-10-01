// Marcas de bolígrafo rojo dibujadas con SVG (se animan con .pen-draw).
import type { CSSProperties, ReactNode } from "react";

const delay = (ms = 0) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function PenCircle({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <svg
        aria-hidden
        viewBox="0 0 100 64"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[22%] -inset-y-[30%] h-[160%] w-[144%] text-[var(--pen)]"
      >
        <path
          d="M68 7 C 42 1, 7 9, 6 33 C 5 54, 40 61, 63 57 C 88 53, 97 39, 94 24 C 91 10, 70 4, 46 6"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="pen-draw"
          style={delay(delayMs)}
        />
      </svg>
      <span className="ink-in relative" style={delay(delayMs + 350)}>
        {children}
      </span>
    </span>
  );
}

export function Tick({ delayMs = 0, className = "" }: { delayMs?: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 22" className={`h-4 w-4 text-[var(--pen)] ${className}`}>
      <path
        d="M2 12 C 4 14, 6 16, 8.5 19 C 12 11, 16 6, 22 2"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pen-draw"
        style={delay(delayMs)}
      />
    </svg>
  );
}

export function Cross({ delayMs = 0, className = "" }: { delayMs?: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`h-4 w-4 text-[var(--pen)] ${className}`}>
      <path
        d="M4 4 C 9 9, 14 14, 20 20 M20 4 C 14 10, 9 14, 4 20"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="pen-draw"
        style={delay(delayMs)}
      />
    </svg>
  );
}

// Garabato en bucle mientras la IA "corrige".
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 60 12" className={`h-3 w-12 ${className}`}>
      <path
        d="M2 8 C 6 2, 9 2, 12 7 S 18 11, 22 5 S 30 1, 33 7 S 41 11, 45 5 S 54 2, 58 7"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="scribble"
      />
    </svg>
  );
}
