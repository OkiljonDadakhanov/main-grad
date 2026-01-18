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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { FamilyMember } from "@/app/student/my-family/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface AddFamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (data: Omit<FamilyMember, "id">) => Promise<void> | void
}

const familyMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  occupation: z.string(),
  contactNumber: z.string(),
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

export default function AddFamilyMemberModal({
  isOpen,
  onClose,
  onAddMember,
}: AddFamilyMemberModalProps) {
  const { t } = useI18n()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
  })

  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPassportFile(e.target.files[0])
  }

  const onSubmit = async (data: FamilyMemberFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const passportCopyUrl = passportFile ? URL.createObjectURL(passportFile) : undefined

      await onAddMember({
        ...data,
        passportCopyUrl,
        passportFile: passportFile || undefined,
      })

      reset()
      setPassportFile(null)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("family.addFamilyMember")}</DialogTitle>
          <DialogDescription>
            {t("family.modalDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">{t("profile.fullName")}</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          {/* Relationship */}
          <div>
            <Label htmlFor="relationship">{t("profile.relationship")}</Label>
            <Select onValueChange={(value) => setValue("relationship", value)}>
              <SelectTrigger id="relationship">
                <SelectValue placeholder={t("family.selectRelationship")} />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.relationship && (
              <p className="text-sm text-red-500">{errors.relationship.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dateOfBirth">{t("profile.dateOfBirth")}</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <Label htmlFor="occupation">{t("family.occupation")}</Label>
            <Input id="occupation" {...register("occupation")} />
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contactNumber">{t("family.contactNumber")}</Label>
            <Input id="contactNumber" {...register("contactNumber")} />
          </div>

          {/* Passport Copy Upload */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t("family.passportCopy")}</h3>
            <Label htmlFor="passportFile">{t("family.uploadPassportCopy")}</Label>
            <Input
              id="passportFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handlePassportChange}
            />
            {passportFile ? (
              <p className="text-xs text-gray-500 mt-1">
                {t("family.uploaded")}: <span className="font-medium">{passportFile.name}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{t("family.noPassportYet")}</p>
            )}
          </div>

          {/* Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isSubmitting) {
                  reset()
                  setPassportFile(null)
                  onClose()
                }
              }}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("family.adding")}
                </span>
              ) : (
                t("family.addMember")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
