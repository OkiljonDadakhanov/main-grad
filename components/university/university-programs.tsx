"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  DollarSign,
  Clock,
  GraduationCap,
} from "lucide-react";
import clsx from "clsx";
import type { AcademicProgram } from "@/types/academic";

interface UniversityProgramsProps {
  programs?: AcademicProgram[];
}

export function UniversityPrograms({ programs = [] }: UniversityProgramsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDegree, setSelectedDegree] = useState("All");

  const safePrograms = programs.filter((p) => p && p.name);

  const categories = [
    "All",
    ...Array.from(
      new Set(safePrograms.map((p) => p.field_of_study).filter(Boolean))
    ),
  ];
  const degrees = [
    "All",
    ...Array.from(
      new Set(safePrograms.map((p) => p.degreeType).filter(Boolean))
    ),
  ];

  const filteredPrograms = safePrograms.filter((program) => {
    const matchesSearch = program.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || program.field_of_study === selectedCategory;
    const matchesDegree =
      selectedDegree === "All" || program.degreeType === selectedDegree;
    return matchesSearch && matchesCategory && matchesDegree;
  });

  const hasPrograms = safePrograms.length > 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">
            Academic Programs
          </h2>

          {hasPrograms && (
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDegree}
                  onValueChange={setSelectedDegree}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {!hasPrograms ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg font-medium">
                  Programs will be available soon.
                </p>
              </div>
            ) : filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => {
                const [expanded, setExpanded] = useState(false);

                return (
                  <Card
                    key={program.id}
                    className="overflow-hidden border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {program.field_of_study}
                            </Badge>
                            <Badge variant="outline">
                              {program.degreeType}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-purple-900 mb-2">
                            {program.name}
                          </h3>

                          {/* About Program Text */}
                          <div
                            className={clsx(
                              "relative text-gray-700 text-sm whitespace-pre-line leading-7",
                              !expanded && "max-h-[240px] overflow-hidden"
                            )}
                          >
                            {program.about_program}
                            {!expanded && (
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                            )}
                          </div>
                          {program.about_program.length > 400 && (
                            <button
                              onClick={() => setExpanded((prev) => !prev)}
                              className="text-purple-700 mt-2 text-sm font-medium hover:underline"
                            >
                              {expanded ? "Show Less" : "Show More"}
                            </button>
                          )}

                          {/* Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="text-sm">
                                {program.start_date} – {program.end_date}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="text-sm">
                                {program.requirements?.find(
                                  (r) => r.requirementType === "english"
                                )?.label ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="text-sm">
                                ${program.contractPrice}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="text-sm">
                                Results:{" "}
                                {program.results_announcement_date || "TBA"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2 min-w-[120px] mt-4 md:mt-0">
                          <Button className="bg-purple-900 hover:bg-purple-800">
                            Apply Now
                          </Button>
                          <Button variant="outline">Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No programs found matching your filters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
