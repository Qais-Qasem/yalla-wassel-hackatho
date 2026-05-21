"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Truck, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  const handleLogin = async (emailInput?: string, passInput?: string) => {
    const e = emailInput || password
    const p = passInput || password

    setLoading(true)
    setError(null)

    const authResult = await getSupabase().auth.signInWithPassword({ email: e, password: p })

    if (authResult.error) {
      setError(authResult.error.message)
      setLoading(false)
      return
    }

    if (authResult.data.user) {
      const { data: profile } = await getSupabase()
        .from("users")
        .select("role")
        .eq("id", authResult.data.user.id)
        .single()

      const target = profile?.role === "driver" ? "/driver" : "/dispatcher"
      router.push(target)
      router.refresh()
    }
  }

  const quickLogin = (email: string) => {
    setEmail(email)
    setPassword("Demo@123")
    handleLogin(email, "Demo@123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Truck className="h-8 w-8 text-cyan-600" />
            <span className="text-2xl font-bold text-gray-900">يلا وصل</span>
          </Link>
          <p className="mt-2 text-gray-500">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yalla-wassel.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2.5 rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

          {/* Demo Quick Login */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-amber-800 text-center">🔑 دخول سريع للعرض التجريبي</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => quickLogin("hadeel@demo.com")}
                className="flex-1 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 text-xs font-medium py-2 rounded-lg transition-colors">
                📋 الموزعة
              </button>
              <button type="button" onClick={() => quickLogin("mahmoud@demo.com")}
                className="flex-1 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 text-xs font-medium py-2 rounded-lg transition-colors">
                🚚 السائق
              </button>
              <a href="/track/demo" target="_blank"
                className="flex-1 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 text-xs font-medium py-2 rounded-lg text-center transition-colors block">
                🔗 التتبع
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            تم الإنشاء بواسطة طلاب جامعة البترا - IEEE Petra Student Branch
          </p>
        </form>
      </div>
    </div>
  )
}
