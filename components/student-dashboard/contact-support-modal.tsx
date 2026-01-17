"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { authFetch, BASE_URL } from "@/lib/auth"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface ContactSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { t } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      setStatus("error")
      setErrorMessage(t("help.fillAllFields"))
      return
    }

    setIsLoading(true)
    setStatus("idle")

    try {
      const res = await authFetch(`${BASE_URL}/api/contact-support/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message }),
      })

      if (res.ok) {
        setStatus("success")
        setSubject("")
        setMessage("")
        setTimeout(() => {
          onClose()
          setStatus("idle")
        }, 2000)
      } else {
        const data = await res.json()
        setStatus("error")
        setErrorMessage(data.error || t("help.sendFailed"))
      }
    } catch {
      setStatus("error")
      setErrorMessage(t("help.sendFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSubject("")
      setMessage("")
      setStatus("idle")
      setErrorMessage("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">{t("help.contactSupport")}</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {t("help.contactDescription")}
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-600 dark:text-green-400 font-medium">
              {t("help.messageSent")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t("help.willRespond")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium dark:text-gray-200">
                {t("help.subject")}
              </label>
              <Input
                id="subject"
                placeholder={t("help.subjectPlaceholder")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isLoading}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium dark:text-gray-200">
                {t("help.message")}
              </label>
              <Textarea
                id="message"
                placeholder={t("help.messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                rows={5}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("help.sending")}
                  </>
                ) : (
                  t("help.sendMessage")
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
