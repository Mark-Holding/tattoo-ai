import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/contexts/UserContext"
import { UnsavedDesignProvider } from "@/contexts/UnsavedDesignContext"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StreamLine - AI Content Creation",
  description: "Create powerful AI content in seconds",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <UnsavedDesignProvider>
            {children}
            <Toaster position="bottom-right" />
          </UnsavedDesignProvider>
        </UserProvider>
      </body>
    </html>
  )
}