"use client";

import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { UniversitiesHero } from "@/components/universities/universities-hero";
import { UniversitiesFilter } from "@/components/universities/universities-filter";
import { UniversitiesGrid } from "@/components/universities/universities-grid";
import { UniversitiesPagination } from "@/components/universities/universities-pagination";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/auth";
import { Loader2, AlertCircle } from "lucide-react";
import type { University } from "@/types/university";

// Cards per page in the grid. The list endpoint is unpaginated, so we paginate client-side.
const PAGE_SIZE = 6;

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [programFeatures, setProgramFeatures] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/api/auth/universities/`, { signal });
      if (!res.ok) throw new Error(`Failed to load universities (${res.status})`);
      const data: University[] = await res.json();
      const list = Array.isArray(data) ? data : [];
      setUniversities(list);
      setFilteredUniversities(list);
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      console.error("Error fetching universities:", err);
      setError("We couldn't load universities. Please try again.");
      setUniversities([]);
      setFilteredUniversities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUniversities(controller.signal);
    return () => controller.abort();
  }, [fetchUniversities]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = universities.filter((uni) => {
        const matchesCity =
          !selectedCity ||
          uni.city?.toLowerCase() === selectedCity.toLowerCase();
        const matchesType =
          !selectedType ||
          uni.types_of_schools?.toLowerCase() === selectedType.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          uni.university_name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFeatures = programFeatures.every((feature) => {
          if (feature === "english") {
            return uni.programmes?.some((p) =>
              p?.requirements?.some((r) => r?.requirementType === "english"),
            );
          }
          if (feature === "scholarship") {
            return (uni.scholarships?.length ?? 0) > 0;
          }
          if (feature === "dormitory") {
            return (
              uni.campus_information?.dormitory_available?.toLowerCase() === "yes"
            );
          }
          return true;
        });

        return matchesCity && matchesType && matchesSearch && matchesFeatures;
      });

      setFilteredUniversities(filtered);
      setCurrentPage(1);
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [universities, selectedCity, selectedType, searchQuery, programFeatures]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: {
    city: string;
    type: string;
    programFeatures: string[];
  }) => {
    setSelectedCity(filters.city);
    setSelectedType(filters.type);
    setProgramFeatures(filters.programFeatures);
    setCurrentPage(1);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <UniversitiesHero onSearch={handleSearch} />

        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-72 flex-shrink-0">
              <UniversitiesFilter
                onFilterChange={handleFilterChange}
                selectedCity={selectedCity}
                selectedType={selectedType}
              />
            </div>

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Loading universities...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Couldn&apos;t load universities
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mb-4">
                    {error}
                  </p>
                  <Button onClick={() => fetchUniversities()}>Try again</Button>
                </div>
              ) : (
                <>
                  <UniversitiesGrid
                    universities={filteredUniversities}
                    currentPage={currentPage}
                    pageSize={PAGE_SIZE}
                  />

                  <UniversitiesPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUniversities.length / PAGE_SIZE)}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
