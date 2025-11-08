"use client"

import { useState, useEffect } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"

export function useDocumentStatus() {
  const [documentStatus, setDocumentStatus] = useState<any>(null)
  const [checkingDocuments, setCheckingDocuments] = useState(false)

  useEffect(() => {
    const fetchDocuments = async () => {
      setCheckingDocuments(true)
      try {
        const endpoints = [
          "personal-documents",
          "educations",
          "certificates/language",
          "certificates/important",
          "financial-documents",
        ]

        const responses = await Promise.all(
          endpoints.map((ep) => authFetch(`${BASE_URL}/api/${ep}/`))
        )
        const jsons = await Promise.all(
          responses.map((r) => (r.ok ? r.json() : { results: [] }))
        )

        // 🧩 Merge language + important
        const allCertificates = [
          ...(jsons[2] || []),
          ...(jsons[3] || []),
        ]

        setDocumentStatus({
          personal: jsons[0],
          education: jsons[1],
          certificates: { results: allCertificates },
          financial: jsons[4],
        })
      } catch (err) {
        console.error("Error fetching documents:", err)
      } finally {
        setCheckingDocuments(false)
      }
    }
    fetchDocuments()
  }, [])

  return { documentStatus, checkingDocuments }
}
