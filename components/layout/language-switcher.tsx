"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n"
import US from "country-flag-icons/react/3x2/US"
import KR from "country-flag-icons/react/3x2/KR"
import RU from "country-flag-icons/react/3x2/RU"
import UZ from "country-flag-icons/react/3x2/UZ"

const LANGUAGES = [
  { code: "en", name: "English", Flag: US },
  { code: "ko", name: "한국어", Flag: KR },
  { code: "ru", name: "Русский", Flag: RU },
  { code: "uz", name: "O'zbek", Flag: UZ },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0]
  const CurrentFlag = currentLang.Flag

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
          <CurrentFlag className="w-6 h-4 rounded-sm shadow-sm" />
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800 min-w-[150px]">
        {LANGUAGES.map((language) => {
          const Flag = language.Flag
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLocale(language.code)}
              className={`flex items-center gap-3 ${locale === language.code ? "bg-purple-50 dark:bg-purple-500/10" : ""}`}
            >
              <Flag className="w-6 h-4 rounded-sm shadow-sm" />
              <span>{language.name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
