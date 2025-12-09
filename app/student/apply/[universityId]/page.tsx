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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

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

  // 🧩 Check missing requirements using student-readiness API
  useEffect(() => {
    if (!selectedProgram) {
      setMissingRequirements([])
      return
    }

    const fetchMissingRequirements = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/api/programmes/${selectedProgram}/student-readiness/`)
        if (!res.ok) return
        
        const data = await res.json()
        // Get missing required requirements from API
        const missingReqs = (data.requirements || []).filter((req: any) => 
          req.required && 
          req.status === "missing" &&
          data.missing_required?.includes(req.id)
        )
        setMissingRequirements(missingReqs)
      } catch (err) {
        console.error("Error fetching missing requirements:", err)
        setMissingRequirements([])
      }
    }

    fetchMissingRequirements()
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
  const checkStudentReadiness = async (programmeId: string) => {
    try {
      const res = await authFetch(`${BASE_URL}/api/programmes/${programmeId}/student-readiness/`)
      if (!res.ok) {
        warning("Failed to verify readiness. Please try again.")
        return false
      }
      const data = await res.json()
      
      // Use can_apply flag from API response
      if (!data.can_apply) {
        const missingRequiredIds = data.missing_required || []
        const missingRequirements = (data.requirements || []).filter((req: any) => 
          missingRequiredIds.includes(req.id)
        )
        
        const missingList = missingRequirements.length > 0
          ? missingRequirements.map((req: any) => `• ${req.label || req.requirementType || 'Required document'}`).join("\n")
          : "Some required documents or fields are missing."
        warning(`You are not ready to apply:\n${missingList}`)
        return false
      }
      return true
    } catch (err) {
      warning("Failed to verify readiness. Please try again.")
      return false
    }
  }

  // ✅ Check before submission
  const handleCheckDocuments = async () => {
    if (!selectedProgram) return error("Please select a program first")
    if (!motivation || !whyThisUniversity) return error("Please fill in all required essays")

    // Server-side readiness check using API
    const isReady = await checkStudentReadiness(selectedProgram)
    if (!isReady) return

    setShowPreview(true)
  }

  // 🚀 Submit Application (checks readiness first, then creates application)
  const handleSubmitApplication = async () => {
    if (!selectedProgram) return error("Select a program before submitting.")
    if (!motivation || !whyThisUniversity) return error("Please fill in all required essays")
    
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
      await uploadEssays(appId, motivation, whyThisUniversity)
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
