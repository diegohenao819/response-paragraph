import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { text } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful writing assistant. Provide comprehensive feedback on the following complete response paragraph.",
        },
        {
          role: "user",
          content: `Complete Text: ${text}\n\nPlease provide general feedback on this response paragraph, focusing on coherence, logical flow, and overall effectiveness.`,
        },
      ],
    })

    const feedback = completion.choices[0].message.content

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: "Error generating general feedback" }, { status: 500 })
  }
}

