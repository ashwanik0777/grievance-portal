"use client"

import { useState } from "react"

const reportsData = [
  {
    id: 1,
    title: "Large pothole on Main Street",
    reporter: "Alex Johnson",
    category: "Pothole",
    status: "Resolved",
    date: "2025-10-20",
    location: "Main St, Downtown",
  },
  {
    id: 2,
    title: "Broken streetlight near Park Ave",
    reporter: "Sarah Chen",
    category: "Streetlight",
    status: "In Progress",
    date: "2025-10-18",
    location: "Park Ave, North",
  },
  {
    id: 3,
    title: "Garbage pile at corner",
    reporter: "Mike Rodriguez",
    category: "Garbage",
    status: "Pending",
    date: "2025-10-15",
    location: "Corner St, East",
  },
  {
    id: 4,
    title: "Road damage near bridge",
    reporter: "Emma Wilson",
    category: "Road Damage",
    status: "In Progress",
    date: "2025-10-12",
    location: "Bridge Rd, West",
  },
]

export default function ReportsTable() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-50 text-green-700"
      case "In Progress":
        return "bg-blue-50 text-blue-700"
      case "Pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (reportId: number, newStatus: string) => {
    console.log(`Report ${reportId} status changed to ${newStatus}`)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Title</th>
              <th className="px-6 py-4 text-left font-bold">Reporter</th>
              <th className="px-6 py-4 text-left font-bold">Category</th>
              <th className="px-6 py-4 text-left font-bold">Location</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {reportsData.map((report) => (
              <tr key={report.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{report.title}</td>
                <td className="px-6 py-4 text-gray-600">{report.reporter}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                    {report.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{report.location}</td>
                <td className="px-6 py-4">
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${getStatusColor(report.status)}`}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
