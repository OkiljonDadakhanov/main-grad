"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import HelpCenter from "./help-center"
import { CreditCard, FileText, GraduationCap, Home, LogOut, Award, Users, FolderOpen, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationLinks = [
  { href: "/student/profile", label: "My profile", icon: Home },
  { href: "/student/personal-information", label: "Personal information", icon: FileText },
  { href: "/student/educational-information", label: "Educational information", icon: GraduationCap },
  { href: "/student/application-documents", label: "Application documents", icon: FolderOpen },
  { href: "/student/certificates", label: "Certificates", icon: Award },
  { href: "/student/financial-documents", label: "Financial documents", icon: DollarSign },
  { href: "/student/my-family", label: "My family", icon: Users },
  { href: "/student/my-applications", label: "My applications", icon: CreditCard },
]

export default function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you'd clear authentication tokens here
    console.log("Logging out...")
    router.push("/")
  }

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-purple-50 to-white border-r flex flex-col">
      {/* Profile Section */}
      <div className="p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-200 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-purple-300 flex items-center justify-center">
            <Home className="h-10 w-10 text-purple-700" />
          </div>
        </div>
        <h2 className="font-bold text-lg text-gray-900 uppercase">SHOXBEK SHUKURULLOYEV</h2>
      </div>

      <Separator />

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-purple-100 hover:text-purple-700",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Help Center */}
      <div className="p-4">
        <HelpCenter />
      </div>

      <Separator />

      {/* Logout Button */}
      <div className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
