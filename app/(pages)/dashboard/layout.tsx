import type React from "react"
import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "CinemaStudio - Professional Video Editor",
  description: "Create stunning videos with CinemaStudio. Professional video editing tools for creators.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans  antialiased`}>
        <Suspense fallback={null}>
          {children}

        </Suspense>
      </body>
    </html>
  )
}
