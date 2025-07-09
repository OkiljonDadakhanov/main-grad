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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { CertificateEntry } from "@/app/student/certificates/page" // Adjust path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

interface EditCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateCertificate: (updatedCertificate: CertificateEntry) => void
  certificate: CertificateEntry | null
}

const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  type: z.string().min(1, "Certificate type is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  // File handling for edit might be complex without backend, so we'll omit direct file re-upload for now
  // It's better to handle file updates separately or just edit metadata.
  description: z.string().optional(),
})

type CertificateFormData = z.infer<typeof certificateSchema>

const certificateTypes = [
  "Language Proficiency (TOPIK, IELTS, TOEFL)",
  "Academic Transcript (School, College, University)",
  "Degree/Diploma Certificate",
  "Letter of Recommendation",
  "Passport/ID Scan",
  "Financial Statement",
  "Award/Achievement",
  "Portfolio (for arts/design)",
  "Other",
]

export default function EditCertificateModal({
  isOpen,
  onClose,
  onUpdateCertificate,
  certificate,
}: EditCertificateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  })

  useEffect(() => {
    if (certificate) {
      setValue("name", certificate.name)
      setValue("type", certificate.type)
      setValue("issueDate", certificate.issueDate)
      setValue("description", certificate.description || "")
    }
  }, [certificate, setValue])

  const onSubmit = (data: CertificateFormData) => {
    if (certificate) {
      // For client-side only, we keep existing fileUrl and fileName
      onUpdateCertificate({ ...certificate, ...data })
    }
    reset()
    onClose()
  }

  if (!certificate) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Certificate/Document</DialogTitle>
          <DialogDescription>Update the details of your document.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Document Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., TOPIK Level 5 Certificate" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="type">Document Type</Label>
            <Select defaultValue={certificate.type} onValueChange={(value) => setValue("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" {...register("issueDate")} />
            {errors.issueDate && <p className="text-sm text-red-500">{errors.issueDate.message}</p>}
          </div>
          {/* File input is omitted for edit simplicity on client-side */}
          {certificate.fileName && <p className="text-sm text-gray-500">Current file: {certificate.fileName}</p>}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register("description")} placeholder="Any notes about this document..." />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
