"use client"

import { Package, Users, Shield } from "lucide-react"

interface KpiCardsProps {
  activeOrders: number
  availableDrivers: number
  avgTrustScore: number
}

export default function KpiCards({ activeOrders, availableDrivers, avgTrustScore }: KpiCardsProps) {
  const cards = [
    {
      label: "الطلبات النشطة",
      value: activeOrders,
      icon: Package,
      color: "bg-cyan-50 text-cyan-600",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      label: "السائقون المتاحون",
      value: availableDrivers,
      icon: Users,
      color: "bg-amber-50 text-amber-600",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      label: "متوسط مؤشر الثقة",
      value: `${avgTrustScore}%`,
      icon: Shield,
      color: "bg-green-50 text-green-600",
      gradient: "from-green-500 to-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">{card.label}</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-50`} />
        </div>
      ))}
    </div>
  )
}
