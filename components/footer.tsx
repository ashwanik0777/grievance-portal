import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-lg text-white">SmartCityFix</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Making cities cleaner, one report at a time. Join our community of change-makers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail size={16} /> support@smartcityfix.com
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone size={16} /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin size={16} /> Worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>
            &copy; 2025 SmartCityFix. All rights reserved. |{" "}
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
