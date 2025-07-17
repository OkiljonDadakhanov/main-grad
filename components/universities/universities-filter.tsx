"use client";

import { useState } from "react";
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

interface UniversitiesFilterProps {
  onFilterChange: (filters: {
    city: string;
    type: string;
    programFeatures: string[];
  }) => void;
  selectedCity: string;
  selectedType: string;
}

export function UniversitiesFilter({
  onFilterChange,
  selectedCity,
  selectedType,
}: UniversitiesFilterProps) {
  const [programFeatures, setProgramFeatures] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: string) => {
    const filters = {
      city: key === "city" ? value : selectedCity,
      type: key === "type" ? value : selectedType,
      programFeatures,
    };
    onFilterChange(filters);
  };

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = programFeatures.includes(feature)
      ? programFeatures.filter((f) => f !== feature)
      : [...programFeatures, feature];

    setProgramFeatures(updatedFeatures);

    // Trigger filter update
    onFilterChange({
      city: selectedCity,
      type: selectedType,
      programFeatures: updatedFeatures,
    });
  };

  const clearFilters = () => {
    setProgramFeatures([]);
    onFilterChange({ city: "", type: "", programFeatures: [] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Filters
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">City</Label>
          <Select
            value={selectedCity}
            onValueChange={(value) => handleFilterChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seoul">Seoul</SelectItem>
              <SelectItem value="busan">Busan</SelectItem>
              <SelectItem value="incheon">Incheon</SelectItem>
              <SelectItem value="daegu">Daegu</SelectItem>
              <SelectItem value="daejeon">Daejeon</SelectItem>
              <SelectItem value="gwangju">Gwangju</SelectItem>
              <SelectItem value="ulsan">Ulsan</SelectItem>
              <SelectItem value="suwon">Suwon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* University Type */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Types of Schools
          </Label>
          <Select
            value={selectedType}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__placeholder__" disabled>
                Select Type
              </SelectItem>
              <SelectItem value="University">University</SelectItem>
              <SelectItem value="College">College</SelectItem>
              <SelectItem value="Institute">Institute</SelectItem>
              <SelectItem value="Academy">Academy</SelectItem>
              <SelectItem value="Graduate School">Graduate School</SelectItem>
              <SelectItem value="Foreign Branch Campus">
                Foreign Branch Campus
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Program Features */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Program Features
          </Label>
          <div className="space-y-3">
            {["english", "scholarship", "dormitory", "exchange"].map(
              (feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={programFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm capitalize">
                    {feature === "english"
                      ? "English Programs"
                      : feature === "scholarship"
                      ? "Scholarships Available"
                      : feature === "dormitory"
                      ? "Dormitory Available"
                      : "Exchange Programs"}
                  </Label>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
