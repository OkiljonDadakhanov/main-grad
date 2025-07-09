"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CertificateEntry } from "@/app/student/certificates/page" // Adjust path
import { Download, Edit, FileText, Trash2 } from "lucide-react"

interface CertificateItemProps {
  certificate: CertificateEntry
  onDelete: (id: string) => void
  onEdit: (certificate: CertificateEntry) => void
  // onDownload: (fileUrl: string) => void; // Future
}

export default function CertificateItem({ certificate, onDelete, onEdit }: CertificateItemProps) {
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
        <p className="text-sm text-gray-600">
          <span className="font-medium">Issued:</span> {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
        {certificate.fileName && (
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">File:</span> {certificate.fileName}
          </p>
        )}
        {certificate.description && <p className="mt-2 text-xs text-gray-500">{certificate.description}</p>}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full text-purple-600 border-purple-600 hover:bg-purple-50">
          <Download className="h-4 w-4 mr-2" /> Download/View
        </Button>
      </CardFooter>
    </Card>
  )
}
