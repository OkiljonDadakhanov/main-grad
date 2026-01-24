"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { UniversitiesHero } from "@/components/universities/universities-hero";
import { UniversitiesFilter } from "@/components/universities/universities-filter";
import { UniversitiesGrid } from "@/components/universities/universities-grid";
import { UniversitiesPagination } from "@/components/universities/universities-pagination";
import { BASE_URL } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [programFeatures, setProgramFeatures] = useState<string[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch all universities
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/auth/universities/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setUniversities(data);
          setFilteredUniversities(data);
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
        if (!cancelled) {
          setUniversities([]);
          setFilteredUniversities([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply filtering logic with debouncing for search
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
            return uni.programmes?.some((p: any) =>
              p?.requirements?.some((r: any) => r?.requirementType === "english")
            );
          }
          if (feature === "scholarship") {
            return uni.scholarships?.length > 0;
          }
          if (feature === "dormitory") {
            return (
              uni.campus_information?.dormitory_available?.toLowerCase() ===
              "yes"
            );
          }
          if (feature === "exchange") {
            return uni.programmes?.length > 1;
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
            {/* Filters Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <UniversitiesFilter
                onFilterChange={handleFilterChange}
                selectedCity={selectedCity}
                selectedType={selectedType}
              />
            </div>

            {/* Universities Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Loading universities...
                  </p>
                </div>
              ) : (
                <>
                  <UniversitiesGrid
                    universities={filteredUniversities}
                    currentPage={currentPage}
                  />

                  <UniversitiesPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUniversities.length / 6)}
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
