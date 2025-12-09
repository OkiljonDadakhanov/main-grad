"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { UniversitiesHero } from "@/components/universities/universities-hero";
import { UniversitiesFilter } from "@/components/universities/universities-filter";
import { UniversitiesGrid } from "@/components/universities/universities-grid";
import { UniversitiesPagination } from "@/components/universities/universities-pagination";

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [programFeatures, setProgramFeatures] = useState<string[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all universities
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://api.gradabroad.net/api/auth/universities/"
        );
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
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply filtering logic with debouncing for search
  useEffect(() => {
    // Use requestAnimationFrame to batch updates and prevent blocking
    const timeoutId = setTimeout(() => {
      const filtered = universities.filter((uni) => {
        const matchesCity =
          !selectedCity || uni.city?.toLowerCase() === selectedCity.toLowerCase();
        const matchesType =
          !selectedType ||
          uni.types_of_schools?.toLowerCase() === selectedType.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          uni.university_name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFeatures = programFeatures.every((feature) => {
          if (feature === "english") {
            return uni.programmes?.some((p) =>
              p?.requirements?.some((r) => r?.requirementType === "english")
            );
          }
          if (feature === "scholarship") {
            return uni.scholarships?.length > 0;
          }
          if (feature === "dormitory") {
            return (
              uni.campus_information?.dormitory_available?.toLowerCase() === "yes"
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
    }, searchQuery ? 300 : 0); // Debounce search queries

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
      <div className="min-h-screen bg-gray-50">
        <UniversitiesHero onSearch={handleSearch} />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <UniversitiesFilter
                onFilterChange={handleFilterChange}
                selectedCity={selectedCity}
                selectedType={selectedType}
              />
            </div>

            {/* Universities Grid */}
            <div className="lg:w-3/4">
              <UniversitiesGrid
                universities={filteredUniversities}
                currentPage={currentPage}
              />

              <UniversitiesPagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUniversities.length / 6)}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
