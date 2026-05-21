"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Plus, UserCheck, Loader2, X } from "lucide-react"

interface Order {
  id: string
  order_number: string
  sender_name: string
  recipient_name: string
  delivery_zone: string
  priority: string
  status: string
  driver_id: string | null
  created_at: string
}

interface Driver {
  id: string
  full_name: string
  status: string
  region: string | null
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "قيد الانتظار", color: "bg-gray-100 text-gray-700" },
  assigned: { label: "تم التعيين", color: "bg-blue-100 text-blue-700" },
  picked_up: { label: "تم الاستلام", color: "bg-amber-100 text-amber-700" },
  delivered: { label: "تم التسليم", color: "bg-green-100 text-green-700" },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  normal: { label: "عادي", color: "bg-gray-100 text-gray-600" },
  urgent: { label: "عاجل", color: "bg-red-100 text-red-700" },
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const supabase = useRef(createClient()).current

  const [form, setForm] = useState({
    order_number: "", sender_name: "", recipient_name: "",
    delivery_zone: "", priority: "normal",
  })

  useEffect(() => {
    loadOrders()
    loadDrivers()
    subscribe()
  }, [])

  const loadOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
    if (data) setOrders(data)
  }

  const loadDrivers = async () => {
    const { data } = await supabase.from("users").select("id, full_name, status, region").eq("role", "driver")
    if (data) setDrivers(data as Driver[])
  }

  const subscribe = () => {
    const channel = supabase.channel(`orders-rt-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") setOrders((prev) => [payload.new as Order, ...prev])
        else if (payload.eventType === "UPDATE") setOrders((prev) => prev.map((o) => o.id === (payload.new as Order).id ? (payload.new as Order) : o))
        else if (payload.eventType === "DELETE") setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }

  const assignDriver = async (orderId: string, driverId: string) => {
    setAssigning(orderId)
    await supabase.from("orders").update({ driver_id: driverId, status: "assigned", updated_at: new Date().toISOString() }).eq("id", orderId)
    await supabase.from("users").update({ status: "on_delivery" }).eq("id", driverId)
    setAssigning(null)
  }

  const createOrder = async () => {
    setCreating(true)
    await supabase.from("orders").insert({
      order_number: form.order_number || `ORD-${Date.now().toString().slice(-4)}`,
      sender_name: form.sender_name,
      recipient_name: form.recipient_name,
      delivery_zone: form.delivery_zone,
      priority: form.priority,
      status: "pending",
    })
    setCreating(false)
    setShowCreate(false)
    setForm({ order_number: "", sender_name: "", recipient_name: "", delivery_zone: "", priority: "normal" })
  }

  return (
    <div>
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">قائمة الطلبات ({orders.length})</h3>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 text-sm bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 transition-colors">
          <Plus className="h-4 w-4" /> طلب جديد
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">طلب جديد</h3>
              <button onClick={() => setShowCreate(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="المصدر (مثل: مطبخ ماما)" value={form.sender_name} onChange={(e) => setForm({ ...form, sender_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input placeholder="المستلم" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input placeholder="منطقة التوصيل" value={form.delivery_zone} onChange={(e) => setForm({ ...form, delivery_zone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="normal">عادي</option>
                <option value="urgent">عاجل</option>
              </select>
              <button onClick={createOrder} disabled={creating} className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50">
                {creating ? "جارٍ الإنشاء..." : "إنشاء الطلب"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 font-medium text-gray-500">رقم الطلب</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">المصدر ← المستلم</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">المنطقة</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">الأولوية</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">الحالة</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">تعيين سائق</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">لا توجد طلبات</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{order.order_number}</td>
                <td className="py-3 px-4 text-gray-700">{order.sender_name} ← {order.recipient_name}</td>
                <td className="py-3 px-4 text-gray-700">{order.delivery_zone}</td>
                <td className="py-3 px-4">
                  <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium", priorityConfig[order.priority]?.color)}>
                    {priorityConfig[order.priority]?.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium", statusConfig[order.status]?.color)}>
                    {statusConfig[order.status]?.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {order.status === "pending" ? (
                    <select
                      onChange={(e) => e.target.value && assignDriver(order.id, e.target.value)}
                      disabled={assigning === order.id}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer hover:border-cyan-400"
                    >
                      <option value="">تعيين...</option>
                      {drivers
                        .filter(d => d.status === "available" && (!d.region || d.region === order.delivery_zone))
                        .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.full_name}{d.region ? ` (${d.region})` : ""}
                        </option>
                      ))}
                      {drivers.filter(d => d.status === "available" && d.region && d.region !== order.delivery_zone).length > 0 && (
                        <optgroup label="مناطق أخرى">
                          {drivers
                            .filter(d => d.status === "available" && d.region && d.region !== order.delivery_zone)
                            .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.full_name} ({d.region})
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  ) : order.driver_id ? (
                    <span className="text-xs text-gray-500">
                      {assigning === order.id ? <Loader2 className="h-3 w-3 animate-spin inline" /> : `🚚 ${drivers.find(d => d.id === order.driver_id)?.full_name || ""}`}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
