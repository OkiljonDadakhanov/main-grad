"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { useCustomToast } from "@/components/custom-toast"
import { authFetch, BASE_URL } from "@/lib/auth"

// ✅ Imported modular components
import ProgramSelector from "@/components/ProgramSelector"
import DocumentsSelector from "@/components/DocumentsSelector"
import EssaysSection from "@/components/EssaysSection"
import ProgramRequirements from "@/components/ProgramRequirements"
import ApplicationPreview from "@/components/ApplicationPreview"
import SubmitSection from "@/components/SubmitSection"

// ✅ Backend API logic encapsulated in hook
import {
  createDraftApplication,
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
  const [documentStatus, setDocumentStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [checkingDocuments, setCheckingDocuments] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // 🧭 Fetch university + programs
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

  // 🧾 Fetch document statuses from user profile
  useEffect(() => {
    const checkDocuments = async () => {
      setCheckingDocuments(true)
      try {
        const [personal, education, certificates, family, financial] = await Promise.all([
          authFetch(`${BASE_URL}/api/personal-documents/`).catch(() => null),
          authFetch(`${BASE_URL}/api/educations/`).catch(() => null),
          authFetch(`${BASE_URL}/api/certificates/important/`).catch(() => null),
          authFetch(`${BASE_URL}/api/family/`).catch(() => null),
          authFetch(`${BASE_URL}/api/financial-documents/`).catch(() => null),
        ])
        const parse = async (res: any) => (res?.ok ? await res.json() : { results: [] })
        const [p, e, c, f, fin] = await Promise.all([
          parse(personal),
          parse(education),
          parse(certificates),
          parse(family),
          parse(financial),
        ])
        setDocumentStatus({
          personal: { hasDocuments: p.results?.length > 0, documents: p.results },
          education: { hasDocuments: e.results?.length > 0, documents: e.results },
          certificates: { hasDocuments: c.results?.length > 0, documents: c.results },
          family: { hasDocuments: f?.length > 0, documents: f },
          financial: { hasDocuments: fin?.length > 0, documents: fin },
        })
      } catch (err) {
        console.error("Error checking documents:", err)
      } finally {
        setCheckingDocuments(false)
      }
    }
    checkDocuments()
  }, [])

  // 📂 File uploads
  const handleFileUpload = (docName: string, file: File | null) => {
    if (file) setUploadedDocs((prev) => ({ ...prev, [docName]: file }))
  }

  // 🧩 Check readiness
  const handleCheckDocuments = async () => {
    const selectedProgramObj = university?.programmes.find((p: any) => String(p.id) === selectedProgram)
    if (!selectedProgram) return error("Please select a program first")
    if (!motivation || !whyThisUniversity) return error("Please fill in all required essays")

    const warnings: string[] = []

    const d = documentStatus
    if (includeDocuments.personalInfo && !d?.personal?.hasDocuments)
      warnings.push("• Personal Information missing")
    if (includeDocuments.education && !d?.education?.hasDocuments)
      warnings.push("• Educational Documents missing")
    if (includeDocuments.certificates && !d?.certificates?.hasDocuments)
      warnings.push("• Certificates missing")
    if (includeDocuments.family && !d?.family?.hasDocuments)
      warnings.push("• Family Information missing")
    if (includeDocuments.financialDocs && !d?.financial?.hasDocuments)
      warnings.push("• Financial Documents missing")

    const requiredDocs = selectedProgramObj?.requirements?.filter((r: any) => r.required) || []
    const uploadedRequiredCount = requiredDocs.filter((r: any) => uploadedDocs[r.label]).length
    if (uploadedRequiredCount < requiredDocs.length)
      warnings.push(`• Missing program-specific documents (${uploadedRequiredCount}/${requiredDocs.length})`)

    if (warnings.length > 0) {
      warning(warnings.join("\n"))
      return
    }
    setShowPreview(true)
  }

  // 🚀 Final Submission
  const handleSubmitApplication = async () => {
    if (!selectedProgram) return error("Select a program before submitting.")
    setSubmitting(true)
    try {
      const appId = await createDraftApplication(Number(selectedProgram))
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

  // 🌀 Loading State
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

  const selectedProgramObj = university?.programmes.find((p: any) => String(p.id) === selectedProgram)

  // 🧩 Render UI
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/student/browse-universities">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply to {university.university_name}</h1>
          <p className="text-sm text-gray-500">Complete your application using your pre-filled profile info</p>
        </div>
      </div>

      {/* Sections */}
      <ProgramSelector
        university={university}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
      />

      <DocumentsSelector
        includeDocuments={includeDocuments}
        setIncludeDocuments={setIncludeDocuments}
        documentStatus={documentStatus}
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
      />

      {showPreview && (
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
    </div>
  )
}
