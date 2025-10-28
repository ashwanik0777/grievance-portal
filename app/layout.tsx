import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayoutShell from "@/components/client-layout-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartCityFix - Report & Fix City Issues",
  description: "A modern grievance portal to report city issues and earn points for community participation",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  )
}
