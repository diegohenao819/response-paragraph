import Image from "next/image";

export default function Page() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Rubrics - 2024</h2>
      <Image
        src="/pictures/rubrics.png"
        alt="Rubrics illustration"
        width={700}
        height={500}
        priority
      />
    </div>
  );
}
