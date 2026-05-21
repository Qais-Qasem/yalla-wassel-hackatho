import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { driverId, orderId, points, reason } = await request.json()

  const { error: logError } = await supabase
    .from("gamification_logs")
    .insert({
      driver_id: driverId,
      order_id: orderId,
      points_awarded: points,
      reason,
    })

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 })
  }

  const { data: driver } = await supabase
    .from("users")
    .select("trust_score")
    .eq("id", driverId)
    .single()

  if (driver) {
    const newScore = Math.min(100, Math.max(0, (driver.trust_score ?? 100) + points))
    await supabase
      .from("users")
      .update({ trust_score: newScore })
      .eq("id", driverId)
  }

  return NextResponse.json({ success: true })
}
