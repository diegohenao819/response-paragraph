import { NextResponse } from "next/server";
import OpenAI from "openai";

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { section, text } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful writing assistant. Provide detailed feedback on the provided section of a response paragraph in two parts:

1. Content & Structure Feedback: Evaluate how well the section fits into the overall paragraph. Consider whether it effectively introduces or summarizes the idea, maintains coherence with the rest of the text, and contributes meaningfully to the argument.

2. Grammar Feedback: Identify any grammatical errors or awkward phrasing, and suggest corrections.

At the end of your response, include a separate line with a score in the format "Score: X/5" (where X is a number from 0 to 5, with 0 being completely ineffective and 5 being excellent).

Below are examples for each section:

- **Topic Sentence Example:**  
  "In today's rapidly evolving world, renewable energy is not only a viable alternative but a necessity for sustainable development."

- **Brief Summary Example:**  
  "The article outlines the benefits of renewable energy, emphasizing its economic and environmental advantages."

- **Analysis or Reaction Example:**  
  "Although the article highlights many benefits, it overlooks potential challenges such as high initial costs and infrastructural limitations."

- **Supporting Evidence Example:**  
  "For instance, a study by the National Renewable Energy Laboratory shows a 20% improvement in energy efficiency when renewable sources are implemented."

- **Intertextual Text Example:**  
  "Similarly, in Shakespeare's works, recurring themes of nature underscore the importance of living in harmony with the environment."

- **Concluding Sentence Example:**  
  "In conclusion, renewable energy not only addresses our immediate energy needs but also paves the way for a sustainable future."

Please provide detailed, actionable feedback as described.`,
        },
        {
          role: "user",
          content: `Section: ${section}\nText: ${text}\n\nPlease provide detailed feedback as per the instructions above.`,
        },
      ],
    });

    const feedback = completion.choices[0].message.content;
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error generating feedback" },
      { status: 500 }
    );
  }
}
