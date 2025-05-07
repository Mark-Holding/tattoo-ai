"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FreestyleStepProps {
  value: string;
  onChange: (value: string) => void;
  excludeValue: string;
  onExcludeChange: (value: string) => void;
}

export default function FreestyleStep({ value, onChange, excludeValue, onExcludeChange }: FreestyleStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Anything Else?</h2>
        <p className="text-muted-foreground">Add any additional details or instructions for your tattoo design.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="freestyle">Additional Details</Label>
        <Textarea
          id="freestyle"
          placeholder="Describe any other elements, styles, or specific instructions you&apos;d like to include..."
          className="min-h-[150px] resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          This is your chance to add any specific details that weren&apos;t covered in the previous steps.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exclude" className="font-medium">
          What Not to Include
        </Label>
        <Textarea
          id="exclude"
          placeholder="Specify elements, styles, or features you want to avoid in your tattoo design..."
          className="min-h-[100px] resize-none"
          value={excludeValue}
          onChange={(e) => onExcludeChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Use this space to specify anything you definitely don&apos;t want in your tattoo design (e.g., specific colors,
          certain symbols, or particular styles to avoid).
        </p>
      </div>
    </div>
  )
}
