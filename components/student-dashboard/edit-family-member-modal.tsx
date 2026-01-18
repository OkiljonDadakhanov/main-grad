"use client"

import { useState, useEffect } from "react"
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
import { useI18n } from "@/lib/i18n"

interface EditFamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateMember: (updatedMember: FamilyMember) => void
  member: FamilyMember | null
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

export default function EditFamilyMemberModal({
  isOpen,
  onClose,
  onUpdateMember,
  member,
}: EditFamilyMemberModalProps) {
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
  const [existingPassportUrl, setExistingPassportUrl] = useState<string | undefined>()

  useEffect(() => {
    if (member) {
      setValue("fullName", member.fullName)
      setValue("relationship", member.relationship)
      setValue("dateOfBirth", member.dateOfBirth)
      setValue("occupation", member.occupation || "")
      setValue("contactNumber", member.contactNumber || "")
      setExistingPassportUrl(member.passportCopyUrl)
    }
  }, [member, setValue])

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPassportFile(e.target.files[0])
  }

  const onSubmit = (data: FamilyMemberFormData) => {
    if (!member) return

    onUpdateMember({
      ...member,
      fullName: data.fullName,
      relationship: data.relationship,
      dateOfBirth: data.dateOfBirth,
      occupation: data.occupation,
      contactNumber: data.contactNumber,
      passportFile: passportFile ?? undefined, // ✅ pass file for PATCH
      passportCopyUrl: existingPassportUrl,
    })

    reset()
    setPassportFile(null)
    onClose()
  }

  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("family.editFamilyMember")}</DialogTitle>
          <DialogDescription>{t("family.modalDescription")}</DialogDescription>
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
            <Select
              defaultValue={member.relationship}
              onValueChange={(value) => setValue("relationship", value)}
            >
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
            {errors.relationship && <p className="text-sm text-red-500">{errors.relationship.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dateOfBirth">{t("profile.dateOfBirth")}</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Occupation */}
          <div>
            <Label htmlFor="occupation">{t("family.occupation")} ({t("common.optional")})</Label>
            <Input id="occupation" {...register("occupation")} />
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contactNumber">{t("family.contactNumber")} ({t("common.optional")})</Label>
            <Input id="contactNumber" {...register("contactNumber")} />
          </div>

          {/* Passport File */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">{t("family.passportCopy")}</h3>
            <Label htmlFor="passportFile">{t("family.uploadPassportCopy")}</Label>
            <Input id="passportFile" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handlePassportChange} />

            {passportFile ? (
              <p className="text-xs text-gray-500 mt-1">
                {t("family.uploaded")}: <span className="font-medium">{passportFile.name}</span>
              </p>
            ) : existingPassportUrl ? (
              <p className="text-xs mt-1">
                <a
                  href={existingPassportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  {t("common.viewFile")}
                </a>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{t("family.noPassportYet")}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setPassportFile(null)
                onClose()
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {t("common.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
