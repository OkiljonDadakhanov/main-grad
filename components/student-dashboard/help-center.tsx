"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { useState } from "react"
import HelpCenterModal, { type HelpMessageFormData } from "./help-center-modal" // Import new modal
import { useCustomToast } from "@/components/custom-toast"
import { useI18n } from "@/lib/i18n"

export default function HelpCenter() {
  const { success, error } = useCustomToast()
  const { t } = useI18n()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmitMessage = (data: HelpMessageFormData) => {
    try {
      // TODO: Implement actual submission logic
      // For now, simulate success
      success(t("help.submitSuccess"))
      setIsModalOpen(false)
    } catch (err) {
      error(t("help.submitError"))
    }
  }

  return (
    <>
      <Card className="mt-auto bg-purple-600 text-white">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-8 w-8" />
            <CardTitle className="text-lg">{t("help.helpCenter")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="text-purple-100 mb-3 text-sm">{t("help.gotIssue")}</CardDescription>
          <Button
            variant="secondary"
            className="w-full bg-white text-purple-600 hover:bg-purple-50"
            onClick={() => setIsModalOpen(true)} // Open modal
          >
            {t("help.sendMessage")}
          </Button>
        </CardContent>
      </Card>
      <HelpCenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitMessage={handleSubmitMessage}
      />
    </>
  )
}
