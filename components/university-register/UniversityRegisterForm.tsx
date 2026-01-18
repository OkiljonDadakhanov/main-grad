"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TermsModal } from "./TermsModal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useCustomToast } from "@/components/custom-toast";

import { FormSection } from "./FormSection";
import { provinceCityData } from "@/constants/constants";
import { BASE_URL } from "@/lib/auth";

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
  const { success, error } = useCustomToast();
  const termsContentRef = useRef<HTMLDivElement | null>(null);

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleChange = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "university_admission_email_address") setEmailError("");
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
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
      error("Password must be at least 6 characters.");
      return false;
    }
    if (
      !form.university_admission_representetive_name ||
      !form.university_admission_representetive_email ||
      !form.university_office_phone
    ) {
      error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setTermsError("");
    if (!isValidForm()) return;

    if (!agreed) {
      error(
        "You must accept the Terms and Conditions before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", form.university_admission_email_address);
    formData.append("password", form.password);

    let normalizedWebsite = form.website.trim();
    if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
      normalizedWebsite = `https://${normalizedWebsite}`;
    }

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
      "address",
      "zip_code",
      "university_office_phone",
      "accreditation_number",
      "accreditation_document",
    ];

    profileFields.forEach((key) => {
      const value = form[key];
      if (value !== null && value !== undefined) {
        if (key === "website") {
          formData.append(`university_profile.website`, normalizedWebsite);
        } else {
          formData.append(`university_profile.${key}`, value as any);
        }
      }
    });

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/register/university/`,
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.university_profile) {
          const serverErrors: Record<string, string> = {};
          Object.entries(data.university_profile).forEach(
            ([field, messages]) => {
              if (Array.isArray(messages)) serverErrors[field] = messages[0];
            }
          );
          setFieldErrors(serverErrors);
        } else if (data.email && Array.isArray(data.email)) {
          setEmailError(data.email[0]);
        } else {
          error("Something went wrong. Please check your inputs.");
        }
        return;
      }

      success("Registration successful! Redirecting...");
      router.push("/success");
    } catch {
      error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScroll = () => {
    if (termsContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsContentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setHasScrolledToBottom(true);
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Register Your University
          </h2>
          <p className="opacity-80 mt-2 text-sm sm:text-base">
            Fill in all necessary information to add your university
          </p>
        </div>

        <Card className="bg-white text-black shadow-xl w-full max-w-full sm:rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            <FormSection
              form={form}
              handleChange={handleChange}
              emailError={emailError}
              fieldErrors={fieldErrors}
            />

            {/* Terms Agreement */}
            <div className="pt-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => {
                    setShowTermsModal(true);
                    setHasScrolledToBottom(false);
                  }}
                  className="mt-1 cursor-pointer"
                />
                <label className="cursor-pointer">
                  I accept all terms and conditions
                </label>
              </div>
              {termsError && (
                <p className="text-sm text-red-600 mt-1">{termsError}</p>
              )}
            </div>

            {/* Terms Modal */}
            <TermsModal
              open={showTermsModal}
              onClose={() => setShowTermsModal(false)}
              setAgreed={() => {
                setAgreed(true);
                setShowTermsModal(false);
              }}
            />

            {/* Submit Button */}
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
