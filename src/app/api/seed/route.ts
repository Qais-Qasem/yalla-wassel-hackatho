import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY missing. Add it in Vercel → Environment Variables." },
      { status: 500 }
    )
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const demoUsers = [
    { email: "hadeel@demo.com", password: "Demo@123" },
    { email: "mahmoud@demo.com", password: "Demo@123" },
    { email: "wael@demo.com", password: "Demo@123" },
    { email: "sami@demo.com", password: "Demo@123" },
  ]

  // 1. Create or get auth users
  const authIds: Record<string, string> = {}

  for (const { email, password } of demoUsers) {
    // Try to get existing user first
    const { data: existing } = await sb.auth.admin.listUsers()
    const found = existing?.users?.find((u) => u.email === email)

    if (found) {
      authIds[email] = found.id
    } else {
      const { data, error } = await sb.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (error) return NextResponse.json({ error: `${email}: ${error.message}` }, { status: 500 })
      authIds[email] = data.user.id
    }
  }

  // 2. Sync public tables — delete in FK order, re-insert with auth UUIDs
  await sb.from("gamification_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await sb.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await sb.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const userData = [
    {
      id: authIds["hadeel@demo.com"],
      role: "dispatcher",
      full_name: "هديل",
      email: "hadeel@demo.com",
      phone_number: "0791111111",
      region: "عمان",
      status: "available",
      trust_score: 100,
    },
    {
      id: authIds["mahmoud@demo.com"],
      role: "driver",
      full_name: "محمود سالم",
      email: "mahmoud@demo.com",
      phone_number: "0792222222",
      region: "غرب عمان",
      status: "available",
      trust_score: 95,
    },
    {
      id: authIds["wael@demo.com"],
      role: "driver",
      full_name: "وائل عودة",
      email: "wael@demo.com",
      phone_number: "0793333333",
      region: "شرق عمان",
      status: "available",
      trust_score: 88,
    },
    {
      id: authIds["sami@demo.com"],
      role: "driver",
      full_name: "سامي ناصر",
      email: "sami@demo.com",
      phone_number: "0794444444",
      region: "وسط عمان",
      status: "on_delivery",
      trust_score: 72,
    },
  ]

  const { error: userError } = await sb.from("users").insert(userData)
  if (userError) return NextResponse.json({ error: `users insert: ${userError.message}` }, { status: 500 })

  // 3. Seed orders
  const { data: existingOrders } = await sb.from("orders").select("id").limit(1)
  if (existingOrders && existingOrders.length === 0) {
    const mahmoudId = authIds["mahmoud@demo.com"]
    const waelId = authIds["wael@demo.com"]
    const samiId = authIds["sami@demo.com"]

    await sb.from("orders").insert([
      {
        order_number: "ORD-1001",
        driver_id: samiId,
        sender_name: "مطبخ ماما",
        recipient_name: "أحمد علي",
        delivery_zone: "خلدا",
        priority: "urgent",
        status: "picked_up",
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        order_number: "ORD-1002",
        driver_id: mahmoudId,
        sender_name: "صيدلية البرج",
        recipient_name: "سارة خالد",
        delivery_zone: "عبدون",
        priority: "normal",
        status: "assigned",
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        order_number: "ORD-1003",
        driver_id: null,
        sender_name: "مخبز القدس",
        recipient_name: "محمود عيسى",
        delivery_zone: "الشميساني",
        priority: "normal",
        status: "pending",
      },
      {
        order_number: "ORD-1004",
        driver_id: null,
        sender_name: "متجر الرفاعي",
        recipient_name: "ليلى حسن",
        delivery_zone: "غرب عمان",
        priority: "urgent",
        status: "pending",
      },
      {
        order_number: "ORD-1005",
        driver_id: waelId,
        sender_name: "مطعم البستان",
        recipient_name: "نور الدين",
        delivery_zone: "جبل عمان",
        priority: "normal",
        status: "assigned",
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ])
  }

  return NextResponse.json({
    success: true,
    auth_users: authIds,
  })
}
