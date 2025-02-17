// src/app/examples/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ExamplesPage() {
  const example1 = {
    title: "EXAMPLE 1: El Olvido que Serémos",
    sections: [
      {
        number: 1,
        title: "Topic Sentence",
        text: "In the movie El Olvido que Seremos, directed by Fernando Trueba, the story follows the life of Héctor Abad Gómez, a Colombian doctor and human rights activist who fought for social justice and public health.",
      },
      {
        number: 2,
        title: "Brief Summary",
        text: "The film portrays his dedication to helping the underprivileged in Medellín and the profound impact of his work on his family, especially his son.",
      },
      {
        number: 3,
        title: "Analysis or Reaction",
        text: "This story is powerful because it shows the courage and resilience needed to stand up for what is right, even in the face of danger. It highlights the importance of empathy and fighting for the common good, which can be both inspiring and tragic.",
      },
      {
        number: 4,
        title: "Supporting Evidence",
        text: "For instance, the scene where Héctor passionately speaks at a public gathering about the right to health care demonstrates his firm commitment to his beliefs.",
      },
      {
        number: 5,
        title: "Personal Connection or Intertextual Text",
        text: "This is very important in current society because the film sheds light on the ongoing social issues in Colombia, such as political violence and the struggle for human rights, a factor that can create change and inspire future generations to keep pushing for justice.",
      },
      {
        number: 6,
        title: "Concluding Sentence",
        text: "The movie serves as a reminder that acts of kindness and advocacy can leave a lasting impact, even if they come at great personal cost.",
      },
    ],
  };

  const example2 = {
    title: "EXAMPLE 2: The Great Dictator",
    sections: [
      {
        number: 1,
        title: "Topic Sentence",
        text: "In The Great Dictator, Charlie Chaplin uses satire to deliver a powerful message on the dangers of authoritarianism.",
      },
      {
        number: 2,
        title: "Brief Summary",
        text: "The film juxtaposes humor with the harsh realities of dictatorship, critiquing the rise of totalitarianism.",
      },
      {
        number: 3,
        title: "Analysis or Reaction",
        text: "The film's blend of comedy and tragedy serves as both a biting critique and a heartfelt plea for humanity and freedom.",
      },
      {
        number: 4,
        title: "Supporting Evidence",
        text: "For example, Chaplin's iconic speech near the end of the film directly addresses the audience, urging them to fight for democracy.",
      },
      {
        number: 5,
        title: "Personal Connection or Intertextual Text",
        text: "This resonant narrative mirrors current events where populist movements threaten democratic values, making the film's message as relevant today as it was then.",
      },
      {
        number: 6,
        title: "Concluding Sentence",
        text: "Ultimately, The Great Dictator remains a timeless reminder of the power of art to challenge oppression and inspire change.",
      },
    ],
  };

  const renderExampleSections = (
    sections: { number: number; title: string; text: string }[]
  ) => (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.number} className="border-b pb-2">
          <p className="font-bold text-gray-800">
            {section.number}. {section.title}:
          </p>
          <p className="ml-4 text-gray-700">{section.text}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        Response Paragraph Examples
      </h1>

      <Card className="shadow-lg">
        <CardHeader className="bg-blue-100 p-4">
          <CardTitle className="text-xl">{example1.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {renderExampleSections(example1.sections)}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="bg-green-100 p-4">
          <CardTitle className="text-xl">{example2.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {renderExampleSections(example2.sections)}
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/" className="text-blue-600 hover:underline text-lg">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
