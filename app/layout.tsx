import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SessionProvider } from "@/components/providers/session-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Trust Ride - Safe & Verified Journeys",
  description: "Secure ride-sharing with blockchain verification and safety features",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            {children}
          </Suspense>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
