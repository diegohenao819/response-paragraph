// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-xl font-bold">Response Paragraph Tool</span>
        <div className="flex gap-4">
          <Link href="/">
            <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
          </Link>
          <Link href="/examples">
            <span className="text-blue-600 hover:underline cursor-pointer">Examples</span>
          </Link>
          <Link href="/expressions">
            <span className="text-blue-600 hover:underline cursor-pointer">Expressions</span>
          </Link>
          {/* <Link href="/rubrics">
            <span className="text-blue-600 hover:underline cursor-pointer">Rubrics</span>
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
