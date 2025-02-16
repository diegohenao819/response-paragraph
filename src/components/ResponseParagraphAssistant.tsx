"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  { id: "topicSentence", label: "Topic Sentence" },
  { id: "briefSummary", label: "Brief Summary" },
  { id: "analysisReaction", label: "Analysis or Reaction" },
  { id: "supportingEvidence", label: "Supporting Evidence" },
  { id: "intertextualText", label: "Intertextual Text" },
  { id: "concludingSentence", label: "Concluding Sentence" },
]

export default function ResponseParagraphAssistant() {
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [completeText, setCompleteText] = useState("")
  const [generalFeedback, setGeneralFeedback] = useState("")

  const handleInputChange = (id: string, value: string) => {
    setInputs((prev) => ({ ...prev, [id]: value }))
    updateCompleteText({ ...inputs, [id]: value })
  }

  const updateCompleteText = (currentInputs: Record<string, string>) => {
    const text = sections
      .map((section) => currentInputs[section.id])
      .filter(Boolean)
      .join(" ")
    setCompleteText(text)
  }

  const sendToAI = async (id: string) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: id, text: inputs[id] }),
      })
      const data = await response.json()
      setFeedback((prev) => ({ ...prev, [id]: data.feedback }))
    } catch (error) {
      console.error("Error fetching AI feedback:", error)
    }
  }

  const getGeneralFeedback = async () => {
    try {
      const response = await fetch("/api/general-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: completeText }),
      })
      const data = await response.json()
      setGeneralFeedback(data.feedback)
    } catch (error) {
      console.error("Error fetching general AI feedback:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-[2fr,auto,2fr] gap-4">
        {sections.map((section) => (
          <div key={section.id} className="contents">
            <div className="space-y-2">
              <label htmlFor={section.id} className="block text-sm font-medium text-gray-700">
                {section.label}
              </label>
              <Textarea
                id={section.id}
                value={inputs[section.id] || ""}
                onChange={(e) => handleInputChange(section.id, e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-center">
              <Button onClick={() => sendToAI(section.id)} className="whitespace-nowrap" size="sm">
                Send to AI
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{feedback[section.id] || "No feedback yet."}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[2fr,1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Complete Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={completeText} readOnly className="w-full h-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>General AI Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={getGeneralFeedback} className="w-full mb-4">
              Get General AI Feedback
            </Button>
            {generalFeedback && <p className="text-sm">{generalFeedback}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

