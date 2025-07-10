"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
  logo: string;
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
  language: string;
  translated_name: string;
  description: string;
}

export default function UniversityRegisterForm() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    logo: "",
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
    language: "en",
    translated_name: "",
    description: "",
  });

  const handleChange = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value as any);
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

      if (!response.ok) throw new Error("Failed to register");

      toast.success(
        "Registration successful! Check your email for confirmation."
      );
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Register Your University
          </h2>
          <p className="text-md opacity-80 mt-2">
            Fill in all necessary information to add your university to our
            platform
          </p>
        </div>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step {step} of 3</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
                <div>
                  <Label>University Website</Label>
                  <Input
                    type="text"
                    required
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    type="text"
                    value={form.logo}
                    onChange={(e) => handleChange("logo", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    type="text"
                    required
                    value={form.contact_person}
                    onChange={(e) =>
                      handleChange("contact_person", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    required
                    value={form.contact_email}
                    onChange={(e) =>
                      handleChange("contact_email", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Input
                    type="text"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Classification</Label>
                  <Input
                    type="text"
                    value={form.classification}
                    onChange={(e) =>
                      handleChange("classification", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Zip Code</Label>
                  <Input
                    type="text"
                    value={form.zip_code}
                    onChange={(e) => handleChange("zip_code", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="text"
                    value={form.phone_number}
                    onChange={(e) =>
                      handleChange("phone_number", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Accreditation Number</Label>
                  <Input
                    type="text"
                    value={form.accreditation_number}
                    onChange={(e) =>
                      handleChange("accreditation_number", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Upload Accreditation Document</Label>
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
                <div>
                  <Label>Language</Label>
                  <Input
                    type="text"
                    value={form.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Translated Name</Label>
                  <Input
                    type="text"
                    value={form.translated_name}
                    onChange={(e) =>
                      handleChange("translated_name", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && <Button onClick={prevStep}>Back</Button>}
              {step < 3 ? (
                <Button onClick={nextStep}>Next</Button>
              ) : (
                <Button type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
