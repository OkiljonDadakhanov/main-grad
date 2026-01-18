import type React from "react"
import StudentSidebar from "@/components/student-dashboard/student-sidebar"
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
      <StudentSidebar />

      {/* Main content shifted right by sidebar width */}
      <div className="flex-1 pl-64">
        {/* Top header */}
        <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-20 shadow-sm dark:shadow-gray-950/50">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Graduate in Korea
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationBell />
            <UserDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
