"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CertificateEntry } from "@/app/student/certificates/page"
import { Download, Edit, FileText, Trash2 } from "lucide-react"

interface CertificateItemProps {
  certificate: CertificateEntry
  onDelete: (id: string) => void
  onEdit: (certificate: CertificateEntry) => void
}

export default function CertificateItem({ certificate, onDelete, onEdit }: CertificateItemProps) {
  const isLanguageCertificate = certificate.type === "Language Proficiency"

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <FileText className="h-8 w-8 text-purple-600 mb-2" />
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-gray-700"
              onClick={() => onEdit(certificate)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(certificate.id)}
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
            <span className="font-medium">Issued:</span> {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "Not specified"}
          </p>
          
          {/* Language Certificate Specific Fields */}
          {isLanguageCertificate && (
            <>
              {certificate.language && (
                <p className="text-gray-600">
                  <span className="font-medium">Language:</span> {certificate.language}
                </p>
              )}
              {certificate.certificate && (
                <p className="text-gray-600">
                  <span className="font-medium">Test:</span> {certificate.certificate}
                </p>
              )}
              {certificate.score && (
                <p className="text-gray-600">
                  <span className="font-medium">Score/Level:</span> {certificate.score}
                </p>
              )}
            </>
          )}
          
          {certificate.fileName && (
            <p className="text-gray-600">
              <span className="font-medium">File:</span> {certificate.fileName}
            </p>
          )}
        </div>
        
        {certificate.description && (
          <p className="mt-3 text-xs text-gray-500">{certificate.description}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-purple-600 border-purple-600 hover:bg-purple-50"
          onClick={() => certificate.fileUrl && window.open(certificate.fileUrl, '_blank')}
          disabled={!certificate.fileUrl}
        >
          <Download className="h-4 w-4 mr-2" /> Download/View
        </Button>
      </CardFooter>
    </Card>
  )
}
