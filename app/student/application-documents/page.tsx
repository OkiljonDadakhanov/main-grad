"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, CheckCircle, Trash2, Eye } from "lucide-react"
import { useState } from "react"
import { BASE_URL, authFetch } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

interface DocumentUpload {
  name: string
  description: string
  file?: File
  uploaded: boolean
  required: boolean
  doc_type: string
}

const DOCUMENT_TYPES: Record<string, DocumentUpload> = {
  sop: {
    name: "Statement of Purpose (SOP)",
    description: "Describe your academic background, career goals, and why you want to study in Korea",
    uploaded: false,
    required: true,
    doc_type: "sop",
  },
  studyPlan: {
    name: "Study Plan",
    description: "Detailed plan of what you intend to study and your research interests (for graduate programs)",
    uploaded: false,
    required: true,
    doc_type: "study_plan",
  },
  recommendationLetter1: {
    name: "Recommendation Letter #1",
    description: "Letter from a professor or professional who can vouch for your academic abilities",
    uploaded: false,
    required: true,
    doc_type: "recommendation_letter_1",
  },
  recommendationLetter2: {
    name: "Recommendation Letter #2",
    description: "Second recommendation letter (if required by the university)",
    uploaded: false,
    required: false,
    doc_type: "recommendation_letter_2",
  },
  portfolio: {
    name: "Portfolio",
    description: "For arts, design, or creative programs - showcase your work",
    uploaded: false,
    required: false,
    doc_type: "portfolio",
  },
  researchProposal: {
    name: "Research Proposal",
    description: "Detailed research proposal for PhD or research-based programs",
    uploaded: false,
    required: false,
    doc_type: "research_proposal",
  },
}

export default function ApplicationDocumentsPage() {
  const { success, error, warning } = useCustomToast()
  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>(DOCUMENT_TYPES)
  const [submitting, setSubmitting] = useState(false)

  const [textInputs, setTextInputs] = useState({
    personalStatementText: "",
    studyPlanText: "",
  })

  const handleFileUpload = (documentKey: string, file: File | null) => {
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [documentKey]: { ...prev[documentKey], file, uploaded: true },
      }))
      success("File selected successfully")
    }
  }

  const handleRemoveFile = (documentKey: string) => {
    setDocuments((prev) => ({
      ...prev,
      [documentKey]: { ...prev[documentKey], file: undefined, uploaded: false },
    }))
  }

  const handleTextChange = (key: string, value: string) => {
    setTextInputs((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setSubmitting(true)
    try {
      // Count uploaded files and text inputs
      const uploadedFiles = Object.values(documents).filter(doc => doc.uploaded && doc.file)
      const hasTextInput = textInputs.personalStatementText.trim() || textInputs.studyPlanText.trim()
      
      if (uploadedFiles.length === 0 && !hasTextInput) {
        warning("Please upload at least one document or write some text")
        return
      }

      // TODO: Implement actual API call when application_id is available
      // For now, simulate save
      await new Promise(resolve => setTimeout(resolve, 500))
      
      success("Application documents saved successfully!")
    } catch (err) {
      error("Failed to save documents")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Application Documents</h1>
        <p className="text-sm text-gray-500">
          Upload or write your application documents required for university admission
        </p>
      </div>

      {/* Personal Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Statement / Statement of Purpose</CardTitle>
          <CardDescription>You can either write your statement here or upload a prepared document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="personalStatementText">Write your personal statement (Optional)</Label>
            <Textarea
              id="personalStatementText"
              placeholder="Tell us about yourself, your academic background, achievements, and why you want to study in Korea..."
              rows={8}
              value={textInputs.personalStatementText}
              onChange={(e) => handleTextChange("personalStatementText", e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Character count: {textInputs.personalStatementText.length} / 4000
            </p>
          </div>
          <div className="pt-4 border-t">
            <Label className="mb-2 block">Or upload a prepared document</Label>
            {documents.sop.uploaded && documents.sop.file ? (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">{documents.sop.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(documents.sop.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFile("sop")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Label htmlFor="sop" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload PDF or Word document</span>
                </div>
                <Input
                  id="sop"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload("sop", e.target.files?.[0] || null)}
                />
              </Label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Study Plan */}
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
              value={textInputs.studyPlanText}
              onChange={(e) => handleTextChange("studyPlanText", e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Character count: {textInputs.studyPlanText.length} / 4000</p>
          </div>
          <div className="pt-4 border-t">
            <Label className="mb-2 block">Or upload a prepared document</Label>
            {documents.studyPlan.uploaded && documents.studyPlan.file ? (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">{documents.studyPlan.file.name}</p>
                    <p className="text-xs text-gray-500">{(documents.studyPlan.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFile("studyPlan")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Label htmlFor="studyPlan" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload PDF or Word document</span>
                </div>
                <Input
                  id="studyPlan"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload("studyPlan", e.target.files?.[0] || null)}
                />
              </Label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Other Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Documents</CardTitle>
          <CardDescription>Upload recommendation letters, portfolio, and other required documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(documents)
            .filter(([key]) => !["sop", "studyPlan"].includes(key))
            .map(([key, doc]) => (
              <div key={key} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{doc.name}</p>
                      {doc.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  </div>
                </div>
                {doc.uploaded && doc.file ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">{doc.file.name}</p>
                        <p className="text-xs text-gray-500">{(doc.file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFile(key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Label htmlFor={key} className="cursor-pointer block mt-2">
                    <div className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                      <Upload className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload</span>
                    </div>
                    <Input
                      id={key}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(key, e.target.files?.[0] || null)}
                    />
                  </Label>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6">
        <Button 
          onClick={handleSave} 
          className="bg-purple-600 hover:bg-purple-700"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save All Documents"}
        </Button>
      </div>
    </div>
  )
}
