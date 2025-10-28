"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

interface ProgramRequirement {
  id: number
  requirementType: string
  label: string
  required: boolean
  note?: string | null
}

interface Program {
  id: number
  university_id: number
  field_of_study: string
  degreeType: string
  name: string
  contractPrice: string
  platformApplicationFee: string
  about_program: string
  application_guide_url: string | null
  application_form_url: string | null
  start_date: string
  end_date: string
  results_announcement_date: string
  active: boolean
  requirements: ProgramRequirement[]
}

interface University {
  id: number
  university_name: string
  logo_url: string | null
  city: string
  classification: string
  address: string
  website: string
  programmes: Program[]
}

interface DocumentStatus {
  hasDocuments: boolean
  documents: any[]
  missingCount: number
}

interface ApplicationDocuments {
  personal: DocumentStatus
  education: DocumentStatus
  certificates: DocumentStatus
  family: DocumentStatus
  application: DocumentStatus
  financial: DocumentStatus
}

export default function ApplyToUniversityPage({ params }: { params: Promise<{ universityId: string }> }) {
  // ✅ unwrap params safely for React 19 / Next 15
  const resolvedParams = React.use(params)
  const universityId = resolvedParams.universityId
  const router = useRouter()
  const { success, error, warning } = useCustomToast()

  const [university, setUniversity] = useState<University | null>(null)
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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [documentStatus, setDocumentStatus] = useState<ApplicationDocuments | null>(null)
  const [checkingDocuments, setCheckingDocuments] = useState(false)
  const [showPreview, setShowPreview] = useState(false)


  // 🧭 Fetch university + program data
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true)
        const response = await authFetch(`${BASE_URL}/api/auth/universities/${universityId}/`)
        if (!response.ok) throw new Error("Failed to fetch university details")

        const data: University = await response.json()
        setUniversity(data)
      } catch (err) {
        console.error("Error loading university:", err)
        error("Failed to load university information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUniversity()
  }, [universityId])

  // Check document status from various APIs
  useEffect(() => {
    const checkDocuments = async () => {
      setCheckingDocuments(true)
      try {
        // Fetch all document types in parallel
        const [personalRes, educationRes, certificatesRes, familyRes, financialRes] = await Promise.all([
          authFetch(`${BASE_URL}/api/personal-documents/`).catch(() => null),
          authFetch(`${BASE_URL}/api/educations/`).catch(() => null),
          authFetch(`${BASE_URL}/api/certificates/important/`).catch(() => null),
          authFetch(`${BASE_URL}/api/family/`).catch(() => null),
          authFetch(`${BASE_URL}/api/financial-documents/`).catch(() => null),
        ])

        const personalData = personalRes?.ok ? await personalRes.json() : { results: [] }
        const educationData = educationRes?.ok ? await educationRes.json() : { results: [] }
        const certificatesData = certificatesRes?.ok ? await certificatesRes.json() : { results: [] }
        const familyData = familyRes?.ok ? await familyRes.json() : []
        const financialData = financialRes?.ok ? await financialRes.json() : []

        setDocumentStatus({
          personal: {
            hasDocuments: Array.isArray(personalData?.results || personalData) && (personalData?.results || personalData).length > 0,
            documents: personalData?.results || personalData || [],
            missingCount: 0,
          },
          education: {
            hasDocuments: Array.isArray(educationData?.results || educationData) && (educationData?.results || educationData).length > 0,
            documents: educationData?.results || educationData || [],
            missingCount: 0,
          },
          certificates: {
            hasDocuments: Array.isArray(certificatesData?.results || certificatesData) && (certificatesData?.results || certificatesData).length > 0,
            documents: certificatesData?.results || certificatesData || [],
            missingCount: 0,
          },
          family: {
            hasDocuments: Array.isArray(familyData) && familyData.length > 0,
            documents: familyData || [],
            missingCount: 0,
          },
          application: {
            hasDocuments: false, // Application docs are uploaded per-application
            documents: [],
            missingCount: 0,
          },
          financial: {
            hasDocuments: Array.isArray(financialData) && financialData.length > 0,
            documents: financialData || [],
            missingCount: 0,
          },
        })
      } catch (err) {
        console.error("Error checking documents:", err)
      } finally {
        setCheckingDocuments(false)
      }
    }
    checkDocuments()
  }, [])

  const handleFileUpload = (docName: string, file: File | null) => {
    if (file) {
      setUploadedDocs((prev) => ({ ...prev, [docName]: file }))
    }
  }

  const handleCheckDocuments = async () => {
    const selectedProgramObj = university?.programmes.find((p) => String(p.id) === selectedProgram)
    
    if (!selectedProgram) {
      error("Please select a program first")
      return
    }

    if (!motivation || !whyThisUniversity) {
      error("Please fill in all required essays")
      return
    }

    const warnings: string[] = []
    
    // Check profile documents if included
    if (includeDocuments.personalInfo && !documentStatus?.personal.hasDocuments) {
      warnings.push("• Personal Information & Documents are missing")
    }
    if (includeDocuments.education && !documentStatus?.education.hasDocuments) {
      warnings.push("• Educational Documents are missing")
    }
    if (includeDocuments.certificates && !documentStatus?.certificates.hasDocuments) {
      warnings.push("• Certificates are missing")
    }
    if (includeDocuments.family && !documentStatus?.family.hasDocuments) {
      warnings.push("• Family Information & Documents are missing")
    }
    if (includeDocuments.financialDocs && !documentStatus?.financial.hasDocuments) {
      warnings.push("• Financial Documents are missing")
    }

    // Check program-specific requirements
    const requiredDocs = selectedProgramObj?.requirements.filter(r => r.required) || []
    const uploadedRequiredCount = requiredDocs.filter(r => uploadedDocs[r.label]).length
    if (uploadedRequiredCount < requiredDocs.length) {
      warnings.push(`• Some required program documents are missing (${uploadedRequiredCount}/${requiredDocs.length} uploaded)`)
    }

    if (warnings.length > 0) {
      warning(warnings.join("\n"))
      return
    }

    setShowPreview(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedProgram) {
      error("Please select a program before submitting.")
      return
    }

    const selectedProgramObj = university?.programmes.find((p) => String(p.id) === selectedProgram)
    
    setSubmitting(true)
    try {
      const payload = {
        programme_id: selectedProgramObj?.id,
        motivation_statement: motivation,
        why_this_university: whyThisUniversity,
        include_personal_info: includeDocuments.personalInfo,
        include_education: includeDocuments.education,
        include_certificates: includeDocuments.certificates,
        include_family: includeDocuments.family,
        include_application_docs: includeDocuments.applicationDocs,
        include_financial_docs: includeDocuments.financialDocs,
      }

      const response = await authFetch(`${BASE_URL}/api/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to submit application")
      }

      success(`Your application to ${university?.university_name} has been submitted successfully!`)
      router.push("/student/my-applications")
    } catch (err) {
      console.error(err)
      error(err instanceof Error ? err.message : "Something went wrong. Please try again.")
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
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">University not found</p>
            <Link href="/student/browse-universities">
              <Button className="mt-4 bg-transparent" variant="outline">
                Back to Browse
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedProgramObj = university?.programmes.find((p) => String(p.id) === selectedProgram)

  // Helper to render program description with formatting
  const renderProgramDescription = (text: string) => {
    const paragraphs = text.split(/\r?\n/).filter(Boolean)
    return (
      <div className="mt-3 space-y-2 text-sm text-gray-700 leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/student/browse-universities">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Apply to {university.university_name}
          </h1>
          <p className="text-sm text-gray-500">
            Complete your application using your pre-filled profile information
          </p>
        </div>
      </div>

      {/* University Banner */}
      {university.logo_url && (
        <div className="flex items-center gap-3">
          <Image
            src={university.logo_url}
            alt={university.university_name}
            width={80}
            height={80}
            className="object-contain"
          />
          <div>
            <p className="text-sm text-gray-600">
              {university.city} • {university.classification}
            </p>
          </div>
        </div>
      )}

      {/* Program Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Program</CardTitle>
          <CardDescription>Choose the program you want to apply for</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger>
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              {university.programmes.filter(p => p.active).map((program) => (
                <SelectItem key={program.id} value={String(program.id)}>
                  {program.name} ({program.degreeType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedProgramObj && (
            <>
              {renderProgramDescription(selectedProgramObj.about_program)}
              {selectedProgramObj.contractPrice && parseFloat(selectedProgramObj.contractPrice) > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900">Contract Price</p>
                  <p className="text-lg font-bold text-purple-600">${parseFloat(selectedProgramObj.contractPrice).toLocaleString()}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Include Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Include Documents from Your Profile</CardTitle>
          <CardDescription>Select which documents from your profile to include</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="personalInfo"
              checked={includeDocuments.personalInfo}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, personalInfo: checked as boolean }))
              }
            />
            <label htmlFor="personalInfo" className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2">
              Personal Information & Documents
              {documentStatus && (
                documentStatus.personal.hasDocuments ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="education"
              checked={includeDocuments.education}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, education: checked as boolean }))
              }
            />
            <label htmlFor="education" className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2">
              Educational Documents (Diplomas, Transcripts)
              {documentStatus && (
                documentStatus.education.hasDocuments ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="certificates"
              checked={includeDocuments.certificates}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, certificates: checked as boolean }))
              }
            />
            <label htmlFor="certificates" className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2">
              Certificates (Language, Professional)
              {documentStatus && (
                documentStatus.certificates.hasDocuments ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="family"
              checked={includeDocuments.family}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, family: checked as boolean }))
              }
            />
            <label htmlFor="family" className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2">
              Family Information & Documents
              {documentStatus && (
                documentStatus.family.hasDocuments ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="applicationDocs"
              checked={includeDocuments.applicationDocs}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, applicationDocs: checked as boolean }))
              }
            />
            <label htmlFor="applicationDocs" className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2">
              Application Documents (Statement, Recommendations)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="financialDocs"
              checked={includeDocuments.financialDocs}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, financialDocs: checked as boolean }))
              }
            />
            <label htmlFor="financialDocs" className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2">
              Financial Documents (Bank, Sponsorship)
              {documentStatus && (
                documentStatus.financial.hasDocuments ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Essays */}
      <Card>
        <CardHeader>
          <CardTitle>Application Essays</CardTitle>
          <CardDescription>
            Answer these questions specifically for {university.university_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="motivation">
              Why do you want to pursue this program? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivation"
              placeholder="Explain your motivation and goals..."
              rows={5}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
            <p className="text-xs text-gray-500">{motivation.length} / 1000 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whyUniversity">
              Why {university.university_name}? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="whyUniversity"
              placeholder={`Explain why you chose ${university.university_name} specifically...`}
              rows={5}
              value={whyThisUniversity}
              onChange={(e) => setWhyThisUniversity(e.target.value)}
            />
            <p className="text-xs text-gray-500">{whyThisUniversity.length} / 1000 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      {selectedProgramObj && (
        <Card>
          <CardHeader>
            <CardTitle>Program-Specific Requirements</CardTitle>
            <CardDescription>Upload documents required for this program</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProgramObj.requirements.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">
                      {req.label}
                      {req.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    {req.note && <p className="text-xs text-gray-500">{req.note}</p>}
                    {uploadedDocs[req.label] && (
                      <p className="text-xs text-gray-500">
                        Uploaded: {uploadedDocs[req.label].name}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {uploadedDocs[req.label] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Label htmlFor={req.label} className="cursor-pointer">
                      <div className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload</span>
                      </div>
                      <Input
                        id={req.label}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.png,.doc,.docx"
                        onChange={(e) => handleFileUpload(req.label, e.target.files?.[0] || null)}
                      />
                    </Label>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {showPreview && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700">Application Preview</CardTitle>
            <CardDescription>Review your application before submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Program:</p>
                <p className="text-sm text-gray-600">{selectedProgramObj?.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Motivation Statement:</p>
                <p className="text-sm text-gray-600 line-clamp-3">{motivation}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Why This University:</p>
                <p className="text-sm text-gray-600 line-clamp-3">{whyThisUniversity}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Documents Included:</p>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {includeDocuments.personalInfo && <li>✓ Personal Information</li>}
                  {includeDocuments.education && <li>✓ Educational Documents</li>}
                  {includeDocuments.certificates && <li>✓ Certificates</li>}
                  {includeDocuments.family && <li>✓ Family Information</li>}
                  {includeDocuments.applicationDocs && <li>✓ Application Documents</li>}
                  {includeDocuments.financialDocs && <li>✓ Financial Documents</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Before submitting:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Review all information in your profile</li>
                  <li>Ensure required documents are uploaded</li>
                  <li>Double-check your essays for clarity</li>
                  <li>Make sure you selected the correct program</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/student/browse-universities" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            {!showPreview ? (
              <Button
                onClick={handleCheckDocuments}
                disabled={submitting || !selectedProgram}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {checkingDocuments ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </span>
                ) : (
                  "Check & Preview"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
