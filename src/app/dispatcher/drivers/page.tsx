"use client"

import { useEffect, useState, useRef } from "react"
import { Users, Shield, MapPin, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Driver {
  id: string
  full_name: string
  region: string
  status: string
  trust_score: number
  phone_number: string
}

const statusLabels: Record<string, { label: string; color: string }> = {
  available: { label: "متاح", color: "bg-green-100 text-green-700" },
  on_delivery: { label: "على توصيلة", color: "bg-amber-100 text-amber-700" },
  offline: { label: "غير متصل", color: "bg-gray-100 text-gray-500" },
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  useEffect(() => {
    getSupabase().from("users").select("*").eq("role", "driver").order("trust_score", { ascending: false }).then(({ data }) => {
      if (data) setDrivers(data as Driver[])
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
          <Users className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">السائقون</h1>
          <p className="text-gray-500 mt-1">إدارة السائقين ومؤشرات الثقة</p>
        </div>
      </div>

      <div className="grid gap-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                  {driver.full_name?.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{driver.full_name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {driver.region}
                  </div>
                </div>
              </div>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusLabels[driver.status]?.color)}>
                {statusLabels[driver.status]?.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{driver.trust_score}</span>
                <span className="text-gray-500">ثقة</span>
              </div>
              {driver.phone_number && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span dir="ltr">{driver.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {drivers.length === 0 && (
          <div className="text-center py-12 text-gray-500">لا يوجد سائقون بعد</div>
        )}
      </div>
    </div>
  )
}
