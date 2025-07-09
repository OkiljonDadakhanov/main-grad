"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ApplicationEntry } from "@/app/student/my-applications/page" // Adjust path
import { cn } from "@/lib/utils"
import { ExternalLink, FileText } from "lucide-react"

interface ApplicationStatusCardProps {
  application: ApplicationEntry
  onViewDetails: (application: ApplicationEntry) => void // New prop
}

const statusColors: Record<ApplicationEntry["status"], string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Accepted: "bg-green-100 text-green-700",
  "Offer Received": "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Waitlisted: "bg-orange-100 text-orange-700",
}

export default function ApplicationStatusCard({ application, onViewDetails }: ApplicationStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-purple-600" />
            <div>
              <CardTitle>{application.universityName}</CardTitle>
              <CardDescription>{application.programName}</CardDescription>
            </div>
          </div>
          <Badge className={cn("text-xs", statusColors[application.status])}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Application ID:</span> {application.applicationId || "N/A"}
        </p>
        <p>
          <span className="font-medium">Submitted On:</span>{" "}
          {new Date(application.applicationDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Last Status Update:</span>{" "}
          {new Date(application.statusDate).toLocaleDateString()}
        </p>
        {application.remarks && (
          <p className="mt-2 text-gray-600">
            <span className="font-medium">Remarks:</span> {application.remarks}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-600 hover:bg-purple-50"
          onClick={() => onViewDetails(application)} // Call onViewDetails
        >
          View Details <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
