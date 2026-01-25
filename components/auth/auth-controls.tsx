"use client"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function AuthControls() {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-1 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-2 py-1 shadow-lg">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  )
}
