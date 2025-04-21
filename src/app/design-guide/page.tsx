"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower, Home, FileText, PlusCircle, Settings, HelpCircle, User, BookOpen } from "lucide-react"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase"

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

export default function DesignGuidePage() {
  return (
    <div className="flex min-h-screen bg-[#f8f7f5]">
      {/* Sidebar */}
      <aside className="w-44 bg-[#1e1e1e] text-white fixed h-full flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Flower className="h-6 w-6 text-white" />
            <span className="text-xl font-serif font-bold">Tattoo</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
            >
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
            <Link href="/design-guide" className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/10 text-white">
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
              const { error } = await supabase.auth.signOut()
              if (error) {
                toast.error('Failed to logout')
              } else {
                window.location.href = '/login'
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
