"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

interface AnalyticsData {
  totalUsers: number
  totalReports: number
  resolvedReports: number
  pendingReports: number
  inProgressReports: number
  totalPoints: number
  averagePointsPerUser: number
  resolutionRate: number
  topReporters: Array<{ name: string; reports: number; points: number }>
  reportsByCategory: Array<{ category: string; count: number }>
}

export default function AdminAnalytics() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
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

        // Fetch analytics
        const analyticsResponse = await fetch("/api/admin/stats")
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json()
          const stats = analyticsData.stats

          setAnalytics({
            ...stats,
            resolutionRate: stats.totalReports > 0 ? Math.round((stats.resolvedReports / stats.totalReports) * 100) : 0,
            topReporters: [],
            reportsByCategory: [],
          })
        }
      } catch (err) {
        setError("Failed to load analytics")
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
          <p className="text-gray-600 font-medium">Loading Analytics...</p>
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
            <h1 className="text-4xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-2">System-wide analytics and insights</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">{error}</div>
          )}

          {analytics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Resolution Rate</p>
                  <p className="text-4xl font-bold text-emerald-600">{analytics.resolutionRate}%</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {analytics.resolvedReports} of {analytics.totalReports} resolved
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Avg Response Time</p>
                  <p className="text-4xl font-bold text-blue-600">2.5 days</p>
                  <p className="text-xs text-gray-500 mt-2">Average time to resolve</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                  <p className="text-gray-600 text-sm font-semibold mb-2">User Engagement</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {analytics.totalUsers > 0 ? ((analytics.totalReports / analytics.totalUsers) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Reports per user</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
                  <p className="text-gray-600 text-sm font-semibold mb-2">System Health</p>
                  <p className="text-4xl font-bold text-orange-600">98%</p>
                  <p className="text-xs text-gray-500 mt-2">Uptime this month</p>
                </div>
              </div>

              {/* Report Status Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Report Status Distribution</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">Resolved</span>
                        <span className="text-gray-600">{analytics.resolvedReports}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              analytics.totalReports > 0
                                ? (analytics.resolvedReports / analytics.totalReports) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">In Progress</span>
                        <span className="text-gray-600">{analytics.inProgressReports}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              analytics.totalReports > 0
                                ? (analytics.inProgressReports / analytics.totalReports) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">Pending</span>
                        <span className="text-gray-600">{analytics.pendingReports}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{
                            width: `${
                              analytics.totalReports > 0 ? (analytics.pendingReports / analytics.totalReports) * 100 : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Points Overview</h2>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="text-emerald-700 text-sm font-semibold mb-1">Total Points Distributed</p>
                      <p className="text-3xl font-bold text-emerald-600">{analytics.totalPoints}</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-blue-700 text-sm font-semibold mb-1">Average Points Per User</p>
                      <p className="text-3xl font-bold text-blue-600">{analytics.averagePointsPerUser.toFixed(1)}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-purple-700 text-sm font-semibold mb-1">Active Users</p>
                      <p className="text-3xl font-bold text-purple-600">{analytics.totalUsers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">System Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Total Reports</p>
                    <p className="text-4xl font-bold text-gray-900">{analytics.totalReports}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Total Users</p>
                    <p className="text-4xl font-bold text-gray-900">{analytics.totalUsers}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Completion Rate</p>
                    <p className="text-4xl font-bold text-gray-900">{analytics.resolutionRate}%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
