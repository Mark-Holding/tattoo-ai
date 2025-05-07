"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clipboard, Check } from "lucide-react"

interface PromptPreviewStepProps {
  prompt: string;
  onCopy: () => void;
  copied: boolean;
}

export default function PromptPreviewStep({ prompt, onCopy, copied }: PromptPreviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Tattoo Prompt</h2>
        <p className="text-muted-foreground">
          Here&apos;s your completed tattoo concept prompt. You can copy this and use it with an AI image generator or share
          it with your tattoo artist.
        </p>
      </div>

      <Card className="border-2">
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap text-sm">{prompt}</p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onCopy} className="gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" /> Copied to Clipboard
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" /> Copy Prompt
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h3 className="mb-2 font-medium">What&apos;s Next?</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Use this prompt with AI image generators like Midjourney or DALL-E to visualize your concept</li>
          <li>Share this prompt with your tattoo artist to communicate your vision</li>
          <li>Save this prompt for future reference or modifications</li>
        </ul>
      </div>
    </div>
  )
}
