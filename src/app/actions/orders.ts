"use server"

import { createClient } from "@/lib/supabase/server"

export async function assignDriver(orderId: string, driverId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("orders")
    .update({
      driver_id: driverId,
      status: "assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) throw new Error(error.message)
  return { success: true }
}
