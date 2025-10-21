"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useCustomToast } from "@/components/custom-toast"
import { BASE_URL, authFetch, getAccessTokenFromStorage } from "@/lib/auth"

const personalInfoSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  passport_number: z.string().optional().nullable(),
  passport_expiry_date: z.string().optional().nullable(),
  email_contact: z.string().email("Invalid email address").optional().nullable(),
  phone_number: z.string().optional().nullable(),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state_province: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  emergency_full_name: z.string().optional().nullable(),
  emergency_relationship: z.string().optional().nullable(),
  emergency_phone: z.string().optional().nullable(),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

const emptyData: PersonalInfoFormData = {
  full_name: "",
  date_of_birth: null,
  gender: "",
  nationality: "",
  passport_number: null,
  passport_expiry_date: null,
  email_contact: "",
  phone_number: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state_province: "",
  postal_code: "",
  country: "",
  emergency_full_name: "",
  emergency_relationship: "",
  emergency_phone: "",
}


export default function PersonalInfoForm() {
  const { success, error } = useCustomToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: emptyData,
  })


  useEffect(() => {
    const token = getAccessTokenFromStorage();
    if (!token) {
      window.location.replace("/login/student");
      return;
    }
    const load = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/api/personal-information/`);
        if (!res.ok) return;
        const data = await res.json();
        // fill form with existing data keys if present
        Object.keys(emptyData).forEach((key) => {
          const k = key as keyof PersonalInfoFormData;
          if (data[k] !== undefined) setValue(k, data[k] as any);
        });
      } catch {}
    };
    load();
  }, [setValue]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      const res = await authFetch(`${BASE_URL}/api/personal-information/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        error("Saqlashda xatolik.");
        return;
      }
      success("Ma'lumotlar saqlandi.");
    } catch {
      error("Server xatosi.");
    }
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
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
            {errors.date_of_birth && <p className="text-sm text-red-500">{String(errors.date_of_birth.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => setValue("gender", value)}>
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
            {errors.nationality && <p className="text-sm text-red-500">{String(errors.nationality.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passport_number">Passport Number</Label>
            <Input id="passport_number" {...register("passport_number")} />
            {errors.passport_number && <p className="text-sm text-red-500">{String(errors.passport_number.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passport_expiry_date">Passport Expiry Date</Label>
            <Input id="passport_expiry_date" type="date" {...register("passport_expiry_date")} />
            {errors.passport_expiry_date && <p className="text-sm text-red-500">{String(errors.passport_expiry_date.message)}</p>}
          </div>
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
              <Label htmlFor="email_contact">Email Address</Label>
              <Input id="email_contact" type="email" {...register("email_contact")} />
              {errors.email_contact && <p className="text-sm text-red-500">{String(errors.email_contact.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input id="phone_number" {...register("phone_number")} />
              {errors.phone_number && <p className="text-sm text-red-500">{String(errors.phone_number.message)}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input id="address_line1" {...register("address_line1")} />
            {errors.address_line1 && <p className="text-sm text-red-500">{String(errors.address_line1.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
            <Input id="address_line2" {...register("address_line2")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-sm text-red-500">{String(errors.city.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state_province">State/Province</Label>
              <Input id="state_province" {...register("state_province")} />
              {errors.state_province && <p className="text-sm text-red-500">{String(errors.state_province.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input id="postal_code" {...register("postal_code")} />
              {errors.postal_code && <p className="text-sm text-red-500">{String(errors.postal_code.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && <p className="text-sm text-red-500">{String(errors.country.message)}</p>}
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
              <Label htmlFor="emergency_full_name">Full Name</Label>
              <Input id="emergency_full_name" {...register("emergency_full_name")} />
              {errors.emergency_full_name && (
                <p className="text-sm text-red-500">{String(errors.emergency_full_name.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_relationship">Relationship</Label>
              <Input id="emergency_relationship" {...register("emergency_relationship")} />
              {errors.emergency_relationship && (
                <p className="text-sm text-red-500">{String(errors.emergency_relationship.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_phone">Phone Number</Label>
              <Input id="emergency_phone" {...register("emergency_phone")} />
              {errors.emergency_phone && (
                <p className="text-sm text-red-500">{String(errors.emergency_phone.message)}</p>
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
