"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

interface Stats {
  totalUsers: number
  totalReports: number
  resolvedReports: number
  pendingReports: number
  inProgressReports: number
  totalPoints: number
  averagePointsPerUser: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }

        const data = await response.json()
        if (data.user.role !== "admin") {
          router.push("/")
          return
        }

        // Fetch stats
        const statsResponse = await fetch("/api/admin/stats")
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.stats)
        }
      } catch (err) {
        setError("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to SmartCityFix Admin Control Panel</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">{error}</div>
          )}

          {/* Stats Grid */}
          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <div className="text-4xl">👥</div>
                  </div>
                </div>

                {/* Total Reports */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
                    </div>
                    <div className="text-4xl">📋</div>
                  </div>
                </div>

                {/* Resolved Reports */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Resolved</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.resolvedReports}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.totalReports > 0 ? Math.round((stats.resolvedReports / stats.totalReports) * 100) : 0}%
                        completion
                      </p>
                    </div>
                    <div className="text-4xl">✅</div>
                  </div>
                </div>

                {/* Pending Reports */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
                    </div>
                    <div className="text-4xl">⏳</div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* In Progress */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">In Progress</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.inProgressReports}</p>
                    </div>
                    <div className="text-4xl">🔄</div>
                  </div>
                </div>

                {/* Total Points */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Total Points</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalPoints}</p>
                    </div>
                    <div className="text-4xl">⭐</div>
                  </div>
                </div>

                {/* Avg Points Per User */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Avg Points/User</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.averagePointsPerUser.toFixed(1)}</p>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <a
                    href="/admin/reports"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-6 rounded-lg border border-blue-200 transition-all text-center"
                  >
                    <p className="text-3xl mb-2">📋</p>
                    <p className="font-semibold text-gray-900">Manage Reports</p>
                    <p className="text-sm text-gray-600 mt-1">View and update reports</p>
                  </a>

                  <a
                    href="/admin/users"
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 p-6 rounded-lg border border-emerald-200 transition-all text-center"
                  >
                    <p className="text-3xl mb-2">👥</p>
                    <p className="font-semibold text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600 mt-1">View user profiles</p>
                  </a>

                  <a
                    href="/admin/categories"
                    className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-6 rounded-lg border border-purple-200 transition-all text-center"
                  >
                    <p className="text-3xl mb-2">🏷️</p>
                    <p className="font-semibold text-gray-900">Categories</p>
                    <p className="text-sm text-gray-600 mt-1">Manage report categories</p>
                  </a>

                  <a
                    href="/admin/settings"
                    className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-6 rounded-lg border border-orange-200 transition-all text-center"
                  >
                    <p className="text-3xl mb-2">⚙️</p>
                    <p className="font-semibold text-gray-900">Settings</p>
                    <p className="text-sm text-gray-600 mt-1">System configuration</p>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
