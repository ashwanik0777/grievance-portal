"use client"

import { usePathname } from "next/navigation"
import React from "react"
import Navbar from "./navbar"
import Footer from "./footer"

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/"
  const isAdmin = pathname.startsWith("/admin")

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}