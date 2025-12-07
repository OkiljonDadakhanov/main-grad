"use client"

import React, { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/components/custom-toast"
import { authFetch, BASE_URL } from "@/lib/auth"

import HeaderSection from "@/components/HeaderSection"
import ApplySections from "@/components/ApplySections"
import SubmitActions from "@/components/SubmitActions"
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
  // --------------------------------------

  // ✅ Check before submission
  const handleCheckDocuments = async () => {
    if (!selectedProgram) return error("Please select a program first")
    if (!motivation || !whyThisUniversity) return error("Please fill in all required essays")

    // Server-side readiness check using API
    const isReady = await checkStudentReadiness(selectedProgram)
    if (!isReady) return

    setShowPreview(true)
  }

  // 🚀 Submit Application
  const handleSubmitApplication = async () => {
    if (!selectedProgram) return error("Select a program before submitting.")
    setSubmitting(true)
    try {
      // create application via POST /api/applications/
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

  const selectedProgramObj = university?.programmes.find(
    (p: any) => String(p.id) === selectedProgram
  )

  return (
    <div className="space-y-6">
      <HeaderSection universityName={university.university_name} />

      <ApplySections
        university={university}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        includeDocuments={includeDocuments}
        setIncludeDocuments={setIncludeDocuments}
        documentStatus={documentStatus}
        motivation={motivation}
        setMotivation={setMotivation}
        whyThisUniversity={whyThisUniversity}
        setWhyThisUniversity={setWhyThisUniversity}
        selectedProgramObj={selectedProgramObj}
        uploadedDocs={uploadedDocs}
        handleFileUpload={handleFileUpload}
        missingRequirements={missingRequirements}
        showPreview={showPreview}
      />

      <SubmitActions
        showPreview={showPreview}
        handleCheckDocuments={handleCheckDocuments}
        handleSubmitApplication={handleSubmitApplication}
        submitting={submitting}
        checkingDocuments={checkingDocuments}
        selectedProgram={selectedProgram}
      />
    </div>
  )
}
