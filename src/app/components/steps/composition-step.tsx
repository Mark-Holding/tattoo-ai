"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const compositions = [
  {
    id: "vertical",
    name: "Vertical",
    description: "Elements arranged from top to bottom",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "horizontal",
    name: "Horizontal",
    description: "Elements arranged from left to right",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "circular",
    name: "Circular",
    description: "Elements arranged in a circle",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "triangular",
    name: "Triangular",
    description: "Elements arranged in a triangle",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "flowing",
    name: "Flowing",
    description: "Elements that follow a curved path",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "symmetrical",
    name: "Symmetrical",
    description: "Balanced elements on both sides",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const placements = [
  {
    id: "forearm",
    name: "Forearm",
    description: "Inner or outer forearm",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "upper-arm",
    name: "Upper Arm",
    description: "Bicep or shoulder area",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "chest",
    name: "Chest",
    description: "Center or side of chest",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "back",
    name: "Back",
    description: "Upper, middle, or lower back",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "leg",
    name: "Leg",
    description: "Thigh, calf, or ankle",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "spine",
    name: "Spine",
    description: "Along the spine",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "wrist",
    name: "Wrist",
    description: "Around the wrist area",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "ankle",
    name: "Ankle",
    description: "Around the ankle area",
    image: "/placeholder.svg?height=100&width=100",
  },
]

interface CompositionStepProps {
  composition: string;
  placement: string;
  onSelectComposition: (value: string) => void;
  onSelectPlacement: (value: string) => void;
}

export default function CompositionStep({ composition, placement, onSelectComposition, onSelectPlacement }: CompositionStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Composition & Body Placement</h2>
        <p className="text-muted-foreground">
          Choose how your tattoo elements will be arranged and where it will be placed on your body.
        </p>
      </div>

      <Tabs defaultValue="composition" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="placement">Body Placement</TabsTrigger>
        </TabsList>
        <TabsContent value="composition" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {compositions.map((comp) => (
              <motion.div key={comp.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    composition === comp.name ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => onSelectComposition(comp.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 overflow-hidden rounded-md">
                        <Image
                          src={comp.image || "/placeholder.svg"}
                          alt={comp.name}
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{comp.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{comp.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="placement" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {placements.map((place) => (
              <motion.div key={place.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    placement === place.name ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => onSelectPlacement(place.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 overflow-hidden rounded-md">
                        <Image
                          src={place.image || "/placeholder.svg"}
                          alt={place.name}
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{place.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{place.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
