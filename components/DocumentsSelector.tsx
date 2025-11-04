"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertCircle } from "lucide-react"
import React from "react"

export default function DocumentsSelector({ includeDocuments, setIncludeDocuments, documentStatus }: any) {
  const items = [
    { key: "personalInfo", label: "Personal Information & Documents", data: documentStatus?.personal },
    { key: "education", label: "Educational Documents (Diplomas, Transcripts)", data: documentStatus?.education },
    { key: "certificates", label: "Certificates (Language, Professional)", data: documentStatus?.certificates },
    { key: "family", label: "Family Information & Documents", data: documentStatus?.family },
    { key: "applicationDocs", label: "Application Documents (Statement, Recommendations)" },
    { key: "financialDocs", label: "Financial Documents (Bank, Sponsorship)", data: documentStatus?.financial },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Include Documents from Your Profile</CardTitle>
        <CardDescription>Select which documents to include</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center space-x-2">
            <Checkbox
              id={item.key}
              checked={includeDocuments[item.key]}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev: any) => ({ ...prev, [item.key]: checked as boolean }))
              }
            />
            <label
              htmlFor={item.key}
              className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2"
            >
              {item.label}
              {item.data && (item.data.hasDocuments
                ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                : <AlertCircle className="h-4 w-4 text-red-500" />)}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
