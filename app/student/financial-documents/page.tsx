"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, FileText, CheckCircle, Trash2, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { useCustomToast } from "@/components/custom-toast"
import { BASE_URL, authFetch, getAccessTokenFromStorage } from "@/lib/auth"

interface FinancialDocument {
  id?: number
  name: string
  description: string
  file?: File
  uploaded: boolean
  required: boolean
  minimumAmount?: number
  doc_type?: string
  file_url?: string
  created_at?: string
  updated_at?: string
}

interface ApiFinancialDocument {
  id: number
  doc_type: string
  file: string
  signed_file_url: string
  uploaded_at: string
  is_submitted: boolean
  submitted_at: string | null
}

export default function FinancialDocumentsPage() {
  const { success, error, warning } = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [viewingDoc, setViewingDoc] = useState<string | null>(null)

  // Profile-level financial documents (reusable across all applications)
  // Application-specific documents (fee receipts, scholarship letters) are uploaded during each application
  const [documents, setDocuments] = useState<Record<string, FinancialDocument>>({
    bankBalance: {
      name: "Bank Balance Certificate",
      description: "Proof of sufficient funds (recommended minimum USD $10,000 or equivalent).",
      uploaded: false,
      required: false,
      minimumAmount: 10000,
      doc_type: "bank_balance",
    },
    financialSupport: {
      name: "Letter of Financial Support",
      description: "Letter from a sponsor confirming financial support for your education.",
      uploaded: false,
      required: false,
      doc_type: "financial_support_letter",
    },
    familyRelationship: {
      name: "Certificate of Family Relationship",
      description: "Official document proving your relationship with your financial sponsor.",
      uploaded: false,
      required: false,
      doc_type: "family_relationship_certificate",
    },
    taxDocuments: {
      name: "Sponsor's Tax Documents",
      description: "Income tax return or employment certificate of your financial sponsor.",
      uploaded: false,
      required: false,
      doc_type: "sponsor_tax_documents",
    },
  })

  useEffect(() => {
    const loadDocuments = async () => {
      const token = getAccessTokenFromStorage()
      if (!token) {
        window.location.replace("/login/student")
        return
      }

      setLoading(true)
      try {
        const response = await authFetch(`${BASE_URL}/api/financial-documents/`)
        if (response.ok) {
          const data: ApiFinancialDocument[] = await response.json()
          setDocuments(prev => {
            const updated = { ...prev }
            data.forEach(apiDoc => {
              const docKey = Object.keys(updated).find(key =>
                updated[key].doc_type === apiDoc.doc_type
              )
              if (docKey) {
                updated[docKey] = {
                  ...updated[docKey],
                  id: apiDoc.id,
                  uploaded: true,
                  file_url: apiDoc.signed_file_url,
                  created_at: apiDoc.uploaded_at,
                  updated_at: apiDoc.uploaded_at,
                }
              }
            })
            return updated
          })
        }
      } catch (err) {
        console.error("Error loading documents:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const handleFileUpload = (documentKey: string, file: File | null) => {
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [documentKey]: { ...prev[documentKey], file, uploaded: true },
      }))
    }
  }

  const handleRemoveFile = async (documentKey: string) => {
    const doc = documents[documentKey]

    // If document exists on server (has id), delete it from server first
    if (doc.id) {
      try {
        const response = await authFetch(`${BASE_URL}/api/financial-documents/${doc.id}/`, {
          method: "DELETE",
        })
        if (!response.ok && response.status !== 404) {
          error("Failed to delete document from server")
          return
        }
      } catch (err) {
        console.error("Delete error:", err)
        error("Failed to delete document")
        return
      }
    }

    // Clear local state
    setDocuments(prev => ({
      ...prev,
      [documentKey]: {
        ...prev[documentKey],
        id: undefined,
        file: undefined,
        uploaded: false,
        file_url: undefined,
        created_at: undefined,
        updated_at: undefined,
      },
    }))
    success("Document removed")
  }

  const handleDragOver = (e: React.DragEvent, documentKey: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(documentKey)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, documentKey: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(null)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!validTypes.includes(file.type)) {
        error('Please upload a PDF, JPG, or PNG file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        error('File size must be less than 5MB')
        return
      }
      handleFileUpload(documentKey, file)
    }
  }

  const handleViewDocument = async (documentKey: string) => {
    const doc = documents[documentKey]
    if (!doc.id) {
      // If document is only local (not saved yet), can't view
      warning("Please save the document first to view it.")
      return
    }

    setViewingDoc(documentKey)
    try {
      // Fetch fresh document data with new signed URL
      const response = await authFetch(`${BASE_URL}/api/financial-documents/`)
      if (response.ok) {
        const data: ApiFinancialDocument[] = await response.json()
        const apiDoc = data.find(d => d.id === doc.id)
        if (apiDoc && apiDoc.signed_file_url) {
          window.open(apiDoc.signed_file_url, "_blank")
        } else {
          error("Could not get document URL")
        }
      } else {
        error("Failed to fetch document")
      }
    } catch (err) {
      console.error("View error:", err)
      error("Failed to view document")
    } finally {
      setViewingDoc(null)
    }
  }

  const handleSave = async () => {
    const token = getAccessTokenFromStorage()
    if (!token) {
      error("Please log in first.")
      return
    }

    setSubmitting(true)
    try {
      const uploadResults = []
      for (const [key, doc] of Object.entries(documents)) {
        // Only upload if there's a new file selected (not already saved to server)
        if (doc.file && doc.doc_type && !doc.id) {
          const formData = new FormData()
          formData.append("doc_type", doc.doc_type)
          formData.append("file", doc.file)

          // Use the correct endpoint for creating documents
          const response = await authFetch(`${BASE_URL}/api/financial-documents/`, {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Failed to upload ${doc.name}: ${JSON.stringify(errorData)}`)
          }

          const uploadedDoc = await response.json()

          setDocuments(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              id: uploadedDoc.id,
              uploaded: true,
              file: undefined, // Clear the local file reference
              file_url: uploadedDoc.signed_file_url,
              created_at: uploadedDoc.uploaded_at,
              updated_at: uploadedDoc.uploaded_at,
            },
          }))

          uploadResults.push(uploadedDoc)
        }
      }

      if (uploadResults.length > 0) {
        success(`${uploadResults.length} document(s) saved successfully!`)
      } else {
        // Check if there are any pending files (selected but not yet saved)
        const pendingFiles = Object.values(documents).filter(doc => doc.file && !doc.id)
        if (pendingFiles.length === 0) {
          warning("No new documents to save. All documents are already saved.")
        } else {
          warning("Please select at least one file to upload.")
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      error(`Error uploading documents: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    const token = getAccessTokenFromStorage()
    if (!token) {
      error("Please log in first.")
      return
    }

    setSubmitting(true)
    try {
      const response = await authFetch(`${BASE_URL}/api/financial-documents/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        error(`Submission error: ${JSON.stringify(errorData)}`)
        return
      }

      success("Financial documents submitted successfully!")
    } catch (err: any) {
      console.error("Submit error:", err)
      error(`Submission error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Documents</h1>
          <p className="text-sm text-gray-500">Upload financial documents to verify your financial capacity for studying in Korea.</p>
        </div>
        <Card className="w-48">
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(documents).filter(doc => doc.uploaded).length}
              </p>
              <p className="text-xs text-gray-500">Documents uploaded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Financial Documents</h3>
              <p className="text-sm text-blue-800 mb-2">
                These documents are saved to your profile and can be reused across multiple applications.
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Minimum bank balance of USD $10,000 (or KRW 13,000,000 equivalent).</li>
                <li>• Bank certificate should be issued within the last 3 months.</li>
                <li>• All documents should be officially translated into English or Korean.</li>
              </ul>
              <p className="text-sm text-blue-700 mt-2 italic">
                Note: Application-specific documents (fee receipts, scholarship letters) are uploaded during each application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {Object.entries(documents).map(([key, doc]) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                  {doc.minimumAmount && (
                    <p className="text-sm text-purple-600 font-medium mt-2">
                      Recommended Minimum: ${doc.minimumAmount.toLocaleString()} USD
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {doc.uploaded ? (
                <div
                  className={`flex items-center justify-between p-4 border rounded-lg bg-green-50 cursor-pointer hover:bg-green-100 transition-colors ${
                    viewingDoc === key ? 'opacity-50' : ''
                  }`}
                  onClick={() => handleViewDocument(key)}
                >
                  <div className="flex items-center gap-3">
                    {viewingDoc === key ? (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {doc.file ? doc.file.name : `${doc.name}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                        {doc.file && ` • ${(doc.file.size / 1024).toFixed(2)} KB`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(key)
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <Label htmlFor={key} className="cursor-pointer block">
                  <div
                    className={`flex flex-col items-center justify-center gap-3 px-4 py-12 border-2 border-dashed rounded-lg transition-colors ${
                      dragOver === key
                        ? 'border-purple-500 bg-purple-100'
                        : 'hover:border-purple-400 hover:bg-purple-50'
                    }`}
                    onDragOver={(e) => handleDragOver(e, key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, key)}
                  >
                    <Upload className={`h-8 w-8 ${dragOver === key ? 'text-purple-500' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {dragOver === key ? 'Drop file here' : 'Click or drag file to upload'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG (max 5MB)</p>
                    </div>
                  </div>
                  <Input
                    id={key}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => handleFileUpload(key, e.target.files?.[0] || null)}
                  />
                </Label>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Documents"}
        </Button>
      </div>
    </div>
  )
}
