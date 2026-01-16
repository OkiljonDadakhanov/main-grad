import type { DocumentStatus, DocumentBase, ProgrammeRequirement } from "@/lib/types"

export function isRequirementFulfilled(
  requirement: ProgrammeRequirement,
  documentStatus: DocumentStatus | null
): boolean {
  if (!documentStatus) return false

  const getResults = (category: unknown): DocumentBase[] => {
    if (Array.isArray(category)) return category
    if (category && typeof category === "object" && "results" in category) {
      return (category as { results?: DocumentBase[] }).results || []
    }
    return []
  }

  const allDocs: DocumentBase[] = [
    ...getResults(documentStatus.personal),
    ...getResults(documentStatus.education),
    ...getResults(documentStatus.certificates),
    ...getResults(documentStatus.financial),
  ]

  const normalize = (str: string | undefined): string =>
    str?.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ?? ""

  const reqKey = normalize(requirement.label)

  return allDocs.some((doc) => {
    const keys = [
      doc.name,
      doc.title,
      doc.doc_type,
      doc.label,
      doc.category,
      doc.file_name,
    ]
      .filter((k): k is string => Boolean(k))
      .map(normalize)

    return keys.some((k) => k.includes(reqKey))
  })
}
