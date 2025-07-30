"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  provinceCityData,
  typeOptions,
  classificationOptions,
} from "@/constants/constants";
import {
  School,
  MapPin,
  Map,
  Mail,
  Lock,
  Phone,
  Globe,
  User,
  FileUp,
} from "lucide-react";

interface FormSectionProps {
  form: any;
  handleChange: (key: string, value: any) => void;
  emailError?: string;
  fieldErrors?: Record<string, string>;
}

export function FormSection({
  form,
  handleChange,
  emailError,
  fieldErrors = {},
}: FormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* University Name */}
      <div className="md:col-span-2">
        <Label>University Name *</Label>
        <div className="relative">
          <School className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            value={form.university_name}
            onChange={(e) => handleChange("university_name", e.target.value)}
          />
        </div>
      </div>

      {/* Types of Schools */}
      <div>
        <Label>Types of Schools *</Label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.types_of_schools}
          onChange={(e) => handleChange("types_of_schools", e.target.value)}
        >
          <option value="">Select Type</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          According to HIGHER EDUCATION ACT Article 2.
        </p>
      </div>

      {/* Classification */}
      <div>
        <Label>Classification *</Label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.classification}
          onChange={(e) => handleChange("classification", e.target.value)}
        >
          <option value="">Select Classification</option>
          {classificationOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          According to HIGHER EDUCATION ACT Article 3.
        </p>
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <Label>Address *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </div>

      {/* Province */}
      <div>
        <Label>Province *</Label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.province}
          onChange={(e) => {
            handleChange("province", e.target.value);
            handleChange("city", "");
          }}
        >
          <option value="">Select Province</option>
          {Object.keys(provinceCityData).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <Label>City *</Label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
          disabled={!form.province}
        >
          <option value="">Select City</option>
          {(provinceCityData[form.province] || []).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Zip Code */}
      <div className="md:col-span-2">
        <Label>Zip Code</Label>
        <div className="relative">
          <Map className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            value={form.zip_code}
            onChange={(e) => handleChange("zip_code", e.target.value)}
          />
        </div>
      </div>

      {/* University Admission Email */}
      <div>
        <Label>University Admission Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            type="email"
            className="pl-10"
            value={form.university_admission_email_address}
            onChange={(e) =>
              handleChange("university_admission_email_address", e.target.value)
            }
          />
        </div>
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>

      {/* Password */}
      <div>
        <Label>Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
      </div>

      {/* University Office Phone */}
      <div>
        <Label>University Office Phone *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="+82 10 1234 5678"
            value={form.university_office_phone}
            onChange={(e) =>
              handleChange("university_office_phone", e.target.value)
            }
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <Label>University Website *</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
      </div>

      {/* Representative Name */}
      <div>
        <Label>University Admission Representative Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            value={form.university_admission_representetive_name}
            onChange={(e) =>
              handleChange(
                "university_admission_representetive_name",
                e.target.value
              )
            }
          />
        </div>
      </div>

      {/* Representative Email */}
      <div>
        <Label>University Admission Representative’s Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            type="email"
            value={form.university_admission_representetive_email}
            onChange={(e) =>
              handleChange(
                "university_admission_representetive_email",
                e.target.value
              )
            }
          />
        </div>
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>

      {/* Accreditation Number */}
      <div className="md:col-span-2">
        <Label>Accreditation Number </Label>
        <Input
          value={form.accreditation_number}
          onChange={(e) => handleChange("accreditation_number", e.target.value)}
        />
      </div>

      {/* Accreditation Document Upload */}
      <div className="md:col-span-2">
        <Label>Upload Accreditation Document </Label>
        <div className="flex items-center gap-2">
          <FileUp className="text-gray-500" />
          <Input
            type="file"
            onChange={(e) =>
              handleChange(
                "accreditation_document",
                e.target.files?.[0] || null
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
