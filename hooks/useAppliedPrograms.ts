"use client"

import { useState, useEffect } from "react"
import { authFetch, BASE_URL, getAccessTokenFromStorage } from "@/lib/auth"

interface AppliedProgram {
  programmeId: number
  applicationId: string
  status: string
}

export function useAppliedPrograms() {
  const [appliedPrograms, setAppliedPrograms] = useState<AppliedProgram[]>([])
  const [appliedProgramIds, setAppliedProgramIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppliedPrograms = async () => {
      // Skip if not authenticated
      if (!getAccessTokenFromStorage()) {
        setLoading(false)
        return
      }

      try {
        const res = await authFetch(`${BASE_URL}/api/applications/mine/`)
        if (!res.ok) {
          setLoading(false)
          return
        }

        const data = await res.json()
        if (!Array.isArray(data)) {
          setLoading(false)
          return
        }

        const programs: AppliedProgram[] = data.map((item: any) => ({
          programmeId: item.programme?.id || item.programme_id,
          applicationId: String(item.id || item.pk || item.application_id || ""),
          status: item.status || "unknown",
        })).filter((p: AppliedProgram) => p.programmeId)

        setAppliedPrograms(programs)
        setAppliedProgramIds(new Set(programs.map(p => p.programmeId)))
      } catch (err) {
        console.error("Error fetching applied programs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppliedPrograms()
  }, [])

  const hasAppliedToProgram = (programId: number | string): boolean => {
    const id = typeof programId === "string" ? parseInt(programId, 10) : programId
    return appliedProgramIds.has(id)
  }

  const getApplicationForProgram = (programId: number | string): AppliedProgram | undefined => {
    const id = typeof programId === "string" ? parseInt(programId, 10) : programId
    return appliedPrograms.find(p => p.programmeId === id)
  }

  return {
    appliedPrograms,
    appliedProgramIds,
    loading,
    hasAppliedToProgram,
    getApplicationForProgram,
  }
}
