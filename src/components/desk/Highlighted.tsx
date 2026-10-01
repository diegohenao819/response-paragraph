// Párrafo con cada parte pasada por su resaltador.
import type { CSSProperties } from "react";
import type { Segment } from "@/lib/marking";

export default function Highlighted({
  segments,
  animate = true,
  baseDelay = 0,
  className = "",
}: {
  segments: Segment[];
  animate?: boolean;
  baseDelay?: number;
  className?: string;
}) {
  let order = 0;
  return (
    <p className={`on-grid text-[17px] text-[var(--ink)] ${className}`}>
      {segments.map((seg, i) => {
        if (!seg.part) return <span key={i}>{seg.text} </span>;
        const d = baseDelay + order++ * 260;
        return (
          <span key={i}>
            <span
              data-part={seg.part}
              className={`hl ${animate ? "hl-swipe" : ""}`}
              style={{ "--delay": `${d}ms` } as CSSProperties}
            >
              {seg.text.trim()}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
