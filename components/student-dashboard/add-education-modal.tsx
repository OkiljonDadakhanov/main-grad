"use client"

import { useState } from "react"
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

interface AddEducationModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEducation: (data: Omit<EducationEntry, "id">) => void
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

export default function AddEducationModal({ isOpen, onClose, onAddEducation }: AddEducationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const [diplomaFile, setDiplomaFile] = useState<File | null>(null)
  const [apostilleFile, setApostilleFile] = useState<File | null>(null)

  const handleDiplomaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDiplomaFile(e.target.files[0])
    }
  }

  const handleApostilleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setApostilleFile(e.target.files[0])
    }
  }

  const onSubmit = (data: EducationFormData) => {
    // In a real app, upload files to storage and save URLs
    const diplomaUrl = diplomaFile ? URL.createObjectURL(diplomaFile) : undefined
    const apostilleUrl = apostilleFile ? URL.createObjectURL(apostilleFile) : undefined

    onAddEducation({
      ...data,
      diplomaUrl,
      apostilleUrl,
    })

    reset()
    setDiplomaFile(null)
    setApostilleFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Education</DialogTitle>
          <DialogDescription>
            Enter your academic qualification and upload related documents.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Institution */}
          <div>
            <Label htmlFor="institution">Institution Name</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && <p className="text-sm text-red-500">{errors.institution.message}</p>}
          </div>

          {/* Degree */}
          <div>
            <Label htmlFor="degree">Degree/Certificate</Label>
            <Input id="degree" {...register("degree")} />
            {errors.degree && <p className="text-sm text-red-500">{errors.degree.message}</p>}
          </div>

          {/* Field of Study */}
          <div>
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Input id="fieldOfStudy" {...register("fieldOfStudy")} />
            {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>}
          </div>

          {/* Dates */}
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

          {/* 📄 Document Uploads */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Educational Documents</h3>

            {/* Diploma / Attestat */}
            <div>
              <Label htmlFor="diplomaFile">Diploma / Attestat</Label>
              <Input id="diplomaFile" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDiplomaChange} />
              {diplomaFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: <span className="font-medium">{diplomaFile.name}</span>
                </p>
              )}
            </div>

            {/* Apostille */}
            <div>
              <Label htmlFor="apostilleFile">Apostille (with translation)</Label>
              <Input id="apostilleFile" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleApostilleChange} />
              {apostilleFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: <span className="font-medium">{apostilleFile.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setDiplomaFile(null)
                setApostilleFile(null)
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Add Education
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
