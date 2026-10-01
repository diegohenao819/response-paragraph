// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-sm text-[var(--ink-faint)] sm:px-6">
      <div className="flex flex-col gap-1 border-t border-[var(--rule)] pt-5 md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Diego Henao. All rights reserved.</p>
        <p>Professor of Upper-Intermediate English Course at Universidad Tecnológica de Pereira.</p>
      </div>
    </footer>
  );
}
