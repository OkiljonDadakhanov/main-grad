"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { useState } from "react"

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  passportExpiry: z.string().min(1, "Passport expiry date is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

const mockStudentData = {
  fullName: "Shoxbek Shukurulloyev",
  dateOfBirth: "1998-05-15",
  gender: "Male",
  nationality: "Uzbek",
  passportNumber: "AC2947014",
  passportExpiry: "2028-10-20",
  email: "shoxbek.s@example.com",
  phone: "+998901234567",
  addressLine1: "123 Tashkent Street",
  city: "Tashkent",
  stateProvince: "Tashkent Region",
  postalCode: "100000",
  country: "Uzbekistan",
  emergencyContactName: "Kamola Shukurulloyeva",
  emergencyContactRelationship: "Sister",
  emergencyContactPhone: "+998907654321",
}

interface UploadedDocument {
  name: string
  file?: File
  uploaded: boolean
}

export default function PersonalInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: mockStudentData,
  })

  const [documents, setDocuments] = useState<Record<string, UploadedDocument>>({
    passportCopy: { name: "Passport Copy", uploaded: false },
    passportPhoto: { name: "Passport-size Photo", uploaded: false },
    medicalReport: { name: "Medical Examination Report", uploaded: false },
    nationalId: { name: "National ID Card / Birth Certificate", uploaded: false },
    apostilleBirth: { name: "Apostille Birth Certificate", uploaded: false },
  })

  const handleFileUpload = (documentKey: string, file: File | null) => {
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [documentKey]: { ...prev[documentKey], file, uploaded: true },
      }))
    }
  }

  const onSubmit = (data: PersonalInfoFormData) => {
    console.log("Personal Info Submitted:", data)
    console.log("Documents:", documents)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your personal identification details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => setValue("gender", value)} defaultValue={mockStudentData.gender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" {...register("nationality")} />
            {errors.nationality && <p className="text-sm text-red-500">{errors.nationality.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passportNumber">Passport Number</Label>
            <Input id="passportNumber" {...register("passportNumber")} />
            {errors.passportNumber && <p className="text-sm text-red-500">{errors.passportNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passportExpiry">Passport Expiry Date</Label>
            <Input id="passportExpiry" type="date" {...register("passportExpiry")} />
            {errors.passportExpiry && <p className="text-sm text-red-500">{errors.passportExpiry.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Upload your identification and personal documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(documents).map(([key, doc]) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  {doc.uploaded && doc.file && <p className="text-xs text-gray-500">{doc.file.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.uploaded ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Label htmlFor={key} className="cursor-pointer">
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload</span>
                    </div>
                    <Input
                      id={key}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(key, e.target.files?.[0] || null)}
                    />
                  </Label>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input id="addressLine1" {...register("addressLine1")} />
            {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input id="addressLine2" {...register("addressLine2")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateProvince">State/Province</Label>
              <Input id="stateProvince" {...register("stateProvince")} />
              {errors.stateProvince && <p className="text-sm text-red-500">{errors.stateProvince.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Full Name</Label>
              <Input id="emergencyContactName" {...register("emergencyContactName")} />
              {errors.emergencyContactName && (
                <p className="text-sm text-red-500">{errors.emergencyContactName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relationship</Label>
              <Input id="emergencyContactRelationship" {...register("emergencyContactRelationship")} />
              {errors.emergencyContactRelationship && (
                <p className="text-sm text-red-500">{errors.emergencyContactRelationship.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Phone Number</Label>
              <Input id="emergencyContactPhone" {...register("emergencyContactPhone")} />
              {errors.emergencyContactPhone && (
                <p className="text-sm text-red-500">{errors.emergencyContactPhone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6">
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
