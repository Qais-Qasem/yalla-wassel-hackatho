"use client"

import { useState } from "react"
import Link from "next/link"
import { Truck, Shield, Trophy, Smartphone, Eye, ArrowLeft, Play, ChevronLeft, ChevronRight, Star, MapPin, CheckCircle, User } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "المشكلة",
    icon: Eye,
    color: "red",
    content: (
      <div className="space-y-4">
        <div className="bg-red-50 border-r-4 border-red-400 p-4 rounded-lg">
          <p className="font-bold text-red-800">هديل، 34 سنة</p>
          <p className="text-sm text-red-700 mt-1">مديرة توصيل عندها 8 سائقين في عمان</p>
        </div>
        <p className="text-gray-700">
          قبل شهرين ركّبت أجهزة GPS على كل دراجة "عشان تخلي السائقين أمناء".
        </p>
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="font-semibold text-amber-800">❌ النتيجة:</p>
          <ul className="text-sm text-amber-700 mt-2 space-y-1">
            <li>• ٣ سائقين استقالوا خلال أسبوع</li>
            <li>• الباقي بدأوا يأخذون استراحات أطول</li>
            <li>• سائق قالها بصراحة: <strong>&quot;أنا مش سجين&quot;</strong></li>
          </ul>
        </div>
        <div className="bg-gradient-to-l from-cyan-600 to-cyan-700 text-white p-4 rounded-lg text-center">
          <p className="font-bold text-lg">المشكلة المركزية</p>
          <p className="text-sm mt-1 opacity-90">بدنا نظام يحاسب على التوصيل بدون ما يحوّل يوم السائق لسجن</p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "الحل: ثقة بلا مراقبة",
    icon: Shield,
    color: "cyan",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 font-medium text-center text-lg">بدال GPS للمراقبة ← ثقة + مساءلة ذاتية</p>
        <div className="grid gap-3">
          <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
            <p className="font-semibold text-cyan-800">🎯 التحديث الذاتي</p>
            <p className="text-sm text-cyan-700">السائق بنفسه يحدّث الحالة: استلمت ← في الطريق ← تم</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="font-semibold text-amber-800">⭐ Trust Score</p>
            <p className="text-sm text-amber-700">كل توصيلة ناجحة ترفع score. السائق الملتزم يحصل استقلالية أكثر</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-semibold text-green-800">🏆 Leaderboard</p>
            <p className="text-sm text-green-700">منافسة إيجابية بين السائقين بدل الرقابة</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">الزبون يتتبع بدون GPS والموزع يشوف الصورة الكاملة بدون ما يدير كل تفصيلة</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "جرب بنفسك — دور الزبون",
    icon: Eye,
    color: "green",
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="font-semibold text-green-800">👤 كزبون:</p>
          <p className="text-sm text-green-700 mt-1">أبي أعرف وين طلبيتي وإيمتى راح توصل ومين السائق</p>
        </div>
        <div className="text-center">
          <Link href="/track/demo" target="_blank"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
            <Play className="h-5 w-5" />
            جرب التتبع المباشر
          </Link>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 text-center">
          ينفتح في تبويبة جديدة — شوف التتبع يتقدم live
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "جرب بنفسك — دور الموزع",
    icon: User,
    color: "amber",
    content: (
      <div className="space-y-4">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="font-semibold text-amber-800">📋 كموزعة (هديل):</p>
          <p className="text-sm text-amber-700 mt-1">بدي صورة كاملة، وقدرة أتدخل عند الحاجة، بدون GPS</p>
        </div>
        <div className="text-center">
          <a href="/login" target="_blank"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200">
            فتح صفحة الدخول
          </a>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <p className="font-semibold text-gray-700 mb-2">ادخل كـ الموزعة:</p>
          <p className="text-gray-600">إيميل: <span dir="ltr" className="font-mono bg-white px-2 py-0.5 rounded">hadeel@demo.com</span></p>
          <p className="text-gray-600">باسورد: <span className="font-mono bg-white px-2 py-0.5 rounded">Demo@123</span></p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "جرب بنفسك — دور السائق",
    icon: Truck,
    color: "blue",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="font-semibold text-blue-800">🚚 كسائق (محمود):</p>
          <p className="text-sm text-blue-700 mt-1">بدي تعليمات واضحة، عبء عمل عادل، وكرامة. مش شاشة تصرخ في وجهي</p>
        </div>
        <div className="text-center">
          <a href="/login" target="_blank"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            فتح صفحة الدخول
          </a>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <p className="font-semibold text-gray-700 mb-2">ادخل كـ السائق:</p>
          <p className="text-gray-600">إيميل: <span dir="ltr" className="font-mono bg-white px-2 py-0.5 rounded">mahmoud@demo.com</span></p>
          <p className="text-gray-600">باسورد: <span className="font-mono bg-white px-2 py-0.5 rounded">Demo@123</span></p>
          <p className="text-xs text-gray-400 mt-2">💡 صغّر عرض المتصفح (300px) عشان تشوف واجهة الجوال</p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "سيناريو كامل",
    icon: Trophy,
    color: "purple",
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-200">
          <h3 className="font-bold text-purple-800 text-center mb-3">🔄 جرب القصة كاملة</h3>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <span><strong>ادخل كـ الموزعة</strong> — شوف لوحة التحكم، أسند طلب لسائق من المنطقة المناسبة</span>
            </li>
            <li className="flex gap-2">
              <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <span><strong>سجّل خروج، ادخل كـ السائق</strong> — شوف المهمة وصلتك، اضغط "تأكيد الاستلام" ثم "تأكيد التسليم"</span>
            </li>
            <li className="flex gap-2">
              <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <span><strong>ارجع للموزعة</strong> — شوف حالة الطلب تغيّرت، ومؤشر ثقة السائق ارتفع</span>
            </li>
            <li className="flex gap-2">
              <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
              <span><strong>افتح تتبع الطلب</strong> — جرب محاكاة التوصيل المباشر وشوف التقدم</span>
            </li>
          </ol>
        </div>
        <div className="bg-gray-900 text-white p-4 rounded-lg text-center text-sm">
          <p>🎯 <strong>الثقة مشت في الاتجاهين:</strong> الموزعة شايفة كلشي بدون GPS، والسائق عنده كرامته + نقاطه + لوحة الشرف</p>
        </div>
      </div>
    ),
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; btn: string }> = {
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", btn: "bg-red-600 hover:bg-red-700" },
  cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", btn: "bg-cyan-600 hover:bg-cyan-700" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", btn: "bg-green-600 hover:bg-green-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", btn: "bg-amber-600 hover:bg-amber-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", btn: "bg-blue-600 hover:bg-blue-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", btn: "bg-purple-600 hover:bg-purple-700" },
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]
  const colors = colorMap[step.color]
  const totalSteps = steps.length

  const next = () => setCurrentStep(Math.min(currentStep + 1, totalSteps - 1))
  const prev = () => setCurrentStep(Math.max(currentStep - 1, 0))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-cyan-600" />
            <span className="font-bold text-gray-900">يلا وصل</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="hidden sm:inline">هاكاثون ٢٠٢٦</span>
            <span>{currentStep + 1}/{totalSteps}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-l from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
              {step.icon && <step.icon className={`h-5 w-5 ${colors.text}`} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{step.title}</h2>
              <p className="text-xs text-gray-500">الخطوة {currentStep + 1} من {totalSteps}</p>
            </div>
          </div>
          {step.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </button>

          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStep
                    ? "bg-cyan-600 w-6"
                    : i < currentStep
                    ? "bg-cyan-300"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-700 transition-colors shadow-sm"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors shadow-sm"
            >
              الصفحة الرئيسية
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 text-center mb-3">روابط سريعة</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/track/demo" target="_blank"
              className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100">
              🔗 تتبع طلب
            </Link>
            <Link href="/login" target="_blank"
              className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100">
              📋 دخول الموزعة
            </Link>
            <Link href="/login" target="_blank"
              className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100">
              🚚 دخول السائق
            </Link>
            <a href="https://github.com/Qais-Qasem/yalla-wassel-hackatho" target="_blank"
              className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100">
              💻 GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
