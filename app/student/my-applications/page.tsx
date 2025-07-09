"use client"

import ApplicationStatusCard from "@/components/student-dashboard/application-status-card"
import ApplicationDetailModal from "@/components/student-dashboard/application-detail-modal" // New
import AddApplicationModal from "@/components/student-dashboard/add-application-modal" // New
import { Button } from "@/components/ui/button" // New
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react" // New
import { useState } from "react"

export interface ApplicationEntry {
  id: string
  universityName: string
  programName: string
  applicationDate: string
  status: "Submitted" | "Under Review" | "Accepted" | "Rejected" | "Waitlisted" | "Offer Received"
  statusDate: string // Date of last status update
  remarks?: string
  applicationId?: string
}

const mockApplications: ApplicationEntry[] = [
  {
    id: "app1",
    universityName: "Seoul National University",
    programName: "MSc in Artificial Intelligence",
    applicationDate: "2024-03-15",
    status: "Under Review",
    statusDate: "2024-04-01",
    applicationId: "SNU2024AI001",
    remarks: "Awaiting interview schedule. Required documents submitted.",
  },
  {
    id: "app2",
    universityName: "KAIST (Korea Advanced Institute of Science and Technology)",
    programName: "PhD in Robotics",
    applicationDate: "2024-02-20",
    status: "Offer Received",
    statusDate: "2024-05-10",
    applicationId: "KAIST2024ROB005",
    remarks: "Scholarship details confirmed. Acceptance deadline: 2024-06-01.",
  },
]

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationEntry[]>(mockApplications)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleViewDetails = (application: ApplicationEntry) => {
    setSelectedApplication(application)
    setIsDetailModalOpen(true)
  }

  const handleAddApplication = (newAppData: Omit<ApplicationEntry, "id" | "statusDate">) => {
    const newApplication: ApplicationEntry = {
      ...newAppData,
      id: `app${Date.now()}`,
      statusDate: new Date().toISOString().split("T")[0], // Set statusDate to today
    }
    setApplications((prev) => [newApplication, ...prev]) // Add to top of the list
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-500">Track the status of your university applications.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Application
        </Button>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationStatusCard key={app.id} application={app} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              You haven't added any applications to track yet. Click "Add Application" to get started.
            </p>
          </CardContent>
        </Card>
      )}

      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        application={selectedApplication}
      />
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplication={handleAddApplication}
      />
    </div>
  )
}
