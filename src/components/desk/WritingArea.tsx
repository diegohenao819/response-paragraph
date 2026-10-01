"use client";
// Zona de escritura cuadriculada que crece con el texto.
import { useCallback, useEffect, useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";

export default function WritingArea({
  minRows = 3,
  className = "",
  value,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { minRows?: number; value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el || el.clientWidth === 0) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight + 2, minRows * 28 + 2)}px`;
  }, [minRows]);

  useLayoutEffect(fit, [value, fit]);

  // El alto depende del ancho: recalcula cuando cambia el ancho de la columna.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== width) {
        width = el.clientWidth;
        fit();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={minRows}
      spellCheck
      className={`writing on-grid block w-full resize-none overflow-hidden rounded-sm border border-[var(--rule)] px-3 text-[17px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--part-ink,var(--ink))] focus:shadow-[0_0_0_3px_var(--hl,var(--rule))] focus:outline-none ${className}`}
      style={{
        backgroundColor: "var(--paper)",
        backgroundImage:
          "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
        backgroundSize: "var(--grid) var(--grid)",
        backgroundAttachment: "local",
        backgroundPosition: "-1px -1px",
      }}
      {...props}
    />
  );
}
