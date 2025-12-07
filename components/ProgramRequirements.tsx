"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { useStudentReadiness } from "@/hooks/useStudentReadiness"

interface ProgramRequirementsProps {
  selectedProgramObj: any
  uploadedDocs: Record<string, File>
  handleFileUpload: (docName: string, file: File | null) => void
  missingRequirements: any[]
  programmeId: string | null
}

export default function ProgramRequirements({
  selectedProgramObj,
  uploadedDocs,
  handleFileUpload,
  missingRequirements,
  programmeId,
}: ProgramRequirementsProps) {
  const { readiness, loading, getDocumentCategoryStatus } = useStudentReadiness(programmeId)
  
  // Get missing requirements from API
  const apiMissingRequirements = React.useMemo(() => {
    if (!readiness || !readiness.requirements) return []
    
    // Filter only missing required requirements that need file uploads
    return readiness.requirements.filter((req: any) => 
      req.required && 
      req.status === "missing" &&
      readiness.missing_required?.includes(req.id)
    )
  }, [readiness])

  // Show loading state
  if (loading && programmeId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Program-Specific Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading requirements...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Don't show if no program selected
  if (!programmeId || !selectedProgramObj) return null

  // Use API requirements if available, otherwise fall back to old logic
  const requirementsToShow = apiMissingRequirements.length > 0 
    ? apiMissingRequirements 
    : missingRequirements

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program-Specific Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirementsToShow.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="h-5 w-5" />
            <p>All required documents are satisfied.</p>
          </div>
        ) : (
          <>
            {requirementsToShow.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Missing Required Documents
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Please upload the following documents to complete your application.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {requirementsToShow.map((req: any) => {
              const reqId = req.id || req.label
              const reqLabel = req.label || req.name || "Document"
              const isUploaded = uploadedDocs[reqLabel] !== undefined
              
              return (
                <div key={reqId} className="space-y-2 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Label className="font-medium text-gray-800">{reqLabel}</Label>
                      {req.required && (
                        <span className="ml-2 text-xs text-red-600 font-semibold">(Required)</span>
                      )}
                      {req.note && (
                        <p className="text-sm text-gray-600 mt-1">{req.note}</p>
                      )}
                      {req.reason && (
                        <p className="text-xs text-amber-600 mt-1 italic">{req.reason}</p>
                      )}
                    </div>
                    {isUploaded && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) =>
                        handleFileUpload(reqLabel, e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {!isUploaded && (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
