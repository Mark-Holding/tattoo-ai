"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type VisualElementsByTheme = {
  [key: string]: string[];
};

const visualElementsByTheme: VisualElementsByTheme = {
  Nature: ["Animals", "Plants", "Landscapes", "Weather", "Elements"],
  Time: ["Clocks", "Hourglasses", "Seasons", "Calendars", "Ancient Artifacts"],
  Cosmos: ["Planets", "Stars", "Galaxies", "Constellations", "Nebulae"],
  Technology: ["Circuits", "Robots", "Gadgets", "Cybernetic", "Digital"],
  Emotions: ["Hearts", "Faces", "Hands", "Abstract Shapes", "Waves"],
  Mythology: ["Deities", "Creatures", "Symbols", "Heroes", "Stories"],
  Spirituality: ["Mandalas", "Religious Symbols", "Chakras", "Auras", "Meditation"],
  Adventure: ["Maps", "Compass", "Mountains", "Ships", "Paths"],
  Identity: ["Cultural Symbols", "Family Crests", "Portraits", "Handwriting", "Fingerprints"],
};

interface VisualElementsStepProps {
  themes: string[];
  selections: string[];
  onSelect: (value: string[]) => void;
}

export default function VisualElementsStep({ themes, selections, onSelect }: VisualElementsStepProps) {
  // Get relevant visual elements based on selected themes
  const relevantElements = themes.reduce<string[]>((acc, theme) => {
    const elements = visualElementsByTheme[theme] || [];
    return [...acc, ...elements];
  }, []);

  // Remove duplicates
  const uniqueElements = [...new Set(relevantElements)];

  const handleSelect = (element: string) => {
    if (selections.includes(element)) {
      onSelect(selections.filter((e: string) => e !== element));
    } else {
      onSelect([...selections, element]);
    }
  };

  const handleRemove = (element: string) => {
    onSelect(selections.filter((e: string) => e !== element));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose Visual Elements</h2>
        <p className="text-muted-foreground">Select elements that will be featured in your tattoo design.</p>
      </div>

      {themes.length === 0 ? (
        <div className="rounded-md bg-muted p-4 text-center">
          <p>Please select at least one theme in the previous step to see relevant visual elements.</p>
        </div>
      ) : (
        <>
          {selections.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selections.map((element) => (
                <Badge key={element} variant="secondary" className="gap-1 px-3 py-1.5">
                  {element}
                  <button onClick={() => handleRemove(element)} className="ml-1 rounded-full hover:bg-muted">
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {element}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {uniqueElements.map((element) => (
              <motion.div key={element} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selections.includes(element) ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => handleSelect(element)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-center font-medium">{element}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
