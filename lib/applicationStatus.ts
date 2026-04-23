// Canonical application-status vocabulary for the student UI.
// Mirrors gradabroad_backend/applications/models.py STATUS_CHOICES.

export type ApplicationStatus =
  | "document_saved"
  | "submitted"
  | "under_review"
  | "resend"
  | "interview"
  | "accepted"
  | "confirmed"
  | "visa_taken"
  | "studying"
  | "rejected"
  | "waitlisted"

// Display order for tabs / timelines.
export const STATUS_ORDER: ApplicationStatus[] = [
  "document_saved",
  "submitted",
  "under_review",
  "resend",
  "interview",
  "accepted",
  "confirmed",
  "visa_taken",
  "studying",
  "waitlisted",
  "rejected",
]

// i18n key per status under `applications.statuses.*`.
const STATUS_I18N_KEY: Record<ApplicationStatus, string> = {
  document_saved: "applications.statuses.documentSaved",
  submitted: "applications.statuses.submitted",
  under_review: "applications.statuses.underReview",
  resend: "applications.statuses.resend",
  interview: "applications.statuses.interview",
  accepted: "applications.statuses.accepted",
  confirmed: "applications.statuses.confirmed",
  visa_taken: "applications.statuses.visaTaken",
  studying: "applications.statuses.studying",
  rejected: "applications.statuses.rejected",
  waitlisted: "applications.statuses.waitlisted",
}

export const STATUS_COLOR_CLASSES: Record<ApplicationStatus, string> = {
  document_saved: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  under_review: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  resend: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  visa_taken: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  studying: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  waitlisted: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
}

const FALLBACK_COLOR = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

// Backend sometimes returns a status that was already title-cased by legacy
// code ("Under Review"). Normalize both forms to the canonical snake_case key.
export function normalizeStatus(raw: string | null | undefined): ApplicationStatus | null {
  if (!raw) return null
  const key = raw.toLowerCase().replace(/\s+/g, "_") as ApplicationStatus
  return (STATUS_ORDER as string[]).includes(key) ? key : null
}

export function getStatusLabel(
  t: (key: string) => string,
  raw: string | null | undefined,
): string {
  const status = normalizeStatus(raw)
  if (!status) return raw ?? ""
  const translated = t(STATUS_I18N_KEY[status])
  // If t() falls through and returns the key unchanged, render a readable fallback.
  return translated === STATUS_I18N_KEY[status] ? titleCase(status) : translated
}

export function getStatusColorClass(raw: string | null | undefined): string {
  const status = normalizeStatus(raw)
  return status ? STATUS_COLOR_CLASSES[status] : FALLBACK_COLOR
}

function titleCase(status: ApplicationStatus): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
