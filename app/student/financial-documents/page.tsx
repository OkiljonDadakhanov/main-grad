"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, FileText, CheckCircle, Trash2, Eye, DollarSign } from "lucide-react"
import { useState } from "react"

interface FinancialDocument {
  name: string
  description: string
  file?: File
  uploaded: boolean
  required: boolean
  minimumAmount?: number
}

export default function FinancialDocumentsPage() {
  const [documents, setDocuments] = useState<Record<string, FinancialDocument>>({
    bankBalance: {
      name: "Bank Balance Certificate",
      description: "Proof of sufficient funds (minimum USD $10,000 or equivalent)",
      uploaded: false,
      required: true,
      minimumAmount: 10000,
    },
    financialSupport: {
      name: "Letter of Financial Support",
      description: "Letter from sponsor confirming they will support your education financially",
      uploaded: false,
      required: true,
    },
    familyRelationship: {
      name: "Certificate of Family Relationship",
      description: "Official document proving relationship with your financial sponsor",
      uploaded: false,
      required: true,
    },
    applicationFeeReceipt: {
      name: "Application Fee Payment Receipt",
      description: "Receipt of payment for university application fees",
      uploaded: false,
      required: true,
    },
    scholarshipProof: {
      name: "Scholarship Award Letter",
      description: "If applicable, upload your scholarship award letter",
      uploaded: false,
      required: false,
    },
    taxDocuments: {
      name: "Sponsor's Tax Documents",
      description: "Income tax returns or employment certificate of financial sponsor",
      uploaded: false,
      required: false,
    },
  })

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

  const handleSave = () => {
    console.log("Financial Documents:", documents)
    alert("Financial documents saved successfully!")
  }

  const uploadedCount = Object.values(documents).filter((doc) => doc.uploaded).length
  const requiredCount = Object.values(documents).filter((doc) => doc.required).length
  const uploadedRequiredCount = Object.values(documents).filter((doc) => doc.required && doc.uploaded).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Financial Documents</h1>
          <p className="text-sm text-gray-500">Upload proof of financial capability for your studies in Korea</p>
        </div>
        <Card className="w-48">
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">
                {uploadedRequiredCount}/{requiredCount}
              </p>
              <p className="text-xs text-gray-500">Required uploaded</p>
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
              <h3 className="font-semibold text-blue-900 mb-1">Financial Requirements</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Minimum bank balance of USD $10,000 (or KRW 13,000,000 equivalent)</li>
                <li>• Bank certificate must be dated within last 3 months</li>
                <li>• Financial sponsor must provide proof of relationship</li>
                <li>• All documents must be officially translated to English or Korean</li>
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
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Required</span>
                    )}
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                  {doc.minimumAmount && (
                    <p className="text-sm text-purple-600 font-medium mt-2">
                      Minimum amount: ${doc.minimumAmount.toLocaleString()} USD
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {doc.uploaded && doc.file ? (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.file.name}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date().toLocaleDateString()} • {(doc.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-purple-600 bg-transparent">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFile(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Label htmlFor={key} className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 border-2 border-dashed rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
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
        <Button variant="outline">Save as Draft</Button>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          Submit Financial Documents
        </Button>
      </div>
    </div>
  )
}
