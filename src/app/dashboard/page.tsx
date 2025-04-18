"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { StyleSelector } from "@/app/components/StyleSelector"
import { PlacementSelector } from "@/app/components/PlacementSelector"
import toast, { Toaster } from 'react-hot-toast'
import {
  Flower,
  Home,
  FileText,
  PlusCircle,
  Settings,
  HelpCircle,
  User,
  Download,
  Upload,
  Pen,
  Eraser,
  Circle,
  Edit,
  Trash2,
  Heart,
  BookOpen,
  Square,
  Paintbrush,
  Maximize2,
  HelpCircle as InfoIcon,
  History,
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// Sample generated designs
const sampleDesigns = [
  {
    id: 1,
    image: "/images/lion-tattoo.png",
  },
  {
    id: 2,
    image: "/images/lion-tattoo.png",
  },
  {
    id: 3,
    image: "/images/woman-tattoo.png",
  },
  {
    id: 4,
    image: "/images/woman-tattoo.png",
  },
  {
    id: 5,
    image: "/images/skull-tattoo.png",
  },
  {
    id: 6,
    image: "/images/skull-tattoo.png",
  },
]

// Sample projects
const sampleProjects = [
  {
    id: 1,
    name: "Floral Sleeve Design",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Geometric Back Piece",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Minimalist Wrist Tattoo",
    date: "2 weeks ago",
  },
]

// Define the TattooStyle interface
interface TattooStyle {
  id: number;
  name: string;
  image: string;
  description: string;
}

// Define the design request interface
interface DesignRequest {
  style: string;
  bodyPlacement: string;
  detailLevel: string;
  modifier: string;
  negativePrompt: string;
  description: string;
  referenceImage: string | null;
  freestyleDrawing: string | null;
  timestamp: number;
}

// Add validation interface
interface ValidationError {
  field: string;
  message: string;
}

export default function DashboardPage() {
  const [description, setDescription] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesigns, setGeneratedDesigns] = useState(sampleDesigns)
  const [latestGeneration, setLatestGeneration] = useState<{
    id: string;
    image: string;
    status: 'pending' | 'processing' | 'generating' | 'completed' | 'failed';
  } | null>(null)
  const [activeDrawingTool, setActiveDrawingTool] = useState("pen")
  const [activeColor, setActiveColor] = useState("#000000")
  const [negativeInput, setNegativeInput] = useState("")
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false)
  
  // Design options state
  const [selectedStyle, setSelectedStyle] = useState("Black and Grey")
  const [selectedPlacement, setSelectedPlacement] = useState("Square")
  const [detailLevel, setDetailLevel] = useState("medium")
  const [selectedModifier, setSelectedModifier] = useState("symmetrical")
  const [isStyleSelectorOpen, setIsStyleSelectorOpen] = useState(false)
  const [isPlacementSelectorOpen, setIsPlacementSelectorOpen] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)

  const [showHistory, setShowHistory] = useState(false)
  const [storedRequests, setStoredRequests] = useState<DesignRequest[]>([])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
        ctx.lineWidth = 2
      }
    }
  }, [])

  // Load stored requests on mount
  useEffect(() => {
    const stored = localStorage.getItem('designRequests')
    if (stored) {
      setStoredRequests(JSON.parse(stored))
    }
  }, [])

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastX(x)
    setLastY(y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.strokeStyle = activeDrawingTool === "eraser" ? "#ffffff" : activeColor
    ctx.lineWidth = activeDrawingTool === "eraser" ? 10 : 2
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastX(x)
    setLastY(y)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Get canvas drawing as base64 image
  const getCanvasImage = (): string | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    try {
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error converting canvas to image:', error)
      return null
    }
  }

  // Validate inputs
  const validateInputs = (): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!description.trim()) {
      errors.push({ field: 'description', message: 'Please enter a design description' })
    }
    if (!selectedStyle) {
      errors.push({ field: 'style', message: 'Please select a style' })
    }
    if (!selectedPlacement) {
      errors.push({ field: 'placement', message: 'Please select a body placement' })
    }
    if (!detailLevel) {
      errors.push({ field: 'detailLevel', message: 'Please select a detail level' })
    }
    if (!selectedModifier) {
      errors.push({ field: 'modifier', message: 'Please select a modifier' })
    }

    return errors
  }

  // Clear all stored requests
  const clearStoredRequests = () => {
    localStorage.removeItem('designRequests')
    setStoredRequests([])
    toast.success('Request history cleared')
  }

  // Delete single request
  const deleteStoredRequest = (timestamp: number) => {
    const updatedRequests = storedRequests.filter(req => req.timestamp !== timestamp)
    localStorage.setItem('designRequests', JSON.stringify(updatedRequests))
    setStoredRequests(updatedRequests)
    toast.success('Request deleted')
  }

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateInputs()
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error.message))
      return
    }

    setIsGenerating(true)

    try {
      // First, create the design request in Supabase
      const { data: designRequest, error: insertError } = await supabase
        .from('design_requests')
        .insert({
          style: selectedStyle,
          body_placement: selectedPlacement,
          detail_level: detailLevel,
          modifier: selectedModifier,
          negative_prompt: negativeInput,
          description: description,
          reference_image_url: uploadedImage,
          freestyle_drawing_url: getCanvasImage(),
          status: 'pending'
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Start the generation process
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: designRequest.id,
          style: selectedStyle,
          bodyPlacement: selectedPlacement,
          detailLevel: detailLevel,
          modifier: selectedModifier,
          negativePrompt: negativeInput,
          description: description,
          referenceImage: uploadedImage,
          freestyleDrawing: getCanvasImage()
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      // Start polling for the result
      startPolling(designRequest.id)
      toast.success('Design generation started!')

    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to generate design')
    } finally {
      setIsGenerating(false)
    }
  }

  // Add polling function to check generation status
  const startPolling = async (requestId: string) => {
    const pollInterval = setInterval(async () => {
      const { data: request } = await supabase
        .from('design_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (request) {
        // Update latest generation status
        setLatestGeneration(prev => ({
          id: requestId,
          image: request.generated_image_url || '',
          status: request.status
        }))

        if (request.status === 'completed') {
          clearInterval(pollInterval)
          // Add to saved designs only if explicitly saved
          toast.success('Design generated successfully!')
        } else if (request.status === 'failed') {
          clearInterval(pollInterval)
          toast.error('Generation failed')
        }
      }
    }, 5000) // Poll every 5 seconds
  }

  // Function to get status message
  const getStatusMessage = () => {
    if (!latestGeneration) return 'No generation in progress'
    switch (latestGeneration.status) {
      case 'pending':
        return 'Preparing generation...'
      case 'processing':
        return 'Processing your request...'
      case 'generating':
        return 'Generating your design...'
      case 'completed':
        return 'Generation complete!'
      case 'failed':
        return 'Generation failed'
      default:
        return 'Unknown status'
    }
  }

  // Handle design actions
  const handleSaveDesign = (id: number) => {
    // Implementation for saving a design
    console.log(`Saving design ${id}`)
  }

  const handleEditDesign = (id: number) => {
    // Implementation for editing a design
    console.log(`Editing design ${id}`)
  }

  const handleDeleteDesign = (id: number) => {
    // Implementation for deleting a design
    setGeneratedDesigns(generatedDesigns.filter((design) => design.id !== id))
  }

  const handleDownloadDesign = (id: number) => {
    // Implementation for downloading a design
    console.log(`Downloading design ${id}`)
  }
  
  // Handle style selection from popup
  const handleSelectStyle = (style: TattooStyle) => {
    setSelectedStyle(style.name)
    setIsStyleSelectorOpen(false)
  }
  
  // Handle placement selection
  const handlePlacementSelect = (placement: string) => {
    setSelectedPlacement(placement)
    console.log(`Selected placement: ${placement}`)
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f5]">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Request History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-bold">Request History</h2>
              <div className="flex gap-2">
                <Button
                  onClick={clearStoredRequests}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Clear All
                </Button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {storedRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No stored requests</p>
              ) : (
                storedRequests.map((request, index) => (
                  <div key={request.timestamp} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Request #{storedRequests.length - index}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteStoredRequest(request.timestamp)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Style:</strong> {request.style}</p>
                        <p><strong>Placement:</strong> {request.bodyPlacement}</p>
                        <p><strong>Detail Level:</strong> {request.detailLevel}</p>
                        <p><strong>Modifier:</strong> {request.modifier}</p>
                      </div>
                      <div>
                        <p><strong>Description:</strong> {request.description}</p>
                        {request.negativePrompt && (
                          <p><strong>Negative Prompt:</strong> {request.negativePrompt}</p>
                        )}
                        <p><strong>Date:</strong> {new Date(request.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Style Selector Modal */}
      {isStyleSelectorOpen && (
        <StyleSelector
          isOpen={isStyleSelectorOpen}
          onClose={() => setIsStyleSelectorOpen(false)}
          onSelectStyle={handleSelectStyle}
        />
      )}
      
      {/* Placement Selector Modal */}
      <PlacementSelector
        isOpen={isPlacementSelectorOpen}
        onClose={() => setIsPlacementSelectorOpen(false)}
        onSelectPlacement={handlePlacementSelect}
      />
      
      {/* New Drawing Modal */}
      {isDrawingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[800px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-bold">Freestyle Drawing</h2>
              <button
                onClick={() => setIsDrawingModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="border border-gray-400 rounded-lg flex flex-col h-[400px] bg-white overflow-hidden">
              <div className="border-b border-gray-400 p-2 flex items-center gap-2">
                <button
                  className={`p-1 rounded ${activeDrawingTool === "pen" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveDrawingTool("pen")}
                >
                  <Pen className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  className={`p-1 rounded ${activeDrawingTool === "eraser" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveDrawingTool("eraser")}
                >
                  <Eraser className="h-4 w-4 text-gray-700" />
                </button>
                <div className="relative">
                  <button
                    className="p-1 rounded hover:bg-gray-100 flex items-center justify-center"
                    style={{ backgroundColor: activeColor }}
                  >
                    <Circle className="h-4 w-4" style={{ color: activeColor === "#000000" ? "white" : "black" }} />
                  </button>
                  <input
                    type="color"
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-6 h-6 cursor-pointer"
                  />
                </div>
                <button className="p-1 rounded hover:bg-gray-100 ml-auto" onClick={clearCanvas}>
                  <Trash2 className="h-4 w-4 text-gray-700" />
                </button>
              </div>
              <div className="flex-1 relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-44 bg-[#1e1e1e] text-white fixed h-full flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Flower className="h-6 w-6 text-white" />
            <span className="text-xl font-serif font-bold">Tattoo</span>
          </div>

          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/10 text-white">
              <Home className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link
              href="/new-project"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="text-sm">Create New</span>
            </Link>
            <div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white">
                <FileText className="h-4 w-4" />
                <span className="text-sm">My Projects</span>
              </div>
              <div className="ml-6 mt-1 space-y-1">
                {sampleProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                  >
                    {project.name}
                    <div className="text-xs text-gray-500">{project.date}</div>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/design-guide"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Design Guide</span>
            </Link>
          </nav>
        </div>

        {/* Bottom navigation */}
        <div className="p-4 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Help</span>
          </Link>
          <button
            onClick={() => setShowHistory(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <History className="h-4 w-4" />
            <span className="text-sm">History</span>
          </button>
        </div>

        {/* User profile at bottom of sidebar */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-300" />
            </div>
            <span className="text-xs font-medium">User</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-44 flex-1">
        {/* Project header */}
        <header className="border-b border-gray-400 bg-[#f8f7f5] p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-serif font-bold">Untitled Project</h1>
          </div>
        </header>

        {/* New Layout Structure */}
        <div className="container mx-auto p-6">
          <div className="flex gap-6">
            {/* Left Column - Client Inputs */}
            <div className="w-1/3 space-y-3">
              {/* Description Input */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <h2 className="text-xl font-serif font-bold mb-4">Enter your design ideas:</h2>
                <Textarea
                  placeholder="Enter a description of the tattoo..."
                  className="w-full border-gray-400 focus:border-gray-500 focus:ring-0 bg-white"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Style Selection */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-2">Style</div>
                <div 
                  className="border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => setIsStyleSelectorOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-gray-700" />
                    <span className="text-sm">{selectedStyle}</span>
                  </div>
                  <Maximize2 className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Body Part / Placement */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <div className="text-sm text-purple-600 mb-2">Body Part / Placement</div>
                <div 
                  className="border border-purple-300 rounded-md p-2 flex items-center justify-between cursor-pointer hover:bg-purple-50"
                  onClick={() => setIsPlacementSelectorOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 border border-gray-400 flex items-center justify-center">
                      <Square className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="text-sm">{selectedPlacement}</span>
                  </div>
                  <Maximize2 className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Detail & Complexity */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <div className="flex items-center gap-1 text-gray-700 mb-2">
                  <span className="text-sm font-medium">DETAIL & COMPLEXITY</span>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    className={`text-xs py-2 border rounded-md flex items-center justify-center gap-1 ${
                      detailLevel === "simple" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => setDetailLevel("simple")}
                  >
                    <Circle className="h-3 w-3" />
                    SIMPLE
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md flex items-center justify-center gap-1 ${
                      detailLevel === "medium" ? "bg-purple-100 border-purple-400 text-purple-600" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => setDetailLevel("medium")}
                  >
                    <Circle className="h-3 w-3 fill-current" />
                    MEDIUM
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md flex items-center justify-center gap-1 ${
                      detailLevel === "complex" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => setDetailLevel("complex")}
                  >
                    <Circle className="h-3 w-3" />
                    COMPLEX
                  </button>
                </div>
              </div>

              {/* Modifiers */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <div className="flex items-center gap-1 text-gray-700 mb-2">
                  <span className="text-sm font-medium">MODIFIERS</span>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    className={`text-xs py-2 border rounded-md ${
                      selectedModifier === "masculine" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => setSelectedModifier("masculine")}
                  >
                    MASCULINE
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md ${
                      selectedModifier === "feminine" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => setSelectedModifier("feminine")}
                  >
                    FEMININE
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md ${
                      selectedModifier === "symmetrical" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => setSelectedModifier("symmetrical")}
                  >
                    SYMMETRICAL
                  </button>
                </div>
              </div>

              {/* Reference Image Upload */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">REFERENCE IMAGE</h3>
                <div
                  className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center h-40 cursor-pointer hover:bg-gray-50"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image"
                        fill
                        className="object-contain"
                      />
                      <button
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedImage(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                    </>
                  )}
                </div>
                <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              {/* Freestyle Drawing Button */}
              <button
                onClick={() => setIsDrawingModalOpen(true)}
                className="w-full bg-white border border-gray-400 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center gap-2">
                  <Pen className="h-5 w-5 text-gray-700" />
                  <span>Open Freestyle Drawing</span>
                </div>
              </button>

              {/* Negative Input */}
              <div className="bg-white border border-gray-400 rounded-lg p-4">
                <div className="flex items-center gap-1 text-gray-700 mb-2">
                  <span className="text-sm font-medium">NEGATIVE INPUTS</span>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Textarea
                  placeholder="Enter things you don't want the model to include..."
                  className="w-full border-gray-300 focus:border-gray-400 focus:ring-0 bg-white text-sm resize-none"
                  value={negativeInput}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNegativeInput(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button
                className="w-full bg-[#1e1e1e] hover:bg-black text-white py-6 text-lg"
                onClick={handleSubmit}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate New Tattoo"}
              </Button>
            </div>

            {/* Right Column - Results */}
            <div className="w-2/3 space-y-6">
              {/* Latest Generated Result */}
              <div className="bg-white border border-gray-400 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  {isGenerating || (latestGeneration && latestGeneration.status !== 'completed') ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                      <p className="text-gray-600 text-center px-4">{getStatusMessage()}</p>
                    </div>
                  ) : latestGeneration?.image ? (
                    <Image
                      src={latestGeneration.image}
                      alt="Latest generated design"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-400">No generated design yet</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-400 p-3 flex items-center justify-center gap-6">
                  <button 
                    className={`flex items-center gap-2 ${latestGeneration?.status !== 'completed' ? 'text-gray-400 cursor-not-allowed' : 'hover:text-purple-600'}`}
                    disabled={latestGeneration?.status !== 'completed'}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Favourite</span>
                  </button>
                  <button 
                    className={`flex items-center gap-2 ${latestGeneration?.status !== 'completed' ? 'text-gray-400 cursor-not-allowed' : 'hover:text-purple-600'}`}
                    disabled={latestGeneration?.status !== 'completed'}
                    onClick={() => {
                      if (latestGeneration?.image) {
                        setGeneratedDesigns(prev => [{
                          id: Date.now(),
                          image: latestGeneration.image
                        }, ...prev])
                        toast.success('Design saved!')
                      }
                    }}
                  >
                    <Edit className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                  <button 
                    className={`flex items-center gap-2 ${latestGeneration?.status !== 'completed' ? 'text-gray-400 cursor-not-allowed' : 'hover:text-purple-600'}`}
                    disabled={latestGeneration?.status !== 'completed'}
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </button>
                  <button 
                    className={`flex items-center gap-2 ${latestGeneration?.status !== 'completed' ? 'text-gray-400 cursor-not-allowed' : 'hover:text-purple-600'}`}
                    disabled={latestGeneration?.status !== 'completed'}
                  >
                    <Maximize2 className="h-5 w-5" />
                    <span>Update</span>
                  </button>
                </div>
              </div>

              {/* Saved Designs Grid */}
              <div>
                <h2 className="text-xl font-serif font-bold mb-4">Saved Designs</h2>
                <div className="grid grid-cols-3 gap-4">
                  {generatedDesigns.map((design) => (
                    <div key={design.id} className="bg-white border border-gray-400 rounded-lg overflow-hidden">
                      <div className="relative w-full h-48">
                        <Image
                          src={design.image}
                          alt={`Generated design ${design.id}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="border-t border-gray-400 p-2 flex items-center justify-center gap-2">
                        <button className="p-1 hover:text-purple-600">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:text-purple-600">
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 hover:text-purple-600"
                          onClick={() => setGeneratedDesigns(prev => prev.filter(d => d.id !== design.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
