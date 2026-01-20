"use client"

import type React from "react"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import StudentSidebar from "@/components/student-dashboard/student-sidebar"
import { SidebarProvider, useSidebar } from "@/components/student-dashboard/sidebar-context"
import NotificationBell from "@/components/student-dashboard/notification-bell"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserDropdown } from "@/components/layout/user-dropdown"

function StudentDashboardContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <StudentSidebar />

      {/* Main content - no left padding on mobile, 64 on desktop */}
      <div className="flex-1 md:pl-64">
        {/* Top header */}
        <header className="flex items-center justify-between px-4 md:px-6 border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-20 shadow-sm dark:shadow-gray-950/50 h-16">
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={open}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationBell />
            <UserDropdown />
          </div>
        </header>

        {/* Page content - smaller padding on mobile */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <StudentDashboardContent>{children}</StudentDashboardContent>
    </SidebarProvider>
  )
}
