"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Upload,
  Flower,
  BarChart,
  Clock,
  PieChart,
} from "lucide-react"

// Sample carousel images
const carouselImages1 = [
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
]

const carouselImages2 = [
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1e1e1e]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#1e1e1e]/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Flower className="h-6 w-6 text-white" />
            <span className="text-xl font-serif font-bold text-white">Tattoo</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <div className="flex rounded-full bg-gray-800/50 p-1">
              <Link href="#" className="rounded-full px-4 py-1.5 text-sm font-medium text-white bg-black/50">
                Home
              </Link>
              <Link
                href="#features"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white hover:bg-black/30"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white hover:bg-black/30"
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white hover:bg-black/30"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Log In Button */}
          <Link href="/login">
            <Button className="hidden md:inline-flex bg-transparent border border-white text-white hover:bg-white/10">
              Log In
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-[#1e1e1e] to-black/20"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-white mb-4 max-w-4xl">
                Create Beautiful Tattoo Designs <span className="text-white">in Minutes</span>
              </h1>
              <p className="max-w-[800px] text-gray-300 md:text-xl mb-8">
                Bring your tattoo ideas to life with our professional design platform. Perfect for artists and clients
                alike.
              </p>

              {/* Start Designing Button */}
              <Link href="/design-widget">
                <Button
                  size="lg"
                  className="gap-2 bg-white hover:bg-gray-100 text-black px-8 py-6 rounded-md shadow-lg transition-all"
                >
                  <Upload className="h-5 w-5" />
                  Try For Free
                </Button>
              </Link>
              <p className="mt-2 text-xs text-gray-400 text-center">No Sign Up Or Payment Card Info Required</p>
            </div>

            {/* Horizontal Scrolling Image Rows */}
            <div className="mt-16 overflow-hidden">
              {/* Top row - moves left to right */}
              <div className="relative mb-4">
                <div className="flex animate-marquee-right">
                  {[...carouselImages1, ...carouselImages1].map((img, index) => (
                    <div
                      key={`top-${index}`}
                      className="relative min-w-[250px] h-[180px] mx-2 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        fill
                        alt={`Tattoo design ${index + 1}`}
                        className="object-cover transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row - moves right to left */}
              <div className="relative">
                <div className="flex animate-marquee-left">
                  {[...carouselImages2, ...carouselImages2].map((img, index) => (
                    <div
                      key={`bottom-${index}`}
                      className="relative min-w-[250px] h-[180px] mx-2 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        fill
                        alt={`Tattoo design ${index + 1}`}
                        className="object-cover transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold tracking-tighter sm:text-5xl text-black">
                  Powerful Features
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to create stunning tattoo designs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex flex-col gap-2 bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-6 w-6 text-black" />
                    <h3 className="text-xl font-serif font-bold text-black">Design Library</h3>
                  </div>
                  <p className="text-gray-600">
                    Access thousands of professional tattoo designs and elements to inspire your next creation.
                  </p>
                </div>
                <div className="flex flex-col gap-2 bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-black" />
                    <h3 className="text-xl font-serif font-bold text-black">Real-time Preview</h3>
                  </div>
                  <p className="text-gray-600">
                    See how your tattoo will look on different skin tones and body placements before committing.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col gap-2 bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-6 w-6 text-black" />
                    <h3 className="text-xl font-serif font-bold text-black">Custom Drawing Tools</h3>
                  </div>
                  <p className="text-gray-600">
                    Professional-grade drawing tools designed specifically for tattoo artists and enthusiasts.
                  </p>
                </div>
                <div className="flex flex-col gap-2 bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-black" />
                    <h3 className="text-xl font-serif font-bold text-black">Artist Collaboration</h3>
                  </div>
                  <p className="text-gray-600">
                    Connect with tattoo artists who can bring your design to life or refine your concepts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-[#1e1e1e]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold tracking-tighter sm:text-5xl text-white">
                  What Our Users Say
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from tattoo artists and clients who use our platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/10 p-6 backdrop-blur-sm hover:bg-black/20 transition-all">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    &quot;Tattoo has completely transformed how I present designs to my clients. The visualization tools are
                    incredible.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Sarah Johnson"
                    className="rounded-full border border-gray-700"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Sarah Johnson</p>
                    <p className="text-xs text-gray-400">Tattoo Artist, Ink Studio</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/10 p-6 backdrop-blur-sm hover:bg-black/20 transition-all">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    &quot;I was nervous about my first tattoo, but being able to visualize it beforehand made all the
                    difference.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Michael Chen"
                    className="rounded-full border border-gray-700"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Michael Chen</p>
                    <p className="text-xs text-gray-400">Client</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/10 p-6 backdrop-blur-sm hover:bg-black/20 transition-all">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    &quot;The collaboration features have helped me connect with clients from all over the world. Game
                    changer!&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Emily Rodriguez"
                    className="rounded-full border border-gray-700"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Emily Rodriguez</p>
                    <p className="text-xs text-gray-400">Freelance Tattoo Artist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold tracking-tighter sm:text-5xl text-black">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for you
                </p>
              </div>
            </div>
            <div className="mx-auto flex flex-col md:flex-row max-w-5xl gap-6 py-12">
              {/* Free Plan */}
              <div className="flex flex-col rounded-xl border-2 border-green-500 bg-green-50 p-6 hover:border-green-600 transition-all relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                  Free Trial
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-green-900">Free</h3>
                  <p className="text-gray-600">Try the app with no commitment</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-green-900">$0</span>
                  <span className="ml-1 text-gray-600">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-900" />
                    <span>3 free model runs</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-900" />
                    <span>Guided design wizard</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-900" />
                    <span>Limited tattoo styles</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-900" />
                    <span>Perfect for trying the app</span>
                  </li>
                </ul>
                <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white">Start Free</Button>
              </div>

              {/* Basic Plan */}
              <div className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-6 hover:border-gray-300 transition-all">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-black">Basic</h3>
                  <p className="text-gray-600">Perfect for enthusiasts and beginners</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-black">$9</span>
                  <span className="ml-1 text-gray-600">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Access to basic design tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>100+ design templates</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Save up to 10 designs</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Reference photo uploads</span>
                  </li>
                </ul>
                <Button className="mt-8 bg-black hover:bg-gray-800 text-white">Get Started</Button>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-6 hover:border-gray-300 transition-all relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-black">Pro</h3>
                  <p className="text-gray-600">Ideal for serious enthusiasts and artists</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-black">$19</span>
                  <span className="ml-1 text-gray-600">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Advanced design tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>1000+ design templates</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Unlimited saved designs</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Reference photo uploads</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Reference photo uploads</span>
                  </li>
                </ul>
                <Button className="mt-8 bg-black hover:bg-gray-800 text-white">Get Started</Button>
              </div>

              {/* Artist Plan */}
              <div className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-6 hover:border-gray-300 transition-all">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-black">Artist</h3>
                  <p className="text-gray-600">For professional tattoo artists</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-black">$39</span>
                  <span className="ml-1 text-gray-600">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Client management tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Portfolio showcase</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Booking system integration</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>24/7 premium support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Artist promotion</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Reference photo uploads</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-8 border-black text-black hover:bg-gray-100">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-[#1e1e1e]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold tracking-tighter sm:text-5xl text-white">
                  Ready to Create Your Design?
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of artists and enthusiasts already using Tattoo to bring their ideas to life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/design-widget">
                  <Button
                    size="lg"
                    className="gap-2 bg-white hover:bg-gray-100 text-black px-8 py-6 rounded-md shadow-lg transition-all"
                  >
                    <Upload className="h-5 w-5" />
                    Try For Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Book a Demo
                </Button>
              </div>
              <p className="text-xs text-gray-400">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </section>
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
