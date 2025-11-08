"use client"

import SubmitSection from "@/components/SubmitSection"

export default function SubmitActions({
  showPreview,
  handleCheckDocuments,
  handleSubmitApplication,
  submitting,
  checkingDocuments,
  selectedProgram,
}: any) {
  return (
    <SubmitSection
      showPreview={showPreview}
      handleCheckDocuments={handleCheckDocuments}
      handleSubmitApplication={handleSubmitApplication}
      submitting={submitting}
      checkingDocuments={checkingDocuments}
      selectedProgram={selectedProgram}
    />
  )
}
