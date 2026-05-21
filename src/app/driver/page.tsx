"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import TaskCard from "@/components/driver/task-card"
import { Loader2, Bell } from "lucide-react"

interface Order {
  id: string
  order_number: string
  sender_name: string
  recipient_name: string
  delivery_zone: string
  priority: string
  status: string
}

export default function DriverPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        loadOrders(user.id)
        channel = supabase
          .channel(`driver-rt-${crypto.randomUUID()}`)
          .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `driver_id=eq.${user.id}`,
          }, (payload) => {
            if (payload.eventType === "INSERT") {
              setOrders((prev) => [payload.new as Order, ...prev])
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as Order
              if (updated.status === "delivered") {
                setOrders((prev) => prev.filter((o) => o.id !== updated.id))
              } else {
                setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))
              }
            }
          })
          .subscribe()
      }
      setLoading(false)
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const loadOrders = async (uid: string) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("driver_id", uid)
      .in("status", ["assigned", "picked_up"])
      .order("created_at", { ascending: false })
      .limit(5)
    if (data) setOrders(data)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">مهامي</h1>
          <p className="text-sm text-gray-500">الطلبات المكلف بها</p>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <TaskCard order={null} />
        ) : (
          orders.map((order) => (
            <TaskCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}
