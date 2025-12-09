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
  FileText,
} from "lucide-react";
import clsx from "clsx";
import type { AcademicProgram } from "@/types/academic";

interface UniversityProgramsProps {
  programs?: AcademicProgram[];
  onProgramSelect?: (programId: string) => void;
  selectedProgramId?: string;
}

export function UniversityPrograms({ 
  programs = [], 
  onProgramSelect,
  selectedProgramId 
}: UniversityProgramsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDegree, setSelectedDegree] = useState("All");
  const [expandedProgramId, setExpandedProgramId] = useState<number | null>(
    null
  );

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
      ?.toLowerCase()
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
                const isExpanded = expandedProgramId === program.id;
                const englishRequirements =
                  program.requirements?.filter(
                    (r) => r.requirementType === "english"
                  ) || [];
                const documentRequirements =
                  program.requirements?.filter(
                    (r) => r.requirementType === "document"
                  ) || [];

                return (
                  <Card
                    key={program.id}
                    className="overflow-hidden border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                          <div
                            className={clsx(
                              "relative text-gray-700 text-sm whitespace-pre-line leading-7",
                              !isExpanded && "max-h-[240px] overflow-hidden"
                            )}
                          >
                            {program.about_program}
                            {!isExpanded && (
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                            )}
                          </div>
                          {program.about_program?.length > 400 && (
                            <button
                              onClick={() =>
                                setExpandedProgramId((prev) =>
                                  prev === program.id ? null : program.id
                                )
                              }
                              className="text-purple-700 mt-2 text-sm font-medium hover:underline"
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                            </button>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-purple-600 mt-1" />
                              <span className="text-sm">
                                <strong>Application Period:</strong>
                                <br />
                                {program.start_date} – {program.end_date}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <GraduationCap className="h-4 w-4 text-purple-600 mt-1" />
                              <span className="text-sm">
                                <strong>Language Requirements:</strong>
                                <br />
                                {englishRequirements.length > 0 ? (
                                  <ul className="list-disc ml-4">
                                    {englishRequirements.map((e, idx) => (
                                      <li key={idx}>
                                        {e.label}
                                        {e.note ? `: ${e.note}` : ""}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  "N/A"
                                )}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <DollarSign className="h-4 w-4 text-purple-600 mt-1" />
                              <span className="text-sm">
                                <strong>Tuition Fee:</strong>
                                <br />${program.contractPrice}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-purple-600 mt-1" />
                              <span className="text-sm">
                                <strong>Result announcement:</strong>
                                <br />
                                {program.results_announcement_date || "TBA"}
                              </span>
                            </div>
                          </div>

                          {documentRequirements.length > 0 && (
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold text-sm text-purple-900">
                                  Required Documents:
                                </span>
                              </div>
                              <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                                {documentRequirements.map((doc, idx) => (
                                  <li key={idx}>{doc.label}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 min-w-[120px] mt-4 md:mt-0">
                          <Button 
                            className={`bg-purple-900 hover:bg-purple-800 ${
                              selectedProgramId === String(program.id) ? 'ring-2 ring-purple-400' : ''
                            }`}
                            onClick={() => onProgramSelect?.(String(program.id))}
                          >
                            {selectedProgramId === String(program.id) ? 'Selected' : 'Select Program'}
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
