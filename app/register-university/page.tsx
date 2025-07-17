// UniversityRegisterForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import {
  Mail,
  Lock,
  MapPin,
  FileUp,
  Phone,
  School,
  Globe,
  User,
  Map,
} from "lucide-react";

const provinceCityData: Record<string, string[]> = {
  "Gyeonggi-do": [
    "Suwon",
    "Seongnam",
    "Anyang",
    "Ansan",
    "Anseong",
    "Yongin",
    "Pyeongtaek",
    "Goyang",
    "Uijeongbu",
    "Icheon",
    "Hwaseong",
    "Namyangju",
  ],
  "Gangwon-do": ["Chuncheon", "Gangneung", "Wonju", "Samcheok"],
  "North Chungcheong": ["Cheongju", "Chungju", "Jecheon"],
  "South Chungcheong": ["Cheonan", "Gongju", "Nonsan", "Dangjin", "Asan"],
  "North Jeolla": ["Jeonju", "Iksan", "Gunsan"],
  "South Jeolla": ["Mokpo", "Yeosu", "Suncheon", "Naju"],
  "North Gyeongsang": ["Gyeongsan", "Andong", "Pohang", "Gumi", "Sangju"],
  "South Gyeongsang": ["Jinju", "Changwon", "Gimhae", "Miryang", "Tongyeong"],
  Jeju: ["Jeju"],
  Seoul: ["Seoul"],
  Busan: ["Busan"],
  Daegu: ["Daegu"],
  Incheon: ["Incheon"],
  Gwangju: ["Gwangju"],
  Daejeon: ["Daejeon"],
  Ulsan: ["Ulsan"],
};

interface FormData {
  university_name: string;
  university_admission_email_address: string;
  password: string;
  website: string;
  university_admission_representetive_name: string;
  university_admission_representetive_email: string;
  types_of_schools: string;
  classification: string;
  address: string;
  province: string;
  city: string;
  zip_code: string;
  university_office_phone: string;
  accreditation_number: string;
  accreditation_document: File | null;
}

export default function UniversityRegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    university_name: "",
    university_admission_email_address: "",
    password: "",
    website: "",
    university_admission_representetive_name: "",
    university_admission_representetive_email: "",
    types_of_schools: "",
    classification: "",
    address: "",
    province: "",
    city: "",
    zip_code: "",
    university_office_phone: "",
    accreditation_number: "",
    accreditation_document: null,
  });

  const [emailError, setEmailError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleChange = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "university_admission_email_address") setEmailError("");
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const isValidForm = () => {
    if (
      !form.university_admission_email_address ||
      !isValidEmail(form.university_admission_email_address)
    ) {
      setEmailError("Please enter a valid email.");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (
      !form.university_admission_representetive_name ||
      !form.university_admission_representetive_email ||
      !form.university_office_phone
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setTermsError("");
    if (!isValidForm()) return;
    if (!agreed) {
      toast.error(
        "You must accept the Terms and Conditions before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", form.university_admission_email_address);
    formData.append("password", form.password);

    const profileFields: (keyof FormData)[] = [
      "university_name",
      "website",
      "university_admission_representetive_name",
      "university_admission_representetive_email",
      "types_of_schools",
      "classification",
      "university_admission_email_address",
      "province",
      "city",
      "zip_code",
      "university_office_phone",
      "accreditation_number",
      "accreditation_document",
    ];

    profileFields.forEach((key) => {
      const value = form[key];
      if (value !== null && value !== undefined) {
        formData.append(`university_profile.${key}`, value as any);
      }
    });

    try {
      const response = await fetch(
        "https://api.gradabroad.net/api/auth/register/university/",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.email && Array.isArray(data.email)) {
          setEmailError(data.email[0]);
        } else {
          toast.error("Something went wrong. Please check your inputs.");
        }
        return;
      }

      toast.success("Registration successful! Redirecting...");
      router.push("/success");
    } catch {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Register Your University
          </h2>
          <p className="opacity-80 mt-2">
            Fill in all necessary information to add your university
          </p>
        </div>

        <Card className="bg-white text-black shadow-xl">
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>University Name *</Label>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    value={form.university_name}
                    onChange={(e) =>
                      handleChange("university_name", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Types of Schools *</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.types_of_schools}
                  onChange={(e) =>
                    handleChange("types_of_schools", e.target.value)
                  }
                >
                  <option value="">Select Type</option>
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="Institute">Institute</option>
                  <option value="Academy">Academy</option>
                  <option value="Graduate School">Graduate School</option>
                  <option value="Foreign Branch Campus">
                    Foreign Branch Campus
                  </option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  According to HIGHER EDUCATION ACT Article 2.
                </p>
              </div>

              <div>
                <Label>Classification *</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.classification}
                  onChange={(e) =>
                    handleChange("classification", e.target.value)
                  }
                >
                  <option value="">Select Classification</option>
                  <option value="National">National</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  According to HIGHER EDUCATION ACT Article 3.
                </p>
              </div>

              <div className="col-span-2">
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

              <div>
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

              {/* Email + Password */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>University admission email address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      className="pl-10"
                      value={form.university_admission_email_address}
                      onChange={(e) =>
                        handleChange(
                          "university_admission_email_address",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-600">{emailError}</p>
                  )}
                </div>

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

                <div>
                  <Label>University office phone *</Label>
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

                <div>
                  <Label>University admission representetive name *</Label>
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

                <div>
                  <Label>University admission representetive’s email *</Label>
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
                  {emailError && (
                    <p className="text-sm text-red-600">{emailError}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <Label>Accreditation Number *</Label>
                <Input
                  value={form.accreditation_number}
                  onChange={(e) =>
                    handleChange("accreditation_number", e.target.value)
                  }
                />
              </div>

              <div className="col-span-2">
                <Label>Upload Accreditation Document *</Label>
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
            <div className="pt-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setTermsError("");
                  }}
                  className="mt-1"
                />
                <label>
                  <a
                    href="/register-university/terms"
                    target="_blank"
                    className="text-purple-700 font-semibold hover:underline"
                  >
                    I accept all terms and conditions
                  </a>
                </label>
              </div>
              {termsError && (
                <p className="text-sm text-red-600 mt-1">{termsError}</p>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
