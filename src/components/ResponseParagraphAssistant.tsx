"use client";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
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

// Hook personalizado actualizado para admitir actualizaciones funcionales
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          setStoredValue(JSON.parse(item));
        } catch {
          setStoredValue(item as unknown as T);
        }
      }
    }
  }, [key]);

  const setValue = (value: T | ((prevValue: T) => T)) => {
    setStoredValue((prevValue) => {
      const newValue =
        typeof value === "function" ? (value as (prevValue: T) => T)(prevValue) : value;
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      return newValue;
    });
  };

  return [storedValue, setValue] as const;
}

export default function ResponseParagraphAssistant() {
  const [inputs, setInputs] = useLocalStorage<Record<string, string>>(
    "responseParagraphInputs",
    {}
  );
  const [feedback, setFeedback] = useLocalStorage<Record<string, string>>(
    "responseParagraphFeedback",
    {}
  );
  const [completeText, setCompleteText] = useState("");
  const [generalFeedback, setGeneralFeedback] = useLocalStorage<string>(
    "generalFeedback",
    ""
  );
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [generalLoading, setGeneralLoading] = useState(false);

  const updateCompleteText = (currentInputs: Record<string, string>) => {
    const text = sections
      .map((section) => currentInputs[section.id])
      .filter(Boolean)
      .join(" ");
    setCompleteText(text);
  };

  const handleInputChange = (id: string, value: string) => {
    const updatedInputs = { ...inputs, [id]: value };
    setInputs(updatedInputs);
    updateCompleteText(updatedInputs);
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
      // Actualización funcional para conservar el feedback previo
      setFeedback((prev) => ({ ...prev, [id]: data.feedback }));
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getGeneralFeedback = async () => {
    setGeneralLoading(true);
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
    } finally {
      setGeneralLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid para secciones individuales */}
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
                <CardTitle>AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedback[section.id] ? (
                  <div className="prose text-sm whitespace-pre-wrap max-h-32 overflow-auto">
                    <ReactMarkdown>{feedback[section.id]}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    No feedback yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Grid para el texto completo y el feedback general */}
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
            <Button
              onClick={getGeneralFeedback}
              className="w-full mb-4"
              disabled={generalLoading}
            >
              {generalLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Get General AI Feedback"
              )}
            </Button>
            {generalFeedback && (
              <div className="prose text-sm max-h-32 overflow-auto">
                <ReactMarkdown>{generalFeedback}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
