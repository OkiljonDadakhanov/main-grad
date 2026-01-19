import type React from "react"
import Image from "next/image"
import StudentSidebar from "@/components/student-dashboard/student-sidebar"
import MobileSidebar from "@/components/student-dashboard/mobile-sidebar"
import NotificationBell from "@/components/student-dashboard/notification-bell"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserDropdown } from "@/components/layout/user-dropdown"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <StudentSidebar />
      </div>

      {/* Main content - full width on mobile, shifted on desktop */}
      <div className="flex-1 lg:pl-64">
        {/* Top header */}
        <header className="flex items-center justify-between px-4 lg:px-6 border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-20 shadow-sm dark:shadow-gray-950/50 h-16">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <MobileSidebar />
            </div>

            <div className="w-10 h-10 rounded-lg overflow-hidden bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">K-GradAbroad</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationBell />
            <UserDropdown />
          </div>
        </header>

        {/* Page content - responsive padding */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
