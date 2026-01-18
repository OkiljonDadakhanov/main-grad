"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function SearchBar() {
  const router = useRouter()
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full gap-2">
      <Input
        type="text"
        placeholder={t("landing.hero.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-purple-500 h-12"
      />
      <Button type="submit" className="bg-purple-700 hover:bg-purple-800 h-12 px-4 sm:px-6">
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{t("landing.hero.searchBtn")}</span>
      </Button>
    </form>
  )
}
