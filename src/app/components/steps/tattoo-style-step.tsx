"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const styles = [
  {
    id: "fine-line",
    name: "Fine Line",
    description: "Delicate, precise lines with minimal shading",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Bold lines, vibrant colors, and classic motifs",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "dotwork",
    name: "Dotwork",
    description: "Intricate patterns created using dots instead of lines",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "geometric",
    name: "Geometric",
    description: "Precise shapes and patterns with mathematical precision",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Fluid, colorful designs mimicking watercolor paintings",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "blackwork",
    name: "Blackwork",
    description: "Bold black ink with intricate patterns and negative space",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "neo-traditional",
    name: "Neo-Traditional",
    description: "Modern take on traditional style with more detail and color",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "realism",
    name: "Realism",
    description: "Highly detailed designs that look like photographs",
    image: "/placeholder.svg?height=120&width=120",
  },
]

interface TattooStyleStepProps {
  selection: string;
  onSelect: (value: string) => void;
}

export default function TattooStyleStep({ selection, onSelect }: TattooStyleStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Tattoo Style</h2>
        <p className="text-muted-foreground">
          Select a style that resonates with your vision. This will set the foundation for your design.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {styles.map((style) => (
          <motion.div key={style.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selection === style.name ? "border-2 border-primary" : ""
              }`}
              onClick={() => onSelect(style.name)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 overflow-hidden rounded-md">
                    <Image
                      src={style.image || "/placeholder.svg"}
                      alt={style.name}
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{style.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{style.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
