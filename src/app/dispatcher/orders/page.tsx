"use client"

import OrdersTable from "@/components/dispatcher/orders-table"
import { Package } from "lucide-react"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
          <Package className="h-5 w-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-1">جميع طلبات التوصيل</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <OrdersTable />
      </div>
    </div>
  )
}
