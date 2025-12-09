"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ApplicationPreview({ 
  program, 
  motivation, 
  whyThisUniversity, 
  essayAnswers,
  readinessData,
  includeDocuments 
}: any) {
  // Extract essay requirements from readiness data
  const essayRequirements = readinessData?.requirements?.filter((req: any) => 
    req.requirementType?.toLowerCase().includes("essay") ||
    req.label?.toLowerCase().includes("essay") ||
    req.label?.toLowerCase().includes("motivation") ||
    req.label?.toLowerCase().includes("statement") ||
    req.label?.toLowerCase().includes("why")
  ) || []

  const useDynamicEssays = essayRequirements.length > 0 && readinessData && essayAnswers

  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="text-green-700">Application Preview</CardTitle>
        <CardDescription>Review before submission</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold">Program:</p>
            <p className="text-gray-700">{program?.name}</p>
          </div>
          
          {useDynamicEssays ? (
            <>
              {essayRequirements.map((req: any) => {
                const reqId = String(req.id)
                const answer = essayAnswers[reqId]
                if (!answer) return null
                
                return (
                  <div key={reqId} className="border-t pt-3">
                    <p className="text-sm font-semibold mb-1">{req.label || "Essay"}:</p>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{answer}</p>
                  </div>
                )
              })}
            </>
          ) : (
            <>
              {motivation && (
                <div>
                  <p className="text-sm font-semibold">Motivation:</p>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{motivation}</p>
                </div>
              )}
              {whyThisUniversity && (
                <div>
                  <p className="text-sm font-semibold">Why this university:</p>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{whyThisUniversity}</p>
                </div>
              )}
            </>
          )}
          
          <div className="border-t pt-3">
            <p className="text-sm font-semibold mb-2">Documents Included:</p>
            <ul className="text-sm mt-1 space-y-1">
              {Object.entries(includeDocuments || {}).map(([key, val]) =>
                val ? <li key={key} className="text-gray-700">✓ {key.replace(/([A-Z])/g, ' $1').trim()}</li> : null
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
