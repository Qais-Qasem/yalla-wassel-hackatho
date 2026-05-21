"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"

const steps = [
  { key: "pending", label: "قيد المعالجة", desc: "جاري تجهيز الطلب" },
  { key: "assigned", label: "تم تعيين سائق", desc: "سائق في طريقه للمتجر" },
  { key: "picked_up", label: "في الطريق إليك", desc: "السائق قادم إليك الآن" },
  { key: "delivered", label: "تم التسليم", desc: "تم تسليم الطلب بنجاح 🎉" },
]

const statusToStepIndex: Record<string, number> = {
  pending: 0, assigned: 1, picked_up: 2, delivered: 3,
}

export default function OrderStepper({
  currentStatus,
  driverName,
  driverPhone,
  orderNumber,
}: {
  currentStatus: string
  driverName?: string
  driverPhone?: string
  orderNumber?: string
}) {
  const currentStep = statusToStepIndex[currentStatus] ?? 0
  const [elapsed, setElapsed] = useState("0 دقيقة")

  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const mins = Math.floor((Date.now() - start) / 60000)
      if (mins < 1) setElapsed("أقل من دقيقة")
      else if (mins < 60) setElapsed(`${mins} دقيقة`)
      else setElapsed(`${Math.floor(mins / 60)} ساعة و ${mins % 60} دقيقة`)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const progressPct = Math.round((currentStep / (steps.length - 1)) * 100)

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">حالة الطلب</span>
          <span className="text-sm font-bold text-cyan-600">{progressPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-amber-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Animated Truck Indicator */}
      {currentStatus === "picked_up" && (
        <div className="bg-gradient-to-l from-cyan-500 to-cyan-600 rounded-xl p-5 text-white text-center shadow-lg shadow-cyan-200 animate-pulse">
          <Truck className="h-10 w-10 mx-auto mb-2 animate-bounce" />
          <p className="text-lg font-bold">السائق في الطريق إليك!</p>
          <p className="text-sm text-white/80 mt-1">جهّز نفسك لاستلام الطلب</p>
        </div>
      )}

      {currentStatus === "delivered" && (
        <div className="bg-gradient-to-l from-green-500 to-green-600 rounded-xl p-5 text-white text-center shadow-lg shadow-green-200">
          <CheckCircle className="h-10 w-10 mx-auto mb-2" />
          <p className="text-lg font-bold">تم التسليم بنجاح!</p>
          <p className="text-sm text-white/80 mt-1">نتمنى لك وجبة شهية 🎉</p>
        </div>
      )}

      {/* Driver Info */}
      {driverName && currentStatus !== "pending" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm">
            {driverName.slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{driverName}</p>
            <p className="text-xs text-gray-500">{driverPhone || ""}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {elapsed}
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="relative">
          <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div
            className="absolute right-4 top-0 w-0.5 bg-cyan-500 transition-all duration-700"
            style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          <div className="space-y-8 relative">
            {steps.map((step, i) => {
              const isActive = i <= currentStep
              const isCurrent = i === currentStep
              return (
                <div key={step.key} className="flex items-center gap-4 relative">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                      isActive
                        ? "bg-cyan-500 text-white shadow-md shadow-cyan-200"
                        : "bg-gray-100 text-gray-400",
                      isCurrent && "ring-4 ring-cyan-100 animate-pulse"
                    )}
                  >
                    {i === 0 && <Package className="h-4 w-4" />}
                    {i === 1 && <MapPin className="h-4 w-4" />}
                    {i === 2 && <Truck className={cn("h-4 w-4", isCurrent && "animate-bounce")} />}
                    {i === 3 && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-semibold", isActive ? "text-gray-900" : "text-gray-400")}>
                      {step.label}
                    </p>
                    <p className={cn("text-xs", isActive ? "text-gray-500" : "text-gray-300")}>
                      {step.desc}
                    </p>
                    {isCurrent && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded-full font-medium">
                        جاري...
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
