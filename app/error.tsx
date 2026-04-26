"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import logger from "@/lib/logger"
import { useI18n } from "@/lib/i18n"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    logger.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            {t("errorPage.goHome")}
          </Button>
        </div>
      </div>
    </div>
  )
}
