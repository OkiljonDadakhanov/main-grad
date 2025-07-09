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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { FamilyMember } from "@/app/student/my-family/page" // Adjust path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddFamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (data: Omit<FamilyMember, "id">) => void
}

const familyMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  occupation: z.string().optional(),
  contactNumber: z.string().optional(),
})

type FamilyMemberFormData = z.infer<typeof familyMemberSchema>

const relationshipTypes = [
  "Father",
  "Mother",
  "Spouse",
  "Sibling (Brother/Sister)",
  "Child (Son/Daughter)",
  "Guardian",
  "Other",
]

export default function AddFamilyMemberModal({ isOpen, onClose, onAddMember }: AddFamilyMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
  })

  const onSubmit = (data: FamilyMemberFormData) => {
    onAddMember(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>Enter the details of the family member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label htmlFor="relationship">Relationship</Label>
            <Select onValueChange={(value) => setValue("relationship", value)}>
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.relationship && <p className="text-sm text-red-500">{errors.relationship.message}</p>}
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
          </div>
          <div>
            <Label htmlFor="occupation">Occupation (Optional)</Label>
            <Input id="occupation" {...register("occupation")} />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
            <Input id="contactNumber" {...register("contactNumber")} />
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
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
