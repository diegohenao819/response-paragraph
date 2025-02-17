"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const sections = [
  {
    id: "topic-Sentence",
    label: "Topic Sentence",
    example:
      "In today's rapidly evolving world, renewable energy is not only a viable alternative but a necessity for sustainable development.",
  },
  {
    id: "brief-Summary",
    label: "Brief Summary",
    example:
      "The article outlines the benefits of renewable energy, emphasizing its economic and environmental advantages.",
  },
  {
    id: "analysis-or-Reaction",
    label: "Analysis or Reaction",
    example:
      "Although the article highlights many benefits, it overlooks potential challenges such as high initial costs and infrastructural limitations.",
  },
  {
    id: "supporting-Evidence",
    label: "Supporting Evidence",
    example:
      "For instance, a study by the National Renewable Energy Laboratory shows a 20% improvement in energy efficiency when renewable sources are implemented.",
  },
  {
    id: "intertextual-Text",
    label: "Intertextual Text",
    example:
      "Similarly, in Shakespeare's works, recurring themes of nature underscore the importance of living in harmony with the environment.",
  },
  {
    id: "concluding-Sentence",
    label: "Concluding Sentence",
    example:
      "In conclusion, renewable energy not only addresses our immediate energy needs but also paves the way for a sustainable future.",
  },
];

export default function ResponseParagraphAssistant() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [completeText, setCompleteText] = useState("");
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleInputChange = (id: string, value: string) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
    updateCompleteText({ ...inputs, [id]: value });
  };

  const updateCompleteText = (currentInputs: Record<string, string>) => {
    const text = sections
      .map((section) => currentInputs[section.id])
      .filter(Boolean)
      .join(" ");
    setCompleteText(text);
  };

  const sendToAI = async (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: id, text: inputs[id] }),
      });
      const data = await response.json();
      setFeedback((prev) => ({ ...prev, [id]: data.feedback }));
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getGeneralFeedback = async () => {
    try {
      const response = await fetch("/api/general-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: completeText }),
      });
      const data = await response.json();
      setGeneralFeedback(data.feedback);
    } catch (error) {
      console.error("Error fetching general AI feedback:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Responsive grid for individual sections */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr,auto,2fr] gap-4">
        {sections.map((section) => (
          <div key={section.id} className="contents">
            <div className="space-y-2">
            <Tooltip>
  <TooltipTrigger asChild>
    <div className="flex items-center gap-1 cursor-pointer">
      <label
        htmlFor={section.id}
        className="block text-sm font-medium text-gray-700"
      >
        {section.label}
      </label>
      <Info className="h-4 w-4 text-gray-500" />
    </div>
  </TooltipTrigger>
  <TooltipContent side="top" className="bg-gray-50 p-2 rounded shadow">
    <p className="text-xs text-gray-600">{section.example}</p>
  </TooltipContent>
</Tooltip>
              <Textarea
                id={section.id}
                value={inputs[section.id] || ""}
                onChange={(e) => handleInputChange(section.id, e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={() => sendToAI(section.id)}
                className="whitespace-nowrap"
                size="sm"
                disabled={loading[section.id]}
              >
                {loading[section.id] ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Send to AI"
                )}
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {feedback[section.id] || "No feedback yet."}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Responsive grid for complete text & general feedback */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
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
            {generalFeedback && (
              <div className="text-sm whitespace-pre-wrap max-h-32 overflow-auto">
                {generalFeedback}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
