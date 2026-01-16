/**
 * Programme API service
 */

import { api } from "./client"
import type { StudentReadinessResponse } from "@/hooks/useStudentReadiness"

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

export const programmeApi = {
  /**
   * Get all programmes
   */
  list: (params?: { university_id?: number }) =>
    api.get<Programme[]>("/api/programmes/", { params }),

  /**
   * Get a single programme by ID
   */
  get: (id: number | string) => api.get<Programme>(`/api/programmes/${id}/`),

  /**
   * Get student readiness for a programme
   */
  getStudentReadiness: (programmeId: number | string) =>
    api.get<StudentReadinessResponse>(
      `/api/programmes/${programmeId}/student-readiness/`
    ),
}

export default programmeApi
