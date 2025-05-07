import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Flower, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"
import TattooPromptBuilder from "../components/tattoo-prompt-builder"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1e1e1e]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#1e1e1e]/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Flower className="h-6 w-6 text-white" />
            <span className="text-xl font-serif font-bold text-white">Tattoo</span>
          </div>
          <nav className="hidden md:flex">
            <div className="flex rounded-full bg-gray-800/50 p-1">
              <Link href="/" className="rounded-full px-4 py-1.5 text-sm font-medium text-white bg-black/50">
                Home
              </Link>
              <Link
                href="/#features"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white hover:bg-black/30"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white hover:bg-black/30"
              >
                Pricing
              </Link>
              <Link
                href="/#contact"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white hover:bg-black/30"
              >
                Contact
              </Link>
            </div>
          </nav>
          <Link href="/login">
            <Button className="hidden md:inline-flex bg-transparent border border-white text-white hover:bg-white/10">
              Log In
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-24">
        <div className="w-full max-w-5xl">
          <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-white">Tattoo Prompt Builder</h1>
          <p className="mb-8 text-center text-lg text-muted-foreground">
            Create the perfect tattoo concept with our step-by-step consultation wizard
          </p>
          <TattooPromptBuilder />
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-[#1e1e1e] py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flower className="h-6 w-6 text-white" />
                <span className="text-xl font-serif font-bold text-white">Tattoo</span>
              </div>
              <p className="text-sm text-gray-400">
                Create beautiful tattoo designs with our professional platform. Perfect for artists and clients alike.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Tattoo. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <div className="flex items-center">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <div className="flex items-center">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <div className="flex items-center">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <div className="flex items-center">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
