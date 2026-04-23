"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, CheckCircle, Trash2, Eye, ArrowLeft, Loader2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BASE_URL, authFetch } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

type DocType =
  | "sop"
  | "study_plan"
  | "recommendation_letter_1"
  | "recommendation_letter_2"
  | "portfolio"
  | "research_proposal"

interface DocMeta {
  key: string
  name: string
  description: string
  required: boolean
  doc_type: DocType
}

interface ServerDoc {
  id: number
  application_id?: number
  doc_type: DocType | string
  text_body?: string | null
  file?: string | null
  note?: string | null
  uploaded_at?: string
  signed_file_url?: string | null
}

const DOCUMENTS: DocMeta[] = [
  {
    key: "sop",
    name: "Statement of Purpose (SOP)",
    description: "Describe your academic background, career goals, and why you want to study in Korea",
    required: true,
    doc_type: "sop",
  },
  {
    key: "studyPlan",
    name: "Study Plan",
    description: "Detailed plan of what you intend to study and your research interests (for graduate programs)",
    required: true,
    doc_type: "study_plan",
  },
  {
    key: "recommendationLetter1",
    name: "Recommendation Letter #1",
    description: "Letter from a professor or professional who can vouch for your academic abilities",
    required: true,
    doc_type: "recommendation_letter_1",
  },
  {
    key: "recommendationLetter2",
    name: "Recommendation Letter #2",
    description: "Second recommendation letter (if required by the university)",
    required: false,
    doc_type: "recommendation_letter_2",
  },
  {
    key: "portfolio",
    name: "Portfolio",
    description: "For arts, design, or creative programs - showcase your work",
    required: false,
    doc_type: "portfolio",
  },
  {
    key: "researchProposal",
    name: "Research Proposal",
    description: "Detailed research proposal for PhD or research-based programs",
    required: false,
    doc_type: "research_proposal",
  },
]

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const obj = data as Record<string, unknown>
  if (typeof obj.detail === "string") return obj.detail
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
      return `${key}: ${val[0]}`
    }
    if (typeof val === "string") return `${key}: ${val}`
  }
  return fallback
}

export default function ApplicationDocumentsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const applicationId = params?.id
  const { success, error, warning } = useCustomToast()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [serverDocs, setServerDocs] = useState<Record<string, ServerDoc | undefined>>({})
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | undefined>>({})
  const [textInputs, setTextInputs] = useState<{ sop: string; study_plan: string }>({
    sop: "",
    study_plan: "",
  })

  const fetchDocs = useCallback(async () => {
    if (!applicationId) return
    try {
      setLoadError(null)
      const res = await authFetch(`${BASE_URL}/api/applications/${applicationId}/docs/`)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(extractErrorMessage(data, "Failed to load documents"))
      }
      const data: ServerDoc[] = await res.json()
      const map: Record<string, ServerDoc | undefined> = {}
      if (Array.isArray(data)) {
        for (const doc of data) {
          const dt = doc.doc_type as string
          const existing = map[dt]
          if (!existing) {
            map[dt] = doc
          } else {
            const a = Date.parse(existing.uploaded_at || "") || 0
            const b = Date.parse(doc.uploaded_at || "") || 0
            if (b >= a) map[dt] = doc
          }
        }
      }
      setServerDocs(map)
      setTextInputs({
        sop: map.sop?.text_body || "",
        study_plan: map.study_plan?.text_body || "",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load documents"
      setLoadError(msg)
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  const handleFileSelect = (key: string, file: File | null) => {
    if (!file) return
    setPendingFiles((prev) => ({ ...prev, [key]: file }))
    success("File selected")
  }

  const handleRemovePending = (key: string, docType: DocType) => {
    setPendingFiles((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (serverDocs[docType]?.file) {
      warning(
        "Note: the previously saved file cannot be deleted from here. Upload a new file to replace it."
      )
    }
  }

  const handleTextChange = (key: "sop" | "study_plan", value: string) => {
    setTextInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handleView = (url?: string | null) => {
    if (!url) {
      error("No file URL available")
      return
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const hasChanges = useMemo(() => {
    if (Object.values(pendingFiles).some(Boolean)) return true
    const sopServer = serverDocs.sop?.text_body || ""
    const planServer = serverDocs.study_plan?.text_body || ""
    if (textInputs.sop.trim() && textInputs.sop !== sopServer) return true
    if (textInputs.study_plan.trim() && textInputs.study_plan !== planServer) return true
    return false
  }, [pendingFiles, serverDocs, textInputs])

  const handleSave = async () => {
    if (!applicationId) return
    if (!hasChanges) {
      warning("Nothing to save")
      return
    }

    setSaving(true)
    const tasks: Array<{ docType: DocType; form: FormData; label: string }> = []

    for (const meta of DOCUMENTS) {
      const dt = meta.doc_type
      const file = pendingFiles[meta.key]
      let text = ""
      if (dt === "sop") text = textInputs.sop
      else if (dt === "study_plan") text = textInputs.study_plan

      const serverText = serverDocs[dt]?.text_body || ""
      const textChanged = !!text.trim() && text !== serverText
      const hasFile = !!file

      if (!textChanged && !hasFile) continue

      const form = new FormData()
      form.append("doc_type", dt)
      if (textChanged || (hasFile && (dt === "sop" || dt === "study_plan") && text.trim())) {
        form.append("text_body", text)
      }
      if (file) form.append("file", file)

      tasks.push({ docType: dt, form, label: meta.name })
    }

    if (tasks.length === 0) {
      warning("Nothing to save")
      setSaving(false)
      return
    }

    let successes = 0
    let failures = 0

    for (const task of tasks) {
      try {
        const res = await authFetch(`${BASE_URL}/api/applications/${applicationId}/docs/`, {
          method: "POST",
          body: task.form,
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const msg = extractErrorMessage(data, `Failed to save ${task.label}`)
          error(`${task.label}: ${msg}`)
          failures += 1
        } else {
          successes += 1
        }
      } catch {
        error(`${task.label}: network error`)
        failures += 1
      }
    }

    if (successes > 0 && failures === 0) {
      success(`Saved ${successes} document${successes === 1 ? "" : "s"}`)
    } else if (successes > 0 && failures > 0) {
      warning(`Saved ${successes}, failed ${failures}`)
    }

    setPendingFiles({})
    await fetchDocs()
    setSaving(false)
  }

  if (!applicationId) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-red-600">Missing application id.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <span className="ml-2 text-sm text-gray-600">Loading documents...</span>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-red-600 font-medium">Failed to load documents</p>
            <p className="text-xs text-gray-500">{loadError}</p>
            <Button variant="outline" size="sm" onClick={fetchDocs}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sopServer = serverDocs.sop
  const planServer = serverDocs.study_plan

  const renderSavedFile = (doc: ServerDoc | undefined) => {
    if (!doc?.file) return null
    const name = typeof doc.file === "string" ? doc.file.split("/").pop() || "Uploaded file" : "Uploaded file"
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 mt-2">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-gray-500">Previously saved. Upload a new file below to replace.</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleView(doc.signed_file_url)}
          disabled={!doc.signed_file_url}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </div>
    )
  }

  const renderPending = (key: string, docType: DocType) => {
    const file = pendingFiles[key]
    if (!file) return null
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 mt-2">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB - ready to save</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRemovePending(key, docType)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </div>
    )
  }

  const renderUploadZone = (key: string, inputId: string) => (
    <Label htmlFor={inputId} className="cursor-pointer block mt-2">
      <div className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg hover:border-purple-400 transition-colors">
        <Upload className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-600">Click to upload PDF, Word, or image</span>
      </div>
      <Input
        id={inputId}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={(e) => handleFileSelect(key, e.target.files?.[0] || null)}
      />
    </Label>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to applications
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Application Documents</h1>
          <p className="text-sm text-gray-500">
            Upload or write your application documents for this application
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Statement / Statement of Purpose</CardTitle>
          <CardDescription>You can either write your statement here or upload a prepared document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sopText">Write your personal statement (Optional)</Label>
            <Textarea
              id="sopText"
              placeholder="Tell us about yourself, your academic background, achievements, and why you want to study in Korea..."
              rows={8}
              value={textInputs.sop}
              onChange={(e) => handleTextChange("sop", e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Character count: {textInputs.sop.length} / 4000</p>
          </div>
          <div className="pt-4 border-t">
            <Label className="mb-2 block">Or upload a prepared document</Label>
            {renderSavedFile(sopServer)}
            {renderPending("sop", "sop")}
            {!pendingFiles.sop && renderUploadZone("sop", "sopFile")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Plan</CardTitle>
          <CardDescription>
            Describe your academic goals and what you plan to study (especially for graduate programs)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="studyPlanText">Write your study plan (Optional)</Label>
            <Textarea
              id="studyPlanText"
              placeholder="Explain your intended field of study, research interests, and long-term academic goals..."
              rows={8}
              value={textInputs.study_plan}
              onChange={(e) => handleTextChange("study_plan", e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Character count: {textInputs.study_plan.length} / 4000
            </p>
          </div>
          <div className="pt-4 border-t">
            <Label className="mb-2 block">Or upload a prepared document</Label>
            {renderSavedFile(planServer)}
            {renderPending("studyPlan", "study_plan")}
            {!pendingFiles.studyPlan && renderUploadZone("studyPlan", "studyPlanFile")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Documents</CardTitle>
          <CardDescription>Upload recommendation letters, portfolio, and other required documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DOCUMENTS.filter((d) => d.key !== "sop" && d.key !== "studyPlan").map((meta) => {
            const server = serverDocs[meta.doc_type]
            return (
              <div key={meta.key} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{meta.name}</p>
                      {meta.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{meta.description}</p>
                  </div>
                </div>
                {renderSavedFile(server)}
                {renderPending(meta.key, meta.doc_type)}
                {!pendingFiles[meta.key] && renderUploadZone(meta.key, `${meta.key}File`)}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Documents"
          )}
        </Button>
      </div>
    </div>
  )
}
