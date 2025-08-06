"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin } from "lucide-react";

interface University {
  id: number;
  university_name: string;
  city: string;
  logo_url: string;
  types_of_schools: string;
  classification: string;
  website: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const tab = params?.tab as string;

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilteredData() {
      setLoading(true);
      const query = new URLSearchParams(searchParams.toString());
      try {
        const res = await fetch(
          `https://api.gradabroad.net/api/auth/universities/?${query}`
        );
        const data = await res.json();
        setUniversities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    }

    if (tab === "university") {
      fetchFilteredData();
    }
  }, [searchParams, tab]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading results...</div>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            Search Results for: <span className="capitalize">{tab}</span>
          </h2>
          <p className="text-gray-600">
            Filtered universities based on your search criteria
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.length > 0 ? (
            universities.map((university) => (
              <Card
                key={university.id}
                className="overflow-hidden border hover:shadow-md"
              >
                <img
                  src={university.logo_url}
                  alt={university.university_name}
                  className="w-full h-40 object-contain p-4 bg-gray-50"
                />
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-purple-900">
                    {university.university_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {university.city}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {university.types_of_schools}
                    </Badge>
                    <Badge
                      className="bg-purple-100 text-purple-800"
                      variant="outline"
                    >
                      {university.classification}
                    </Badge>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-purple-900 hover:bg-purple-800"
                  >
                    <a
                      href={`/universities/${university.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Details
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No universities found matching your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
