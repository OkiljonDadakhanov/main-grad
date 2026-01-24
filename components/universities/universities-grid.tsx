"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, GraduationCap, Building2, Globe, BookOpen } from "lucide-react";
import Image from "next/image";

interface University {
  id: number;
  university_name: string;
  city?: string;
  logo_url?: string;
  types_of_schools?: string;
  classification?: string;
  campus_information?: {
    dormitory_available?: string;
    graduates_total?: number | string;
  };
  programmes?: any[];
  scholarships?: any[];
}

interface UniversitiesGridProps {
  universities: University[];
  currentPage: number;
}

const ITEMS_PER_PAGE = 6;

export function UniversitiesGrid({
  universities,
  currentPage,
}: UniversitiesGridProps) {
  const router = useRouter();

  // Calculate paginated universities
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUniversities = universities.slice(startIndex, endIndex);

  if (universities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No universities found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Try adjusting your filters or search terms to find more universities.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {universities.length} {universities.length === 1 ? "University" : "Universities"} Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, universities.length)} of {universities.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedUniversities.map((university) => (
          <Card
            key={university.id}
            className="group overflow-hidden bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/universities/${university.id}`)}
          >
            <div className="relative h-40 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-slate-800/80 to-transparent z-10" />
              <Image
                src={university.logo_url || "/placeholder.svg"}
                alt={university.university_name}
                fill
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-5">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {university.university_name}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-4">
                {university.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span>{university.city}</span>
                  </div>
                )}
                {university.types_of_schools && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <span>{university.types_of_schools}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {university.classification && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                    {university.classification}
                  </Badge>
                )}
                {university.campus_information?.dormitory_available?.toLowerCase() === "yes" && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                    <Building2 className="w-3 h-3 mr-1" />
                    Dormitory
                  </Badge>
                )}
                {university.scholarships && university.scholarships.length > 0 && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0">
                    <Globe className="w-3 h-3 mr-1" />
                    Scholarships
                  </Badge>
                )}
                {university.programmes && university.programmes.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {university.programmes.length} Programs
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                {university.campus_information?.graduates_total && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Users className="h-4 w-4" />
                    <span>{university.campus_information.graduates_total} graduates</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/universities/${university.id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
