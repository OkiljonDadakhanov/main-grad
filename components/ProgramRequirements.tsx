"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Upload, CheckCircle2 } from "lucide-react"

export default function ProgramRequirements({ selectedProgramObj, uploadedDocs, handleFileUpload }: any) {
  if (!selectedProgramObj) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program-Specific Requirements</CardTitle>
        <CardDescription>Upload required documents for this program</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedProgramObj.requirements.map((req: any) => (
          <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-sm">
                  {req.label} {req.required && <span className="text-red-500">*</span>}
                </p>
                {req.note && <p className="text-xs text-gray-500">{req.note}</p>}
                {uploadedDocs[req.label] && (
                  <p className="text-xs text-gray-500">Uploaded: {uploadedDocs[req.label].name}</p>
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
  )
}
