// src/components/FeedbackCard.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface FeedbackCardProps {
  title?: string;
  feedback?: string;
}

export default function FeedbackCard({
  title = "AI Feedback",
  feedback,
}: FeedbackCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (feedback) {
      try {
        await navigator.clipboard.writeText(feedback);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy feedback:", err);
      }
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {feedback && (
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {feedback ? (
          <div className="text-sm whitespace-pre-wrap max-h-32 overflow-auto">
            {feedback}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No feedback yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
