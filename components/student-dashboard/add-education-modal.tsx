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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"
import { useI18n } from "@/lib/i18n"

interface AddEducationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => Promise<void> | void
}

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),

  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  type: z.string().optional().default("secondary"),
  country: z.string().optional().default(""),
  city: z.string().optional().default(""),
  graduationYear: z.string().optional().default(""),
  gpa: z.string().optional(),
  description: z.string().optional(),
})

type EducationFormData = z.infer<typeof educationSchema>

export default function AddEducationModal({ isOpen, onClose, onCreated }: AddEducationModalProps) {
  const { success, error } = useCustomToast()
  const { t } = useI18n()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const onSubmit = async (data: EducationFormData) => {
    try {
      const graduationYear = data.graduationYear || (data.endDate ? String(new Date(data.endDate).getFullYear()) : "")
      const payload: Record<string, unknown> = {
        type: data.type || "secondary",
        institution_name: data.institution,
   
        field_of_study: data.fieldOfStudy,
        country: data.country || undefined,
        city: data.city || undefined,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        graduation_year: graduationYear ? Number(graduationYear) : undefined,
        gpa: data.gpa || undefined,
        description: data.description || "",
        extra: {},
      }

      const response = await authFetch(`${BASE_URL}/api/educations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Failed to create education")
      success(t("education.educationAdded"))
      reset()
      await onCreated()
    } catch (e) {
      error(t("education.addFailed"))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("education.addNewEducation")}</DialogTitle>
          <DialogDescription>
            {t("education.modalDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Institution */}
          <div>
            <Label htmlFor="institution">{t("education.institutionName")}</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && (
              <p className="text-sm text-red-500">{errors.institution.message}</p>
            )}
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">{t("education.degree")}</Label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue="primary">
                <SelectTrigger id="type">
                  <SelectValue placeholder={t("education.selectDegree")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">{t("education.primary")}</SelectItem>
                  <SelectItem value="secondary">{t("education.secondary")}</SelectItem>
                  <SelectItem value="vocational">{t("education.vocational")}</SelectItem>
                  <SelectItem value="higher_bachelor">{t("education.higherBachelor")}</SelectItem>
                  <SelectItem value="graduate_master">{t("education.graduateMaster")}</SelectItem>
                  <SelectItem value="postgraduate_doctoral">{t("education.postgraduateDoctoral")}</SelectItem>
                  <SelectItem value="foundation_preparatory">{t("education.foundationPreparatory")}</SelectItem>
                  <SelectItem value="professional_certificate">{t("education.professionalCertificate")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="country">{t("profile.country")}</Label>
              <Input id="country" placeholder="Uzbekistan" {...register("country")} />
            </div>

            <div>
              <Label htmlFor="city">{t("profile.city")}</Label>
              <Input id="city" placeholder="Tashkent" {...register("city")} />
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <Label htmlFor="fieldOfStudy">{t("education.fieldOfStudy")}</Label>
            <Input id="fieldOfStudy" {...register("fieldOfStudy")} />
            {errors.fieldOfStudy && (
              <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">{t("education.startDate")}</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div>
              <Label htmlFor="endDate">{t("education.endDate")}</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          {/* Graduation Year */}
          <div>
            <Label htmlFor="graduationYear">{t("education.graduationYear")}</Label>
            <Input id="graduationYear" placeholder="2024" {...register("graduationYear")} />
          </div>

          {/* GPA */}
          <div>
            <Label htmlFor="gpa">{t("education.gpaOptional")}</Label>
            <Input id="gpa" {...register("gpa")} placeholder={t("education.gpaPlaceholder")} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">{t("education.descriptionOptional")}</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={t("education.descriptionPlaceholder")}
            />
          </div>

          {/* Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onClose()
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {t("education.addEducation")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
