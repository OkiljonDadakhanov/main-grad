/**
 * Applications API service
 */

import { api } from "./client"

export interface Application {
  id: number
  programme_id: number
  programme_name: string
  university_name: string
  status: string
  applied_date: string | null
  last_status_update: string
  remarks: string
}

export interface ApplicationCreate {
  programme_id: number
}

export interface ApplicationTransition {
  to: string
}

export const applicationApi = {
  /**
   * Get user's applications
   */
  list: (params?: { status?: string }) =>
    api.get<Application[]>("/api/my/applications/", { params }),

  /**
   * Create a new application
   */
  create: (data: ApplicationCreate) =>
    api.post<Application>("/api/applications/", data),

  /**
   * Get a single application
   */
  get: (id: number | string) =>
    api.get<Application>(`/api/applications/${id}/`),

  /**
   * Transition application status
   */
  transition: (id: number | string, data: ApplicationTransition) =>
    api.patch<Application>(`/api/applications/${id}/transition/`, data),

  /**
   * Upload attachment
   */
  uploadAttachment: (applicationId: number | string, formData: FormData) =>
    api.upload(`/api/applications/${applicationId}/attachments/`, formData),

  /**
   * Get application attachments
   */
  getAttachments: (applicationId: number | string) =>
    api.get(`/api/applications/${applicationId}/attachments/`),
}

export default applicationApi
