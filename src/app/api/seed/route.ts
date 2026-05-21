import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not set. Add it in Vercel → Environment Variables" },
      { status: 500 }
    )
  }

  const supabase = createClient(
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

  const results = []

  for (const user of demoUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    })

    if (error) {
      results.push({ email: user.email, error: error.message })
    } else {
      results.push({ email: user.email, status: "created/updated", id: data.user.id })
    }
  }

  return NextResponse.json({ results })
}
