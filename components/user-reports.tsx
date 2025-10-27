"use client"

import { useEffect, useState } from "react"

interface Report {
  _id: string
  title: string
  category: string
  status: string
  createdAt: string
}

export default function UserReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/user/reports")
        if (response.ok) {
          const data = await response.json()
          setReports(data.reports || [])
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 text-green-700"
      case "in-progress":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <p className="text-gray-600">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet. Start by reporting an issue!</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600">
                  {report.category} • {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(report.status)}`}
                >
                  {report.status}
                </span>
                <span className="text-lg font-bold text-emerald-600">+10</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
