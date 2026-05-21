"use client"

import { Shield, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustScoreCardProps {
  score: number
  trend?: number
}

export default function TrustScoreCard({ score, trend = 0 }: TrustScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-green-600"
    if (s >= 70) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (s: number) => {
    if (s >= 90) return "bg-green-50 border-green-200"
    if (s >= 70) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  const getBarColor = (s: number) => {
    if (s >= 90) return "bg-green-500"
    if (s >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("rounded-xl border p-6", getScoreBg(score))}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">مؤشر الثقة</span>
        <Shield className={cn("h-6 w-6", getScoreColor(score))} />
      </div>
      <p className={cn("text-4xl font-bold", getScoreColor(score))}>{score}</p>
      <div className="mt-3 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      {trend !== 0 && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trend > 0 ? "text-green-600" : "text-red-600")}>
          {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend > 0 ? "+" : ""}{trend} نقطة هذا الأسبوع
        </div>
      )}
    </div>
  )
}
