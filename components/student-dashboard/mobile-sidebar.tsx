"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Award,
  Users,
  DollarSign,
  Search,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearAuthStorage, getAccessTokenFromStorage, getUserFromStorage, BASE_URL, authFetch } from "@/lib/auth"
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
  { href: "/student/settings", labelKey: "nav.settings", icon: Settings },
]

export default function MobileSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [fullName, setFullName] = useState<string>("")
  const { t } = useI18n()

  const handleLogout = () => {
    clearAuthStorage()
    setIsOpen(false)
    router.push("/")
  }

  useEffect(() => {
    const token = getAccessTokenFromStorage()
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

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 bg-white dark:bg-gray-900">
        <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {fullName || "STUDENT"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("nav.studentDashboard")}
                </span>
              </div>
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("nav.logOut")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
