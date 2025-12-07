"use client"

import { useState, useEffect } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"

export interface Requirement {
  id: number
  requirementType: string
  label: string
  required: boolean
  note: string | null
  status: "missing" | "satisfied" | "partial"
  reason: string | null
  matched_record: any | null
}

export interface StudentReadinessResponse {
  requirements: Requirement[]
  satisfied: number[]
  missing_required: number[]
  can_apply: boolean
}

export interface DocumentCategoryStatus {
  key: string
  label: string
  hasMissingRequired: boolean
  hasPartial: boolean
  allSatisfied: boolean
  requirements: Requirement[]
}

export function useStudentReadiness(programmeId: string | null) {
  const [readiness, setReadiness] = useState<StudentReadinessResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!programmeId) {
      setReadiness(null)
      return
    }

    const fetchReadiness = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await authFetch(`${BASE_URL}/api/programmes/${programmeId}/student-readiness/`)
        if (!res.ok) {
          throw new Error("Failed to fetch student readiness")
        }
        const data = await res.json()
        setReadiness(data)
      } catch (err) {
        console.error("Error fetching student readiness:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch readiness")
        setReadiness(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReadiness()
  }, [programmeId])

  // Map requirements to document categories
  const getDocumentCategoryStatus = (): DocumentCategoryStatus[] => {
    if (!readiness || !readiness.requirements) {
      return []
    }

    const categoryMapping: Record<string, { key: string; label: string; requirementTypes: string[] }> = {
      personalInfo: {
        key: "personalInfo",
        label: "Personal Information & Documents",
        requirementTypes: ["passport", "personal_info", "personal_information", "passport_number", "date_of_birth", "address"],
      },
      education: {
        key: "education",
        label: "Educational Documents (Diplomas, Transcripts)",
        requirementTypes: ["education", "diploma", "transcript", "degree", "educational_documents"],
      },
      certificates: {
        key: "certificates",
        label: "Certificates (Language, Professional)",
        requirementTypes: ["certificate", "language", "ielts", "toefl", "topik", "language_certificate", "professional_certificate"],
      },
      family: {
        key: "family",
        label: "Family Information & Documents",
        requirementTypes: ["family", "family_info", "family_information", "family_documents"],
      },
      applicationDocs: {
        key: "applicationDocs",
        label: "Application Documents (Statement, Recommendations)",
        requirementTypes: ["application", "statement", "recommendation", "essay", "application_documents"],
      },
      financialDocs: {
        key: "financialDocs",
        label: "Financial Documents (Bank, Sponsorship)",
        requirementTypes: ["financial", "bank", "sponsorship", "financial_documents", "bank_statement"],
      },
    }

    const categories: Record<string, DocumentCategoryStatus> = {}

    // Initialize all categories
    Object.values(categoryMapping).forEach((cat) => {
      categories[cat.key] = {
        key: cat.key,
        label: cat.label,
        hasMissingRequired: false,
        hasPartial: false,
        allSatisfied: true,
        requirements: [],
      }
    })

    // Map requirements to categories
    readiness.requirements.forEach((req) => {
      const reqType = req.requirementType?.toLowerCase() || ""
      const reqLabel = req.label?.toLowerCase() || ""

      let matchedCategory: string | null = null

      // Priority 1: Match by label keywords (more reliable than requirementType)
      if (reqLabel.includes("passport") || reqLabel.includes("personal") || reqLabel.includes("birth") || reqLabel.includes("identity")) {
        matchedCategory = "personalInfo"
      } else if (reqLabel.includes("education") || reqLabel.includes("diploma") || reqLabel.includes("transcript") || reqLabel.includes("degree") || reqLabel.includes("academic")) {
        matchedCategory = "education"
      } else if (reqLabel.includes("ielts") || reqLabel.includes("toefl") || reqLabel.includes("topik") || reqLabel.includes("language") || reqLabel.includes("certificate") || reqLabel.includes("score")) {
        matchedCategory = "certificates"
      } else if (reqLabel.includes("family")) {
        matchedCategory = "family"
      } else if (reqLabel.includes("statement") || reqLabel.includes("recommendation") || reqLabel.includes("essay") || reqLabel.includes("letter") || reqLabel.includes("motivation")) {
        matchedCategory = "applicationDocs"
      } else if (reqLabel.includes("financial") || reqLabel.includes("bank") || reqLabel.includes("sponsorship") || reqLabel.includes("fund")) {
        matchedCategory = "financialDocs"
      }

      // Priority 2: If no label match, try requirementType
      if (!matchedCategory) {
        for (const [key, cat] of Object.entries(categoryMapping)) {
          if (cat.requirementTypes.some((type) => reqType.includes(type) || reqLabel.includes(type))) {
            matchedCategory = key
            break
          }
        }
      }

      // Priority 3: Match by requirementType directly
      if (!matchedCategory) {
        const typeMap: Record<string, string> = {
          passport: "personalInfo",
          personal_info: "personalInfo",
          personal_information: "personalInfo",
          education: "education",
          educational_documents: "education",
          certificate: "certificates",
          language: "certificates",
          family: "family",
          family_info: "family",
          application: "applicationDocs",
          application_documents: "applicationDocs",
          financial: "financialDocs",
          financial_documents: "financialDocs",
        }
        
        for (const [type, category] of Object.entries(typeMap)) {
          if (reqType.includes(type)) {
            matchedCategory = category
            break
          }
        }
      }

      // Default: if no match found, try to infer from common patterns
      if (!matchedCategory) {
        // If it's clearly a language test score, map to certificates
        if (/^\d+\.?\d*/.test(reqLabel) && (reqLabel.includes("overall") || reqLabel.includes("score"))) {
          matchedCategory = "certificates"
        } else {
          // Default to personalInfo as fallback
          matchedCategory = "personalInfo"
        }
      }

      const category = categories[matchedCategory]
      if (category) {
        category.requirements.push(req)
        // Use both status field and missing_required/satisfied arrays for accuracy
        const isMissing = readiness.missing_required?.includes(req.id) || req.status === "missing"
        const isSatisfied = readiness.satisfied?.includes(req.id) || req.status === "satisfied"
        
        if (isMissing && req.required) {
          category.hasMissingRequired = true
          category.allSatisfied = false
        } else if (req.status === "partial") {
          category.hasPartial = true
          category.allSatisfied = false
        }
      }
    })

    // Final check: determine final status for each category using API arrays
    Object.values(categories).forEach((cat) => {
      if (cat.requirements.length === 0) {
        // No requirements for this category - assume satisfied
        cat.allSatisfied = true
        cat.hasMissingRequired = false
        cat.hasPartial = false
      } else {
        // Get required requirements
        const requiredReqs = cat.requirements.filter((r) => r.required)
        if (requiredReqs.length === 0) {
          // No required items - assume satisfied
          cat.allSatisfied = true
          cat.hasMissingRequired = false
        } else {
          // Check using missing_required array from API
          const missingRequiredIds = readiness.missing_required || []
          const satisfiedIds = readiness.satisfied || []
          
          const categoryMissingRequired = requiredReqs.some((r) => 
            missingRequiredIds.includes(r.id) || 
            (r.status === "missing" && r.required)
          )
          
          const categoryAllSatisfied = requiredReqs.every((r) =>
            satisfiedIds.includes(r.id) ||
            (r.status === "satisfied" && !missingRequiredIds.includes(r.id))
          )
          
          if (categoryMissingRequired) {
            cat.hasMissingRequired = true
            cat.allSatisfied = false
          } else if (categoryAllSatisfied) {
            cat.allSatisfied = true
            cat.hasMissingRequired = false
          }
          
          // Check for partial status
          if (cat.requirements.some((r) => r.status === "partial")) {
            cat.hasPartial = true
          }
        }
      }
    })

    return Object.values(categories)
  }

  return {
    readiness,
    loading,
    error,
    getDocumentCategoryStatus,
    canApply: readiness?.can_apply ?? false,
  }
}

