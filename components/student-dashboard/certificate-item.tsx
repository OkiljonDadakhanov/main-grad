"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CertificateEntry } from "@/app/student/certificates/page"
import { Edit, FileText, Trash2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface CertificateItemProps {
  certificate: CertificateEntry
  onDelete: (id: string) => void
  onEdit: (certificate: CertificateEntry) => void
}

export default function CertificateItem({
  certificate,
  onDelete,
  onEdit,
}: CertificateItemProps) {
  const { t } = useI18n()
  const isLanguageCertificate = certificate.type === "Language Proficiency"

  const handleCardClick = () => {
    if (certificate.fileUrl) {
      window.open(certificate.fileUrl, "_blank");
    }
  };

  return (
    <Card
      className={`flex flex-col cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all ${
        !certificate.fileUrl ? "cursor-default" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <FileText className="h-8 w-8 text-purple-600 mb-2" />
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(certificate);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(certificate.id);
              }}
              className="h-7 w-7 text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg">{certificate.name}</CardTitle>
        <CardDescription>{certificate.type}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">{t("certificates.issued")}:</span>{" "}
            {certificate.issueDate
              ? new Date(certificate.issueDate).toLocaleDateString()
              : t("common.notSpecified")}
          </p>

          {/* Language Certificate Specific Fields */}
          {isLanguageCertificate && (
            <>
              {certificate.language && (
                <p className="text-gray-600">
                  <span className="font-medium">{t("certificates.language")}:</span>{" "}
                  {certificate.language}
                </p>
              )}
              {certificate.certificate && (
                <p className="text-gray-600">
                  <span className="font-medium">{t("certificates.test")}:</span>{" "}
                  {certificate.certificate}
                </p>
              )}
              {certificate.score && (
                <p className="text-gray-600">
                  <span className="font-medium">{t("certificates.scoreLevel")}:</span>{" "}
                  {certificate.score}
                </p>
              )}
            </>
          )}

        </div>

        {certificate.description && (
          <p className="mt-3 text-xs text-gray-500">
            {certificate.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
