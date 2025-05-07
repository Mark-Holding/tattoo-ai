"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
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
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/contexts/UserContext"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

// Define Project type based on schema
interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Define ProjectDesign type based on schema
interface ProjectDesign {
  id: string;
  project_id: string;
  image_url: string;
  style?: string;
  body_placement?: string;
  detail_level?: string;
  modifier?: string;
  description?: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
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

  const [storedRequests, setStoredRequests] = useState<DesignRequest[]>([])

  // Project state
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const newProjectInputRef = useRef<HTMLInputElement>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  // Saved Designs state (for the active project)
  const [savedDesigns, setSavedDesigns] = useState<ProjectDesign[]>([])
  const [isLoadingSavedDesigns, setIsLoadingSavedDesigns] = useState(false)

  // State to track unsaved design
  const [isLatestDesignSaved, setIsLatestDesignSaved] = useState(true)
  const [showNavigationWarning, setShowNavigationWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

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

  // Fetch projects on mount and when user changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      setIsLoadingProjects(true)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        const fetchedProjects = data || []
        setProjects(fetchedProjects)
        
        // Check for project parameter in URL
        const projectIdFromUrl = searchParams.get('project')
        
        if (projectIdFromUrl) {
          // Find the project with matching ID
          const projectFromUrl = fetchedProjects.find(p => p.id === projectIdFromUrl)
          if (projectFromUrl) {
            setActiveProject(projectFromUrl)
            return // Skip setting first project as active
          }
        }
        
        // Default behavior - set first project as active if it exists and no project is active
        if (fetchedProjects.length > 0 && !activeProject) {
          setActiveProject(fetchedProjects[0])
        } else if (fetchedProjects.length === 0) {
          // If no projects exist, ensure activeProject is null
          setActiveProject(null)
        }
      } catch (error: any) {
        toast.error(`Failed to fetch projects: ${error.message}`)
        console.error("Error fetching projects:", error)
        setProjects([])
      } finally {
        setIsLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [user, searchParams])

  // Fetch saved designs when active project changes
  useEffect(() => {
    const fetchSavedDesigns = async () => {
      if (!activeProject) {
        setSavedDesigns([]) // Clear designs if no project is active
        return
      }

      setIsLoadingSavedDesigns(true)
      try {
        const { data, error } = await supabase
          .from('project_designs')
          .select('*')
          .eq('project_id', activeProject.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setSavedDesigns(data || [])
      } catch (error: any) {
        toast.error(`Failed to fetch saved designs: ${error.message}`)
        console.error("Error fetching saved designs:", error)
        setSavedDesigns([])
      } finally {
        setIsLoadingSavedDesigns(false)
      }
    }

    fetchSavedDesigns()
  }, [activeProject])

  // Focus input when it appears
  useEffect(() => {
    if (isCreatingProject && newProjectInputRef.current) {
      newProjectInputRef.current.focus()
    }
  }, [isCreatingProject])

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
      // Create the request object
      const requestObject = {
        style: selectedStyle,
        body_placement: selectedPlacement,
        detail_level: detailLevel,
        modifier: selectedModifier,
        negative_prompt: negativeInput,
        description: description,
        reference_image_url: uploadedImage,
        freestyle_drawing_url: getCanvasImage(),
        status: 'pending'
      }
      
      console.log('Submitting design request with:', requestObject)

      // First, create the design request in Supabase
      const { data: designRequest, error: insertError } = await supabase
        .from('design_requests')
        .insert(requestObject)
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
  const handleSaveDesign = (_id: number) => {
    // TODO: Implement save design functionality
  }

  const handleEditDesign = (_id: number) => {
    // TODO: Implement edit design functionality
  }

  const handleDeleteDesign = async (_id: number) => {
    // TODO: Implement delete design functionality
  }

  const handleDownloadDesign = (_id: number) => {
    // TODO: Implement download design functionality
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

  // Handle creating a new project
  const handleCreateProject = async () => {
    const projectName = newProjectName.trim()
    if (!projectName || !user) {
      setNewProjectName("")
      setIsCreatingProject(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ name: projectName, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setProjects(prevProjects => [data, ...prevProjects])
      }
      toast.success(`Project "${projectName}" created!`)

    } catch (error: any) {
      toast.error(`Failed to create project: ${error.message}`)
      console.error("Error creating project:", error)
    } finally {
      setNewProjectName("")
      setIsCreatingProject(false)
    }
  }

  // Handle Enter key in new project input
  const handleNewProjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateProject()
    } else if (e.key === 'Escape') {
      setNewProjectName("")
      setIsCreatingProject(false)
    }
  }

  // Handle deleting a project
  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete the project "${projectName}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId)

        if (error) throw error

        // Remove project from local state
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId))
        toast.success(`Project "${projectName}" deleted.`)

      } catch (error: any) {
        toast.error(`Failed to delete project: ${error.message}`)
        console.error("Error deleting project:", error)
      }
    }
  }

  // Effect to update save status when a new design is generated
  useEffect(() => {
    if (latestGeneration?.status === 'completed' && latestGeneration.image) {
      setIsLatestDesignSaved(false)
    }
  }, [latestGeneration])
  
  // Add beforeunload event listener for browser navigation/refresh
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isLatestDesignSaved && latestGeneration?.status === 'completed' && latestGeneration.image) {
        // Standard way to show a browser confirmation dialog before leaving
        event.preventDefault()
        // Modern browsers require returnValue to be set
        event.returnValue = ''
        return ''
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLatestDesignSaved, latestGeneration])
  
  // Safe navigation handler
  const handleNavigation = useCallback((href: string) => {
    if (!isLatestDesignSaved && latestGeneration?.status === 'completed' && latestGeneration.image) {
      // Show our custom dialog
      setPendingNavigation(href)
      setShowNavigationWarning(true)
    } else {
      // Safe to navigate
      window.location.href = href
    }
  }, [isLatestDesignSaved, latestGeneration])

  // Confirm navigation and discard changes
  const confirmNavigation = () => {
    setShowNavigationWarning(false)
    if (pendingNavigation) {
      window.location.href = pendingNavigation
    }
  }
  
  // Cancel navigation and stay on page
  const cancelNavigation = () => {
    setShowNavigationWarning(false)
    setPendingNavigation(null)
  }

  // Function to handle saving the LATEST generated design to the ACTIVE project
  const handleSaveLatestDesignToProject = async () => {
    if (!activeProject) {
      toast.error("Please select a project first.")
      return
    }
    if (!latestGeneration?.image) {
      toast.error("No generated image to save.")
      return
    }

    try {
      const designData: Omit<ProjectDesign, 'id' | 'created_at'> = {
        project_id: activeProject.id,
        image_url: latestGeneration.image,
        // Optionally add other relevant data from the generation settings
        style: selectedStyle,
        body_placement: selectedPlacement,
        detail_level: detailLevel,
        modifier: selectedModifier,
        description: description, // Use the main description input?
      }

      const { data: newDesign, error } = await supabase
        .from('project_designs')
        .insert(designData)
        .select()
        .single()

      if (error) throw error

      if (newDesign) {
        // Add the newly saved design to the top of the local state
        setSavedDesigns(prevDesigns => [newDesign, ...prevDesigns])
        toast.success(`Design saved to project "${activeProject.name}"!`)
        
        // Mark the latest design as saved
        setIsLatestDesignSaved(true)
      }

    } catch (error: any) {
      toast.error(`Failed to save design: ${error.message}`)
      console.error("Error saving design:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f5]">
      {/* Toast notifications */}
      <Toaster position="top-right" />
      
      {/* Navigation Warning Dialog */}
      <Dialog open={showNavigationWarning} onOpenChange={setShowNavigationWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved Design</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-700">
              You have an unsaved design that will be lost if you navigate away. Would you like to save it first?
            </p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={confirmNavigation}
            >
              Continue Without Saving
            </Button>
            <Button
              type="button"
              onClick={cancelNavigation}
            >
              Go Back and Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <div 
              className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/10 text-white cursor-pointer"
              onClick={() => handleNavigation('/dashboard')}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </div>
            <button
              onClick={() => {
                setIsCreatingProject(true)
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="text-sm">Create New</span>
            </button>
            <div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white">
                <FileText className="h-4 w-4" />
                <span className="text-sm">My Projects</span>
              </div>
              <div className="ml-2 mt-1 space-y-0.5 pr-2">
                {isCreatingProject && (
                  <div className="px-2 py-0.5">
                    <Input
                      ref={newProjectInputRef}
                      type="text"
                      placeholder="New Project Name..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onBlur={handleCreateProject}
                      onKeyDown={handleNewProjectKeyDown}
                      className="h-6 px-1 py-0 text-xs bg-black/20 border-gray-600 focus:border-white focus:ring-0 text-white placeholder:text-gray-500 rounded"
                    />
                  </div>
                )}

                {/* Project List */}
                <div className="max-h-[180px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent">
                  {isLoadingProjects ? (
                    <p className="text-xs text-gray-500 px-2 py-0.5">Loading projects...</p>
                  ) : projects.length === 0 && !isCreatingProject ? (
                     <p className="text-xs text-gray-500 px-2 py-0.5">No projects yet</p>
                  ) : (
                    projects.map((project) => (
                      <div 
                        key={project.id} 
                        className={`group flex items-center justify-between rounded-md cursor-pointer ${
                          activeProject?.id === project.id ? 'bg-white/20' : 'hover:bg-white/10' // Highlight active project
                        }`}
                        onClick={() => setActiveProject(project)} // Set project as active on click
                      >
                        {/* Changed Link to span/div as click is handled by parent */}
                        <span
                          className={`flex-grow block px-2 py-0.5 text-xs truncate ${
                            activeProject?.id === project.id ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'
                          }`}
                          title={project.name}
                        >
                          {project.name}
                        </span>
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); // Prevent setting active project when deleting
                            handleDeleteProject(project.id, project.name)
                          }}
                          className={`p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 mr-1 ${
                            activeProject?.id === project.id ? 'opacity-100' : '' // Keep visible if active
                          }`}
                          title="Delete project"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
              onClick={() => handleNavigation(activeProject ? `/design-guide?project=${activeProject.id}` : '/design-guide')}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Design Guide</span>
            </div>
          </nav>
        </div>

        {/* Bottom navigation */}
        <div className="p-4 space-y-1">
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
            onClick={() => handleNavigation('/settings')}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </div>
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
            onClick={() => handleNavigation('/help')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Help</span>
          </div>
        </div>

        {/* User profile at bottom of sidebar */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-300" />
            </div>
            <span className="text-xs font-medium">User</span>
          </div>
          <button
            onClick={async () => {
              if (!isLatestDesignSaved && latestGeneration?.status === 'completed' && latestGeneration.image) {
                setPendingNavigation('/login')
                setShowNavigationWarning(true)
              } else {
                const { error } = await supabase.auth.signOut()
                if (error) {
                  toast.error('Failed to logout')
                } else {
                  window.location.href = '/login'
                }
              }
            }}
            className="mt-2 w-full text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-md px-2 py-1"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-44 flex-1">
        {/* Project header */}
        <header className="border-b border-gray-400 bg-[#f8f7f5] p-4 sticky top-0 z-10">
          <div className="container mx-auto">
            <h1 className="text-2xl font-serif font-bold">{activeProject?.name || 'Select or Create a Project'}</h1>
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
                    onClick={() => {
                      setDetailLevel("simple");
                    }}
                  >
                    <Circle className="h-3 w-3" />
                    SIMPLE
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md flex items-center justify-center gap-1 ${
                      detailLevel === "medium" ? "bg-purple-100 border-purple-400 text-purple-600" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => {
                      setDetailLevel("medium");
                    }}
                  >
                    <Circle className="h-3 w-3 fill-current" />
                    MEDIUM
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md flex items-center justify-center gap-1 ${
                      detailLevel === "complex" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => {
                      setDetailLevel("complex");
                    }}
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
                    onClick={() => {
                      setSelectedModifier("masculine");
                    }}
                  >
                    MASCULINE
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md ${
                      selectedModifier === "feminine" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => {
                      setSelectedModifier("feminine");
                    }}
                  >
                    FEMININE
                  </button>
                  <button
                    className={`text-xs py-2 border rounded-md ${
                      selectedModifier === "symmetrical" ? "bg-gray-100 border-gray-400" : "border-gray-300 text-gray-500"
                    }`}
                    onClick={() => {
                      setSelectedModifier("symmetrical");
                    }}
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
                    onClick={handleSaveLatestDesignToProject}
                  >
                    <Edit className="h-5 w-5" />
                    <span>Save to Project</span>
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
                <h2 className="text-xl font-serif font-bold mb-4">
                  Saved Designs {activeProject ? `for "${activeProject.name}"` : ''}
                </h2>
                {isLoadingSavedDesigns ? (
                   <p className="text-gray-500 text-center py-4">Loading saved designs...</p>
                ) : savedDesigns.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {activeProject ? 'No designs saved for this project yet.' : 'Select a project to view saved designs.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {savedDesigns.map((design) => (
                      <div key={design.id} className="bg-white border border-gray-400 rounded-lg overflow-hidden">
                        <div className="relative w-full h-48">
                          <Image
                            src={design.image_url}
                            alt={`Saved design ${design.id}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="border-t border-gray-400 p-2 flex items-center justify-center gap-2">
                          <button className="p-1 hover:text-purple-600" title="Favourite (Not implemented)">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:text-purple-600" title="Download (Not implemented)">
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 hover:text-red-500"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this saved design?')) {
                                try {
                                  const { error } = await supabase
                                    .from('project_designs')
                                    .delete()
                                    .eq('id', design.id);
                                  if (error) throw error;
                                  setSavedDesigns(prev => prev.filter(d => d.id !== design.id));
                                  toast.success('Saved design deleted.');
                                } catch (err: any) {
                                  toast.error(`Failed to delete saved design: ${err.message}`);
                                }
                              }
                            }}
                            title="Delete saved design"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
