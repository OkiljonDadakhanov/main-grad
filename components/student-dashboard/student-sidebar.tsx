"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ContactSupportModal from "./contact-support-modal"
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
import { useI18n } from "@/lib/i18n"

const navigationLinks = [
  { href: "/student/profile", labelKey: "nav.myProfile", icon: Home },
  { href: "/student/personal-information", labelKey: "nav.personalInfo", icon: FileText },
  { href: "/student/educational-information", labelKey: "nav.educationalInfo", icon: GraduationCap },
  { href: "/student/certificates", labelKey: "nav.certificates", icon: Award },
  { href: "/student/financial-documents", labelKey: "nav.financialDocs", icon: DollarSign },
  { href: "/student/my-family", labelKey: "nav.myFamily", icon: Users },
  { href: "/student/browse-universities", labelKey: "nav.browseUniversities", icon: Search },
  { href: "/student/my-applications", labelKey: "nav.myApplications", icon: CreditCard },
]

export default function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [fullName, setFullName] = useState<string>("")
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const { t } = useI18n()

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
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-950/50 flex flex-col z-50">
      {/* Profile */}
      <div className="p-6 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/15 dark:to-purple-500/10 flex items-center justify-center shadow-inner">
          <Home className="h-8 w-8 text-purple-700 dark:text-purple-400" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide leading-tight">
          {fullName ? fullName.toUpperCase() : "STUDENT"}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("nav.studentDashboard")}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-white dark:bg-gray-900">
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
                  : "text-gray-700 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors shrink-0",
                  isActive ? "text-white" : "text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                )}
              />
              <span className="truncate">{t(link.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Help Center — compact */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-white dark:bg-gray-900">
        <div className="rounded-md bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-300 text-xs p-3 shadow-sm">
          <p className="font-medium mb-1 flex items-center justify-between">
            {t("help.helpCenter")}
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">{t("help.available247")}</span>
          </p>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 leading-tight">
            {t("help.needAssistance")}
          </p>
          <Button
            size="sm"
            className="w-full h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setIsContactModalOpen(true)}
          >
            {t("help.contactSupport")}
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto bg-white dark:bg-gray-900">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("nav.logOut")}
        </Button>
      </div>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </aside>
  )
}
