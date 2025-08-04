"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, DollarSign, Award } from "lucide-react";

interface Scholarship {
  id: number;
  programme_id: number;
  programme_name: string;
  name: string;
  coverage: string;
  eligibility_criteria: string;
  application_deadline: string;
  is_active: boolean;
  translations: any[];
}

interface UniversityScholarshipsProps {
  universityId: string | number;
}

export function UniversityScholarships({
  universityId,
}: UniversityScholarshipsProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScholarships() {
      try {
        const res = await fetch(
          `https://api.gradabroad.net/api/auth/universities/${universityId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch university data");
        }

        const data = await res.json();
        setScholarships(data.scholarships || []);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    }

    fetchScholarships();
  }, [universityId]);

  const filteredScholarships = scholarships.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasScholarships = scholarships.length > 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">
            Scholarships
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading scholarships...</p>
          ) : hasScholarships ? (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-6">
                {filteredScholarships.length > 0 ? (
                  filteredScholarships.map((scholarship) => (
                    <Card
                      key={scholarship.id}
                      className="overflow-hidden border hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-2">
                              Program: {scholarship.programme_name}
                            </Badge>
                            <h3 className="text-xl font-bold text-purple-900 mb-2">
                              {scholarship.name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {scholarship.eligibility_criteria}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                                <span className="text-sm">
                                  <strong>Coverage:</strong>{" "}
                                  {scholarship.coverage}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 text-purple-600 mr-2" />
                                <span className="text-sm">
                                  <strong>Eligibility:</strong>{" "}
                                  {scholarship.eligibility_criteria}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                                <span className="text-sm">
                                  <strong>Deadline:</strong>{" "}
                                  {scholarship.application_deadline || "TBA"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[120px]">
                            <Button className="bg-purple-900 hover:bg-purple-800">
                              Apply Now
                            </Button>
                            <Button variant="outline">Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No scholarships found matching your filters.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg font-medium">
                Scholarships will be available soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
