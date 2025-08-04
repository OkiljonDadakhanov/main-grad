"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UniversityOverview } from "@/components/university/university-overview";
import { UniversityPrograms } from "@/components/university/university-programs";
import { UniversityScholarships } from "@/components/university/university-scholarships";
import { UniversityGallery } from "@/components/university/university-gallery";
import { UniversityFAQs } from "@/components/university/university-faqs";

export function ClientUniversityPage({
  universityId,
}: {
  universityId: string;
}) {
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // ✅ controlled tab

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await fetch(
          `https://api.gradabroad.net/api/auth/universities/${universityId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch university");
        const data = await res.json();
        setUniversity(data);
        console.log("Fetched university:", data); // ✅ Debug output
      } catch (error) {
        console.error(error);
        setUniversity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [universityId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (!university) {
    return (
      <div className="p-8 text-center text-red-600">University not found</div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-80 bg-purple-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              university.logo_url || "/placeholder.svg"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-end pb-8">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {university.university_name}
            </h1>
            <div className="flex items-center text-gray-200">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{university.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-white border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <UniversityOverview university={university} />
              </TabsContent>
              <TabsContent value="programs">
                <UniversityPrograms programs={university.programmes || []} />
              </TabsContent>
              <TabsContent value="scholarships">
                <UniversityScholarships universityId={university.id} />
              </TabsContent>
              <TabsContent value="gallery">
                <UniversityGallery
                  gallery_categories={university.gallery_categories || []}
                />
              </TabsContent>

              <TabsContent value="faqs">
                <UniversityFAQs universityId={university.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="space-y-6 sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-purple-900">
                    Quick Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Type</p>
                        <p className="text-gray-600">
                          {university.types_of_schools}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Established</p>
                        <p className="text-gray-600">
                          {university.campus_information?.year_established ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Students</p>
                        <p className="text-gray-600">
                          {university.campus_information?.graduates_total ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline break-all"
                        >
                          {university.website?.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-purple-900">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href={`mailto:${university.university_admission_email_address}`}
                          className="text-purple-600 hover:underline break-all"
                        >
                          {university.university_admission_email_address}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href={`tel:${university.university_office_phone}`}
                          className="text-purple-600 hover:underline"
                        >
                          {university.university_office_phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{university.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full bg-purple-900 hover:bg-purple-800"
                size="lg"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
