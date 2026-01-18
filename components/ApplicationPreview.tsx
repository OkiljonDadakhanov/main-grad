"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CheckCircle2, FileText, AlertCircle } from "lucide-react"

interface ApplicationPreviewProps {
  program: any
  readinessData?: any
  includeDocuments?: Record<string, boolean>
  uploadedDocs?: Record<string, File>
  paymentReceipt?: File | null
}

export default function ApplicationPreview({
  program,
  readinessData,
  includeDocuments,
  uploadedDocs = {},
  paymentReceipt
}: ApplicationPreviewProps) {
  // Check if program has application fee
  const hasFee = program?.platformApplicationFee &&
    parseFloat(program.platformApplicationFee) > 0
  // Get all requirements that need file uploads during application
  const applicationRequirements = readinessData?.requirements?.filter((req: any) => {
    const status = req.status?.toLowerCase() || ""
    return status === "pending_upload" || status === "missing"
  }) || []

  // Check which requirements have been uploaded locally
  const getUploadStatus = (req: any) => {
    const reqLabel = req.label || ""
    // Check if file was uploaded locally
    const hasLocalUpload = uploadedDocs[reqLabel] !== undefined
    // Check if satisfied from profile
    const isSatisfiedFromProfile = req.status === "satisfied"

    return hasLocalUpload || isSatisfiedFromProfile
  }

  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="text-green-700">Application Preview</CardTitle>
        <CardDescription>Review before submission</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold">Program:</p>
            <p className="text-gray-700">{program?.name}</p>
          </div>

          {hasFee && (
            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">Application Fee:</p>
              <div className="flex items-center gap-2 text-sm">
                {paymentReceipt ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Payment Receipt - {paymentReceipt.name}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600">
                      Payment Receipt - Not uploaded (${parseFloat(program.platformApplicationFee).toFixed(2)} required)
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {applicationRequirements.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">Application Documents:</p>
              {applicationRequirements.map((req: any) => {
                const isUploaded = getUploadStatus(req)
                const uploadedFile = uploadedDocs[req.label]

                return (
                  <div key={req.id} className="flex items-center gap-2 text-sm mb-1">
                    {isUploaded ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">
                          {req.label} - {uploadedFile ? uploadedFile.name : "Ready"}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-600">
                          {req.label} - Not uploaded
                        </span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="border-t pt-3">
            <p className="text-sm font-semibold mb-2">Documents Included:</p>
            <ul className="text-sm mt-1 space-y-1">
              {Object.entries(includeDocuments || {}).map(([key, val]) =>
                val ? (
                  <li key={key} className="text-gray-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
