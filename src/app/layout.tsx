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
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        <TooltipProvider>{children}</TooltipProvider>
        <Footer />
      </body>
    </html>
  );
}
