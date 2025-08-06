"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

import { CATEGORIES, DEGREE_TYPES, provinceCityData } from "@/lib/data"; // assumed utility file

const flattenCities = Object.values(provinceCityData).flat();

export function UniversitySearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("university");
  const [filters, setFilters] = useState({
    university: {
      city: "",
      category: "",
    },
    program: {
      city: "",
      category: "",
      degree: "",
    },
    scholarship: {
      type: "",
      degree: "",
    },
  });

  const handleFilterChange = (tab: string, field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  const handleSearch = (tab: string) => {
    const currentFilters = filters[tab as keyof typeof filters];
    const queryParams = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        queryParams.append(key, value);
      }
    });
    router.push(`/search/${tab}?${queryParams.toString()}`);
  };

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            Find Your Perfect Korean University
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for Korean universities, programs, or scholarships based on
            your preferences
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border shadow-md">
          <CardContent className="p-6">
            <Tabs
              defaultValue="university"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="university">Universities</TabsTrigger>
                <TabsTrigger value="program">Programs</TabsTrigger>
                <TabsTrigger value="scholarship">Scholarships</TabsTrigger>
              </TabsList>

              <TabsContent value="university" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Select
                      value={filters.university.city}
                      onValueChange={(value) =>
                        handleFilterChange("university", "city", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {flattenCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Field of Study
                    </label>
                    <Select
                      value={filters.university.category}
                      onValueChange={(value) =>
                        handleFilterChange("university", "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field of study" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-900 hover:bg-purple-800 mt-4"
                  onClick={() => handleSearch("university")}
                >
                  <Search className="mr-2 h-4 w-4" /> Search Universities
                </Button>
              </TabsContent>

              <TabsContent value="program" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Select
                      value={filters.program.city}
                      onValueChange={(value) =>
                        handleFilterChange("program", "city", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {flattenCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Field of Study
                    </label>
                    <Select
                      value={filters.program.category}
                      onValueChange={(value) =>
                        handleFilterChange("program", "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field of study" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Degree</label>
                    <Select
                      value={filters.program.degree}
                      onValueChange={(value) =>
                        handleFilterChange("program", "degree", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Degrees</SelectItem>
                        {DEGREE_TYPES.map((deg) => (
                          <SelectItem key={deg} value={deg}>
                            {deg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-900 hover:bg-purple-800 mt-4"
                  onClick={() => handleSearch("program")}
                >
                  <Search className="mr-2 h-4 w-4" /> Search Programs
                </Button>
              </TabsContent>

              <TabsContent value="scholarship" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Degree</label>
                    <Select
                      value={filters.scholarship.degree}
                      onValueChange={(value) =>
                        handleFilterChange("scholarship", "degree", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Degrees</SelectItem>
                        {DEGREE_TYPES.map((deg) => (
                          <SelectItem key={deg} value={deg}>
                            {deg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={filters.scholarship.type}
                      onValueChange={(value) =>
                        handleFilterChange("scholarship", "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="merit">Merit-based</SelectItem>
                        <SelectItem value="need">Need-based</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-900 hover:bg-purple-800 mt-4"
                  onClick={() => handleSearch("scholarship")}
                >
                  <Search className="mr-2 h-4 w-4" /> Search Scholarships
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
