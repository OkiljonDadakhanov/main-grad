"use client"

import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getThemeLabel = () => {
    if (theme === "dark") return t("theme.dark")
    if (theme === "system") return t("theme.system")
    return t("theme.light")
  }

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="Toggle theme"
      >
        <Sun size={20} className="text-gray-600" />
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label={`Current theme: ${getThemeLabel()}. Click to change theme`}
        >
          {theme === "dark" ? (
            <Moon size={20} className="text-gray-600 dark:text-gray-400" />
          ) : theme === "system" ? (
            <Monitor size={20} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun size={20} className="text-gray-600" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800 min-w-[160px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center justify-between ${theme === "light" ? "bg-purple-50 dark:bg-purple-500/10" : ""}`}
        >
          <span className="flex items-center">
            <Sun size={16} className="mr-2" />
            {t("theme.light")}
          </span>
          {theme === "light" && <Check size={16} className="text-purple-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center justify-between ${theme === "dark" ? "bg-purple-50 dark:bg-purple-500/10" : ""}`}
        >
          <span className="flex items-center">
            <Moon size={16} className="mr-2" />
            {t("theme.dark")}
          </span>
          {theme === "dark" && <Check size={16} className="text-purple-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center justify-between ${theme === "system" ? "bg-purple-50 dark:bg-purple-500/10" : ""}`}
        >
          <span className="flex items-center">
            <Monitor size={16} className="mr-2" />
            {t("theme.system")}
          </span>
          {theme === "system" && <Check size={16} className="text-purple-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
