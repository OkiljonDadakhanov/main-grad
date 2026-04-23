"use client"

import ApplicationStatusCard from "@/components/student-dashboard/application-status-card"
import ApplicationDetailModal from "@/components/student-dashboard/application-detail-modal"
import { Card, CardContent } from "@/components/ui/card"
import React, { useState, useEffect } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"
import { useI18n } from "@/lib/i18n"
import { STATUS_ORDER, getStatusLabel } from "@/lib/applicationStatus"

export interface ApplicationEntry {
  id: string
  universityName: string
  programName: string
  applicationDate: string
  status: string
  statusDate: string
  remarks?: string
  applicationId?: string
  acceptanceLetterUrl?: string | null
}

const mockApplications: ApplicationEntry[] = [
  {
    id: "app1",
    universityName: "Seoul National University",
    programName: "MSc in Artificial Intelligence",
    applicationDate: "2024-03-15",
    status: "Interview",
    statusDate: "2024-04-01",
    applicationId: "SNU2024AI001",
    remarks: "Interview scheduled for April 15, 2024 at 10:00 AM KST.",
  },
  {
    id: "app2",
    universityName: "KAIST (Korea Advanced Institute of Science and Technology)",
    programName: "PhD in Robotics",
    applicationDate: "2024-02-20",
    status: "Accepted",
    statusDate: "2024-05-10",
    applicationId: "KAIST2024ROB005",
    remarks: "Congratulations! Your application has been accepted.",
  },
  {
    id: "app3",
    universityName: "Yonsei University",
    programName: "MBA (Global)",
    applicationDate: "2024-04-01",
    status: "Submitted",
    statusDate: "2024-04-01",
    applicationId: "YONSEI2024MBA012",
  },
  {
    id: "app4",
    universityName: "Korea University",
    programName: "MSc in Data Science",
    applicationDate: "2024-03-10",
    status: "Resend",
    statusDate: "2024-04-05",
    applicationId: "KU2024DS003",
    remarks: "Additional documents required: Updated transcript and language certificate.",
  },
]

export default function MyApplicationsPage() {
  const { error } = useCustomToast()
  const { t } = useI18n()
  const [applications, setApplications] = useState<ApplicationEntry[]>([])
  const [selectedApplication, setSelectedApplication] = useState<ApplicationEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [loading, setLoading] = useState<boolean>(true)

  const handleViewDetails = (application: ApplicationEntry) => {
    setSelectedApplication(application)
    setIsDetailModalOpen(true)
  }

  const fetchMyApplications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const res = await authFetch(`${BASE_URL}/api/applications/mine/`)
      if (!res.ok) throw new Error("Failed to load applications")
      const data = await res.json()
      if (!Array.isArray(data)) {
        setApplications([])
        return
      }

      const mapped = data.map((item: any) => {
        const id = String(item.id ?? item.pk ?? item.application_id ?? item.uuid ?? "")
        const universityName =
          item.university_name || item.university?.university_name || item.university?.name || ""
        const programName =
          item.program_name || item.programme_name || item.programme?.title || item.programme?.name || ""
        // Handle null/undefined dates - only use valid date strings
        const applicationDate = item.submitted_on ?? item.applied_date ?? ""
        const status = item.status || item.application_status || "Submitted"
        const statusDate = item.last_status_update ?? item.status_updated_at ?? item.updated_at ?? ""
        const remarks = item.remarks || item.note || item.comment || ""
        const applicationId = String(item.id || item.application_id || item.pk || "")
        const acceptanceLetterUrl = item.acceptance_letter_url || null
        return {
          id,
          universityName,
          programName,
          applicationDate: applicationDate || "",
          status,
          statusDate: statusDate || "",
          remarks,
          applicationId,
          acceptanceLetterUrl,
        } as ApplicationEntry
      })
      setApplications(mapped)
    } catch (err) {
      console.error(err)
      if (showLoading) error("Failed to load your applications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyApplications()

    // Poll every 30 seconds as backup
    const interval = setInterval(() => fetchMyApplications(false), 30000)

    // Refresh when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMyApplications(false)
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Refresh immediately when notification bell detects a new notification
    const handleStatusChange = () => {
      fetchMyApplications(false)
    }
    window.addEventListener("application-status-changed", handleStatusChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("application-status-changed", handleStatusChange)
    }
  }, [])

  // Normalize status for comparison (handle both underscores and spaces)
  const normalizeStatus = (status: string) => status.toLowerCase().replace(/[\s_]/g, "_")

  const filterApplications = (status: string) => {
    if (status === "all") return applications
    return applications.filter((app) => normalizeStatus(app.status) === normalizeStatus(status))
  }

  const getStatusCount = (status: string) => {
    if (status === "all") return applications.length
    return applications.filter((app) => normalizeStatus(app.status) === normalizeStatus(status)).length
  }

  const filteredApplications = filterApplications(activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage your university applications</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: t("common.all") || "All" },
          ...STATUS_ORDER
            .filter((s) => s !== "document_saved")
            .map((s) => ({ value: s, label: getStatusLabel(t, s) })),
        ].map((status) => {
          const count = getStatusCount(status.value)
          const isActive = activeTab === status.value
          return (
            <button
              key={status.value}
              onClick={() => setActiveTab(status.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {status.label}
              {count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <ApplicationStatusCard key={app.id} application={app} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 dark:text-gray-400">
              {activeTab === "all"
                ? "You haven't applied to any universities yet. Browse universities to get started."
                : `No applications with status "${activeTab}".`}
            </p>
          </CardContent>
        </Card>
      )}

      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        application={selectedApplication}
      />
    </div>
  )
}
