import type React from "react"
import StudentSidebar from "@/components/student-dashboard/student-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <StudentSidebar />

      {/* Main content shifted right by sidebar width */}
      <div className="flex-1 pl-64">
        {/* Top header */}
        <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-20">
          <h1 className="text-lg font-semibold text-gray-800">
            Graduate in Korea
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://flagcdn.com/us.svg" alt="USA Flag" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
