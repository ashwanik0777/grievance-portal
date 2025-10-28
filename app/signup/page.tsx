"use client"

import Link from "next/link"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartCityFix</h1>
          <p className="text-gray-600">Join our community and make a difference</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

          <SignupForm />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
