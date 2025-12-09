"use client"

import { authFetch, BASE_URL } from "@/lib/auth"

export interface UploadedDocs {
  [key: string]: File
}

export async function createDraftApplication(programme_id: number) {
  const res = await authFetch(`${BASE_URL}/api/applications/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programme_id }),
  })
  if (!res.ok) throw new Error("Failed to create draft application")
  const data = await res.json()
  return data.id
}

export async function uploadAttachments(appId: number, uploadedDocs: UploadedDocs) {
  for (const [label, file] of Object.entries(uploadedDocs)) {
    const formData = new FormData()
    formData.append("file_type", label)
    formData.append("file", file)
    const res = await authFetch(`${BASE_URL}/api/applications/${appId}/attachments/`, {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error(`Failed to upload ${label}`)
  }
}

export async function uploadEssays(
  appId: number, 
  motivation?: string, 
  whyThisUniversity?: string,
  requirementId?: number
) {
  // If requirementId is provided, use dynamic essay format
  if (requirementId && motivation) {
    const res = await authFetch(`${BASE_URL}/api/applications/${appId}/docs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requirement_id: requirementId,
        text_body: motivation,
      }),
    })
    if (!res.ok) throw new Error(`Failed to upload essay for requirement ${requirementId}`)
    return
  }
  
  // Fallback to old format
  const essays = [
    { doc_type: "motivation", text_body: motivation || "" },
    { doc_type: "why_university", text_body: whyThisUniversity || "" },
  ].filter(essay => essay.text_body) // Only upload non-empty essays
  
  for (const essay of essays) {
    const res = await authFetch(`${BASE_URL}/api/applications/${appId}/docs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(essay),
    })
    if (!res.ok) throw new Error(`Failed to upload ${essay.doc_type}`)
  }
}

export async function finalizeApplication(appId: number) {
  const res = await authFetch(`${BASE_URL}/api/applications/${appId}/transition/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: "submitted" }),
  })
  if (!res.ok) throw new Error("Failed to submit application")
}
