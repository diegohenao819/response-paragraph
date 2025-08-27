import Image from "next/image";

export default function Page() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Expressions</h2>
      <Image
        src="/pictures/expressions.png"
        alt="Expressions illustration"
        width={700}
        height={500}
        priority
      />
    </div>
  );
}
