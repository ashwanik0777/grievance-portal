"use client"

import { useState } from "react"
import Link from "next/link"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"user" | "admin">("user")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartCityFix</h1>
          <p className="text-gray-600">Report issues, earn points, make a difference</p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setLoginType("user")}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
              loginType === "user" ? "bg-emerald-600 text-white" : "bg-transparent text-gray-700 hover:text-gray-900"
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setLoginType("admin")}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
              loginType === "admin" ? "bg-emerald-600 text-white" : "bg-transparent text-gray-700 hover:text-gray-900"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {loginType === "user" ? "User Login" : "Admin Login"}
          </h2>

          <LoginForm userType={loginType} />

          {loginType === "user" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm mb-4">Demo credentials:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700 space-y-1">
                <p>Email: user@example.com</p>
                <p>Password: password123</p>
              </div>
            </div>
          )}

          {loginType === "admin" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm mb-4">Demo admin credentials:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700 space-y-1">
                <p>Email: admin@example.com</p>
                <p>Password: admin123</p>
              </div>
            </div>
          )}
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
