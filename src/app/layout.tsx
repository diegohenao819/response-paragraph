import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Response Paragraph Writing Assistant",
  description: "An AI-powered tool to help students write structured response paragraphs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* Skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground rounded px-3 py-1"
        >
          Skip to content
        </a>
        <Navbar />
        <TooltipProvider>
          <main id="main" className="container mx-auto p-4">{children}</main>
        </TooltipProvider>
        <Footer />
      </body>
    </html>
  );
}
