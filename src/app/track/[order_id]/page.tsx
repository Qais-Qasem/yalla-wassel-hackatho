"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import OrderStepper from "@/components/tracking/order-stepper"
import { Truck, Loader2, MapPin, Store, PhoneCall, Play } from "lucide-react"

interface Order {
  id: string
  order_number: string
  sender_name: string
  recipient_name: string
  delivery_zone: string
  status: string
  driver_id: string | null
}

interface Driver {
  full_name: string
  phone_number: string
}

export default function TrackOrderPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const [simulating, setSimulating] = useState(false)

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }
    loadOrder()
  }, [params.order_id])

  const loadOrder = async () => {
    const orderId = params.order_id as string
    if (orderId === "demo") {
      startSimulation()
      return
    }

    let { data: orderData } = await supabase
      .from("orders")
      .select("*, driver:driver_id(full_name, phone_number)")
      .eq("order_number", orderId)
      .single()

    if (!orderData) {
      const { data: byId } = await supabase
        .from("orders")
        .select("*, driver:driver_id(full_name, phone_number)")
        .eq("id", orderId)
        .single()
      orderData = byId
    }

    if (orderData) {
      setOrder(orderData)
      if (orderData.driver) setDriver(orderData.driver as unknown as Driver)
      subscribeToOrder(orderData.id)
    }
    setLoading(false)
  }

  const startSimulation = useCallback(async () => {
    setSimulating(true)
    setLoading(false)
    setDriver({ full_name: "محمود سالم", phone_number: "0792222222" })
    setOrder({
      id: "demo",
      order_number: "DEMO-001",
      sender_name: "مخبز القدس",
      recipient_name: "محمود عيسى",
      delivery_zone: "الشميساني",
      status: "pending",
      driver_id: "demo-driver",
    })

    const simSteps = [
      { status: "assigned", delay: 2500 },
      { status: "picked_up", delay: 5000 },
      { status: "delivered", delay: 7500 },
    ]

    for (let i = 0; i < simSteps.length; i++) {
      await new Promise(r => setTimeout(r, simSteps[i].delay))
      setOrder(prev =>
        prev
          ? { ...prev, status: simSteps[i].status }
          : prev
      )
    }
    setSimulating(false)
  }, [])

  const subscribeToOrder = (orderId: string) => {
    channelRef.current = supabase
      .channel(`track-${orderId}-${crypto.randomUUID()}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        const updated = payload.new as Order
        setOrder(updated)
        if (updated.driver_id) {
          supabase.from("users").select("full_name, phone_number").eq("id", updated.driver_id).single().then(({ data }) => {
            if (data) setDriver(data)
          })
        }
      })
      .subscribe()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Truck className="h-12 w-12 text-cyan-300 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-500">جارٍ تحميل بيانات التتبع...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">الطلب غير موجود</h1>
          <p className="text-gray-500">تحقق من رقم التتبع وحاول مرة أخرى</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Truck className="h-6 w-6 text-cyan-600" />
            <span className="text-lg font-bold text-gray-900">يلا وصل</span>
          </div>
          <p className="text-gray-500 text-sm">تتبع الطلب</p>
        </div>

        {/* Route Visualization */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">من</p>
              <p className="text-sm font-semibold text-gray-900">{order.sender_name}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-gradient-to-b from-amber-400 to-green-400 rounded-full" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">إلى</p>
              <p className="text-sm font-semibold text-gray-900">{order.recipient_name}</p>
              <p className="text-xs text-gray-400">{order.delivery_zone}</p>
            </div>
          </div>
          {driver && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-xs">
                  {driver.full_name?.slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">السائق</p>
                  <p className="text-sm font-semibold text-gray-900">{driver.full_name}</p>
                </div>
              </div>
              <a href={`tel:${driver.phone_number}`} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                <PhoneCall className="h-3 w-3" />
                اتصل
              </a>
            </div>
          )}
        </div>

        {/* Order Info Badge */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">رقم الطلب</span>
          <span className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg" dir="ltr">{order.order_number}</span>
        </div>

        {/* Stepper */}
        <OrderStepper
          currentStatus={order.status}
          driverName={driver?.full_name}
          driverPhone={driver?.phone_number}
          orderNumber={order.order_number}
        />

        {/* Demo Simulation Button */}
        {params.order_id === "demo" && !simulating && (
          <button
            onClick={startSimulation}
            className="mt-4 w-full bg-gradient-to-l from-cyan-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-cyan-200 hover:from-cyan-700 hover:to-cyan-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            محاكاة تجربة التوصيل المباشر
          </button>
        )}
        {params.order_id === "demo" && simulating && (
          <div className="mt-4 bg-cyan-50 border border-cyan-200 text-cyan-700 py-3 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري محاكاة التوصيل...
          </div>
        )}
      </div>
    </div>
  )
}
