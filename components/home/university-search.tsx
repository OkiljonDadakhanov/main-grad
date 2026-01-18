"use client";

import { useState } from "react";
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
import { useI18n } from "@/lib/i18n";

import { CATEGORIES, DEGREE_TYPES, provinceCityData } from "@/lib/data";

const flattenCities = Object.values(provinceCityData).flat();

export function UniversitySearch() {
  const router = useRouter();
  const { t } = useI18n();
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
        ...prev[tab as keyof typeof prev],
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
    <section className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-4">
            {t("landing.search.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.search.subtitle")}
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border shadow-md dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="p-6">
            <Tabs
              defaultValue="university"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="university">{t("landing.search.tabs.universities")}</TabsTrigger>
                <TabsTrigger value="program">{t("landing.search.tabs.programs")}</TabsTrigger>
                <TabsTrigger value="scholarship">{t("landing.search.tabs.scholarships")}</TabsTrigger>
              </TabsList>

              <TabsContent value="university" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.city")}
                    </label>
                    <Select
                      value={filters.university.city}
                      onValueChange={(value) =>
                        handleFilterChange("university", "city", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectCity")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allCities")}</SelectItem>
                        {flattenCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.fieldOfStudy")}
                    </label>
                    <Select
                      value={filters.university.category}
                      onValueChange={(value) =>
                        handleFilterChange("university", "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectField")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allCategories")}</SelectItem>
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
                  <Search className="mr-2 h-4 w-4" /> {t("landing.search.searchUniversities")}
                </Button>
              </TabsContent>

              <TabsContent value="program" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.city")}
                    </label>
                    <Select
                      value={filters.program.city}
                      onValueChange={(value) =>
                        handleFilterChange("program", "city", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectCity")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allCities")}</SelectItem>
                        {flattenCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.fieldOfStudy")}
                    </label>
                    <Select
                      value={filters.program.category}
                      onValueChange={(value) =>
                        handleFilterChange("program", "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectField")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allCategories")}</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.degree")}
                    </label>
                    <Select
                      value={filters.program.degree}
                      onValueChange={(value) =>
                        handleFilterChange("program", "degree", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectDegree")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allDegrees")}</SelectItem>
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
                  <Search className="mr-2 h-4 w-4" /> {t("landing.search.searchPrograms")}
                </Button>
              </TabsContent>

              <TabsContent value="scholarship" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.degree")}
                    </label>
                    <Select
                      value={filters.scholarship.degree}
                      onValueChange={(value) =>
                        handleFilterChange("scholarship", "degree", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectDegree")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allDegrees")}</SelectItem>
                        {DEGREE_TYPES.map((deg) => (
                          <SelectItem key={deg} value={deg}>
                            {deg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("landing.search.type")}
                    </label>
                    <Select
                      value={filters.scholarship.type}
                      onValueChange={(value) =>
                        handleFilterChange("scholarship", "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("landing.search.selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("landing.search.allTypes")}</SelectItem>
                        <SelectItem value="merit">{t("landing.search.meritBased")}</SelectItem>
                        <SelectItem value="need">{t("landing.search.needBased")}</SelectItem>
                        <SelectItem value="research">{t("landing.search.research")}</SelectItem>
                        <SelectItem value="government">{t("landing.search.government")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-900 hover:bg-purple-800 mt-4"
                  onClick={() => handleSearch("scholarship")}
                >
                  <Search className="mr-2 h-4 w-4" /> {t("landing.search.searchScholarships")}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
