"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, User, LogOut, Truck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRef } from "react"

const navItems = [
  { href: "/driver", label: "المهام", icon: ClipboardList },
  { href: "/driver/profile", label: "ملفي", icon: User },
]

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  const handleLogout = async () => {
    await getSupabase().auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Bottom Nav */}
      <div className="max-w-lg mx-auto px-4 py-4 pb-20">
        {children}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
                  pathname === item.href
                    ? "text-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <item.icon className="h-6 w-6" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-6 w-6" />
              خروج
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
