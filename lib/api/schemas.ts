/**
 * Zod schemas for API response validation
 */

import { z } from "zod"

// Programme requirement schema
export const ProgrammeRequirementSchema = z.object({
  id: z.number(),
  requirementType: z.string(),
  label: z.string(),
  required: z.boolean(),
  note: z.string().nullable(),
  matching_doc_type: z.string().nullable(),
})

// Programme schema
export const ProgrammeSchema = z.object({
  id: z.number(),
  university_id: z.number(),
  field_of_study: z.string(),
  degreeType: z.string(),
  name: z.string(),
  contractPrice: z.string(),
  platformApplicationFee: z.string(),
  about_program: z.string().nullable(),
  application_guide_url: z.string().nullable(),
  application_form_url: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  results_announcement_date: z.string().nullable(),
  active: z.boolean(),
  requirements: z.array(ProgrammeRequirementSchema),
})

// Application schema
export const ApplicationSchema = z.object({
  id: z.number(),
  programme_id: z.number(),
  programme_name: z.string(),
  university_name: z.string(),
  status: z.string(),
  applied_date: z.string().nullable(),
  last_status_update: z.string(),
  remarks: z.string(),
})

// Student readiness requirement schema
export const ReadinessRequirementSchema = z.object({
  id: z.number(),
  requirementType: z.string(),
  label: z.string(),
  required: z.boolean(),
  note: z.string().nullable(),
  status: z.enum(["missing", "satisfied", "partial"]),
  reason: z.string().nullable(),
  matched_record: z
    .object({
      id: z.number(),
      type: z.string(),
      name: z.string().optional(),
      score: z.number().optional(),
      file: z.string().optional(),
    })
    .nullable(),
})

// Student readiness response schema
export const StudentReadinessResponseSchema = z.object({
  requirements: z.array(ReadinessRequirementSchema),
  satisfied: z.array(z.number()),
  missing_required: z.array(z.number()),
  can_apply: z.boolean(),
})

// User profile schema
export const UserProfileSchema = z.object({
  id: z.number(),
  email: z.string().optional(),
  email_address: z.string().optional(),
  full_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  phone: z.string().optional(),
  account_type: z.string().optional(),
})

// University schema
export const UniversitySchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.string(),
  city: z.string(),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  website: z.string().optional(),
  is_verified: z.boolean().optional(),
  programmes: z.array(ProgrammeSchema).optional(),
})

// Paginated response schema helper
export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  })
}

// Export types derived from schemas
export type ProgrammeType = z.infer<typeof ProgrammeSchema>
export type ApplicationType = z.infer<typeof ApplicationSchema>
export type StudentReadinessResponseType = z.infer<typeof StudentReadinessResponseSchema>
export type UniversityType = z.infer<typeof UniversitySchema>
