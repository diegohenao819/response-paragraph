"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/examples", label: "Examples" },
  { href: "/expressions", label: "Expressions" },
  { href: "/rubrics", label: "Rubrics" },
];

export default function Navbar() {
  const pathname = usePathname();

  const base =
    "px-3 py-1.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const active =
    "bg-primary text-primary-foreground hover:bg-primary/90";
  const idle =
    "text-blue-700 hover:underline hover:bg-blue-50 dark:hover:bg-zinc-800";

  return (
    <nav className="bg-gray-100 dark:bg-zinc-900/60 backdrop-blur p-3 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center gap-4 justify-between">
        <span className="text-lg font-semibold">Response Paragraph Tool</span>
        <div className="flex items-center gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`${base} ${pathname === l.href ? active : idle}`}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
