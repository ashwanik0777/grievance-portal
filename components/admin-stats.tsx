import type { LucideIcon } from "lucide-react"

interface AdminStatsProps {
  icon: LucideIcon
  label: string
  value: string
  color: string
}

export default function AdminStats({ icon: Icon, label, value, color }: AdminStatsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-4">
        <Icon className={`${color}`} size={32} />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
