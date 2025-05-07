"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const symbols = [
  {
    id: "metatron",
    name: "Metatron's Cube",
    description: "Sacred geometry representing the universe",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "flower-of-life",
    name: "Flower of Life",
    description: "Pattern of overlapping circles representing creation",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "tree-of-life",
    name: "Tree of Life",
    description: "Mystical symbol connecting all forms of creation",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "sri-yantra",
    name: "Sri Yantra",
    description: "Ancient Hindu symbol representing cosmic energy",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "constellation",
    name: "Constellation",
    description: "Star pattern with personal significance",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "infinity",
    name: "Infinity Symbol",
    description: "Representing limitless possibilities",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "triquetra",
    name: "Triquetra",
    description: "Celtic symbol of trinity",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "ouroboros",
    name: "Ouroboros",
    description: "Snake eating its own tail, representing cycles",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "merkaba",
    name: "Merkaba",
    description: "3D star tetrahedron representing light, spirit, and body",
    image: "/placeholder.svg?height=100&width=100",
  },
]

interface SymbolsStepProps {
  selections: string[];
  onSelect: (value: string[]) => void;
}

export default function SymbolsStep({ selections, onSelect }: SymbolsStepProps) {
  const handleSelect = (symbol: string) => {
    if (selections.includes(symbol)) {
      onSelect(selections.filter((s: string) => s !== symbol));
    } else {
      onSelect([...selections, symbol]);
    }
  };

  const handleRemove = (symbol: string) => {
    onSelect(selections.filter((s: string) => s !== symbol));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Sacred Geometry & Symbols</h2>
        <p className="text-muted-foreground">Select symbols to incorporate into your design (optional).</p>
      </div>

      {selections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selections.map((symbol) => (
            <Badge key={symbol} variant="secondary" className="gap-1 px-3 py-1.5">
              {symbol}
              <button onClick={() => handleRemove(symbol)} className="ml-1 rounded-full hover:bg-muted">
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {symbol}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {symbols.map((symbol) => (
          <motion.div key={symbol.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selections.includes(symbol.name) ? "border-2 border-primary" : ""
              }`}
              onClick={() => handleSelect(symbol.name)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 overflow-hidden rounded-md">
                    <Image
                      src={symbol.image || "/placeholder.svg"}
                      alt={symbol.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{symbol.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{symbol.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
