"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Write" },
  { href: "/examples", label: "Examples" },
  { href: "/expressions", label: "Expressions" },
  { href: "/rubrics", label: "Rubric" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 pt-5 pb-6 sm:flex-nowrap sm:px-6">
      <Link href="/" className="group flex items-baseline gap-2 text-[var(--ink)]">
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight sm:text-xl">
          Response Paragraph
        </span>
        <span className="hidden text-sm text-[var(--ink-faint)] sm:inline">Week 4 · UTP</span>
      </Link>
      <div className="contents sm:flex sm:items-center sm:gap-1">
        <div className="-mx-2.5 order-last flex w-full items-center sm:order-none sm:mx-0 sm:w-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
                  active
                    ? "font-semibold text-[var(--ink)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {l.label}
                {active && (
                  <svg
                    aria-hidden
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="absolute inset-x-2 -bottom-0.5 h-2 w-[calc(100%-1rem)] text-[var(--pen)]"
                  >
                    <path
                      d="M2 5 C 25 2, 55 7, 98 3"
                      pathLength={1}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="pen-draw"
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
