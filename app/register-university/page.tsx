// UniversityRegisterForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, MapPin, FileUp } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  website: string;
  contact_person: string;
  contact_email: string;
  type: string;
  classification: string;
  address: string;
  city: string;
  zip_code: string;
  latitude: string;
  longitude: string;
  phone_number: string;
  accreditation_number: string;
  accreditation_document: File | null;
}

export default function UniversityRegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    website: "",
    contact_person: "",
    contact_email: "",
    type: "",
    classification: "",
    address: "",
    city: "",
    zip_code: "",
    latitude: "",
    longitude: "",
    phone_number: "",
    accreditation_number: "",
    accreditation_document: null,
  });

  const [emailError, setEmailError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleChange = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailError("");
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const isValidForm = () => {
    if (!form.email || !isValidEmail(form.email)) {
      setEmailError("Please enter a valid email.");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (!form.contact_person || !form.contact_email || !form.phone_number) {
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
    formData.append("email", form.email);
    formData.append("password", form.password);

    const profileFields: (keyof FormData)[] = [
      "name",
      "website",
      "contact_person",
      "contact_email",
      "type",
      "classification",
      "address",
      "city",
      "zip_code",
      "latitude",
      "longitude",
      "phone_number",
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
                  <Input
                    className="pl-10"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Type *</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
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
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="Institute">Institute</option>
                  <option value="Academy">Academy</option>
                </select>
              </div>

              <div className="col-span-2">
                <Label>Address *</Label>
                <Input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              <div>
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>

              <div>
                <Label>Zip Code</Label>
                <Input
                  value={form.zip_code}
                  onChange={(e) => handleChange("zip_code", e.target.value)}
                />
              </div>

              <div>
                <Label>Latitude *</Label>
                <Input
                  value={form.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                />
              </div>

              <div>
                <Label>Longitude *</Label>
                <Input
                  value={form.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                />
              </div>

              <div>
                <Label> University email address *</Label>
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) =>
                    handleChange("contact_email", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>University office phone *</Label>
                <div className="relative">
                  <Input
                    className="pl-10"
                    value={form.phone_number}
                    onChange={(e) =>
                      handleChange("phone_number", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label>University Website *</Label>
                <div className="relative">
                  <Input
                    className="pl-10"
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>University representetive name *</Label>
                <div className="relative">
                  <Input
                    className="pl-10"
                    value={form.contact_person}
                    onChange={(e) =>
                      handleChange("contact_person", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
