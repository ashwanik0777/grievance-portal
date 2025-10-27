import Link from "next/link"
import { ArrowRight, MapPin, Trophy, Users, Award, TrendingUp } from "lucide-react"
import StatsCard from "@/components/stats-card"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Impact</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Join thousands of citizens making a real difference in their communities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StatsCard icon={MapPin} label="Issues Reported" value="2,847" trend="↑ 12% this month" />
            <StatsCard icon={Users} label="Active Contributors" value="1,234" trend="↑ 8% this month" />
            <StatsCard icon={Trophy} label="Issues Resolved" value="1,956" trend="↑ 15% this month" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Simple steps to make your city better</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "1",
                icon: MapPin,
                title: "Report an Issue",
                description: "Spot a problem in your city? Take a photo and report it with location details.",
              },
              {
                step: "2",
                icon: Award,
                title: "Earn Points",
                description: "Get rewarded with points for every valid report you submit.",
              },
              {
                step: "3",
                icon: TrendingUp,
                title: "Climb the Leaderboard",
                description: "Compete with other citizens and unlock exclusive games and rewards.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 text-center hover:shadow-lg hover:border-emerald-200 transition-all group"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Choose SmartCityFix?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Everything you need to make a real impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                title: "Real-Time Tracking",
                description: "Monitor your reports and see them get resolved in real-time",
              },
              {
                title: "Gamified Experience",
                description: "Earn badges, unlock achievements, and compete with friends",
              },
              { title: "Community Rewards", description: "Get exclusive perks and rewards for your contributions" },
              { title: "Mobile Friendly", description: "Report issues on-the-go with our mobile-optimized platform" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 hover:shadow-lg hover:border-emerald-200 transition-all"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg sm:text-xl text-emerald-100 mb-8 leading-relaxed">
            Start reporting city issues and earning points today. Join our community of change-makers!
          </p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-all hover:shadow-lg active:scale-95"
          >
            Report Your First Issue <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
