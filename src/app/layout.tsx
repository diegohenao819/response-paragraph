import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
  Bricolage_Grotesque,
} from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const body = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-body" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Response Paragraph Writing Assistant",
  description: "Write your response paragraph, get it marked against the rubric, and improve it draft by draft.",
};

// Aplica el tema antes del primer pintado para evitar el parpadeo.
const themeScript = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        {/* Skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-[var(--ink)] text-[var(--paper)] rounded px-3 py-1"
        >
          Skip to content
        </a>
        <Navbar />
        <TooltipProvider>
          <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6">
            {children}
          </main>
        </TooltipProvider>
        <Footer />
      </body>
    </html>
  );
}
