"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ApplicationEntry } from "@/app/student/my-applications/page"
import { cn } from "@/lib/utils"
import { ExternalLink, FileText, Calendar, Clock, Video, Download, FolderOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { getStatusColorClass, getStatusLabel, normalizeStatus } from "@/lib/applicationStatus"

interface ApplicationStatusCardProps {
  application: ApplicationEntry
  onViewDetails: (application: ApplicationEntry) => void
}

// Parse interview details from remarks
function parseInterviewDetails(remarks: string) {
  const dateMatch = remarks.match(/Interview scheduled for ([^.]+)\./i)
  const koreanTimeMatch = remarks.match(/Korean Time \(KST\):\s*(\d{2}:\d{2})/i)
  const uzbekTimeMatch = remarks.match(/Uzbekistan Time \(UZT\):\s*(\d{2}:\d{2})/i)
  // Be lenient with URL format - handle missing slashes
  const linkMatch = remarks.match(/Interview link:\s*(https?:\/?\/?[^\s]+)/i)

  let link: string | null = null
  if (linkMatch && linkMatch[1]) {
    link = linkMatch[1]
    // Fix common URL issues - ensure proper protocol format
    if (link.match(/^https?:\/[^/]/i)) {
      link = link.replace(/^(https?:)\/([^/])/i, '$1//$2')
    }
    if (link.match(/^https?:[^/]/i)) {
      link = link.replace(/^(https?:)([^/])/i, '$1//$2')
    }
  }

  return {
    dateTime: dateMatch ? dateMatch[1] : null,
    koreanTime: koreanTimeMatch ? koreanTimeMatch[1] : null,
    uzbekTime: uzbekTimeMatch ? uzbekTimeMatch[1] : null,
    link: link,
  }
}

export default function ApplicationStatusCard({ application, onViewDetails }: ApplicationStatusCardProps) {
  const { t } = useI18n()
  const router = useRouter()
  const status = normalizeStatus(application.status)
  const isInterview = status === "interview"
  const isAccepted = status !== null && ["accepted", "confirmed", "visa_taken", "studying"].includes(status)
  const hasAcceptanceLetter = isAccepted && !!application.acceptanceLetterUrl
  const interviewDetails = isInterview && application.remarks ? parseInterviewDetails(application.remarks) : null

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all ${
        isInterview ? "border-purple-300 dark:border-purple-600 bg-purple-50/30 dark:bg-purple-900/20" : ""
      }`}
      onClick={() => onViewDetails(application)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            <div>
              <CardTitle>{application.universityName}</CardTitle>
              <CardDescription>{application.programName}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/student/my-applications/${application.id}/documents`)
              }}
            >
              <FolderOpen className="h-4 w-4 mr-1" />
              Documents
            </Button>
            <Badge className={cn("text-xs", getStatusColorClass(application.status))}>
              {getStatusLabel(t, application.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">{t("applications.applicationId")}:</span> {application.applicationId || "N/A"}
        </p>
        <p>
          <span className="font-medium">{t("applications.submittedOn")}:</span>{" "}
          {new Date(application.applicationDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">{t("applications.lastStatusUpdate")}:</span>{" "}
          {new Date(application.statusDate).toLocaleDateString()}
        </p>

        {/* Interview Details Section */}
        {isInterview && interviewDetails && (
          <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Video className="h-4 w-4" />
              {t("applications.interviewScheduled")}
            </h4>
            {interviewDetails.dateTime && (
              <p className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{interviewDetails.dateTime}</span>
              </p>
            )}
            {(interviewDetails.koreanTime || interviewDetails.uzbekTime) && (
              <div className="space-y-1 mb-2 text-sm">
                {interviewDetails.koreanTime && (
                  <p className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <Clock className="h-4 w-4" />
                    <span>🇰🇷 Korean Time (KST): <span className="font-semibold">{interviewDetails.koreanTime}</span></span>
                  </p>
                )}
                {interviewDetails.uzbekTime && (
                  <p className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <Clock className="h-4 w-4" />
                    <span>🇺🇿 Uzbekistan Time (UZT): <span className="font-semibold">{interviewDetails.uzbekTime}</span></span>
                  </p>
                )}
              </div>
            )}
            {interviewDetails.link && (
              <Button
                variant="default"
                size="sm"
                className="mt-2 bg-purple-600 hover:bg-purple-700"
                onClick={(e) => {
                  e.stopPropagation()
                  let url = interviewDetails.link!
                  if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url
                  }
                  window.open(url, '_blank', 'noopener,noreferrer')
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("applications.joinInterview")}
              </Button>
            )}
          </div>
        )}

        {/* Acceptance Letter Available Indicator */}
        {hasAcceptanceLetter && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
            <p className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
              <Download className="h-4 w-4" />
              {t("applications.acceptanceLetterAvailable") || "Acceptance letter available"}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {t("applications.clickToDownload") || "Click to view details and download"}
            </p>
          </div>
        )}

        {/* Regular remarks for non-interview statuses */}
        {!isInterview && application.remarks && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            <span className="font-medium">{t("common.remarks")}:</span> {application.remarks}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
