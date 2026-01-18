"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, BookOpen, Award, Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/auth";

interface University {
  id: number;
  university_name: string;
  city: string;
  logo_url: string;
  types_of_schools: string;
  classification: string;
  website: string;
  programmes?: Programme[];
}

interface Programme {
  id: number;
  programme_name: string;
  degree_type: string;
  category: string;
  tuition_fee: string;
  university_name?: string;
}

const TAB_TITLES: Record<string, string> = {
  university: "Universities",
  program: "Programs",
  scholarship: "Scholarships",
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const tab = params?.tab as string;

  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const query = new URLSearchParams(searchParams.toString());

      try {
        const res = await fetch(`${BASE_URL}/api/auth/universities/?${query}`);
        const data = await res.json();
        const universitiesData = Array.isArray(data) ? data : [];
        setUniversities(universitiesData);

        // Extract programs from universities for program tab
        if (tab === "program") {
          const allPrograms: Programme[] = [];
          universitiesData.forEach((uni: University) => {
            if (uni.programmes) {
              uni.programmes.forEach((prog) => {
                allPrograms.push({
                  ...prog,
                  university_name: uni.university_name,
                });
              });
            }
          });
          setPrograms(allPrograms);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setUniversities([]);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams, tab]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-2">
            Search Results: <span className="capitalize">{TAB_TITLES[tab] || tab}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {tab === "university" && "Universities matching your search criteria"}
            {tab === "program" && "Academic programs matching your preferences"}
            {tab === "scholarship" && "Scholarship opportunities for you"}
          </p>
        </div>

        {/* University Results */}
        {tab === "university" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {universities.length > 0 ? (
              universities.map((university) => (
                <Link key={university.id} href={`/universities/${university.id}`}>
                  <Card className="overflow-hidden border dark:border-gray-800 dark:bg-gray-900 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer h-full group">
                    <div className="relative h-40 bg-gray-50 dark:bg-gray-800 p-4">
                      <img
                        src={university.logo_url || "/placeholder.svg"}
                        alt={university.university_name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 line-clamp-2">
                        {university.university_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        {university.city}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {university.types_of_schools && (
                          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                            {university.types_of_schools}
                          </Badge>
                        )}
                        {university.classification && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" variant="outline">
                            {university.classification}
                          </Badge>
                        )}
                      </div>
                      <Button className="w-full bg-purple-900 hover:bg-purple-800 dark:bg-purple-700 dark:hover:bg-purple-600">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No universities found matching your filters.</p>
                <Button variant="outline" className="mt-4 dark:border-gray-700" asChild>
                  <Link href="/universities">Browse All Universities</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Program Results */}
        {tab === "program" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.length > 0 ? (
              programs.map((program, index) => (
                <Card key={`${program.id}-${index}`} className="overflow-hidden border dark:border-gray-800 dark:bg-gray-900 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                      <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 line-clamp-2">
                      {program.programme_name}
                    </h3>
                    {program.university_name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {program.university_name}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {program.degree_type && (
                        <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                          {program.degree_type}
                        </Badge>
                      )}
                      {program.category && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" variant="outline">
                          {program.category}
                        </Badge>
                      )}
                    </div>
                    {program.tuition_fee && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tuition: {program.tuition_fee}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No programs found matching your filters.</p>
                <Button variant="outline" className="mt-4 dark:border-gray-700" asChild>
                  <Link href="/">Adjust Search Filters</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Scholarship Results */}
        {tab === "scholarship" && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Scholarship Search Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              We're working on bringing you the best scholarship opportunities.
            </p>
            <Button variant="outline" className="dark:border-gray-700" asChild>
              <Link href="/universities">Browse Universities Instead</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
