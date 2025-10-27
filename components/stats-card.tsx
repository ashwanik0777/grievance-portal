import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string
  trend?: string
}

export default function StatsCard({ icon: Icon, label, value, trend }: StatsCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 text-center hover:shadow-md hover:border-emerald-200 transition-all group">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
          <Icon className="text-emerald-600" size={32} />
        </div>
      </div>
      <p className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">{label}</p>
      <p className="text-3xl sm:text-4xl font-bold text-slate-900">{value}</p>
      {trend && <p className="text-emerald-600 text-sm font-semibold mt-2">{trend}</p>}
    </div>
  )
}
