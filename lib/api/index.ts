/**
 * API Services - Centralized exports
 */

export { api, ApiError, ValidationError } from "./client"
export { programmeApi } from "./programmes"
export { applicationApi } from "./applications"

// Re-export schemas
export {
  ProgrammeSchema,
  ProgrammeRequirementSchema,
  ApplicationSchema,
  StudentReadinessResponseSchema,
  UniversitySchema,
  paginatedSchema,
} from "./schemas"

// Re-export types
export type { Programme, ProgrammeRequirement } from "./programmes"
export type { Application, ApplicationCreate, ApplicationTransition } from "./applications"
export type {
  ProgrammeType,
  ApplicationType,
  StudentReadinessResponseType,
  UniversityType,
} from "./schemas"
