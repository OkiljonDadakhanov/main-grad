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
import type { ApplicationEntry } from "@/app/student/my-applications/page"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, ExternalLink, Video } from "lucide-react"

interface ApplicationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  application: ApplicationEntry | null
}

const statusColors: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Under Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  under_review: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Accepted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Offer Received": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Waitlisted: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Resend: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  resend: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Studying: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  studying: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
}

// Parse interview details from remarks
function parseInterviewDetails(remarks: string) {
  const dateMatch = remarks.match(/Interview scheduled for ([^.]+)\./i)
  const linkMatch = remarks.match(/Interview link:\s*(https?:\/\/[^\s]+)/i)

  return {
    dateTime: dateMatch ? dateMatch[1] : null,
    link: linkMatch ? linkMatch[1] : null,
  }
}

export default function ApplicationDetailModal({ isOpen, onClose, application }: ApplicationDetailModalProps) {
  if (!application) return null

  const isInterview = application.status.toLowerCase() === "interview"
  const interviewDetails = isInterview && application.remarks ? parseInterviewDetails(application.remarks) : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Application Details: {application.universityName}</DialogTitle>
          <DialogDescription>{application.programName}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <Badge className={cn("text-xs font-semibold", statusColors[application.status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300")}>
              {application.status}
            </Badge>
          </div>
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">Application ID:</span>{" "}
            <span className="text-gray-600 dark:text-gray-400">{application.applicationId || "N/A"}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">Submitted On:</span>{" "}
            <span className="text-gray-600 dark:text-gray-400">{new Date(application.applicationDate).toLocaleDateString()}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">Last Status Update:</span>{" "}
            <span className="text-gray-600 dark:text-gray-400">{new Date(application.statusDate).toLocaleDateString()}</span>
          </p>

          {/* Interview Details Section */}
          {isInterview && interviewDetails && (
            <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <Video className="h-5 w-5" />
                Interview Details
              </h4>
              {interviewDetails.dateTime && (
                <p className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{interviewDetails.dateTime}</span>
                </p>
              )}
              {interviewDetails.link && (
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.open(interviewDetails.link!, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Interview
                </Button>
              )}
            </div>
          )}

          {/* Regular remarks */}
          {application.remarks && !isInterview && (
            <div className="pt-2">
              <p className="font-medium text-gray-700 dark:text-gray-300">Remarks/Notes:</p>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap p-2 bg-gray-50 dark:bg-gray-800/50 rounded border dark:border-gray-700">{application.remarks}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
