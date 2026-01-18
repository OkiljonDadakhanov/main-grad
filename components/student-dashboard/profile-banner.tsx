"use client"

import { Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function ProfileBanner() {
  const { t } = useI18n()

  return (
    <div className="relative bg-purple-600 rounded-lg p-8 text-white overflow-hidden">
      <div
        className="absolute top-0 right-0 h-full w-1/2 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.2'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>
      <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-purple-600 to-transparent"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2 flex items-center">
          {t("profile.banner")}
          <Sparkles className="ml-3 h-8 w-8 text-yellow-300" />
        </h2>
      </div>
    </div>
  )
}
