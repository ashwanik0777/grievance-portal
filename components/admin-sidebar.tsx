"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  PieChart,
  FileText,
  Users,
  Tag,
  Settings,
  BarChart,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <PieChart className="w-5 h-5" /> },
    { href: "/admin/reports", label: "Manage Reports", icon: <FileText className="w-5 h-5" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/categories", label: "Categories", icon: <Tag className="w-5 h-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { href: "/admin/analytics", label: "Analytics", icon: <BarChart className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
        aria-label="Toggle admin menu"
      >
        <MenuIcon size={18} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6 transform transition-transform duration-300 z-40 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-emerald-400">SmartCityFix</h1>
          <p className="text-slate-400 text-sm">Admin Control Panel</p>
        </div>

        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
