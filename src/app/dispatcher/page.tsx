"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import KpiCards from "@/components/dispatcher/kpi-cards"
import OrdersTable from "@/components/dispatcher/orders-table"
import { Loader2 } from "lucide-react"

export default function DispatcherPage() {
  const [kpiData, setKpiData] = useState({ activeOrders: 0, availableDrivers: 0, avgTrustScore: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current

  useEffect(() => {
    loadKpiData()

    const channel = supabase
      .channel(`dash-rt-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadKpiData())
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => loadKpiData())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const loadKpiData = async () => {
    const { count: activeOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "assigned", "picked_up"])

    const { count: availableDrivers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "driver")
      .eq("status", "available")

    const { data: drivers } = await supabase
      .from("users")
      .select("trust_score")
      .eq("role", "driver")

    const avgTrustScore = drivers && drivers.length > 0
      ? Math.round(drivers.reduce((sum, d) => sum + (d.trust_score ?? 0), 0) / drivers.length)
      : 0

    setKpiData({
      activeOrders: activeOrders ?? 0,
      availableDrivers: availableDrivers ?? 0,
      avgTrustScore,
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على عمليات التوصيل</p>
      </div>

      <KpiCards
        activeOrders={kpiData.activeOrders}
        availableDrivers={kpiData.availableDrivers}
        avgTrustScore={kpiData.avgTrustScore}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <OrdersTable />
      </div>
    </div>
  )
}
