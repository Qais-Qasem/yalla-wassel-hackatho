"use client"

import { useState } from "react"
import { Package, MapPin, ChevronLeft, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  order_number: string
  sender_name: string
  recipient_name: string
  delivery_zone: string
  priority: string
  status: string
  driver_id?: string | null
}

const statusFlow = ["assigned", "picked_up", "delivered"]

const nextStatusLabel: Record<string, string> = {
  assigned: "تأكيد الاستلام",
  picked_up: "تأكيد التسليم",
}

export default function TaskCard({ order }: { order: Order | null }) {
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">لا توجد مهام حالياً</p>
        <p className="text-gray-400 text-sm mt-1">انتظر حتى يسند لك الموزع طلباً جديداً</p>
      </div>
    )
  }

  const currentStep = statusFlow.indexOf(order.status)
  const isComplete = order.status === "delivered"

  const handleUpdateStatus = async () => {
    setUpdating(true)
    const nextIndex = currentStep + 1
    if (nextIndex < statusFlow.length) {
      const newStatus = statusFlow[nextIndex]
      await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", order.id)

      // Update driver status
      if (order.driver_id) {
        if (newStatus === "picked_up") {
          await supabase
            .from("users")
            .update({ status: "on_delivery" })
            .eq("id", order.driver_id)
        } else if (newStatus === "delivered") {
          await supabase
            .from("users")
            .update({ status: "available" })
            .eq("id", order.driver_id)
        }
      }

      // Award trust points on delivery
      if (newStatus === "delivered" && order.driver_id) {
        await supabase
          .from("gamification_logs")
          .insert({
            driver_id: order.driver_id,
            order_id: order.id,
            points_awarded: 1,
            reason: "تم التسليم بنجاح في الوقت المحدد",
          })

        const { data: driver } = await supabase
          .from("users")
          .select("trust_score")
          .eq("id", order.driver_id)
          .single()

        if (driver) {
          const newScore = Math.min(100, Math.max(0, (driver.trust_score ?? 100) + 1))
          await supabase
            .from("users")
            .update({ trust_score: newScore })
            .eq("id", order.driver_id)
        }
      }
    }
    setUpdating(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Status Progress Bar */}
      <div className="flex items-center gap-0">
        {statusFlow.map((s, i) => (
          <div
            key={s}
            className={cn(
              "flex-1 h-1.5",
              i <= currentStep ? "bg-cyan-500" : "bg-gray-200"
            )}
          />
        ))}
      </div>

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{order.order_number}</span>
              {order.priority === "urgent" && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  عاجل
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">{order.delivery_zone}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <MapPin className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-amber-600 font-medium">من</p>
              <p className="text-sm font-semibold text-gray-900">{order.sender_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <MapPin className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-green-600 font-medium">إلى</p>
              <p className="text-sm font-semibold text-gray-900">{order.recipient_name}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isComplete && (
          <button
            onClick={handleUpdateStatus}
            disabled={updating}
            className={cn(
              "w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all",
              "bg-gradient-to-l from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600",
              "shadow-lg shadow-cyan-200 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {updating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {nextStatusLabel[order.status]}
                <ChevronLeft className="h-5 w-5" />
              </>
            )}
          </button>
        )}
        {isComplete && (
          <div className="w-full py-3 rounded-lg bg-green-50 text-green-700 font-semibold text-center">
            تم التسليم بنجاح ✓
          </div>
        )}
      </div>
    </div>
  )
}
