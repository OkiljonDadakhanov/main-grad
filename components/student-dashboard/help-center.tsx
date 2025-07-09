"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { useState } from "react"
import HelpCenterModal, { type HelpMessageFormData } from "./help-center-modal" // Import new modal

export default function HelpCenter() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmitMessage = (data: HelpMessageFormData) => {
    console.log("Help message submitted:", data) // Replace with actual submission logic
    // Add a toast notification for success
  }

  return (
    <>
      <Card className="mt-auto bg-purple-600 text-white">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-8 w-8" />
            <CardTitle className="text-lg">Help Center</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="text-purple-100 mb-3 text-sm">Got an issue? Need assistance?</CardDescription>
          <Button
            variant="secondary"
            className="w-full bg-white text-purple-600 hover:bg-purple-50"
            onClick={() => setIsModalOpen(true)} // Open modal
          >
            Send a message
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
