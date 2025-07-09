"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ApplicationEntry } from "@/app/student/my-applications/page" // Adjust path
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

interface ApplicationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  application: ApplicationEntry | null
}

const statusColors: Record<ApplicationEntry["status"], string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Accepted: "bg-green-100 text-green-700",
  "Offer Received": "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Waitlisted: "bg-orange-100 text-orange-700",
}

export default function ApplicationDetailModal({ isOpen, onClose, application }: ApplicationDetailModalProps) {
  if (!application) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Application Details: {application.universityName}</DialogTitle>
          <DialogDescription>{application.programName}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Status:</span>
            <Badge className={cn("text-xs font-semibold", statusColors[application.status])}>
              {application.status}
            </Badge>
          </div>
          <p>
            <span className="font-medium text-gray-700">Application ID:</span>{" "}
            <span className="text-gray-600">{application.applicationId || "N/A"}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Submitted On:</span>{" "}
            <span className="text-gray-600">{new Date(application.applicationDate).toLocaleDateString()}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Last Status Update:</span>{" "}
            <span className="text-gray-600">{new Date(application.statusDate).toLocaleDateString()}</span>
          </p>
          {application.remarks && (
            <div className="pt-2">
              <p className="font-medium text-gray-700">Remarks/Notes:</p>
              <p className="text-gray-600 whitespace-pre-wrap p-2 bg-gray-50 rounded border">{application.remarks}</p>
            </div>
          )}
          {/* Add more details as needed, e.g., required documents, contact person */}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          {/* Could add a button to "Withdraw Application" or "Upload Document" */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
