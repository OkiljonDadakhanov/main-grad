"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EducationEntry } from "@/app/student/educational-information/page" // Adjust path as needed
import { Edit, Trash2 } from "lucide-react"

interface EducationItemProps {
  entry: EducationEntry
  onDelete: (id: string) => void
  onEdit: (entry: EducationEntry) => void
}

export default function EducationItem({ entry, onDelete, onEdit }: EducationItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{entry.institution}</CardTitle>
            <CardDescription>
              {entry.degree} in {entry.fieldOfStudy}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <p>
            <span className="font-medium">Type:</span> {entry.type || "-"}
          </p>
          <p>
            <span className="font-medium">Location:</span> {entry.city && entry.country ? `${entry.city}, ${entry.country}` : entry.country || entry.city || "-"}
          </p>
          <p>
            <span className="font-medium">Start Date:</span> {entry.startDate ? new Date(entry.startDate).toLocaleDateString() : "-"}
          </p>
          <p>
            <span className="font-medium">End Date:</span> {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : "-"}
          </p>
          {entry.graduationYear && (
            <p>
              <span className="font-medium">Graduation Year:</span> {entry.graduationYear}
            </p>
          )}
          {entry.gpa && (
            <p>
              <span className="font-medium">GPA:</span> {entry.gpa}
            </p>
          )}
        </div>
        {entry.description && <p className="mt-2 text-sm text-gray-600">{entry.description}</p>}
      </CardContent>
    </Card>
  )
}
