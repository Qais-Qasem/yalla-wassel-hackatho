import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    key ? { auth: { autoRefreshToken: false, persistSession: false } } : undefined
  )

  const tables = ["users", "orders", "gamification_logs"]
  const results: Record<string, any> = {}

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*")
    results[table] = { count: data?.length ?? 0, error: error?.message ?? null }
  }

  const { data: authList } = await supabase.auth.admin.listUsers()

  return NextResponse.json({
    tables: results,
    auth_users: authList?.users.map((u) => ({ email: u.email, id: u.id })) ?? [],
    has_service_key: !!key,
  })
}
