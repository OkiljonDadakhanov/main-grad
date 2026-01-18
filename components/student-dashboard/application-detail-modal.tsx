"use client"

import { useState } from "react"
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
import { Calendar, ExternalLink, Video, Copy, Check } from "lucide-react"

// Helper to safely format dates
const formatDate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString()
}

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

  // Capture everything after "Interview link:"
  const linkSectionMatch = remarks.match(/Interview link:\s*(.+)/i)

  let link: string | null = null
  let additionalInstructions: string | null = null

  if (linkSectionMatch && linkSectionMatch[1]) {
    const linkSection = linkSectionMatch[1].trim()

    // Try to extract URL - be lenient with protocol format
    const urlMatch = linkSection.match(/^(https?:\/?\/?[^\s]+)/i)
    if (urlMatch) {
      let extractedUrl = urlMatch[1]
      // Fix common URL issues - ensure proper protocol format
      if (extractedUrl.match(/^https?:\/[^/]/i)) {
        // Single slash after colon - fix it
        extractedUrl = extractedUrl.replace(/^(https?:)\/([^/])/i, '$1//$2')
      }
      if (extractedUrl.match(/^https?:[^/]/i)) {
        // No slash after colon - fix it
        extractedUrl = extractedUrl.replace(/^(https?:)([^/])/i, '$1//$2')
      }
      link = extractedUrl
      const afterUrl = linkSection.substring(urlMatch[1].length).trim()
      if (afterUrl) {
        additionalInstructions = afterUrl
      }
    } else {
      // No protocol detected - treat first word as link, rest as instructions
      const parts = linkSection.split(/\s+/)
      link = parts[0]
      // Try to make it a valid URL if it looks like a domain
      if (link && !link.startsWith('http') && link.includes('.')) {
        link = 'https://' + link
      }
      if (parts.length > 1) {
        additionalInstructions = parts.slice(1).join(' ')
      }
    }
  }

  return {
    dateTime: dateMatch ? dateMatch[1] : null,
    link,
    additionalInstructions,
  }
}

export default function ApplicationDetailModal({ isOpen, onClose, application }: ApplicationDetailModalProps) {
  const [copied, setCopied] = useState(false)

  if (!application) return null

  const isInterview = application.status.toLowerCase() === "interview"
  const interviewDetails = isInterview && application.remarks ? parseInterviewDetails(application.remarks) : null

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoinInterview = (link: string) => {
    // Ensure the link has proper protocol
    let url = link
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

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
            <span className="text-gray-600 dark:text-gray-400">
              {formatDate(application.applicationDate) || "Not submitted yet"}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">Last Status Update:</span>{" "}
            <span className="text-gray-600 dark:text-gray-400">
              {formatDate(application.statusDate) || "N/A"}
            </span>
          </p>

          {/* Interview Details Section */}
          {isInterview && (
            <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2 text-lg">
                <Video className="h-5 w-5" />
                Interview Details
              </h4>

              <div className="space-y-4">
                {/* Date & Time */}
                {interviewDetails?.dateTime && (
                  <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                      Date & Time
                    </p>
                    <p className="flex items-center gap-2 text-purple-800 dark:text-purple-200 font-medium">
                      <Calendar className="h-4 w-4" />
                      {interviewDetails.dateTime}
                    </p>
                  </div>
                )}

                {/* Meeting Link */}
                {interviewDetails?.link && (
                  <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                      Meeting Link
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded border">
                        <span className="text-purple-700 dark:text-purple-300 break-all text-sm flex-1">
                          {interviewDetails.link}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                          onClick={() => handleCopyLink(interviewDetails.link!)}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 w-full"
                        onClick={() => handleJoinInterview(interviewDetails.link!)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join Interview
                      </Button>
                    </div>
                  </div>
                )}

                {/* Instructions from University */}
                {interviewDetails?.additionalInstructions && (
                  <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                      Instructions from University
                    </p>
                    <p className="text-purple-700 dark:text-purple-300 whitespace-pre-wrap text-sm">
                      {interviewDetails.additionalInstructions}
                    </p>
                  </div>
                )}

                {/* Fallback: Show raw remarks if nothing was parsed */}
                {application.remarks && !interviewDetails?.dateTime && !interviewDetails?.link && (
                  <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                      Details
                    </p>
                    <p className="text-purple-700 dark:text-purple-300 whitespace-pre-wrap text-sm">
                      {application.remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* No details message */}
              {!application.remarks && (
                <p className="text-purple-600 dark:text-purple-400 italic mt-2">
                  No interview details provided by the university yet.
                </p>
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
