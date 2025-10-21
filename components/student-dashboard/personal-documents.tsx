"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, Trash2, Download } from "lucide-react"
import { useCustomToast } from "@/components/custom-toast"
import { authFetch, BASE_URL } from "@/lib/auth"

interface PersonalDocument {
  id: string
  doc_type: string
  file_name: string
  file_url: string
  uploaded_at: string
  status: string
}

interface DocumentType {
  key: string
  name: string
  required: boolean
}

const DOCUMENT_TYPES: DocumentType[] = [
  { key: "passport_copy", name: "Passport Copy", required: true },
  { key: "passport_photo", name: "Passport-size Photo", required: true },
  { key: "medical_exam_report", name: "Medical Examination Report", required: true },
  { key: "national_id_or_birth_certificate", name: "National ID Card / Birth Certificate", required: true },
  { key: "apostille_birth_certificate", name: "Apostille Birth Certificate", required: false },
]

export default function PersonalDocuments() {
  const { success, error } = useCustomToast()
  const [documents, setDocuments] = useState<PersonalDocument[]>([])
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  // Load existing documents
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await authFetch(`${BASE_URL}/api/personal-documents/`)
      if (response.ok) {
        const data = await response.json()
        const list: unknown = data.results ?? data ?? []
        const normalized = (Array.isArray(list) ? list : [])
          .map((item: any) => ({
            id: String(item.id),
            doc_type: item.doc_type ?? item.document_type ?? "",
            file_name: item.file_name ?? item.name ?? "",
            file_url: item.file_url ?? item.url ?? "",
            uploaded_at: item.uploaded_at ?? item.created_at ?? new Date().toISOString(),
            status: item.status ?? "uploaded",
          }))
        setDocuments(normalized)
      } else if (response.status === 401) {
        error("Authentication required. Please log in again.")
        // Optionally redirect to login
        // window.location.replace("/login/student")
      } else {
        error("Failed to load documents")
      }
    } catch (err) {
      console.error("Error loading documents:", err)
      error("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (documentType: string, file: File | null) => {
    if (!file) return

    setUploading(prev => ({ ...prev, [documentType]: true }))

    try {
      const formData = new FormData()
      formData.append("doc_type", documentType)
      formData.append("file", file)

      const response = await authFetch(`${BASE_URL}/api/personal-documents/`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        success("Document uploaded successfully")
        await loadDocuments() // Reload documents
      } else if (response.status === 401) {
        error("Authentication required. Please log in again.")
      } else {
        const errorData = await response.json().catch(() => ({}))
        error(errorData.error || "Failed to upload document")
      }
    } catch (err) {
      console.error("Upload error:", err)
      error("Failed to upload document")
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }))
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await authFetch(`${BASE_URL}/api/personal-documents/${documentId}/`, {
        method: "DELETE",
      })

      if (response.ok) {
        success("Document deleted successfully")
        await loadDocuments() // Reload documents
      } else if (response.status === 401) {
        error("Authentication required. Please log in again.")
      } else {
        const errorData = await response.json().catch(() => ({}))
        error(errorData.error || "Failed to delete document")
      }
    } catch (err) {
      console.error("Delete error:", err)
      error("Failed to delete document")
    }
  }

  const getDocumentForType = (documentType: string): PersonalDocument | undefined => {
    return documents.find(doc => doc.doc_type === documentType)
  }

  const isDocumentUploaded = (documentType: string): boolean => {
    return !!getDocumentForType(documentType)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Upload your identification and personal documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading documents...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
        <CardDescription>Upload your identification and personal documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DOCUMENT_TYPES.map((docType) => {
          const uploadedDoc = getDocumentForType(docType.key)
          const isUploaded = isDocumentUploaded(docType.key)
          const isUploading = uploading[docType.key]

          return (
            <div key={docType.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">
                    {docType.name}
                    {docType.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {uploadedDoc && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{uploadedDoc.file_name}</p>
                      <span className="text-xs text-gray-400">
                        ({new Date(uploadedDoc.uploaded_at).toLocaleDateString()})
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isUploaded ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {uploadedDoc?.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(uploadedDoc.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(uploadedDoc!.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Label htmlFor={docType.key} className="cursor-pointer">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      isUploading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </span>
                    </div>
                    <Input
                      id={docType.key}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading}
                      onChange={(e) => handleFileUpload(docType.key, e.target.files?.[0] || null)}
                    />
                  </Label>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
