"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"), // Consider using a date picker
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

// Mock data - replace with actual data fetching
const mockStudentData = {
  fullName: "Shoxbek Shukurulloyev",
  dateOfBirth: "1998-05-15",
  gender: "Male",
  nationality: "Uzbek",
  passportNumber: "AC222222",
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

export default function PersonalInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // To set initial values
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: mockStudentData, // Set default values from mock data
  })

  const onSubmit = (data: PersonalInfoFormData) => {
    console.log("Personal Info Submitted:", data)
    // Handle form submission (e.g., API call)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
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
      </div>

      {/* Contact Information */}
      <h3 className="text-lg font-medium pt-4 border-t mt-6">Contact Information</h3>
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

      {/* Emergency Contact */}
      <h3 className="text-lg font-medium pt-4 border-t mt-6">Emergency Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Full Name</Label>
          <Input id="emergencyContactName" {...register("emergencyContactName")} />
          {errors.emergencyContactName && <p className="text-sm text-red-500">{errors.emergencyContactName.message}</p>}
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

      <div className="flex justify-end pt-6">
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
