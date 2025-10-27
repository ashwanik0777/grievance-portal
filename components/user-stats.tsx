import type { LucideIcon } from "lucide-react"

interface UserStatsProps {
  icon: LucideIcon
  label: string
  value: string
}

export default function UserStats({ icon: Icon, label, value }: UserStatsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-4">
        <Icon className="text-emerald-600" size={32} />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
