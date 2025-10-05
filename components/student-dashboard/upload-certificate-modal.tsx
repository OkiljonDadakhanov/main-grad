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
import type { CertificateEntry, NewCertificateData } from "@/app/student/certificates/page" // Adjust path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UploadCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCertificateAction: (data: NewCertificateData) => void
}

const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  type: z.string().min(1, "Certificate type is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  file: z
    .instanceof(FileList)
    .optional()
    .refine((files) => files === undefined || files.length > 0, "File is required if provided"),
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

export default function UploadCertificateModal({ isOpen, onClose, onAddCertificateAction }: UploadCertificateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  })

  const onSubmit = (data: CertificateFormData) => {
    const submissionData: NewCertificateData = {
      name: data.name,
      type: data.type,
      issueDate: data.issueDate,
      description: data.description,
    }
    if (data.file && data.file.length > 0) {
      submissionData.file = Array.from(data.file)
    }
    onAddCertificateAction(submissionData)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload New Certificate/Document</DialogTitle>
          <DialogDescription>Add details and upload your document file.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Document Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., TOPIK Level 5 Certificate" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="type">Document Type</Label>
            <Select onValueChange={(value) => setValue("type", value)}>
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
          <div>
            <Label htmlFor="file">Upload File (PDF, JPG, PNG - Max 5MB)</Label>
            <Input id="file" type="file" {...register("file")} accept=".pdf,.jpg,.jpeg,.png" />
            {errors.file && <p className="text-sm text-red-500">{errors.file.message}</p>}
          </div>
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
              Upload Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
