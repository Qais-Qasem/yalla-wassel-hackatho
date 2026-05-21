"use server"

import { createClient } from "@/lib/supabase/server"

export async function awardPoints(driverId: string, orderId: string, points: number, reason: string) {
  const supabase = await createClient()

  const { error: logError } = await supabase
    .from("gamification_logs")
    .insert({
      driver_id: driverId,
      order_id: orderId,
      points_awarded: points,
      reason,
    })

  if (logError) throw new Error(logError.message)

  const { data: driver } = await supabase
    .from("users")
    .select("trust_score")
    .eq("id", driverId)
    .single()

  if (driver) {
    const newScore = Math.min(100, Math.max(0, (driver.trust_score ?? 100) + points))
    const { error: updateError } = await supabase
      .from("users")
      .update({ trust_score: newScore })
      .eq("id", driverId)

    if (updateError) throw new Error(updateError.message)
  }

  return { success: true }
}
