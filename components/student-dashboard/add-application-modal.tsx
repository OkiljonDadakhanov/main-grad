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
import type { ApplicationEntry } from "@/app/student/my-applications/page" // Adjust path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onAddApplication: (data: Omit<ApplicationEntry, "id" | "statusDate">) => void
}

const applicationSchema = z.object({
  universityName: z.string().min(1, "University name is required"),
  programName: z.string().min(1, "Program name is required"),
  applicationDate: z.string().min(1, "Application date is required"),
  status: z
    .enum(["Submitted", "Under Review", "Accepted", "Rejected", "Waitlisted", "Offer Received"])
    .default("Submitted"),
  applicationId: z.string().optional(),
  remarks: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

const applicationStatuses: ApplicationEntry["status"][] = [
  "Submitted",
  "Under Review",
  "Accepted",
  "Offer Received",
  "Waitlisted",
  "Rejected",
]

export default function AddApplicationModal({ isOpen, onClose, onAddApplication }: AddApplicationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { status: "Submitted" },
  })

  const onSubmit = (data: ApplicationFormData) => {
    onAddApplication(data)
    reset({ status: "Submitted" }) // Reset with default status
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Application to Track</DialogTitle>
          <DialogDescription>
            Manually add an application you've submitted to keep track of its status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="universityName">University Name</Label>
            <Input id="universityName" {...register("universityName")} />
            {errors.universityName && <p className="text-sm text-red-500">{errors.universityName.message}</p>}
          </div>
          <div>
            <Label htmlFor="programName">Program Name</Label>
            <Input id="programName" {...register("programName")} />
            {errors.programName && <p className="text-sm text-red-500">{errors.programName.message}</p>}
          </div>
          <div>
            <Label htmlFor="applicationDate">Application Date</Label>
            <Input id="applicationDate" type="date" {...register("applicationDate")} />
            {errors.applicationDate && <p className="text-sm text-red-500">{errors.applicationDate.message}</p>}
          </div>
          <div>
            <Label htmlFor="status">Current Status</Label>
            <Select
              defaultValue="Submitted"
              onValueChange={(value) => setValue("status", value as ApplicationEntry["status"])}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {applicationStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>
          <div>
            <Label htmlFor="applicationId">Application ID (Optional)</Label>
            <Input id="applicationId" {...register("applicationId")} />
          </div>
          <div>
            <Label htmlFor="remarks">Remarks/Notes (Optional)</Label>
            <Textarea id="remarks" {...register("remarks")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
