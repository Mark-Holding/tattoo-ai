"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clipboard, ArrowLeft, ArrowRight, Check } from "lucide-react"
import TattooStyleStep from "@/app/components/steps/tattoo-style-step"
import ThemeStep from "@/app/components/steps/theme-step"
import VisualElementsStep from "@/app/components/steps/visual-elements-step"
import SubElementsStep from "@/app/components/steps/sub-elements-step"
import CompositionStep from "@/app/components/steps/composition-step"
import SymbolsStep from "@/app/components/steps/symbols-step"
import FinalTouchesStep from "@/app/components/steps/final-touches-step"
import FreestyleStep from "@/app/components/steps/freestyle-step"
import PromptPreviewStep from "@/app/components/steps/prompt-preview-step"

const steps = [
  "Tattoo Style",
  "Core Themes",
  "Visual Elements",
  "Sub-Elements",
  "Composition & Placement",
  "Sacred Geometry & Symbols",
  "Final Touches",
  "Freestyle",
  "Prompt Preview",
]

type FinalTouches = {
  quote: string;
  date: string;
  coordinates: string;
};

type Selections = {
  style: string;
  themes: string[];
  visualElements: string[];
  subElements: string[];
  composition: string;
  placement: string;
  symbols: string[];
  finalTouches: FinalTouches;
  freestyle: string;
  excludeElements: string;
};

export default function TattooPromptBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Selections>({
    style: "",
    themes: [],
    visualElements: [],
    subElements: [],
    composition: "",
    placement: "",
    symbols: [],
    finalTouches: {
      quote: "",
      date: "",
      coordinates: "",
    },
    freestyle: "",
    excludeElements: "",
  })
  const [copied, setCopied] = useState(false)

  const updateSelections = <K extends keyof Selections>(field: K, value: Selections[K]) => {
    setSelections((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const generatePrompt = () => {
    let prompt = ""

    if (selections.style) {
      prompt += `A ${selections.style} tattoo`
    } else {
      prompt += "A tattoo"
    }

    if (selections.visualElements.length > 0 || selections.subElements.length > 0) {
      prompt += " of "

      if (selections.subElements.length > 0) {
        prompt += selections.subElements.join(", ")
      } else if (selections.visualElements.length > 0) {
        prompt += selections.visualElements.join(", ")
      }
    }

    if (selections.themes.length > 0) {
      prompt += `, representing ${selections.themes.join(", ")}`
    }

    if (selections.composition) {
      prompt += `, with a ${selections.composition} composition`
    }

    if (selections.symbols.length > 0) {
      prompt += `, incorporating ${selections.symbols.join(", ")}`
    }

    if (selections.placement) {
      prompt += `, designed for the ${selections.placement}`
    }

    if (selections.finalTouches.quote) {
      prompt += `, with the quote "${selections.finalTouches.quote}"`
    }

    if (selections.finalTouches.date) {
      prompt += `, featuring the date ${selections.finalTouches.date}`
    }

    if (selections.finalTouches.coordinates) {
      prompt += `, including coordinates ${selections.finalTouches.coordinates}`
    }

    if (selections.freestyle) {
      prompt += `. ${selections.freestyle}`
    } else {
      prompt += "."
    }

    if (selections.excludeElements) {
      prompt += ` Please avoid including: ${selections.excludeElements}.`
    }

    return prompt
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TattooStyleStep selection={selections.style} onSelect={(value: string) => updateSelections("style", value)} />
      case 1:
        return <ThemeStep selections={selections.themes} onSelect={(value: string[]) => updateSelections("themes", value)} />
      case 2:
        return (
          <VisualElementsStep
            themes={selections.themes}
            selections={selections.visualElements}
            onSelect={(value: string[]) => updateSelections("visualElements", value)}
          />
        )
      case 3:
        return (
          <SubElementsStep
            visualElements={selections.visualElements}
            selections={selections.subElements}
            onSelect={(value: string[]) => updateSelections("subElements", value)}
          />
        )
      case 4:
        return (
          <CompositionStep
            composition={selections.composition}
            placement={selections.placement}
            onSelectComposition={(value: string) => updateSelections("composition", value)}
            onSelectPlacement={(value: string) => updateSelections("placement", value)}
          />
        )
      case 5:
        return <SymbolsStep selections={selections.symbols} onSelect={(value: string[]) => updateSelections("symbols", value)} />
      case 6:
        return (
          <FinalTouchesStep
            finalTouches={selections.finalTouches}
            onUpdate={(value: FinalTouches) => updateSelections("finalTouches", value)}
          />
        )
      case 7:
        return (
          <FreestyleStep
            value={selections.freestyle}
            onChange={(value: string) => updateSelections("freestyle", value)}
            excludeValue={selections.excludeElements}
            onExcludeChange={(value: string) => updateSelections("excludeElements", value)}
          />
        )
      case 8:
        return <PromptPreviewStep prompt={generatePrompt()} onCopy={copyToClipboard} copied={copied} />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="mb-8 hidden md:block">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="mt-2 text-center text-xs">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute h-1 w-full bg-muted"></div>
          <div
            className="absolute h-1 bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium">{steps[currentStep]}</span>
        </div>
        <div className="relative mt-2">
          <div className="absolute h-1 w-full bg-muted"></div>
          <div
            className="absolute h-1 bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Wizard Content */}
      <Card className="overflow-hidden border-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between border-t bg-muted/50 p-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="mr-2 h-4 w-4" /> Copy Prompt
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
