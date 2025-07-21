// UniversityRegisterForm.tsx

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const termsContentRef = useRef<HTMLDivElement | null>(null);

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
      "address",
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
          headers: { Accept: "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.university_profile) {
          const serverErrors: Record<string, string> = {};
          Object.entries(data.university_profile).forEach(
            ([field, messages]) => {
              if (Array.isArray(messages)) {
                serverErrors[field] = messages[0];
              }
            }
          );
          setFieldErrors(serverErrors);
        } else if (data.email && Array.isArray(data.email)) {
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

  const handleScroll = () => {
    if (termsContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsContentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setHasScrolledToBottom(true);
      }
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

            <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
              <DialogContent className="max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Terms and Conditions</DialogTitle>
                  <DialogDescription>
                    Please scroll to the bottom and click "I Agree" to continue.
                  </DialogDescription>
                </DialogHeader>
                <div
                  ref={termsContentRef}
                  onScroll={handleScroll}
                  className="overflow-y-auto max-h-[300px] border p-3 rounded text-sm text-gray-700 bg-white space-y-4"
                >
                  <h2 className="text-base font-semibold">
                    1. General Provisions
                  </h2>
                  <p>
                    These terms govern the use of the "gradabroad.net" platform.
                    The platform provides services specifically for South Korean
                    universities and facilitates effective collaboration with
                    students. By using "gradabroad.net," you agree to these
                    terms.
                  </p>
                  <h2 className="text-base font-semibold">
                    2. Description of Services
                  </h2>
                  <p>
                    Through the "gradabroad.net" platform, South Korean
                    universities can access the following free services:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>Accepting and reviewing student applications.</li>
                    <li>
                      Automating and managing the university admission process.
                    </li>
                    <li>Delivering admission results to students.</li>
                  </ul>
                  <p>
                    <strong>Note:</strong> Universities using the Econom (Free)
                    plan do not have access to:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>Posting advertisements.</li>
                    <li>Uploading video content.</li>
                  </ul>
                  <h2 className="text-base font-semibold">
                    3. Payment Conditions
                  </h2>
                  <ul className="list-disc pl-5">
                    <li>The Econom plan is completely free of charge.</li>
                    <li>No subscription fees or hidden costs apply.</li>
                  </ul>
                  <h2 className="text-base font-semibold">
                    4. User Responsibilities
                  </h2>
                  <ul className="list-disc pl-5">
                    <li>
                      Universities must use the platform lawfully and in
                      accordance with the specified rules.
                    </li>
                    <li>
                      Applications must be reviewed fairly, and results must be
                      delivered promptly.
                    </li>
                  </ul>
                  <h2 className="text-base font-semibold">
                    5. gradabroad.net Responsibilities
                  </h2>
                  <ul className="list-disc pl-5">
                    <li>
                      Ensuring the quality of services and providing technical
                      support.
                    </li>
                    <li>
                      Keeping university data confidential and disclosing it
                      only to the Ministries of Education of Uzbekistan and
                      South Korea.
                    </li>
                  </ul>
                  <h2 className="text-base font-semibold">
                    6. Validity of Terms
                  </h2>
                  <p>
                    These terms and conditions apply upon the university's
                    registration and use of the Econom (Free) plan.
                  </p>
                  <h2 className="text-base font-semibold">
                    7. Contact Information
                  </h2>
                  <p>
                    For inquiries or issues, please contact:
                    <br />
                    <strong>"gradabroad.net" Platform</strong>
                    <br />
                    Email: gradabroadltd@gmail.com
                  </p>
                  <hr className="border-t border-gray-300" />
                  <h2 className="text-base font-semibold">
                    사용 약관: 에코놈 (무료) 요금제
                  </h2>
                  <h3 className="font-semibold">1. 일반 조항</h3>
                  <p>
                    이 약관은 "gradabroad.net" 플랫폼의 이용 규정을 명시합니다.
                    본 플랫폼은 한국 대학을 위한 맞춤형 서비스를 제공하며
                    학생들과 효과적인 협력을 지원합니다. "gradabroad.net"를
                    사용함으로써 귀하는 본 약관에 동의하는 것으로 간주됩니다.
                  </p>
                  <h3 className="font-semibold">2. 서비스 설명</h3>
                  <p>다음의 무료 서비스를 이용할 수 있습니다:</p>
                  <ul className="list-disc pl-5">
                    <li>학생 지원서 접수 및 검토</li>
                    <li>대학 입학 절차의 자동화 및 관리</li>
                    <li>입학 결과를 학생들에게 전달</li>
                  </ul>
                  <p>
                    <strong>참고:</strong> 아래 서비스는 사용할 수 없습니다:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>광고 게시</li>
                    <li>동영상 콘텐츠 업로드</li>
                  </ul>
                  <h3 className="font-semibold">3. 결제 조건</h3>
                  <ul className="list-disc pl-5">
                    <li>에코놈 요금제는 완전히 무료입니다.</li>
                    <li>구독 요금이나 숨겨진 비용이 없습니다.</li>
                  </ul>
                  <h3 className="font-semibold">4. 사용자 의무</h3>
                  <ul className="list-disc pl-5">
                    <li>
                      대학은 플랫폼을 법적이고 명시된 규정에 따라 사용해야
                      합니다.
                    </li>
                    <li>
                      지원서를 공정하게 검토하고 결과를 신속히 전달해야 합니다.
                    </li>
                  </ul>
                  <h3 className="font-semibold">5. gradabroad.net의 의무</h3>
                  <ul className="list-disc pl-5">
                    <li>서비스 품질을 보장하고 기술 지원을 제공합니다.</li>
                    <li>
                      대학 데이터를 기밀로 유지하며 우즈베키스탄 및 한국
                      교육부에만 공개합니다.
                    </li>
                  </ul>
                  <h3 className="font-semibold">6. 약관 유효 기간</h3>
                  <p>
                    이 약관은 대학이 에코놈(무료) 요금제를 등록하고 사용하는
                    즉시 적용됩니다.
                  </p>
                  <h3 className="font-semibold">7. 연락처 정보</h3>
                  <p>
                    문의사항이나 문제가 있을 경우 아래로 연락해 주십시오:
                    <br />
                    <strong>"gradabroad.net" 플랫폼</strong>
                    <br />
                    이메일: gradabroadltd@gmail.com
                  </p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => {
                      if (hasScrolledToBottom) {
                        setAgreed(true);
                        setShowTermsModal(false);
                      } else {
                        toast.error("Please scroll to the bottom to agree.");
                      }
                    }}
                    disabled={!hasScrolledToBottom}
                  >
                    I Agree
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
