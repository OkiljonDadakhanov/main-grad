"use client"

import { useEffect, useState } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"

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
  const [data, setData] = useState<any>({})

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
          keys.map((k) => authFetch((endpoints as any)[k]).catch(() => ({ ok: false })))
        )

        const jsons = await Promise.all(
          responses.map((r) => (r.ok ? r.json().catch(() => null) : null))
        )

        const result: any = {}
        keys.forEach((k, i) => {
          result[k] = jsons[i]
        })

        // merge certificates
        result.certificates = [
          ...(result.certificatesLang || []),
          ...(result.certificatesImportant || []),
        ]

        setData(result)
      } catch (err) {
        console.error("readiness fetch error", err)
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
      const valid = educations.some((e: any) => e.institution || e.school_name || e.degree)
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
  const compareRequirements = (requirements: any[] = []): { requirementStatuses: any[]; isEligibleToApply: boolean; missing: string[] } => {
    const { sections, allSectionsCompleted } = checkSections()
    const requirementStatuses: any[] = []
    const missingOverall: string[] = []

    const docs = {
      personal: data.personalDocuments || [],
      education: data.educations || [],
      certificates: data.certificates || [],
      financial: data.financial || [],
      application: data.applicationDocs || [],
      family: data.family || [],
    }

    requirements.forEach((req: any) => {
      // flexible matching
      const label = req.label || req.name || req.title || req.doc_type || String(req.id || "Requirement")
      let status: "Completed" | "Missing" | "Partially completed" = "Missing"
      const details: string[] = []

      // field-based requirement
      if (req.field_key) {
        const val = (data.personalInfo && data.personalInfo[req.field_key]) || (data.profile && data.profile[req.field_key])
        if (val) status = "Completed"
        else details.push(`Missing field: ${req.field_key}`)
      }

      // document-based requirement
      if (req.doc_type || req.document_type || req.code) {
        const docKey = req.doc_type || req.document_type || req.code
        const found = Object.values(docs).some((arr: any) =>
          Array.isArray(arr) && arr.some((d: any) => {
            return (
              String(d.doc_type || d.type || d.code || d.name || "").toLowerCase() === String(docKey).toLowerCase() ||
              String(d.name || d.display_name || d.label || "").toLowerCase().includes(String(docKey).toLowerCase()) ||
              String(label).toLowerCase().includes(String(d.name || d.display_name || d.label || "").toLowerCase())
            )
          })
        )
        if (found) {
          status = status === "Completed" ? "Completed" : "Completed"
        } else {
          details.push(`Missing document: ${label}`)
        }
      }

      // certificate / score check
      if (req.min_score || req.minimum_score) {
        // naive: look for certificate with score property
        const scoreField = req.score_field || "score"
        const match = (data.certificates || []).find((c: any) => typeof c[scoreField] !== "undefined")
        if (match) {
          const score = Number(match[scoreField])
          if (!isNaN(score) && score >= Number(req.min_score || req.minimum_score)) {
            status = "Completed"
          } else {
            details.push(`Minimum score ${req.min_score || req.minimum_score} not met`)
          }
        } else {
          details.push(`No score certificate found for ${label}`)
        }
      }

      if (details.length === 0 && status === "Missing") status = "Completed"
      if (details.length > 0 && status === "Completed") status = "Partially completed"

      if (status !== "Completed") missingOverall.push(label)

      requirementStatuses.push({ id: req.id ?? req.code ?? label, label, status, details })
    })

    const allRequirementsCompleted = requirementStatuses.every((r) => r.status === "Completed")
    const isEligibleToApply = allRequirementsCompleted && allSectionsCompleted

    return { requirementStatuses, isEligibleToApply, missing: missingOverall }
  }

  return { loading, data, checkSections, compareRequirements }
}
