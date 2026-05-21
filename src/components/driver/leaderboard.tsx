"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Driver {
  id: string
  full_name: string
  trust_score: number
  region: string
}

const rankIcons = [Trophy, Medal, Award]
const rankColors = ["text-amber-500", "text-gray-400", "text-amber-700"]

export default function Leaderboard() {
  const [drivers, setDrivers] = useState<Driver[]>([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("users")
      .select("id, full_name, trust_score, region")
      .eq("role", "driver")
      .order("trust_score", { ascending: false })
    if (data) setDrivers(data)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-gray-900">لوحة الشرف</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {drivers.map((driver, i) => {
          const RankIcon = rankIcons[i] || Award
          return (
            <div
              key={driver.id}
              className={cn(
                "flex items-center justify-between p-4",
                i < 3 && "bg-gradient-to-l from-amber-50/50 to-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", i < 3 ? "bg-amber-100" : "bg-gray-100")}>
                  <RankIcon className={cn("h-4 w-4", rankColors[i] || "text-gray-500")} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{driver.full_name}</p>
                  <p className="text-xs text-gray-500">{driver.region}</p>
                </div>
              </div>
              <div className="text-left">
                <p className={cn("text-lg font-bold", driver.trust_score >= 90 ? "text-green-600" : driver.trust_score >= 70 ? "text-amber-600" : "text-red-600")}>
                  {driver.trust_score}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
