"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FinalTouches {
  quote: string;
  date: string;
  coordinates: string;
}

interface FinalTouchesStepProps {
  finalTouches: FinalTouches;
  onUpdate: (value: FinalTouches) => void;
}

export default function FinalTouchesStep({ finalTouches, onUpdate }: FinalTouchesStepProps) {
  const handleChange = (field: keyof FinalTouches, value: string) => {
    onUpdate({
      ...finalTouches,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Final Touches</h2>
        <p className="text-muted-foreground">Add personal details to make your tattoo unique (all fields optional).</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quote">Quote or Text</Label>
          <Input
            id="quote"
            placeholder="Enter a meaningful quote or text"
            value={finalTouches.quote}
            onChange={(e) => handleChange("quote", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">A short phrase, quote, or word that has significance to you.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Significant Date</Label>
          <Input
            id="date"
            placeholder="MM.DD.YYYY or other format"
            value={finalTouches.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            A date that holds special meaning (birth, anniversary, milestone).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordinates">Coordinates</Label>
          <Input
            id="coordinates"
            placeholder="e.g. 40.7128° N, 74.0060° W"
            value={finalTouches.coordinates}
            onChange={(e) => handleChange("coordinates", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Geographic coordinates of a meaningful location.</p>
        </div>
      </div>
    </div>
  )
}
