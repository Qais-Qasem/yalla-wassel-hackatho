import Link from "next/link"
import { Truck, Shield, Trophy, Smartphone, ArrowLeft, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-cyan-600" />
              <span className="text-xl font-bold text-gray-900">يلا وصل</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/demo"
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700 px-3 py-2 rounded-md"
              >
                العرض التجريبي
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                تسجيل الدخول
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                ثقة بلا مراقبة
                <span className="block text-cyan-600 mt-2">توصيل بلا حدود</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                منصة لوجستية ذكية تحوّل المراقبة إلى مساءلة ذاتية. 
                نظام التلعيب ومؤشرات الثقة يمنح سائقيك الكرامة التي يستحقونها، 
                ويمنحك الشفافية التي تحتاجها.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-end">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200"
                >
                  جرب العرض التجريبي
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  تسجيل الدخول
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full blur-3xl opacity-20" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-lg p-4 border-r-4 border-amber-400">
                      <p className="text-sm font-semibold text-amber-800">مؤشر الثقة: 95</p>
                      <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-amber-500 rounded-full" />
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border-r-4 border-green-400">
                      <p className="text-sm font-semibold text-green-800">تم التسليم - 15:30</p>
                      <p className="text-xs text-green-600 mt-1">+10 نقاط</p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-4 border-r-4 border-cyan-400">
                      <p className="text-sm font-semibold text-cyan-800">المركز الأول في لوحة الشرف</p>
                      <p className="text-xs text-cyan-600 mt-1">محمد سالم - 450 نقطة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">لماذا يلا وصل؟</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            نعيد تعريف العلاقة بين الإدارة والسائقين من خلال الشفافية والثقة
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">نظام التلعيب</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                حوّل التوصيل إلى منافسة إيجابية. اكسب النقاط، ارتقِ في لوحة الشرف، 
                وحوّل ضغط العمل إلى تحدٍ ممتع.
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl p-6 border border-cyan-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">مؤشر الثقة</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                مساءلة ذاتية بدلاً من المراقبة. كلما التزمت بالتحديثات، ارتفعت ثقتك 
                وزادت استقلاليتك.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تحديثات لحظية</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                يعلم العميل والموزع بكل تغيير في حالة الطلب فوراً، 
                بدون خرائط ولا تتبع دقيق.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">كيف يعمل النظام؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">يُسند الطلب</h3>
              <p className="text-gray-500 text-sm">الموزع يُسند الطلب لسائق بناءً على منطقته وتوافره</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">يُحدّث السائق</h3>
              <p className="text-gray-500 text-sm">السائق يضغط على زر لتحديث الحالة: استلمت، في الطريق، تم</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">يُكافأ الأداء</h3>
              <p className="text-gray-500 text-sm">يكسب نقاط ثقة، وتتحدّث لوحة الشرف، ويرتفع مؤشره</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-cyan-600" />
            <span className="font-semibold text-gray-900">يلا وصل</span>
          </div>
          <p className="text-sm text-gray-500">نظام التوصيل الذكي القائم على الثقة</p>
        </div>
      </footer>
    </div>
  )
}
