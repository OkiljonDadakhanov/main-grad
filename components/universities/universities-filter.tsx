"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, MapPin, Building2, Sparkles } from "lucide-react";

interface UniversitiesFilterProps {
  onFilterChange: (filters: {
    city: string;
    type: string;
    programFeatures: string[];
  }) => void;
  selectedCity: string;
  selectedType: string;
}

const CITIES = [
  { value: "seoul", label: "Seoul" },
  { value: "busan", label: "Busan" },
  { value: "incheon", label: "Incheon" },
  { value: "daegu", label: "Daegu" },
  { value: "daejeon", label: "Daejeon" },
  { value: "gwangju", label: "Gwangju" },
  { value: "ulsan", label: "Ulsan" },
  { value: "suwon", label: "Suwon" },
];

const SCHOOL_TYPES = [
  { value: "University", label: "University" },
  { value: "College", label: "College" },
  { value: "Institute", label: "Institute" },
  { value: "Academy", label: "Academy" },
  { value: "Graduate School", label: "Graduate School" },
  { value: "Foreign Branch Campus", label: "Foreign Branch Campus" },
];

const FEATURES = [
  { value: "english", label: "English Programs", description: "Courses taught in English" },
  { value: "scholarship", label: "Scholarships Available", description: "Financial aid options" },
  { value: "dormitory", label: "Dormitory Available", description: "On-campus housing" },
  { value: "exchange", label: "Exchange Programs", description: "International opportunities" },
];

export function UniversitiesFilter({
  onFilterChange,
  selectedCity,
  selectedType,
}: UniversitiesFilterProps) {
  const [programFeatures, setProgramFeatures] = useState<string[]>([]);
  const [localCity, setLocalCity] = useState(selectedCity);
  const [localType, setLocalType] = useState(selectedType);

  // Sync local state with props
  useEffect(() => {
    setLocalCity(selectedCity);
    setLocalType(selectedType);
  }, [selectedCity, selectedType]);

  const handleCityChange = (value: string) => {
    const newCity = value === "all" ? "" : value;
    setLocalCity(newCity);
    onFilterChange({
      city: newCity,
      type: localType,
      programFeatures,
    });
  };

  const handleTypeChange = (value: string) => {
    const newType = value === "all" ? "" : value;
    setLocalType(newType);
    onFilterChange({
      city: localCity,
      type: newType,
      programFeatures,
    });
  };

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = programFeatures.includes(feature)
      ? programFeatures.filter((f) => f !== feature)
      : [...programFeatures, feature];

    setProgramFeatures(updatedFeatures);
    onFilterChange({
      city: localCity,
      type: localType,
      programFeatures: updatedFeatures,
    });
  };

  const clearFilters = () => {
    setProgramFeatures([]);
    setLocalCity("");
    setLocalType("");
    onFilterChange({ city: "", type: "", programFeatures: [] });
  };

  const hasActiveFilters = localCity || localType || programFeatures.length > 0;

  return (
    <Card className="sticky top-4 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
            Filters
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 -mr-2"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-500" />
            City
          </Label>
          <Select
            value={localCity || "all"}
            onValueChange={handleCityChange}
          >
            <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* University Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            Type of School
          </Label>
          <Select
            value={localType || "all"}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {SCHOOL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Program Features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Features
          </Label>
          <div className="space-y-3">
            {FEATURES.map((feature) => (
              <label
                key={feature.value}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <Checkbox
                  id={feature.value}
                  checked={programFeatures.includes(feature.value)}
                  onCheckedChange={() => handleFeatureToggle(feature.value)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {feature.label}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Active Filters Count */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {[
                localCity && "1 city",
                localType && "1 type",
                programFeatures.length > 0 && `${programFeatures.length} feature${programFeatures.length > 1 ? "s" : ""}`,
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
