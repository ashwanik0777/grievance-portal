import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-block mb-4 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
              ✨ Community-Driven Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Fix Your City, Earn Rewards
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              SmartCityFix is a community-driven platform where citizens report local issues and earn points for making
              their city cleaner and safer.
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {[
                "Report issues with photos and location",
                "Earn points for every valid report",
                "Compete on leaderboards and unlock rewards",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/report"
                className="bg-emerald-500 text-white hover:bg-emerald-600 px-8 py-3 rounded-lg font-bold inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
              >
                Report an Issue <ArrowRight size={20} />
              </Link>
              <Link
                href="/leaderboard"
                className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-8 py-3 rounded-lg font-bold inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
              >
                View Leaderboard
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:block animate-scale-in">
            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl p-8 border border-emerald-100">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-slate-900">Recent Reports</p>
                  <p className="text-slate-600 text-sm mt-1">Pothole on Main Street</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-semibold">
                      Pending
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-semibold">+50 pts</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-slate-900">Your Points</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">450 pts</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-slate-900">Your Rank</p>
                  <p className="text-slate-600 text-sm mt-1">#12 on Leaderboard 🏆</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
