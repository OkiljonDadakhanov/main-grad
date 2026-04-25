// Shapes returned by GET /api/auth/universities/ (list) and /api/auth/universities/{id}/ (detail).
// Most fields are optional because the backend returns sparse records for incomplete profiles.

export interface ProgrammeRequirement {
  id: number;
  requirementType: string;
  label: string;
  required: boolean;
  note: string | null;
  matching_doc_type: string | null;
}

export interface UniversityProgramme {
  id: number;
  university_id?: number;
  programme_name?: string;
  // Some endpoints return `name` instead of `programme_name`.
  name?: string;
  field_of_study?: string;
  degree_type?: string;
  degreeType?: string;
  category?: string;
  tuition_fee?: string;
  contractPrice?: string;
  platformApplicationFee?: string;
  about_program?: string | null;
  application_guide_url?: string | null;
  application_form_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  results_announcement_date?: string | null;
  active?: boolean;
  requirements?: ProgrammeRequirement[];
}

export interface UniversityScholarship {
  id: number;
  programme_id: number;
  programme_name: string;
  name: string;
  coverage: string;
  eligibility_criteria: string;
  application_deadline: string | null;
  is_active: boolean;
  translations?: Array<{
    id: number;
    language: string;
    translated_name: string;
    description: string;
  }>;
}

export interface UniversityCampusInformation {
  description?: string;
  dormitory_available?: string;
  graduates_total?: number | string;
  graduates_employed?: number | string;
  year_established?: string;
  ranking_local?: number | string;
  ranking_global?: number | string;
}

export interface University {
  id: number;
  university_name: string;
  city?: string;
  logo_url?: string;
  types_of_schools?: string;
  classification?: string;
  website?: string;
  address?: string;
  university_admission_email_address?: string;
  university_office_phone?: string;
  campus_information?: UniversityCampusInformation;
  programmes?: UniversityProgramme[];
  scholarships?: UniversityScholarship[];
}

// Convenience: Programme as it appears in search results (with denormalised university_name).
export type ProgrammeWithUniversity = UniversityProgramme & {
  university_name?: string;
  university_id?: number;
};

// Standalone scholarship from GET /api/scholarships/.
export interface ScholarshipListItem {
  id: number;
  programme_id: number;
  programme_name: string;
  name: string;
  coverage: string;
  eligibility_criteria: string;
  application_deadline: string | null;
  is_active: boolean;
  translations?: Array<{
    id: number;
    language: string;
    translated_name: string;
    description: string;
  }>;
}
