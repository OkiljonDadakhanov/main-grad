export function isRequirementFulfilled(requirement: any, documentStatus: any): boolean {
  if (!documentStatus) return false

  const allDocs = [
    ...(documentStatus.personal?.results || []),
    ...(documentStatus.education?.results || []),
    ...(documentStatus.certificates?.results || []),
    ...(documentStatus.financial?.results || []),
  ]

  const normalize = (str: string) =>
    str?.toLowerCase().replace(/[^a-z0-9]+/g, "").trim()

  const reqKey = normalize(requirement.label)

  return allDocs.some((doc: any) => {
    const keys = [
      doc.name,          // for language certificates
      doc.title,         // for important documents
      doc.doc_type,      // for personal docs
      doc.label,
      doc.category,
      doc.file_name,
    ]
      .filter(Boolean)
      .map(normalize)

    return keys.some((k) => k.includes(reqKey))
  })
}
