"use client"

import { useEffect, useState } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"
import type {
  ApplicationReadinessData,
  EducationEntry,
  Certificate,
  ProgrammeRequirement,
  RequirementStatus,
  DocumentBase,
} from "@/lib/types"
import logger from "@/lib/logger"

type SectionCheck = {
  completed: boolean
  missing: string[]
}

type SectionsStatus = {
  profile: SectionCheck
  personalInfo: SectionCheck
  education: SectionCheck
  applicationDocs: SectionCheck
  certificates: SectionCheck
  financial: SectionCheck
  family: SectionCheck
}

export function useApplicationReadiness() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Partial<ApplicationReadinessData>>({})

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const endpoints = {
          profile: `${BASE_URL}/api/me/profile/`,
          personalInfo: `${BASE_URL}/api/personal-information/`,
          personalDocuments: `${BASE_URL}/api/personal-documents/`,
          educations: `${BASE_URL}/api/educations/`,
          certificatesLang: `${BASE_URL}/api/certificates/language/`,
          certificatesImportant: `${BASE_URL}/api/certificates/important/`,
          financial: `${BASE_URL}/api/financial-documents/`,
          family: `${BASE_URL}/api/family/`,
          applicationDocs: `${BASE_URL}/api/application-documents/`,
        }

        const keys = Object.keys(endpoints) as (keyof typeof endpoints)[]
        const responses = await Promise.all(
          keys.map((k) => authFetch(endpoints[k]).catch(() => ({ ok: false as const })))
        )

        const jsons = await Promise.all(
          responses.map((r) => {
            if (!r.ok) return null
            return "json" in r ? r.json().catch(() => null) : null
          })
        )

        const result: Partial<ApplicationReadinessData> = {}
        keys.forEach((k, i) => {
          (result as Record<string, unknown>)[k] = jsons[i]
        })

        // merge certificates
        result.certificates = [
          ...(result.certificatesLang || []),
          ...(result.certificatesImportant || []),
        ]

        setData(result)
      } catch (err) {
        logger.error("readiness fetch error", err)
        setData({})
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const checkSections = (): { sections: SectionsStatus; allSectionsCompleted: boolean } => {
    const profile = data.profile || null
    const personalInfo = data.personalInfo || null
    const educations = Array.isArray(data.educations) ? data.educations : []
    const applicationDocs = Array.isArray(data.applicationDocs) ? data.applicationDocs : []
    const certificates = Array.isArray(data.certificates) ? data.certificates : []
    const financial = Array.isArray(data.financial) ? data.financial : []
    const family = Array.isArray(data.family) ? data.family : []

    const sections: SectionsStatus = {
      profile: { completed: false, missing: [] },
      personalInfo: { completed: false, missing: [] },
      education: { completed: false, missing: [] },
      applicationDocs: { completed: false, missing: [] },
      certificates: { completed: false, missing: [] },
      financial: { completed: false, missing: [] },
      family: { completed: false, missing: [] },
    }

    // Profile: require full_name + email + phone_number
    if (profile && (profile.full_name || profile.first_name) && (profile.email || profile.email_address) && (profile.phone_number || profile.phone)) {
      sections.profile.completed = true
    } else {
      if (!profile) sections.profile.missing.push("Profile not filled")
      else {
        if (!profile.full_name && !profile.first_name) sections.profile.missing.push("Full name")
        if (!profile.email && !profile.email_address) sections.profile.missing.push("Email")
        if (!profile.phone_number && !profile.phone) sections.profile.missing.push("Phone number")
      }
    }

    // Personal Info: require passport_number or date_of_birth + address
    if (personalInfo && (personalInfo.passport_number || personalInfo.date_of_birth)) {
      sections.personalInfo.completed = true
    } else {
      sections.personalInfo.missing.push("Personal information (passport or DOB) is incomplete")
    }

    // Education: require at least one education entry with institution/degree
    if (educations.length > 0) {
      const valid = educations.some((e: EducationEntry) => e.institution || e.school_name || e.degree)
      if (valid) sections.education.completed = true
      else sections.education.missing.push("Education entries incomplete")
    } else {
      sections.education.missing.push("No education records added")
    }

    // Application docs: check presence
    if (applicationDocs.length > 0) sections.applicationDocs.completed = true
    else sections.applicationDocs.missing.push("No application documents uploaded (statement, recommendations)")

    // Certificates
    if (certificates.length > 0) sections.certificates.completed = true
    else sections.certificates.missing.push("No certificates uploaded")

    // Financial
    if (financial.length > 0) sections.financial.completed = true
    else sections.financial.missing.push("No financial documents uploaded")

    // Family - not always required, but mark completed if any family or family docs exist
    if (family.length > 0) sections.family.completed = true
    else sections.family.missing.push("No family members added or family documents")

    const allSectionsCompleted = Object.values(sections).every((s) => s.completed)
    return { sections, allSectionsCompleted }
  }

  // compare program requirements with fetched student data
  const compareRequirements = (requirements: ProgrammeRequirement[] = []): { requirementStatuses: RequirementStatus[]; isEligibleToApply: boolean; missing: string[] } => {
    const { sections, allSectionsCompleted } = checkSections()
    const requirementStatuses: RequirementStatus[] = []
    const missingOverall: string[] = []

    const docs = {
      personal: data.personalDocuments || [],
      education: data.educations || [],
      certificates: data.certificates || [],
      financial: data.financial || [],
      application: data.applicationDocs || [],
      family: data.family || [],
    }

    requirements.forEach((req) => {
      // flexible matching
      const label = req.label || String(req.id || "Requirement")
      let status: "Completed" | "Missing" | "Partially completed" = "Missing"
      const details: string[] = []

      // document-based requirement
      if (req.matching_doc_type) {
        const docKey = req.matching_doc_type
        const found = Object.values(docs).some((arr) =>
          Array.isArray(arr) && arr.some((d: DocumentBase) => {
            return (
              String(d.doc_type || d.type || d.code || d.name || "").toLowerCase() === String(docKey).toLowerCase() ||
              String(d.name || d.display_name || d.label || "").toLowerCase().includes(String(docKey).toLowerCase()) ||
              String(label).toLowerCase().includes(String(d.name || d.display_name || d.label || "").toLowerCase())
            )
          })
        )
        if (found) {
          status = "Completed"
        } else {
          details.push(`Missing document: ${label}`)
        }
      }

      // certificate / score check for score requirements
      if (req.requirementType === "score") {
        // look for certificate with score property
        const match = (data.certificates || []).find((c: Certificate) => typeof c.score !== "undefined" || typeof c.overall_score !== "undefined")
        if (match) {
          status = "Completed"
        } else {
          details.push(`No score certificate found for ${label}`)
        }
      }

      if (details.length === 0 && status === "Missing") status = "Completed"
      if (details.length > 0 && status === "Completed") status = "Partially completed"

      if (status !== "Completed") missingOverall.push(label)

      requirementStatuses.push({ id: req.id ?? label, label, status, details })
    })

    const allRequirementsCompleted = requirementStatuses.every((r) => r.status === "Completed")
    const isEligibleToApply = allRequirementsCompleted && allSectionsCompleted

    return { requirementStatuses, isEligibleToApply, missing: missingOverall }
  }

  return { loading, data, checkSections, compareRequirements }
}
