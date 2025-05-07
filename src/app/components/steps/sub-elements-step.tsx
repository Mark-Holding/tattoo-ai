"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type SubElementsByVisualElement = {
  [key: string]: string[];
};

const subElementsByVisualElement: SubElementsByVisualElement = {
  Animals: ["Wolf", "Lion", "Eagle", "Snake", "Butterfly", "Owl", "Fox", "Deer", "Dragon", "Koi Fish"],
  Plants: ["Rose", "Lotus", "Tree", "Fern", "Succulent", "Cherry Blossom", "Pine", "Ivy", "Mushroom"],
  Landscapes: ["Mountain", "Ocean", "Forest", "Desert", "Waterfall", "Valley", "Cliff", "Island"],
  Weather: ["Lightning", "Rain", "Cloud", "Wind", "Snow", "Rainbow", "Storm", "Sunshine"],
  Elements: ["Fire", "Water", "Earth", "Air", "Metal", "Wood", "Void"],
  Clocks: ["Pocket Watch", "Grandfather Clock", "Sundial", "Digital Clock", "Broken Clock", "Melting Clock"],
  Planets: ["Earth", "Mars", "Jupiter", "Saturn", "Moon", "Sun", "Mercury", "Venus"],
  Stars: ["North Star", "Shooting Star", "Supernova", "Binary Stars", "Star Cluster"],
  Deities: ["Zeus", "Odin", "Athena", "Anubis", "Ganesha", "Buddha", "Kali", "Thor"],
  Creatures: ["Phoenix", "Unicorn", "Griffin", "Mermaid", "Centaur", "Werewolf", "Vampire", "Kraken"],
  Hourglasses: [],
  Seasons: ["Summer", "Winter", "Spring", "Fall", "Rainy Season", "Autumn"],
  Calendars: [],
  AncientArtifacts: [],
  Galaxies: [],
  Constellations: [],
  Nebulae: [],
  Circuits: [],
  Robots: [],
  Gadgets: [],
  Cybernetic: [],
  Digital: [],
  Hearts: [],
  Faces: [],
  Hands: [],
  "Abstract Shapes": [],
  Waves: [],
  Symbols: [],
  Heroes: [],
  Stories: [],
  Mandalas: [],
  "Religious Symbols": [],
  Chakras: [],
  Auras: [],
  Meditation: [],
  Maps: [],
  Compass: [],
  Mountains: [],
  Ships: [],
  Paths: [],
  "Cultural Symbols": [],
  "Family Crests": [],
  Portraits: [],
  Handwriting: [],
  Fingerprints: [],
};

interface SubElementsStepProps {
  visualElements: string[];
  selections: string[];
  onSelect: (value: string[]) => void;
}

export default function SubElementsStep({ visualElements, selections, onSelect }: SubElementsStepProps) {
  // Get relevant sub-elements based on selected visual elements
  const relevantSubElements = visualElements.reduce<string[]>((acc, element) => {
    const subElements = subElementsByVisualElement[element] || [];
    return [...acc, ...subElements];
  }, []);

  // Remove duplicates
  const uniqueSubElements = [...new Set(relevantSubElements)];

  const handleSelect = (subElement: string) => {
    if (selections.includes(subElement)) {
      onSelect(selections.filter((e: string) => e !== subElement));
    } else {
      onSelect([...selections, subElement]);
    }
  };

  const handleRemove = (subElement: string) => {
    onSelect(selections.filter((e: string) => e !== subElement));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose Specific Elements</h2>
        <p className="text-muted-foreground">Select specific elements that will be featured in your tattoo design.</p>
      </div>

      {visualElements.length === 0 ? (
        <div className="rounded-md bg-muted p-4 text-center">
          <p>Please select at least one visual element in the previous step to see specific options.</p>
        </div>
      ) : (
        <>
          {selections.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selections.map((subElement) => (
                <Badge key={subElement} variant="secondary" className="gap-1 px-3 py-1.5">
                  {subElement}
                  <button onClick={() => handleRemove(subElement)} className="ml-1 rounded-full hover:bg-muted">
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {subElement}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {uniqueSubElements.map((subElement) => (
              <motion.div key={subElement} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selections.includes(subElement) ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => handleSelect(subElement)}
                >
                  <CardContent className="p-3">
                    <h3 className="text-center text-sm font-medium">{subElement}</h3>
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
