"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const themes = [
  {
    id: "nature",
    name: "Nature",
    description: "Elements from the natural world",
    icon: "🌿",
  },
  {
    id: "time",
    name: "Time",
    description: "Concepts related to past, present, and future",
    icon: "⏳",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    description: "Celestial bodies and space elements",
    icon: "✨",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Modern and futuristic elements",
    icon: "⚙️",
  },
  {
    id: "emotions",
    name: "Emotions",
    description: "Representations of human feelings",
    icon: "❤️",
  },
  {
    id: "mythology",
    name: "Mythology",
    description: "Legendary figures and stories",
    icon: "🏛️",
  },
  {
    id: "spirituality",
    name: "Spirituality",
    description: "Symbols of faith and inner peace",
    icon: "☯️",
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Journey and exploration themes",
    icon: "🧭",
  },
  {
    id: "identity",
    name: "Identity",
    description: "Personal heritage and self-expression",
    icon: "🔍",
  },
]

interface ThemeStepProps {
  selections: string[];
  onSelect: (value: string[]) => void;
}

export default function ThemeStep({ selections, onSelect }: ThemeStepProps) {
  const handleSelect = (theme: string) => {
    if (selections.includes(theme)) {
      onSelect(selections.filter((t: string) => t !== theme));
    } else if (selections.length < 3) {
      onSelect([...selections, theme]);
    }
  };

  const handleRemove = (theme: string) => {
    onSelect(selections.filter((t: string) => t !== theme));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Select Core Themes</h2>
        <p className="text-muted-foreground">Choose up to 3 themes that represent the meaning behind your tattoo.</p>
      </div>

      {selections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selections.map((theme) => (
            <Badge key={theme} variant="secondary" className="gap-1 px-3 py-1.5">
              {theme}
              <button onClick={() => handleRemove(theme)} className="ml-1 rounded-full hover:bg-muted">
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {theme}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {themes.map((theme) => (
          <motion.div key={theme.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selections.includes(theme.name) ? "border-2 border-primary" : ""
              } ${selections.length >= 3 && !selections.includes(theme.name) ? "opacity-50" : ""}`}
              onClick={() => handleSelect(theme.name)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
                  {theme.icon}
                </div>
                <div>
                  <h3 className="font-medium">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
