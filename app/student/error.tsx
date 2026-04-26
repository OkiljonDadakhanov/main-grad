"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import logger from "@/lib/logger"
import { useI18n } from "@/lib/i18n"

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    logger.error("Student section error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("errorPage.title")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("errorPage.description")}
        </p>
        <div className="space-x-4">
          <Button onClick={() => reset()} variant="default">
            {t("errorPage.tryAgain")}
          </Button>
          <Button
            onClick={() => (window.location.href = "/student/profile")}
            variant="outline"
          >
            {t("errorPage.goHome")}
          </Button>
        </div>
      </div>
    </div>
  )
}
