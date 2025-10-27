"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import ReportForm from "@/components/report-form"

export default function ReportPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/login")
        }
      } catch (err) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Report an Issue</h1>
          <p className="text-lg text-gray-600">
            Help us improve the city by reporting local issues. Include photos and location details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <ReportForm />
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What to Report</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Potholes & damaged roads</li>
                    <li>• Broken streetlights</li>
                    <li>• Garbage piles</li>
                    <li>• Damaged infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500 text-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold mb-3">Earn Points</h3>
              <p className="text-sm text-emerald-100 mb-4">
                Each valid report earns you points that can be used to unlock games and climb the leaderboard.
              </p>
              <p className="text-2xl font-bold">+50 pts</p>
              <p className="text-xs text-emerald-100 mt-2">per valid report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
