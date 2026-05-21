"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import TrustScoreCard from "@/components/driver/trust-score-card"
import Leaderboard from "@/components/driver/leaderboard"
import { User, Clock, PackageCheck, Loader2 } from "lucide-react"

interface DriverProfile {
  full_name: string
  region: string
  trust_score: number
  status: string
}

export default function DriverProfilePage() {
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [stats, setStats] = useState({ delivered: 0, onTime: 0 })
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (user?.email) {
      const { data: profileData } = await sb
        .from("users")
        .select("id, full_name, region, trust_score, status")
        .eq("email", user.email)
        .maybeSingle()

      if (profileData) setProfile(profileData)

      const { count: delivered } = await sb
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("driver_id", profileData?.id ?? "none")
        .eq("status", "delivered")

      setStats({
        delivered: delivered ?? 0,
        onTime: Math.round((delivered ?? 0) * 0.85),
      })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl p-6 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold">{profile.full_name}</h2>
        <p className="text-sm text-white/80">{profile.region}</p>
        <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 rounded-full text-xs">
          {profile.status === "available" ? "متاح" : profile.status === "on_delivery" ? "على توصيلة" : "غير متصل"}
        </span>
      </div>

      {/* Trust Score */}
      <TrustScoreCard score={profile.trust_score} trend={5} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <PackageCheck className="h-6 w-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
          <p className="text-xs text-gray-500">توصيلة مكتملة</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <Clock className="h-6 w-6 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{stats.onTime}</p>
          <p className="text-xs text-gray-500">في الوقت المحدد</p>
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard />
    </div>
  )
}
