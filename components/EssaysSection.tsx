"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface EssaysSectionProps {
  university: any
  readinessData?: any
  essayAnswers?: Record<string, string>
  setEssayAnswers?: (answers: Record<string, string>) => void
  motivation?: string
  setMotivation?: (value: string) => void
  whyThisUniversity?: string
  setWhyThisUniversity?: (value: string) => void
}

export default function EssaysSection({ 
  university, 
  readinessData,
  essayAnswers = {},
  setEssayAnswers,
  motivation = "",
  setMotivation,
  whyThisUniversity = "",
  setWhyThisUniversity
}: EssaysSectionProps) {
  // Extract essay requirements from readiness data (only pure text essays, not document uploads)
  const essayRequirements = readinessData?.requirements?.filter((req: any) => {
    const reqType = req.requirementType?.toLowerCase() || ""
    const label = req.label?.toLowerCase() || ""

    // Exclude document type requirements - those need file uploads, not text
    if (reqType === "document" || reqType === "file" || reqType === "upload") {
      return false
    }

    // Include essay/text type requirements
    if (reqType === "essay" || reqType === "text") {
      return true
    }

    // Include based on label only if NOT a document type
    return (
      label.includes("essay") ||
      label.includes("motivation letter") ||
      (label.includes("why") && !label.includes("document"))
    )
  }) || []

  // If no essay requirements from API, use fallback to old hardcoded essays
  const useDynamicEssays = essayRequirements.length > 0 && readinessData

  const handleEssayChange = (requirementId: string, value: string) => {
    if (setEssayAnswers) {
      setEssayAnswers({
        ...essayAnswers,
        [requirementId]: value
      })
    }
  }

  // Get character limit from requirement note or default
  const getCharacterLimit = (req: any) => {
    if (req.note) {
      const match = req.note.match(/(\d+)\s*(characters?|chars?|words?)/i)
      if (match) {
        return parseInt(match[1])
      }
    }
    return 1000 // default
  }

  if (useDynamicEssays) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Essays</CardTitle>
          <CardDescription>
            Answer these questions for {university?.university_name || "the program"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {essayRequirements.map((req: any) => {
            const reqId = String(req.id)
            const answer = essayAnswers[reqId] || ""
            const charLimit = getCharacterLimit(req)
            const isRequired = req.required !== false
            const isMissing = readinessData?.missing_required?.includes(req.id) && !answer.trim()

            return (
              <div key={reqId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`essay-${reqId}`} className="font-medium">
                    {req.label || "Essay Question"}
                    {isRequired && <span className="text-red-600 ml-1">*</span>}
                  </Label>
                  {isMissing && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                {req.note && (
                  <p className="text-sm text-gray-600 italic">{req.note}</p>
                )}
                <Textarea
                  id={`essay-${reqId}`}
                  rows={6}
                  value={answer}
                  onChange={(e) => handleEssayChange(reqId, e.target.value)}
                  className={isMissing ? "border-red-300" : ""}
                  placeholder={`Enter your response here${charLimit ? ` (max ${charLimit} characters)` : ""}`}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {answer.length} / {charLimit} characters
                  </p>
                  {req.reason && (
                    <p className="text-xs text-amber-600 italic">{req.reason}</p>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  // Fallback to old hardcoded essays
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Essays</CardTitle>
        <CardDescription>Answer these questions for {university?.university_name || "the program"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="motivation">Why do you want to pursue this program? *</Label>
          <Textarea 
            id="motivation" 
            rows={5} 
            value={motivation} 
            onChange={(e) => setMotivation?.(e.target.value)} 
          />
          <p className="text-xs text-gray-500">{motivation.length} / 1000 characters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whyUni">Why {university?.university_name}? *</Label>
          <Textarea 
            id="whyUni" 
            rows={5} 
            value={whyThisUniversity} 
            onChange={(e) => setWhyThisUniversity?.(e.target.value)} 
          />
          <p className="text-xs text-gray-500">{whyThisUniversity.length} / 1000 characters</p>
        </div>
      </CardContent>
    </Card>
  )
}
