/**
 * API Services - Centralized exports
 */

export { api, ApiError } from "./client"
export { programmeApi } from "./programmes"
export { applicationApi } from "./applications"

// Re-export types
export type { Programme, ProgrammeRequirement } from "./programmes"
export type { Application, ApplicationCreate, ApplicationTransition } from "./applications"
