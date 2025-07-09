"use client"

import { Award, ClipboardList, FileText, GraduationCap, UserCircle, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/student/profile", label: "My profile", icon: UserCircle },
  { href: "/student/personal-information", label: "Personal information", icon: ClipboardList },
  { href: "/student/educational-information", label: "Educational information", icon: GraduationCap },
  { href: "/student/certificates", label: "Certificates", icon: Award },
  { href: "/student/my-family", label: "My family", icon: Users },
  { href: "/student/my-applications", label: "My applications", icon: FileText },
]

const StudentSidebar = () => {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 py-4">
      <div className="px-6 py-2">
        <h2 className="text-lg font-semibold text-gray-900">Student Dashboard</h2>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm font-medium text-gray-700 rounded-md transition-colors duration-200 ${
              pathname === item.href ? "bg-purple-100 text-purple-700" : "hover:bg-purple-50"
            }`}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default StudentSidebar
