"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, GraduationCap, Star } from "lucide-react";
import Image from "next/image";
import { BASE_URL } from "@/lib/auth";

interface UniversitiesGridProps {
  searchQuery: string;
  selectedCity: string;
  selectedType: string;
  selectedRanking: string; // still unused
  currentPage: number; // still unused
}

export function UniversitiesGrid({
  searchQuery,
  selectedCity,
  selectedType,
  selectedRanking,
  currentPage,
}: UniversitiesGridProps) {
  const router = useRouter();
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCity) params.append("city", selectedCity);
        if (selectedType) params.append("types_of_schools", selectedType);

        const url = `${BASE_URL}/api/auth/universities/${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const res = await fetch(url);
        const data = await res.json();

        // Since API returns an array, use it directly
        setUniversities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load universities:", error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [searchQuery, selectedCity, selectedType]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading universities...
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No universities found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {universities.length} Universities Found
        </h2>
        {/* You may remove currentPage since pagination isn't used */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {universities.map((university) => (
          <Card
            key={university.id}
            className="overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer"
            onClick={() => router.push(`/universities/${university.id}`)}
          >
            <div className="relative h-48">
              <Image
                src={university.logo_url || "/placeholder.svg"}
                alt={university.university_name}
                fill
                className="object-contain p-4"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">
                    {university.university_name}
                  </h3>
                  <p className="text-gray-600 text-sm">{university.city}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {university.city}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {university.campus_information?.graduates_total || "N/A"}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {university.types_of_schools}
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Badge variant="outline">{university.classification}</Badge>
                {university.campus_information?.dormitory_available ===
                  "Yes" && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Dormitory
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              >
                Compare
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
