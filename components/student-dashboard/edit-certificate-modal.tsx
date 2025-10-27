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
import type { CertificateEntry } from "@/app/student/certificates/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

interface EditCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdated: () => Promise<void> | void
  certificate: CertificateEntry | null
}

const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  type: z.string().min(1, "Certificate type is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  description: z.string().optional(),
  language: z.string().optional(),
  certificate: z.string().optional(),
  score: z.string().optional(),
})

type CertificateFormData = z.infer<typeof certificateSchema>

const certificateTypes = [
  "Language Proficiency",
  "Academic Transcript",
  "Degree/Diploma Certificate",
  "Letter of Recommendation",
  "Passport/ID Scan",
  "Financial Statement",
  "Award/Achievement",
  "Portfolio",
  "Other",
]

const languageOptions = [
  "English",
  "Korean",
  "Chinese",
  "Japanese",
  "German",
  "French",
  "Spanish",
  "Other",
]

const certificateOptions = [
  "IELTS",
  "TOEFL",
  "TOPIK",
  "HSK",
  "JLPT",
  "DELE",
  "DELF",
  "Other",
]

export default function EditCertificateModal({
  isOpen,
  onClose,
  onUpdated,
  certificate,
}: EditCertificateModalProps) {
  const { success, error } = useCustomToast()
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
      setValue("language", certificate.language || "")
      setValue("certificate", certificate.certificate || "")
      setValue("score", certificate.score?.toString() || "")
    }
  }, [certificate, setValue])

  const onSubmit = async (data: CertificateFormData) => {
    if (!certificate) return
    
    try {
      const isLanguageCertificate = certificate.type === "Language Proficiency"
      const endpoint = isLanguageCertificate 
        ? `${BASE_URL}/api/certificates/language/${certificate.id}/`
        : `${BASE_URL}/api/certificates/important/${certificate.id}/`

      const payload: Record<string, unknown> = {
        issue_date: data.issueDate,
        description: data.description || "",
      }

      if (isLanguageCertificate) {
        payload.name = data.name
        payload.language = data.language || ""
        payload.certificate = data.certificate || ""
        payload.score_or_level = data.score || ""
      } else {
        // Important certificates use 'title' field
        payload.title = data.name
      }

      const response = await authFetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to update certificate")
      
      success("Certificate updated")
      reset()
      await onUpdated()
    } catch (e) {
      error("Failed to update certificate")
    }
  }

  if (!certificate) return null

  const isLanguageCertificate = certificate.type === "Language Proficiency"

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
            <Input id="name" {...register("name")} placeholder="e.g., IELTS Certificate" />
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

          {/* Language Certificate Specific Fields */}
          {isLanguageCertificate && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue={certificate.language || ""} onValueChange={(value) => setValue("language", value)}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="certificate">Certificate Type</Label>
                  <Select defaultValue={certificate.certificate || ""} onValueChange={(value) => setValue("certificate", value)}>
                    <SelectTrigger id="certificate">
                      <SelectValue placeholder="Select certificate" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificateOptions.map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="score">Score/Level</Label>
                <Input
                  id="score"
                  {...register("score")}
                  placeholder="e.g., 7.5, Level 5, B2"
                />
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" {...register("issueDate")} />
            {errors.issueDate && <p className="text-sm text-red-500">{errors.issueDate.message}</p>}
          </div>
          
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
