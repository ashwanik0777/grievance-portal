"use client"

import { BarChart3, AlertCircle, CheckCircle, Clock } from "lucide-react"
import AdminStats from "@/components/admin-stats"
import ReportsTable from "@/components/reports-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-emerald-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">Manage and track all submitted reports</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStats icon={AlertCircle} label="Total Reports" value="2,847" color="text-emerald-600" />
          <AdminStats icon={Clock} label="Pending" value="234" color="text-blue-600" />
          <AdminStats icon={BarChart3} label="In Progress" value="456" color="text-sky-600" />
          <AdminStats icon={CheckCircle} label="Resolved" value="1,956" color="text-green-600" />
        </div>

        {/* Reports Table */}
        <ReportsTable />
      </div>
    </div>
  )
}
