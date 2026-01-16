"use client"

import React, { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/components/custom-toast"
import { authFetch, BASE_URL } from "@/lib/auth"
import { UniversityPrograms } from "@/components/university/university-programs"
import DocumentsSelector from "@/components/DocumentsSelector"
import EssaysSection from "@/components/EssaysSection"
import ProgramRequirements from "@/components/ProgramRequirements"
import ApplicationPreview from "@/components/ApplicationPreview"
import SubmitSection from "@/components/SubmitSection"
import { useDocumentStatus } from "@/hooks/useDocumentStatus"
import {
  uploadAttachments,
  uploadEssays,
  finalizeApplication,
} from "@/hooks/useApplicationFlow"

export default function ApplyToUniversityPage({
  params,
}: {
  params: Promise<{ universityId: string }>
}) {
  const resolvedParams = React.use(params)
  const universityId = resolvedParams.universityId
  const router = useRouter()
  const { success, error, warning } = useCustomToast()

  const [university, setUniversity] = useState<any>(null)
  const [selectedProgram, setSelectedProgram] = useState<string>("")
  const [activeTab, setActiveTab] = useState("programs")
  const [motivation, setMotivation] = useState("")
  const [whyThisUniversity, setWhyThisUniversity] = useState("")
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({})
  const [includeDocuments, setIncludeDocuments] = useState({
    personalInfo: true,
    education: true,
    certificates: true,
    family: true,
    applicationDocs: true,
    financialDocs: true,
  })
  const [missingRequirements, setMissingRequirements] = useState<any[]>([])
  const [readinessData, setReadinessData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({})

  const { documentStatus, checkingDocuments } = useDocumentStatus()

  // 🎓 Fetch University Data
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/api/auth/universities/${universityId}/`)
        if (!res.ok) throw new Error("Failed to fetch university details")
        const data = await res.json()
        setUniversity(data)
        // Auto-select first active program if available
        const firstActive = data.programmes?.find((p: any) => p.active)
        if (firstActive) {
          setSelectedProgram(String(firstActive.id))
        }
      } catch {
        error("Failed to load university information.")
      } finally {
        setLoading(false)
      }
    }
    fetchUniversity()
  }, [universityId])

  // 🧩 Fetch student-readiness data (includes essays and requirements)
  useEffect(() => {
    if (!selectedProgram) {
      setMissingRequirements([])
      setReadinessData(null)
      setEssayAnswers({})
      return
    }

    const fetchReadiness = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/api/programmes/${selectedProgram}/student-readiness/`)
        if (!res.ok) return
        
        const data = await res.json()
        setReadinessData(data)
        
        // Get missing required requirements from API (for document uploads)
        // Only include document-type requirements, exclude pure text essays
        const missingReqs = (data.requirements || []).filter((req: any) => {
          if (!req.required || req.status !== "missing" || !data.missing_required?.includes(req.id)) {
            return false
          }
          const reqType = req.requirementType?.toLowerCase() || ""
          // Include document type requirements (even if label contains "statement")
          if (reqType === "document" || reqType === "file" || reqType === "upload") {
            return true
          }
          // Exclude pure essay types
          if (reqType === "essay" || reqType === "text") {
            return false
          }
          // For other types, exclude based on essay-related labels
          const label = req.label?.toLowerCase() || ""
          return !(label.includes("essay") || label.includes("motivation letter"))
        })
        setMissingRequirements(missingReqs)

        // Initialize essay answers from existing data if available
        // Only include pure essay type requirements
        const essayReqs = (data.requirements || []).filter((req: any) => {
          const reqType = req.requirementType?.toLowerCase() || ""
          const label = req.label?.toLowerCase() || ""

          // Skip document type requirements
          if (reqType === "document" || reqType === "file" || reqType === "upload") {
            return false
          }

          // Include essay/text type requirements
          if (reqType === "essay" || reqType === "text") {
            return true
          }

          // Include based on label only if NOT a document type
          return (
            label.includes("essay") ||
            label.includes("motivation letter") ||
            (label.includes("why") && !label.includes("document"))
          )
        })
        
        // Initialize with existing values if they exist
        const initialEssays: Record<string, string> = {}
        essayReqs.forEach((req: any) => {
          if (req.matched_record?.answer || req.matched_record?.content) {
            initialEssays[String(req.id)] = req.matched_record.answer || req.matched_record.content || ""
          }
        })
        setEssayAnswers(initialEssays)
      } catch (err) {
        console.error("Error fetching readiness:", err)
        setMissingRequirements([])
        setReadinessData(null)
      }
    }

    fetchReadiness()
  }, [selectedProgram])

  // 📂 Handle Upload
  const handleFileUpload = (docName: string, file: File | null) => {
    if (file) setUploadedDocs((prev) => ({ ...prev, [docName]: file }))
  }

  // Handle program selection from tabs
  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId)
    setActiveTab("apply")
  }

  // ---- server-side readiness check ----
  // This check accounts for locally uploaded documents that haven't been sent to server yet
  const checkStudentReadiness = async (programmeId: string) => {
    try {
      const res = await authFetch(`${BASE_URL}/api/programmes/${programmeId}/student-readiness/`)
      if (!res.ok) {
        warning("Failed to verify readiness. Please try again.")
        return false
      }
      const data = await res.json()

      // If server says ready, we're good
      if (data.can_apply) {
        return true
      }

      // Check if missing requirements are covered by local uploads
      const missingRequiredIds = data.missing_required || []
      const missingRequirements = (data.requirements || []).filter((req: any) =>
        missingRequiredIds.includes(req.id)
      )

      // Get all locally uploaded doc keys (exact labels used in ProgramRequirements)
      const uploadedKeys = Object.keys(uploadedDocs)

      // Filter out requirements that are covered by local uploads
      const trulyMissing = missingRequirements.filter((req: any) => {
        const reqLabel = req.label || ""
        const reqType = (req.requirementType || "").toLowerCase()

        // For document type requirements, check if user uploaded a matching file
        if (reqType === "document" || reqType === "file" || reqType === "upload") {
          // The upload key is exactly the requirement label (from ProgramRequirements component)
          const hasUpload = uploadedKeys.some(key =>
            key === reqLabel || // Exact match (most common)
            key.toLowerCase() === reqLabel.toLowerCase() || // Case-insensitive match
            key.toLowerCase().includes(reqLabel.toLowerCase()) ||
            reqLabel.toLowerCase().includes(key.toLowerCase())
          )
          if (hasUpload) {
            return false // Not truly missing - user has uploaded it locally
          }
        }

        return true // Still missing
      })

      if (trulyMissing.length > 0) {
        const missingList = trulyMissing
          .map((req: any) => `• ${req.label || req.requirementType || 'Required document'}`)
          .join("\n")
        warning(`You are not ready to apply:\n${missingList}`)
        return false
      }

      // All missing requirements are covered by local uploads
      return true
    } catch (err) {
      warning("Failed to verify readiness. Please try again.")
      return false
    }
  }

  // ✅ Check before submission
  const handleCheckDocuments = async () => {
    if (!selectedProgram) return error("Please select a program first")

    // Check if all required essays are filled (only pure text essays, not document uploads)
    if (readinessData) {
      const essayReqs = (readinessData.requirements || []).filter((req: any) => {
        if (!req.required) return false
        const reqType = req.requirementType?.toLowerCase() || ""
        const label = req.label?.toLowerCase() || ""

        // Skip document type requirements - those are file uploads, not text
        if (reqType === "document" || reqType === "file" || reqType === "upload") {
          return false
        }

        // Include essay/text type requirements
        if (reqType === "essay" || reqType === "text") {
          return true
        }

        // Include based on label only if NOT a document type
        return (
          label.includes("essay") ||
          label.includes("motivation letter") ||
          (label.includes("why") && !label.includes("document"))
        )
      })

      const missingEssays = essayReqs.filter((req: any) => {
        const answer = essayAnswers[String(req.id)]
        return !answer || answer.trim().length === 0
      })

      if (missingEssays.length > 0) {
        error(`Please fill in all required essays: ${missingEssays.map((r: any) => r.label).join(", ")}`)
        return
      }
    } else {
      // Fallback to old validation
      if (!motivation || !whyThisUniversity) return error("Please fill in all required essays")
    }

    // Server-side readiness check using API
    const isReady = await checkStudentReadiness(selectedProgram)
    if (!isReady) return

    setShowPreview(true)
  }

  // 🚀 Submit Application (checks readiness first, then creates application)
  const handleSubmitApplication = async () => {
    if (!selectedProgram) return error("Select a program before submitting.")

    // Check if all required essays are filled (only pure text essays, not document uploads)
    if (readinessData) {
      const essayReqs = (readinessData.requirements || []).filter((req: any) => {
        if (!req.required) return false
        const reqType = req.requirementType?.toLowerCase() || ""
        const label = req.label?.toLowerCase() || ""

        // Skip document type requirements - those are file uploads, not text
        if (reqType === "document" || reqType === "file" || reqType === "upload") {
          return false
        }

        // Include essay/text type requirements
        if (reqType === "essay" || reqType === "text") {
          return true
        }

        // Include based on label only if NOT a document type
        return (
          label.includes("essay") ||
          label.includes("motivation letter") ||
          (label.includes("why") && !label.includes("document"))
        )
      })

      const missingEssays = essayReqs.filter((req: any) => {
        const answer = essayAnswers[String(req.id)]
        return !answer || answer.trim().length === 0
      })

      if (missingEssays.length > 0) {
        error(`Please fill in all required essays: ${missingEssays.map((r: any) => r.label).join(", ")}`)
        return
      }
    } else {
      // Fallback to old validation
      if (!motivation || !whyThisUniversity) return error("Please fill in all required essays")
    }
    
    setSubmitting(true)
    try {
      // First check readiness
      const isReady = await checkStudentReadiness(selectedProgram)
      if (!isReady) {
        setSubmitting(false)
        return
      }

      // Create application via POST /api/applications/
      const createRes = await authFetch(`${BASE_URL}/api/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programme_id: Number(selectedProgram) }),
      })

      if (!createRes.ok) {
        const text = await createRes.text().catch(() => null)
        throw new Error(text || "Failed to create application")
      }

      const created = await createRes.json()
      const appId = created.id ?? created.application_id ?? created.pk
      if (!appId) throw new Error("Application created but no ID returned")

      await uploadAttachments(appId, uploadedDocs)
      
      // Upload essays dynamically based on readiness data (only pure text essays)
      if (readinessData && Object.keys(essayAnswers).length > 0) {
        const essayReqs = (readinessData.requirements || []).filter((req: any) => {
          const reqType = req.requirementType?.toLowerCase() || ""
          const label = req.label?.toLowerCase() || ""

          // Skip document type requirements
          if (reqType === "document" || reqType === "file" || reqType === "upload") {
            return false
          }

          // Include essay/text type requirements
          if (reqType === "essay" || reqType === "text") {
            return true
          }

          // Include based on label only if NOT a document type
          return (
            label.includes("essay") ||
            label.includes("motivation letter") ||
            (label.includes("why") && !label.includes("document"))
          )
        })
        
        // Upload each essay requirement
        for (const req of essayReqs) {
          const answer = essayAnswers[String(req.id)]
          if (answer && answer.trim()) {
            // Use the requirement ID and answer to upload
            await uploadEssays(appId, answer, undefined, req.id)
          }
        }
      } else {
        // Fallback to old method
        await uploadEssays(appId, motivation, whyThisUniversity)
      }
      
      await finalizeApplication(appId)
      success("Your application has been successfully submitted!")
      router.push("/student/my-applications")
    } catch (err) {
      console.error(err)
      error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-purple-600" />
        Loading university details...
      </div>
    )
  }

  if (!university) {
    return (
      <div className="space-y-6 text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">University not found</p>
        <Link href="/student/browse-universities">
          <Button variant="outline">Back to Browse</Button>
        </Link>
      </div>
    )
  }

  const selectedProgramObj = university?.programmes?.find(
    (p: any) => String(p.id) === selectedProgram
  )

  const activePrograms = university?.programmes?.filter((p: any) => p.active) || []

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-2">
            Apply to {university.university_name}
          </h1>
          <p className="text-gray-600">
            Select a program and complete your application
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-white border">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          {selectedProgram && <TabsTrigger value="apply">Apply</TabsTrigger>}
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          <UniversityPrograms 
            programs={activePrograms}
            onProgramSelect={handleProgramSelect}
            selectedProgramId={selectedProgram}
          />
        </TabsContent>

        {selectedProgram && (
          <TabsContent value="apply" className="space-y-6">
            {selectedProgramObj && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">
                        {selectedProgramObj.name}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          {selectedProgramObj.field_of_study}
                        </Badge>
                        <Badge variant="outline">
                          {selectedProgramObj.degreeType}
                        </Badge>
                      </div>
                    </div>
                    {selectedProgramObj.contractPrice && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Contract Price</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ${parseFloat(selectedProgramObj.contractPrice).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <DocumentsSelector
              includeDocuments={includeDocuments}
              setIncludeDocuments={setIncludeDocuments}
              documentStatus={documentStatus}
              programmeId={selectedProgram || null}
            />

            <EssaysSection
              university={university}
              readinessData={readinessData}
              essayAnswers={essayAnswers}
              setEssayAnswers={setEssayAnswers}
              motivation={motivation}
              setMotivation={setMotivation}
              whyThisUniversity={whyThisUniversity}
              setWhyThisUniversity={setWhyThisUniversity}
            />

            <ProgramRequirements
              selectedProgramObj={selectedProgramObj}
              uploadedDocs={uploadedDocs}
              handleFileUpload={handleFileUpload}
              missingRequirements={missingRequirements}
              readinessData={readinessData}
              programmeId={selectedProgram || null}
            />

            {missingRequirements.length === 0 && selectedProgram && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-green-600 font-medium">
                    ✅ All required documents are already uploaded.
                  </p>
                </CardContent>
              </Card>
            )}

            {showPreview && selectedProgramObj && (
              <ApplicationPreview
                program={selectedProgramObj}
                motivation={motivation}
                whyThisUniversity={whyThisUniversity}
                essayAnswers={essayAnswers}
                readinessData={readinessData}
                includeDocuments={includeDocuments}
              />
            )}

            <SubmitSection
              showPreview={showPreview}
              handleCheckDocuments={handleCheckDocuments}
              handleSubmitApplication={handleSubmitApplication}
              submitting={submitting}
              checkingDocuments={checkingDocuments}
              selectedProgram={selectedProgram}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
