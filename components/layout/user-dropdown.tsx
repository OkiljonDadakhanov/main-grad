"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authFetch, BASE_URL, clearAuthStorage, getUserFromStorage } from "@/lib/auth"
import { useI18n } from "@/lib/i18n"

interface UserData {
  full_name: string
  email: string
}

export function UserDropdown() {
  const router = useRouter()
  const { t } = useI18n()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Try fast path from stored user
    const storedUser = getUserFromStorage<UserData>()
    if (storedUser?.full_name) {
      setUser(storedUser)
    }

    // Fetch fresh data
    const fetchUser = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/api/me/profile/`)
        if (res.ok) {
          const data = await res.json()
          setUser({
            full_name: data.full_name || "Student",
            email: data.email || "",
          })
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    clearAuthStorage()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium text-sm">
            {user ? getInitials(user.full_name) : "S"}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {user?.full_name || "Student"}
          </p>
          {user?.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/student/profile")}
          className="cursor-pointer"
        >
          <User size={16} className="mr-2" />
          {t("nav.myProfile")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/student/settings")}
          className="cursor-pointer"
        >
          <Settings size={16} className="mr-2" />
          {t("nav.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10"
        >
          <LogOut size={16} className="mr-2" />
          {t("nav.logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
