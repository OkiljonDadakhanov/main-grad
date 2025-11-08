"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, CheckCircle } from "lucide-react"

interface ProgramRequirementsProps {
  selectedProgramObj: any
  uploadedDocs: Record<string, File>
  handleFileUpload: (docName: string, file: File | null) => void
  missingRequirements: any[]
}

export default function ProgramRequirements({
  selectedProgramObj,
  uploadedDocs,
  handleFileUpload,
  missingRequirements,
}: ProgramRequirementsProps) {
  if (!selectedProgramObj) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program-Specific Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedProgramObj.requirements?.length === 0 ? (
          <p className="text-gray-500">No special requirements for this program.</p>
        ) : (
          <>
            {missingRequirements.length === 0 && (
              <p className="text-green-600 font-medium">✅ All required documents uploaded.</p>
            )}

            {missingRequirements.map((req: any) => (
              <div key={req.id} className="space-y-2">
                <Label className="font-medium text-gray-800">{req.label}</Label>
                {req.note && (
                  <p className="text-sm text-gray-500">{req.note}</p>
                )}
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload(req.label, e.target.files?.[0] || null)
                    }
                  />
                  {uploadedDocs[req.label] ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
