"use client"

import { useEffect } from "react"
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
import type { EducationEntry } from "@/app/student/educational-information/page"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

interface EditEducationModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdated: () => Promise<void> | void
  educationEntry: EducationEntry | null
}

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  type: z.string().optional().default("secondary"),
  country: z.string().optional().default("") ,
  city: z.string().optional().default("") ,
  graduationYear: z.string().optional().default(""),
  gpa: z.string().optional(),
  description: z.string().optional(),
})

type EducationFormData = z.infer<typeof educationSchema>

export default function EditEducationModal({
  isOpen,
  onClose,
  onUpdated,
  educationEntry,
}: EditEducationModalProps) {
  const { success, error } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  useEffect(() => {
    if (educationEntry) {
      setValue("institution", educationEntry.institution)
      setValue("degree", educationEntry.degree)
      setValue("fieldOfStudy", educationEntry.fieldOfStudy)
      setValue("startDate", educationEntry.startDate)
      setValue("endDate", educationEntry.endDate)
      setValue("type", educationEntry.type || "secondary")
      setValue("country", educationEntry.country || "")
      setValue("city", educationEntry.city || "")
      setValue("graduationYear", educationEntry.graduationYear ? String(educationEntry.graduationYear) : "")
      setValue("gpa", educationEntry.gpa || "")
      setValue("description", educationEntry.description || "")
    }
  }, [educationEntry, setValue])

  const onSubmit = async (data: EducationFormData) => {
    if (!educationEntry) return
    try {
      const graduationYear = data.graduationYear || (data.endDate ? String(new Date(data.endDate).getFullYear()) : "")
      const payload: Record<string, unknown> = {
        type: data.type || "secondary",
        institution_name: data.institution,
        degree: data.degree,
        field_of_study: data.fieldOfStudy,
        country: data.country || undefined,
        city: data.city || undefined,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        graduation_year: graduationYear ? Number(graduationYear) : undefined,
        gpa: data.gpa || undefined,
        description: data.description || "",
      }
      const response = await authFetch(`${BASE_URL}/api/educations/${educationEntry.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Failed to update education")
      success("Education updated")
      reset()
      await onUpdated()
    } catch (e) {
      error("Failed to update education")
    }
  }

  if (!educationEntry) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Education Entry</DialogTitle>
          <DialogDescription>
            Update your academic qualification and related documents.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Institution */}
          <div>
            <Label htmlFor="institution">Institution Name</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && (
              <p className="text-sm text-red-500">{errors.institution.message}</p>
            )}
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Input id="type" placeholder="secondary" {...register("type")} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Uzbekistan" {...register("country")} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Tashkent" {...register("city")} />
            </div>
          </div>

          {/* Degree */}
          <div>
            <Label htmlFor="degree">Degree/Certificate</Label>
            <Input id="degree" {...register("degree")} />
            {errors.degree && (
              <p className="text-sm text-red-500">{errors.degree.message}</p>
            )}
          </div>

          {/* Field of Study */}
          <div>
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Input id="fieldOfStudy" {...register("fieldOfStudy")} />
            {errors.fieldOfStudy && (
              <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Graduation Year */}
          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input id="graduationYear" placeholder="2024" {...register("graduationYear")} />
          </div>

          {/* GPA */}
          <div>
            <Label htmlFor="gpa">GPA (Optional)</Label>
            <Input id="gpa" {...register("gpa")} placeholder="e.g., 3.8/4.0 or 85%" />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Any additional details or achievements..."
            />
          </div>

          {/* Files are managed on the entry row */}

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
