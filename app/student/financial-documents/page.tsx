"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, FileText, CheckCircle, Trash2, Eye, DollarSign } from "lucide-react"
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
  
  const [documents, setDocuments] = useState<Record<string, FinancialDocument>>({
    bankBalance: {
      name: "Bank Balance Certificate",
      description: "Proof of sufficient funds (minimum USD $10,000 or equivalent)",
      uploaded: false,
      required: true,
      minimumAmount: 10000,
      doc_type: "bank_balance",
    },
    financialSupport: {
      name: "Letter of Financial Support",
      description: "Letter from sponsor confirming they will support your education financially",
      uploaded: false,
      required: true,
      doc_type: "financial_support",
    },
    familyRelationship: {
      name: "Certificate of Family Relationship",
      description: "Official document proving relationship with your financial sponsor",
      uploaded: false,
      required: true,
      doc_type: "family_relationship",
    },
    applicationFeeReceipt: {
      name: "Application Fee Payment Receipt",
      description: "Receipt of payment for university application fees",
      uploaded: false,
      required: true,
      doc_type: "application_fee_receipt",
    },
    scholarshipProof: {
      name: "Scholarship Award Letter",
      description: "If applicable, upload your scholarship award letter",
      uploaded: false,
      required: false,
      doc_type: "scholarship_proof",
    },
    taxDocuments: {
      name: "Sponsor's Tax Documents",
      description: "Income tax returns or employment certificate of financial sponsor",
      uploaded: false,
      required: false,
      doc_type: "tax_documents",
    },
  })

  // Load existing documents from API
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
          
          // Update documents with existing data
          setDocuments(prev => {
            const updated = { ...prev }
            data.forEach(apiDoc => {
              // Find the document key by doc_type
              const docKey = Object.keys(updated).find(key => 
                updated[key].doc_type === apiDoc.doc_type
              )
              if (docKey) {
                updated[docKey] = {
                  ...updated[docKey],
                  id: apiDoc.id,
                  uploaded: true,
                  file_url: apiDoc.signed_file_url, // Use signed_file_url for viewing
                  created_at: apiDoc.uploaded_at, // Use uploaded_at as created_at
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
      setDocuments((prev) => ({
        ...prev,
        [documentKey]: { ...prev[documentKey], file, uploaded: true },
      }))
    }
  }

  const handleRemoveFile = (documentKey: string) => {
    setDocuments((prev) => ({
      ...prev,
      [documentKey]: { ...prev[documentKey], file: undefined, uploaded: false },
    }))
  }

  const handleSave = async () => {
    const token = getAccessTokenFromStorage()
    if (!token) {
      error("Siz avval tizimga kiring")
      return
    }

    setSubmitting(true)
    try {
      // Upload each document and update state immediately
      const uploadResults = []
      
      for (const [key, doc] of Object.entries(documents)) {
        if (doc.file && doc.doc_type) {
          const formData = new FormData()
          formData.append('doc_type', doc.doc_type)
          formData.append('file', doc.file)

          const response = await authFetch(`${BASE_URL}/api/financial-documents/save-draft/`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Failed to upload ${doc.name}: ${JSON.stringify(errorData)}`)
          }

          const uploadedDoc = await response.json()
          
          // Update the specific document in state immediately
          setDocuments(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              id: uploadedDoc.id,
              uploaded: true,
              file_url: uploadedDoc.signed_file_url, // Use signed_file_url for viewing
              created_at: uploadedDoc.uploaded_at, // Use uploaded_at as created_at
              updated_at: uploadedDoc.uploaded_at,
            }
          }))
          
          uploadResults.push(uploadedDoc)
        }
      }

      if (uploadResults.length > 0) {
        success(`${uploadResults.length} ta hujjat muvaffaqiyatli yuklandi!`)
      } else {
        warning("Yuklash uchun hujjat tanlang")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      error(`Hujjat yuklashda xatolik: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    const token = getAccessTokenFromStorage()
    if (!token) {
      error("Siz avval tizimga kiring")
      return
    }

    // Check if all required documents are uploaded
    const requiredDocs = Object.values(documents).filter(doc => doc.required)
    const uploadedRequiredDocs = requiredDocs.filter(doc => doc.uploaded)
    
    if (uploadedRequiredDocs.length < requiredDocs.length) {
      warning("Barcha majburiy hujjatlarni yuklang")
      return
    }

    setSubmitting(true)
    try {
      const response = await authFetch(`${BASE_URL}/api/financial-documents/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        error(`Yuborishda xatolik: ${JSON.stringify(errorData)}`)
        return
      }

      success("Moliyaviy hujjatlar muvaffaqiyatli yuborildi!")
    } catch (err: any) {
      console.error("Submit error:", err)
      error(`Yuborishda xatolik: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const uploadedCount = Object.values(documents).filter((doc) => doc.uploaded).length
  const requiredCount = Object.values(documents).filter((doc) => doc.required).length
  const uploadedRequiredCount = Object.values(documents).filter((doc) => doc.required && doc.uploaded).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Hujjatlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Moliyaviy Hujjatlar</h1>
          <p className="text-sm text-gray-500">Koreyada o'qish uchun moliyaviy imkoniyatlaringizni tasdiqlovchi hujjatlarni yuklang</p>
        </div>
        <Card className="w-48">
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">
                {uploadedRequiredCount}/{requiredCount}
              </p>
              <p className="text-xs text-gray-500">Majburiy hujjatlar yuklangan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Requirements Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Moliyaviy Talablar</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Minimal bank balansi USD $10,000 (yoki KRW 13,000,000 ekvivalenti)</li>
                <li>• Bank sertifikati oxirgi 3 oy ichida berilgan bo'lishi kerak</li>
                <li>• Moliyaviy homiy munosabatlarini tasdiqlovchi hujjat taqdim etishi kerak</li>
                <li>• Barcha hujjatlar ingliz yoki koreys tiliga rasmiy tarjima qilingan bo'lishi kerak</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="grid gap-6">
        {Object.entries(documents).map(([key, doc]) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    {doc.required && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Majburiy</span>
                    )}
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                  {doc.minimumAmount && (
                    <p className="text-sm text-purple-600 font-medium mt-2">
                      Minimal miqdor: ${doc.minimumAmount.toLocaleString()} USD
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {doc.uploaded ? (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">
                        {doc.file ? doc.file.name : `${doc.name} hujjati`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Yuklangan: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                        {doc.file && ` • ${(doc.file.size / 1024).toFixed(2)} KB`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-purple-600 bg-transparent"
                      onClick={() => doc.file_url && window.open(doc.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Ko'rish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFile(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> O'chirish
                    </Button>
                  </div>
                </div>
              ) : (
                <Label htmlFor={key} className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 border-2 border-dashed rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Yuklash uchun bosing yoki sudrab tashlang</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (maksimal 5MB)</p>
                    </div>
                  </div>
                  <Input
                    id={key}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(key, e.target.files?.[0] || null)}
                  />
                </Label>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={handleSave}
          disabled={submitting}
        >
          {submitting ? "Saqlanmoqda..." : "Loyiha sifatida saqlash"}
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-purple-600 hover:bg-purple-700"
          disabled={submitting}
        >
          {submitting ? "Yuborilmoqda..." : "Moliyaviy Hujjatlarni Yuborish"}
        </Button>
      </div>
    </div>
  )
}
