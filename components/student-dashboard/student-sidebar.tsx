"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HelpCenter from "./help-center"
import {
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Award,
  Users,
  FolderOpen,
  DollarSign,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BASE_URL, authFetch, clearAuthStorage, getAccessTokenFromStorage, getUserFromStorage } from "@/lib/auth"

const navigationLinks = [
  { href: "/student/profile", label: "My profile", icon: Home },
  { href: "/student/personal-information", label: "Personal information", icon: FileText },
  { href: "/student/educational-information", label: "Educational information", icon: GraduationCap },
  { href: "/student/application-documents", label: "Application documents", icon: FolderOpen },
  { href: "/student/certificates", label: "Certificates", icon: Award },
  { href: "/student/financial-documents", label: "Financial documents", icon: DollarSign },
  { href: "/student/my-family", label: "My family", icon: Users },
  { label: "Browse Universities", href: "/student/browse-universities", icon: Search },
  { href: "/student/my-applications", label: "My applications", icon: CreditCard },
]

export default function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [fullName, setFullName] = useState<string>("")

  const handleLogout = () => {
    clearAuthStorage()
    router.push("/")
  }

  useEffect(() => {
    const token = getAccessTokenFromStorage()
    // Try fast path from stored user
    const storedUser = getUserFromStorage<any>()
    if (storedUser && typeof storedUser.full_name === "string" && storedUser.full_name) {
      setFullName(storedUser.full_name)
    }
    if (!token) return
    const load = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/api/me/profile/`)
        if (!res.ok) return
        const data = await res.json()
        if (typeof data?.full_name === "string") setFullName(data.full_name)
      } catch {}
    }
    load()
  }, [])

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50">
      {/* Profile */}
      <div className="p-6 text-center border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-inner">
          <Home className="h-8 w-8 text-purple-700" />
        </div>
        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide leading-tight">
          {fullName ? fullName.toUpperCase() : "STUDENT"}
        </h2>
        <p className="text-xs text-gray-500 mt-1">Student Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-white">
        {navigationLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors shrink-0",
                  isActive ? "text-white" : "text-purple-600 group-hover:text-purple-700"
                )}
              />
              <span className="truncate">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Help Center — compact */}
      <div className="border-t border-gray-100 px-4 py-2 bg-white">
        <div className="rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-xs p-3 shadow-sm">
          <p className="font-medium mb-1 flex items-center justify-between">
            Help Center
            <span className="text-[10px] text-purple-600 font-normal">24/7</span>
          </p>
          <p className="text-[11px] text-gray-600 mb-2 leading-tight">
            Need assistance or have a question?
          </p>
          <Button
            size="sm"
            className="w-full h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
          >
            Send message
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto bg-white">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
