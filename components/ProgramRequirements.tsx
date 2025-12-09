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
  readinessData?: any
  programmeId: string | null
}

export default function ProgramRequirements({
  selectedProgramObj,
  uploadedDocs,
  handleFileUpload,
  missingRequirements,
  readinessData,
  programmeId,
}: ProgramRequirementsProps) {
  const { readiness, loading, getDocumentCategoryStatus } = useStudentReadiness(programmeId)
  
  // Use readinessData from props if available, otherwise use hook data
  const activeReadiness = readinessData || readiness
  
  // Get all document requirements from API (exclude essays)
  const allDocumentRequirements = React.useMemo(() => {
    if (!activeReadiness || !activeReadiness.requirements) return []
    
    // Filter requirements that need file uploads (not essays)
    return activeReadiness.requirements.filter((req: any) => {
      const isEssay = req.requirementType?.toLowerCase().includes("essay") ||
                     req.label?.toLowerCase().includes("essay") ||
                     req.label?.toLowerCase().includes("motivation") ||
                     req.label?.toLowerCase().includes("statement") ||
                     req.label?.toLowerCase().includes("why") ||
                     req.requirementType?.toLowerCase() === "text"
      
      return !isEssay && (
        req.requirementType?.toLowerCase().includes("document") ||
        req.requirementType?.toLowerCase().includes("file") ||
        req.requirementType?.toLowerCase().includes("upload") ||
        req.label?.toLowerCase().includes("document") ||
        req.label?.toLowerCase().includes("file") ||
        req.label?.toLowerCase().includes("upload") ||
        req.label?.toLowerCase().includes("certificate") ||
        req.label?.toLowerCase().includes("diploma") ||
        req.label?.toLowerCase().includes("transcript") ||
        req.label?.toLowerCase().includes("passport") ||
        req.label?.toLowerCase().includes("photo")
      )
    })
  }, [activeReadiness])
  
  // Get missing required requirements
  const apiMissingRequirements = React.useMemo(() => {
    return allDocumentRequirements.filter((req: any) => 
      req.required && 
      (req.status === "missing" || activeReadiness?.missing_required?.includes(req.id))
    )
  }, [allDocumentRequirements, activeReadiness])

  // Show loading state
  if (loading && programmeId && !readinessData) {
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
  const requirementsToShow = allDocumentRequirements.length > 0 
    ? allDocumentRequirements 
    : missingRequirements

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program-Specific Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allDocumentRequirements.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="h-5 w-5" />
            <p>No additional document requirements for this program.</p>
          </div>
        ) : (
          <>
            {apiMissingRequirements.length > 0 && (
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

            {allDocumentRequirements.map((req: any) => {
              const reqId = req.id || req.label
              const reqLabel = req.label || req.name || "Document"
              const isUploaded = uploadedDocs[reqLabel] !== undefined
              const isMissing = req.status === "missing" || activeReadiness?.missing_required?.includes(req.id)
              const isSatisfied = req.status === "satisfied" || activeReadiness?.satisfied?.includes(req.id)
              const isRequired = req.required !== false
              
              return (
                <div 
                  key={reqId} 
                  className={`space-y-2 p-4 border rounded-lg ${
                    isSatisfied ? "bg-green-50 border-green-200" : 
                    isMissing && isRequired ? "bg-amber-50 border-amber-200" : 
                    "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium text-gray-800">{reqLabel}</Label>
                        {isRequired && (
                          <span className="text-xs text-red-600 font-semibold">(Required)</span>
                        )}
                        {isSatisfied && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {isMissing && isRequired && (
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      {req.note && (
                        <p className="text-sm text-gray-600 mt-1">{req.note}</p>
                      )}
                      {req.reason && (
                        <p className="text-xs text-amber-600 mt-1 italic">{req.reason}</p>
                      )}
                      {req.requirementType && (
                        <p className="text-xs text-gray-500 mt-1">Type: {req.requirementType}</p>
                      )}
                    </div>
                    {isUploaded && !isSatisfied && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  {!isSatisfied && (
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
                  )}
                </div>
              )
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
