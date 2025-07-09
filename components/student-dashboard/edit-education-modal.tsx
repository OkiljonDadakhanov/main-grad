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
import type { EducationEntry } from "@/app/student/educational-information/page" // Adjust path
import { useEffect } from "react"

interface EditEducationModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateEducation: (updatedEntry: EducationEntry) => void
  educationEntry: EducationEntry | null
}

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  gpa: z.string().optional(),
  description: z.string().optional(),
})

type EducationFormData = z.infer<typeof educationSchema>

export default function EditEducationModal({
  isOpen,
  onClose,
  onUpdateEducation,
  educationEntry,
}: EditEducationModalProps) {
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
      setValue("gpa", educationEntry.gpa || "")
      setValue("description", educationEntry.description || "")
    }
  }, [educationEntry, setValue])

  const onSubmit = (data: EducationFormData) => {
    if (educationEntry) {
      onUpdateEducation({ ...educationEntry, ...data })
    }
    reset()
    onClose()
  }

  if (!educationEntry) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Education Entry</DialogTitle>
          <DialogDescription>Update the details of your academic qualification.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="institution">Institution Name</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && <p className="text-sm text-red-500">{errors.institution.message}</p>}
          </div>
          <div>
            <Label htmlFor="degree">Degree/Certificate</Label>
            <Input id="degree" {...register("degree")} />
            {errors.degree && <p className="text-sm text-red-500">{errors.degree.message}</p>}
          </div>
          <div>
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Input id="fieldOfStudy" {...register("fieldOfStudy")} />
            {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="gpa">GPA (Optional)</Label>
            <Input id="gpa" {...register("gpa")} placeholder="e.g., 3.8/4.0 or 85%" />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Any additional details or achievements..."
            />
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
