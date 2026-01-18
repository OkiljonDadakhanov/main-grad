"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EducationEntry } from "@/app/student/educational-information/page" // Adjust path as needed
import { Edit, Trash2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface EducationItemProps {
  entry: EducationEntry
  onDelete: (id: string) => void
  onEdit: (entry: EducationEntry) => void
}

export default function EducationItem({ entry, onDelete, onEdit }: EducationItemProps) {
  const { t } = useI18n()

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
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4 mr-1" /> {t("common.edit")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-1" /> {t("common.delete")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <p>
            <span className="font-medium">{t("education.type")}:</span> {entry.type || "-"}
          </p>
          <p>
            <span className="font-medium">{t("education.location")}:</span> {entry.city && entry.country ? `${entry.city}, ${entry.country}` : entry.country || entry.city || "-"}
          </p>
          <p>
            <span className="font-medium">{t("education.startDate")}:</span> {entry.startDate ? new Date(entry.startDate).toLocaleDateString() : "-"}
          </p>
          <p>
            <span className="font-medium">{t("education.endDate")}:</span> {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : "-"}
          </p>
          {entry.graduationYear && (
            <p>
              <span className="font-medium">{t("education.graduationYear")}:</span> {entry.graduationYear}
            </p>
          )}
          {entry.gpa && (
            <p>
              <span className="font-medium">{t("education.gpa")}:</span> {entry.gpa}
            </p>
          )}
        </div>
        {entry.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{entry.description}</p>}
      </CardContent>
    </Card>
  )
}
