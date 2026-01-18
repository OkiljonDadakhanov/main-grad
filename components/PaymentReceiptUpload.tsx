"use client"

import { useState, useRef } from "react"
import { CreditCard, CheckCircle, Upload, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface PaymentReceiptUploadProps {
  feeAmount: string
  paymentInstructions: string
  receiptFile: File | null
  onFileChange: (file: File | null) => void
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

export function PaymentReceiptUpload({
  feeAmount,
  paymentInstructions,
  receiptFile,
  onFileChange,
}: PaymentReceiptUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      onFileChange(file)
    }
  }

  const handleRemoveFile = () => {
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      onFileChange(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
      <h3 className="font-semibold text-amber-800 flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Application Fee Required
      </h3>
      <p className="text-2xl font-bold text-amber-900 mt-2">${feeAmount} USD</p>

      <div className="mt-4 p-3 bg-white rounded border">
        <p className="text-sm font-medium text-gray-700">Payment Instructions:</p>
        <p className="text-sm text-gray-600 whitespace-pre-wrap mt-1">
          {paymentInstructions || "Please contact the university for payment details."}
        </p>
      </div>

      <div className="mt-4">
        <Label className="text-amber-800">Upload Payment Receipt *</Label>
        <p className="text-xs text-amber-700 mb-2">
          Please upload proof of payment (PDF, JPG, or PNG)
        </p>

        {!receiptFile ? (
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-amber-500 bg-amber-100"
                : "border-amber-300 hover:border-amber-400 hover:bg-amber-100/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragging ? "text-amber-600" : "text-amber-500"}`} />
            <p className="text-sm text-amber-700 font-medium">
              {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              PDF, JPG, JPEG, or PNG (max 10MB)
            </p>
          </div>
        ) : (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">{receiptFile.name}</p>
                <p className="text-xs text-green-600">
                  {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {!receiptFile && (
        <p className="text-xs text-amber-700 mt-3 bg-amber-100 p-2 rounded">
          You must upload a payment receipt before submitting your application.
        </p>
      )}
    </div>
  )
}
