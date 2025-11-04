"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ApplicationPreview({ program, motivation, whyThisUniversity, includeDocuments }: any) {
  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="text-green-700">Application Preview</CardTitle>
        <CardDescription>Review before submission</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div><p className="text-sm font-semibold">Program:</p><p>{program?.name}</p></div>
          <div><p className="text-sm font-semibold">Motivation:</p><p>{motivation}</p></div>
          <div><p className="text-sm font-semibold">Why this university:</p><p>{whyThisUniversity}</p></div>
          <div>
            <p className="text-sm font-semibold">Documents Included:</p>
            <ul className="text-sm mt-1 space-y-1">
              {Object.entries(includeDocuments).map(([key, val]) =>
                val ? <li key={key}>✓ {key}</li> : null
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
