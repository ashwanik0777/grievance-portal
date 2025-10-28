"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, Leaf, LogOut, Settings, User } from "lucide-react"

interface AppUser {
  _id: string
  name?: string
  email: string
  role: string
  points: number
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    // Poll every 5 seconds to check auth status
    const interval = setInterval(checkAuth, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setShowProfileMenu(false)
    router.push("/")
    router.refresh()
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/report", label: "Report Issue" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/games", label: "Games" },
  ]

  const getInitials = (name?: string, email?: string) => {
    const source = (name && name.trim()) || (email && email.split("@")[0]) || ""
    if (!source) return "U"
    return source
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-200">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl text-slate-900 hidden sm:inline">SmartCityFix</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3 relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold transition-all duration-200 hover:shadow-lg active:scale-95"
                      title={user.name ?? user.email}
                    >
                      {getInitials(user.name, user.email)}
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                      <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-lg shadow-lg py-2 w-48 z-50 animate-slide-up">
                        <div className="px-4 py-2 border-b border-slate-200">
                          <p className="font-semibold text-slate-900">{user.name ?? user.email}</p>
                          <p className="text-xs text-slate-600">{user.email}</p>
                          <p className="text-sm font-bold text-emerald-600 mt-1">{user.points} points</p>
                        </div>

                        {user.role === "user" && (
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <User size={16} />
                            My Profile
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Settings size={16} />
                            Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 text-left"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-medium text-sm hover:shadow-md active:scale-95"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} className="text-slate-900" /> : <Menu size={24} className="text-slate-900" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-slate-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-200 space-y-2">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-slate-600 font-medium">
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                        <p className="text-sm font-bold text-emerald-600 mt-1">{user.points} points</p>
                      </div>
                      {user.role === "user" && (
                        <Link
                          href="/profile"
                          className="block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          My Profile
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
