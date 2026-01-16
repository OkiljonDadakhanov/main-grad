/**
 * Document and requirement type definitions
 */

export interface DocumentBase {
  id: number
  name?: string
  title?: string
  doc_type?: string
  label?: string
  category?: string
  file_name?: string
  display_name?: string
  type?: string
  code?: string
}

export interface PersonalDocument extends DocumentBase {
  document_type?: string
  file?: string
  uploaded_at?: string
}

export interface EducationEntry {
  id: number
  institution?: string
  school_name?: string
  degree?: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  gpa?: number | string
}

export interface Certificate extends DocumentBase {
  score?: number
  overall_score?: number
  test_date?: string
  expiry_date?: string
}

export interface FinancialDocument extends DocumentBase {
  amount?: number
  currency?: string
  date_issued?: string
}

export interface FamilyMember {
  id: number
  relationship?: string
  name?: string
  occupation?: string
}

export interface DocumentStatus {
  personal?: {
    results?: PersonalDocument[]
  } | PersonalDocument[]
  education?: {
    results?: EducationEntry[]
  } | EducationEntry[]
  certificates?: {
    results?: Certificate[]
  } | Certificate[]
  financial?: {
    results?: FinancialDocument[]
  } | FinancialDocument[]
}

export interface Programme {
  id: number
  university_id: number
  field_of_study: string
  degreeType: string
  name: string
  contractPrice: string
  platformApplicationFee: string
  about_program: string | null
  application_guide_url: string | null
  application_form_url: string | null
  start_date: string | null
  end_date: string | null
  results_announcement_date: string | null
  active: boolean
  requirements: ProgrammeRequirement[]
}

export interface ProgrammeRequirement {
  id: number
  requirementType: string
  label: string
  required: boolean
  note: string | null
  matching_doc_type: string | null
}

export interface University {
  id: number
  name: string
  country: string
  city: string
  description?: string
  logo_url?: string
  website?: string
  is_verified?: boolean
  programmes?: Programme[]
}

export interface ReadinessRequirement {
  id: number
  requirementType: string
  label: string
  required: boolean
  note: string | null
  status: "missing" | "satisfied" | "partial"
  reason: string | null
  matched_record: MatchedRecord | null
}

export interface MatchedRecord {
  id: number
  type: string
  name?: string
  score?: number
  file?: string
}

export interface UserProfile {
  id: number
  email?: string
  email_address?: string
  full_name?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  phone?: string
  account_type?: string
}

export interface PersonalInfo {
  id?: number
  passport_number?: string
  date_of_birth?: string
  address?: string
  nationality?: string
}

export interface ApplicationDocument extends DocumentBase {
  document_type?: string
  file?: string
}

export interface ApplicationReadinessData {
  profile: UserProfile | null
  personalInfo: PersonalInfo | null
  personalDocuments: PersonalDocument[]
  educations: EducationEntry[]
  certificatesLang: Certificate[]
  certificatesImportant: Certificate[]
  certificates: Certificate[]
  financial: FinancialDocument[]
  family: FamilyMember[]
  applicationDocs: ApplicationDocument[]
}

export interface RequirementStatus {
  id: number | string
  label: string
  status: "Completed" | "Missing" | "Partially completed"
  details: string[]
}
