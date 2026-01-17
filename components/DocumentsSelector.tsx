"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Loader2, FileText } from "lucide-react"
import React from "react"
import { useStudentReadiness } from "@/hooks/useStudentReadiness"

export default function DocumentsSelector({
  includeDocuments,
  setIncludeDocuments,
  documentStatus,
  programmeId
}: any) {
  const { getDocumentCategoryStatus, loading } = useStudentReadiness(programmeId)

  // Get dynamic status from API if programmeId is available
  const categoryStatuses = programmeId ? getDocumentCategoryStatus() : []

  // Default items list
  const defaultItems = [
    { key: "personalInfo", label: "Personal Information & Documents" },
    { key: "education", label: "Educational Documents (Diplomas, Transcripts)" },
    { key: "certificates", label: "Certificates (Language, Professional)" },
    { key: "family", label: "Family Information & Documents" },
    { key: "applicationDocs", label: "Application Documents (Statement, Recommendations)" },
    { key: "financialDocs", label: "Financial Documents (Bank, Sponsorship)" },
  ]

  // Merge with dynamic status if available
  const items = defaultItems.map((item) => {
    const status = categoryStatuses.find((s) => s.key === item.key)
    // Show warning if there are missing required documents
    // Only show status icons when we have programmeId and status data
    const showWarning = programmeId && status ? status.hasMissingRequired : false
    const showSuccess = programmeId && status ? (status.allSatisfied && status.requirements.length > 0 && !status.hasMissingRequired) : false
    const showLoading = loading && programmeId

    return {
      ...item,
      status,
      showWarning,
      showSuccess,
      showLoading,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents from Your Profile</CardTitle>
        <CardDescription>These documents will be automatically included from your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center space-x-3 py-1">
            <div className="flex-shrink-0">
              {item.showLoading ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : item.showWarning ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : item.showSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <FileText className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {item.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
