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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful writing assistant. Provide concise feedback on the following section of a response paragraph.",
        },
        {
          role: "user",
          content: `Section: ${section}\nText: ${text}\n\nPlease provide brief, constructive feedback on this section. Also, highlight if grammar is correct or specify the grammar mistakes there might be`,
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
