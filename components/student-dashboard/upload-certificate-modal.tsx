"use client"

import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"
import { Loader2 } from "lucide-react"

interface UploadCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => Promise<void> | void
}

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

export default function UploadCertificateModal({
  isOpen,
  onClose,
  onCreated,
}: UploadCertificateModalProps) {
  const { success, error } = useCustomToast()
  const [certificateType, setCertificateType] = useState<string>("")
  const [schema, setSchema] = useState<z.ZodType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const clientSchema = z.object({
      name: z.string().min(1, "Certificate name is required"),
      type: z.string().min(1, "Certificate type is required"),
      issueDate: z.string().min(1, "Issue date is required"),
      file: z
        .any()
        .refine(
          (files) => files instanceof FileList && files.length > 0,
          "File is required"
        ),
      description: z.string().optional(),
      language: z.string().optional(),
      certificate: z.string().optional(),
      score: z.string().optional(),
    })
    setSchema(clientSchema)
  }, [])

  const form = useForm<any>({
    resolver: schema ? zodResolver(schema) : undefined,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form

  const isLanguageCertificate = certificateType === "Language Proficiency"

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", data.file[0])

      if (data.description) {
        formData.append("description", data.description)
      }

      let endpoint: string
      if (isLanguageCertificate) {
        endpoint = `${BASE_URL}/api/certificates/language/`
        formData.append("name", data.name)
        formData.append("issue_date", data.issueDate)
        formData.append("language", data.language || "")
        formData.append("certificate", data.certificate || "")
        formData.append("score_or_level", data.score || "")
      } else {
        endpoint = `${BASE_URL}/api/certificates/important/`
        formData.append("title", data.name)
        formData.append("issue_date", data.issueDate)
      }

      const response = await authFetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to upload certificate")
      }

      success("Certificate uploaded successfully")
      reset()
      setCertificateType("")
      await onCreated()
    } catch (e) {
      error("Failed to upload certificate")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload New Certificate/Document</DialogTitle>
          <DialogDescription>
            Add details and upload your document file.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Document Type */}
          <div>
            <Label htmlFor="type">Document Type</Label>
            <Select
              onValueChange={(value) => {
                setCertificateType(value)
                setValue("type", value)
              }}
            >
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
            {errors.type?.message && (
              <p className="text-sm text-red-500">
                {String(errors.type.message)}
              </p>
            )}
          </div>

          {/* Document Name */}
          <div>
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., IELTS Certificate, Academic Transcript"
            />
            {errors.name?.message && (
              <p className="text-sm text-red-500">
                {String(errors.name.message)}
              </p>
            )}
          </div>

          {/* Language Certificate Specific Fields */}
          {isLanguageCertificate && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select onValueChange={(value) => setValue("language", value)}>
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
                  <Select
                    onValueChange={(value) => setValue("certificate", value)}
                  >
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

          {/* Issue Date */}
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" {...register("issueDate")} />
            {errors.issueDate?.message && (
              <p className="text-sm text-red-500">
                {String(errors.issueDate.message)}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file">Upload File (PDF, JPG, PNG - Max 5MB)</Label>
            <Input
              id="file"
              type="file"
              {...register("file")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {errors.file?.message && (
              <p className="text-sm text-red-500">
                {String(errors.file.message)}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Any notes about this document..."
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setCertificateType("")
                onClose()
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
