"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  FileText,
  Clock,
  MapPin,
  Lightbulb,
  School,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

export default function VisaRequirementsPage() {
  const agencies = [
    {
      name: "AMEKS",
      address: "Mirabad str. 39, 32B",
      phone: ["+998 71 2522707", "+998 91 1358489", "+998 90 8079126 (Korean)"],
      email: "an@ameks.net",
    },
    {
      name: "ASPAN TOUR",
      address: "Sh. Rustaveli str. 46/46",
      phone: ["+998 71 2537255", "+998 90 9919462", "+998 97 4048399 (Korean)"],
      email: "aspantour@gmail.com",
    },
    {
      name: "BESTA",
      address: "Bobur str. 74",
      phone: ["+998 90 3524000", "+998 97 7075452", "+998 95 1953153 (Korean)"],
      email: "dmitriy.besta@gmail.com",
    },
    {
      name: "FLY TEAM",
      address: "Shakhrisabz str. 3/57",
      phone: ["+998 90 3267299", "+998 90 1760186", "+998 98 1230909 (Korean)"],
      email: "flyteamtashkent@gmail.com",
    },
    {
      name: "HELLO ASIA TOUR",
      address: "Mirobod str. 2/75",
      phone: ["+998 77 0074419", "+998 95 4149990", "+998 90 9492199 (Korean)"],
      email: "kimkyu1@hanmail.net",
    },
    {
      name: "KOR TOUR",
      address: "Avliyo ota str. 2/25",
      phone: ["+998 99 3286282", "+998 90 9918113", "+998 90 3528113 (Korean)"],
      email: "ozkortour@gmail.com",
    },
    {
      name: "KOREA BEST TOUR",
      address: "Yakkasaroy, At Termiziy str. 30",
      phone: ["+998 90 8295276", "+998 91 1921114 (Korean)"],
      email: "uzbesttour@gmail.com",
    },
    {
      name: "MERIDIAN TRAVEL",
      address: "Markaz-5, 66",
      phone: ["+998 95 3080707", "+998 93 1274749", "+998 97 7569960 (Korean)"],
      email: "meridianinbound@mail.ru",
    },
    {
      name: "NOJIA TOUR",
      address: "Sumbula str. 52",
      phone: ["+998 90 1321203", "+998 94 6397117", "+998 97 4300820 (Korean)"],
      email: "uznexustour@naver.com",
    },
    {
      name: "ORIENT DESK SERVICE",
      address: "Oybek str. 40",
      phone: ["+998 33 3395665", "+998 97 7775665", "+998 97 4418889 (Korean)"],
      email: "ods_tour@mail.ru",
    },
    {
      name: "ORIGINAL EVEREST BUSINESS",
      address: "Bunyodkor str. 2a",
      phone: ["+998 99 4003355", "+998 97 1403355", "+998 95 4006565"],
      email: "originaleverest@mail.ru",
    },
    {
      name: "TAEWOONG TRAVEL",
      address: "Fidokor str. 7",
      phone: ["+998 71 2302339", "+998 93 1838937 (Korean)"],
      email: "tgl_travel@e-tgl.com",
    },
    {
      name: "VIP–LARUS",
      address: "Sh. Rustaveli str. 18",
      phone: [
        "+998 99 9874441",
        "+998 94 6200747",
        "+998 93 9287373 (English)",
      ],
      email: "viplarustavel@gmail.com",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      {/* Hero banner — matches gradabroad.net style */}
      <section className="relative flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[url('/images/main.jpg')] bg-cover bg-center"
            aria-hidden
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(120deg, rgba(51, 0, 102, 0.65) 0%, rgba(10, 37, 99, 0.55) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.35)" }}
          />
        </div>

        <div className="relative z-10 w-full px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl text-center text-white">
            <div className="mb-4 flex items-center justify-center">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
                Study in Korea · Visa (D-2)
              </span>
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Visa Requirements for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                Uzbek Students Applying to Korea
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-white/90 md:mt-6 md:text-lg">
              A clear, step-by-step guide to the D-2 student visa: documents,
              timing, where to apply, and helpful tips.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col items-center justify-center gap-3 sm:flex-row md:mt-10">
              <Button
                size="lg"
                className="min-w-[190px] bg-white text-purple-900 hover:bg-white/90"
                asChild
              >
                <Link href="/universities">Explore Universities</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[190px] border-white/60 bg-white/90 text-purple-900 hover:bg-white"
                asChild
              >
                <Link href="/application-process">How to Apply</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top cards row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Globe className="h-6 w-6" /> Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                Studying in Korea requires a valid <b>D-2 Student Visa</b>.
                Prepare the required documents and apply through the Embassy of
                the Republic of Korea in Uzbekistan.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <FileText className="h-6 w-6" /> Visa Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 gap-2 text-gray-700">
                  <li>
                    📘 <b>D-2-2</b> – Bachelor’s degree
                  </li>
                  <li>
                    📗 <b>D-2-3</b> – Master’s degree
                  </li>
                  <li>
                    📕 <b>D-2-4</b> – Doctoral degree
                  </li>
                  <li>
                    📙 <b>D-2-5</b> – Exchange / Research
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Clock className="h-6 w-6" /> Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                ⏳ Average: <b>2–4 weeks</b> (varies by season and
                completeness).
                <br />✅ Apply at least <b>2 months</b> before semester start.
              </CardContent>
            </Card>
          </div>

          {/* Required Documents (accordion) */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <ShieldCheck className="h-6 w-6" /> Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="docs">
                  <AccordionTrigger className="text-base font-semibold">
                    Full checklist
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Visa Application Form (completed & signed)</li>
                      <li>Passport (valid ≥ 6 months) + copy</li>
                      <li>
                        Certificate of Admission (issued by the Korean
                        university)
                      </li>
                      <li>
                        Proof of Financial Ability (bank statements or
                        scholarship certificate)
                      </li>
                      <li>
                        Academic Records (diploma, transcripts, apostilled if
                        required)
                      </li>
                      <li>Recent passport-size photo</li>
                      <li>Visa fee (as per embassy requirements)</li>
                      <li>Additional documents if requested by the embassy</li>
                    </ul>
                    <div className="mt-4 rounded-lg border border-purple-200/70 bg-purple-50 px-4 py-3 text-purple-900">
                      <b>Financial proof tip:</b> Show at least{" "}
                      <b>$10,000 USD</b> (or equivalent) for one year’s study
                      unless you have a full scholarship.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Where to apply + Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <MapPin className="h-6 w-6" /> Where to Apply
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p className="font-medium">
                  Embassy of the Republic of Korea in Uzbekistan
                </p>
                <p>📍 Tashkent, Mirzo Ulugbek district</p>
                <p>🕘 Visa Section: Mon–Fri, 09:00–12:00</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-900"
                  >
                    D-2 Visa
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-900"
                  >
                    Embassy Submission
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-900"
                  >
                    Original Docs
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Lightbulb className="h-6 w-6" /> Useful Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>Double-check all documents before submission.</li>
                  <li>Keep copies of everything you submit.</li>
                  <li>
                    After arrival in Korea, apply for an{" "}
                    <b>Alien Registration Card (ARC)</b> within 90 days.
                  </li>
                </ul>
                <div className="mt-4 flex gap-3">
                  <Button asChild className="bg-purple-900 hover:bg-purple-800">
                    <Link href="/application-process">
                      See Application Steps
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-purple-300 text-purple-900 hover:bg-purple-50"
                  >
                    <Link href="/universities">Find Programs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why our platform */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <School className="h-6 w-6" /> Why Apply Through Our Platform?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-purple-200/70 bg-white p-4">
                  <p className="font-semibold text-purple-900">
                    Direct University Links
                  </p>
                  <p>We connect you with accredited Korean universities.</p>
                </div>
                <div className="rounded-lg border border-purple-200/70 bg-white p-4">
                  <p className="font-semibold text-purple-900">
                    Verified Documents
                  </p>
                  <p>Proper admission docs = smoother visa processing.</p>
                </div>
                <div className="rounded-lg border border-purple-200/70 bg-white p-4">
                  <p className="font-semibold text-purple-900">
                    Guidance & Updates
                  </p>
                  <p>We guide each step of your application.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accredited Agencies */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-purple-900">
                Accredited Visa Agencies
              </h2>
              <p className="text-gray-600">
                Students may also submit through officially accredited agencies:
              </p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-purple-50 text-purple-900">
                  <tr>
                    <th className="p-3">Agency</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.map((a) => (
                    <tr key={a.name} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{a.name}</td>
                      <td className="p-3">{a.address}</td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {a.phone.map((p) => (
                            <span
                              key={p}
                              className="inline-flex items-center gap-1"
                            >
                              <Phone className="h-3.5 w-3.5 text-gray-500" />
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <a
                          href={`mailto:${a.email}`}
                          className="inline-flex items-center gap-1 text-purple-900 underline"
                        >
                          <Mail className="h-4 w-4" />
                          {a.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {agencies.map((a) => (
                <Card key={a.name} className="border-0 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-900">{a.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700 space-y-2">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                      <span>{a.address}</span>
                    </p>
                    <div className="space-y-1">
                      {a.phone.map((p) => (
                        <p key={p} className="flex items-start gap-2">
                          <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
                          <span>{p}</span>
                        </p>
                      ))}
                    </div>
                    <p className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
                      <a
                        href={`mailto:${a.email}`}
                        className="text-purple-900 underline"
                      >
                        {a.email}
                      </a>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA strip */}
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 text-center md:flex-row md:text-left">
              <div>
                <p className="text-lg font-semibold text-purple-900">
                  Ready to start your application?
                </p>
                <p className="text-gray-700">
                  Search programs and follow our step-by-step process tailored
                  for Uzbek students.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-purple-900 hover:bg-purple-800">
                  <Link href="/universities">Find Programs</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-purple-300 text-purple-900 hover:bg-purple-50"
                >
                  <Link href="/application-process">Application Guide</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
