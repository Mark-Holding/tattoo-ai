"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower, Home, FileText, PlusCircle, Settings, HelpCircle, User, BookOpen, Trash2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/contexts/UserContext"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Tattoo styles data
const tattooStyles = [
  {
    id: 1,
    name: "Old School / Traditional",
    image: "/images/oldschool.png",
    description:
      "Bold lines, vibrant colors, and iconic imagery like anchors, roses, and eagles. Originated with sailors in the early 20th century.",
  },
  {
    id: 2,
    name: "New School",
    image: "/images/newschool.png",
    description:
      "Exaggerated, cartoonish style with bold colors, heavy outlines and exaggerated proportions. Popular in the 1980s and 1990s.",
  },
  {
    id: 3,
    name: "Neo Traditional",
    image: "/images/neotrad.png",
    description:
      "Combines elements of traditional tattooing with a more illustrative approach, featuring more detailed imagery and a broader color palette.",
  },
  {
    id: 4,
    name: "Tribal",
    image: "/images/tribal.png",
    description:
      "Bold, black patterns inspired by indigenous cultures. Features geometric shapes and patterns that flow with the body's contours.",
  },
  {
    id: 5,
    name: "Blackwork",
    image: "/images/blackwork.png",
    description:
      "Uses solid black ink to create bold, graphic designs. Can range from simple silhouettes to intricate patterns and textures.",
  },
  {
    id: 6,
    name: "Dotwork",
    image: "/images/dotwork.png",
    description:
      "Creates images using thousands of tiny dots. Can create subtle shading and ethereal effects, often with geometric or mandala designs.",
  },
  {
    id: 7,
    name: "Geometric",
    image: "/images/geometric.png",
    description:
      "Focuses on precise shapes, patterns, and symmetry. Often incorporates sacred geometry and mathematical principles.",
  },
  {
    id: 8,
    name: "Illustrative",
    image: "/images/illustration.png",
    description:
      "Resembles illustrations from books or artwork, with a focus on line work and sometimes incorporating elements of realism.",
  },
  {
    id: 9,
    name: "Sketch",
    image: "/images/sketch.png",
    description:
      "Mimics the appearance of a pencil or pen sketch, often with loose, gestural lines and a raw, unfinished quality.",
  },
  {
    id: 10,
    name: "Watercolor",
    image: "/images/watercolor.png",
    description:
      "Mimics the flowing, transparent quality of watercolor paintings, often with splashes of color that appear to bleed beyond outlines.",
  },
  {
    id: 11,
    name: "Japanese",
    image: "/images/japanese.png",
    description:
      "Traditional Japanese imagery like koi fish, dragons, and cherry blossoms, often covering large areas of the body with a cohesive theme.",
  },
  {
    id: 12,
    name: "Anime/Cartoon",
    image: "/images/cartoon.png",
    description:
      "Inspired by Japanese animation and cartoons, featuring colorful characters with large eyes and exaggerated features in a cartoon style.",
  },
  {
    id: 13,
    name: "Lettering",
    image: "/images/lettering.png",
    description:
      "Focuses on typography, from elegant script to bold block letters. Can include quotes, names, or meaningful words.",
  },
  {
    id: 14,
    name: "Minimalism",
    image: "/images/minimalism.png",
    description:
      "Simple designs with clean lines and minimal detail. Often small and subtle, focusing on negative space and simplicity.",
  },
  {
    id: 15,
    name: "Realism",
    image: "/images/realism.png",
    description:
      "Creates highly detailed, lifelike images that resemble photographs. Often portraits or nature scenes with precise shading.",
  },
  {
    id: 16,
    name: "Psychedelic",
    image: "/images/psychedelic.png",
    description:
      "Vibrant, surreal imagery inspired by psychedelic art of the 1960s. Features bright colors, optical illusions, and dreamlike imagery.",
  },
  {
    id: 17,
    name: "Impressionism",
    image: "/images/impressionism.png",
    description:
      "Based on the painting style, featuring soft colors and light effects to create dreamy, atmospheric designs with a painterly quality.",
  },
  {
    id: 18,
    name: "",
    image: "",
    description: "",
  },
]

// Define Project type based on schema
interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function DesignGuidePage() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Project state
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const newProjectInputRef = useRef<HTMLInputElement>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  
  // Unsaved changes warning state
  const [showNavigationWarning, setShowNavigationWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  
  // Get unsaved design status from localStorage or sessionStorage
  const checkForUnsavedDesign = useCallback(() => {
    // Check dashboard state via localStorage/sessionStorage
    // You can add this feature in a future iteration
    // For now, we'll just load and check this value globally
    const unsavedDesignData = sessionStorage.getItem('unsavedDesign')
    return !!unsavedDesignData
  }, [])
  
  // Safe navigation handler
  const handleNavigation = useCallback((href: string) => {
    const hasUnsavedDesign = checkForUnsavedDesign()
    if (hasUnsavedDesign) {
      // Show our custom dialog
      setPendingNavigation(href)
      setShowNavigationWarning(true)
    } else {
      // Safe to navigate
      window.location.href = href
    }
  }, [checkForUnsavedDesign])

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
        setProjects(data || [])
        
        // Check for project parameter in URL
        const projectIdFromUrl = searchParams.get('project')
        if (projectIdFromUrl) {
          setActiveProjectId(projectIdFromUrl)
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

  // Focus input when it appears
  useEffect(() => {
    if (isCreatingProject && newProjectInputRef.current) {
      newProjectInputRef.current.focus()
    }
  }, [isCreatingProject])

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

  // Handle Enter key in new project input
  const handleNewProjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateProject()
    } else if (e.key === 'Escape') {
      setNewProjectName("")
      setIsCreatingProject(false)
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

      {/* Sidebar */}
      <aside className="w-44 bg-[#1e1e1e] text-white fixed h-full flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Flower className="h-6 w-6 text-white" />
            <span className="text-xl font-serif font-bold">Tattoo</span>
          </div>

          <nav className="space-y-1">
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
              onClick={() => handleNavigation(activeProjectId ? `/dashboard?project=${activeProjectId}` : '/dashboard')}
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

                {isLoadingProjects ? (
                  <p className="text-xs text-gray-500 px-2 py-0.5">Loading projects...</p>
                ) : projects.length === 0 && !isCreatingProject ? (
                  <p className="text-xs text-gray-500 px-2 py-0.5">No projects yet</p>
                ) : (
                  projects.map((project) => (
                    <div 
                      key={project.id} 
                      className={`group flex items-center justify-between ${
                        activeProjectId === project.id ? 'bg-white/20' : 'hover:bg-white/10'
                      } rounded-md`}
                    >
                      <div
                        className={`flex-grow block px-2 py-0.5 text-xs ${
                          activeProjectId === project.id ? 'text-white font-medium' : 'text-gray-400'
                        } group-hover:text-white truncate cursor-pointer`}
                        title={project.name}
                        onClick={() => handleNavigation(`/dashboard?project=${project.id}`)}
                      >
                        {project.name}
                      </div>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        className="p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 mr-1"
                        title="Delete project"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/10 text-white">
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
              const hasUnsavedDesign = checkForUnsavedDesign()
              if (hasUnsavedDesign) {
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
        {/* Page header */}
        <header className="border-b border-gray-400 bg-[#f8f7f5] p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-serif font-bold">Tattoo Design Guide</h1>
          </div>
        </header>

        {/* Page content */}
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Explore different tattoo styles to find inspiration for your next design. Each style has its own unique
              characteristics, history, and aesthetic.
            </p>
          </div>

          {/* Style cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tattooStyles.map((style) => (
              <Card
                key={style.id}
                className="overflow-hidden bg-white border border-gray-400 hover:shadow-md transition-shadow"
              >
                {style.name ? (
                  <>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg font-serif">{style.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {style.image && (
                        <div className="relative h-48 mb-3 rounded-md overflow-hidden">
                          <Image
                            src={style.image || "/placeholder.svg"}
                            alt={style.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm text-gray-600">{style.description}</p>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-4 h-full flex items-center justify-center">
                    <p className="text-gray-400 italic">Coming soon...</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
