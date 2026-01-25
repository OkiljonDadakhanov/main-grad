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
  CheckCircle2,
  XCircle,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import type { AcademicProgram } from "@/types/academic";

// Helper function to check application period status
function getApplicationStatus(startDate?: string, endDate?: string): {
  isOpen: boolean;
  status: "open" | "closed" | "upcoming" | "unknown";
  label: string;
} {
  if (!startDate || !endDate) {
    return { isOpen: false, status: "unknown", label: "Dates TBA" };
  }

  const now = new Date();
  // Reset time to start of day for accurate date comparison
  now.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (now < start) {
    return { isOpen: false, status: "upcoming", label: "Opening Soon" };
  } else if (now >= start && now <= end) {
    return { isOpen: true, status: "open", label: "Open Now" };
  } else {
    return { isOpen: false, status: "closed", label: "Closed" };
  }
}

interface UniversityProgramsProps {
  programs?: AcademicProgram[];
  onProgramSelect?: (programId: string) => void;
  selectedProgramId?: string;
  appliedProgramIds?: Set<number>;
}

export function UniversityPrograms({
  programs = [],
  onProgramSelect,
  selectedProgramId,
  appliedProgramIds = new Set()
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
                const isAlreadyApplied = appliedProgramIds.has(program.id);
                const applicationStatus = getApplicationStatus(program.start_date, program.end_date);
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
                    className={clsx(
                      "overflow-hidden border transition-all duration-200",
                      applicationStatus.isOpen
                        ? "hover:shadow-lg hover:border-purple-300"
                        : "hover:shadow-md opacity-90",
                      selectedProgramId === String(program.id) && "ring-2 ring-purple-500 border-purple-500"
                    )}
                  >
                    {/* Status Header Bar */}
                    <div className={clsx(
                      "px-6 py-2 flex items-center justify-between",
                      applicationStatus.status === "open" && "bg-green-50 dark:bg-green-900/20",
                      applicationStatus.status === "closed" && "bg-red-50 dark:bg-red-900/20",
                      applicationStatus.status === "upcoming" && "bg-amber-50 dark:bg-amber-900/20",
                      applicationStatus.status === "unknown" && "bg-gray-50 dark:bg-gray-800/50"
                    )}>
                      <div className="flex items-center gap-2">
                        {applicationStatus.status === "open" && (
                          <CalendarCheck className="w-4 h-4 text-green-600" />
                        )}
                        {applicationStatus.status === "closed" && (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        {applicationStatus.status === "upcoming" && (
                          <Clock className="w-4 h-4 text-amber-600" />
                        )}
                        {applicationStatus.status === "unknown" && (
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={clsx(
                          "text-sm font-semibold",
                          applicationStatus.status === "open" && "text-green-700 dark:text-green-400",
                          applicationStatus.status === "closed" && "text-red-600 dark:text-red-400",
                          applicationStatus.status === "upcoming" && "text-amber-700 dark:text-amber-400",
                          applicationStatus.status === "unknown" && "text-gray-600 dark:text-gray-400"
                        )}>
                          {applicationStatus.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {program.start_date && program.end_date
                          ? `${program.start_date} - ${program.end_date}`
                          : "Dates to be announced"
                        }
                      </span>
                    </div>

                    <CardContent className="p-6">
                      {/* Header Section */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300">
                              {program.field_of_study}
                            </Badge>
                            <Badge variant="outline" className="dark:border-gray-600">
                              {program.degreeType}
                            </Badge>
                            {isAlreadyApplied && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Already Applied
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                            {program.name}
                          </h3>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row lg:flex-col gap-2 min-w-[140px]">
                          {isAlreadyApplied ? (
                            <Button
                              variant="outline"
                              className="border-green-500 text-green-700 cursor-default flex-1 lg:flex-none"
                              disabled
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Applied
                            </Button>
                          ) : applicationStatus.isOpen ? (
                            <Button
                              className={clsx(
                                "bg-purple-900 hover:bg-purple-800 flex-1 lg:flex-none",
                                selectedProgramId === String(program.id) && "ring-2 ring-purple-400"
                              )}
                              onClick={() => onProgramSelect?.(String(program.id))}
                            >
                              {selectedProgramId === String(program.id) ? "Selected" : "Select Program"}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="border-gray-300 text-gray-500 cursor-not-allowed flex-1 lg:flex-none"
                              disabled
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Not Available
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Program Description */}
                      <div className="mb-5">
                        <div
                          className={clsx(
                            "relative text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed",
                            !isExpanded && "max-h-[120px] overflow-hidden"
                          )}
                        >
                          {program.about_program}
                          {!isExpanded && program.about_program && program.about_program.length > 200 && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                          )}
                        </div>
                        {program.about_program && program.about_program.length > 200 && (
                          <button
                            onClick={() =>
                              setExpandedProgramId((prev) =>
                                prev === program.id ? null : program.id
                              )
                            }
                            className="text-purple-700 dark:text-purple-400 mt-2 text-sm font-medium hover:underline"
                          >
                            {isExpanded ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        {/* Tuition Fee */}
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tuition Fee</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              ${program.contractPrice?.toLocaleString() || "TBA"}
                            </p>
                          </div>
                        </div>

                        {/* Result Announcement */}
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Results Date</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              {program.results_announcement_date || "TBA"}
                            </p>
                          </div>
                        </div>

                        {/* Language Requirements */}
                        <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm sm:col-span-2 lg:col-span-1">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Language Requirements</p>
                            {englishRequirements.length > 0 ? (
                              <div className="text-sm text-gray-900 dark:text-gray-100 mt-1 space-y-0.5">
                                {englishRequirements.slice(0, 2).map((e, idx) => (
                                  <p key={idx} className="truncate font-medium">
                                    {e.label}{e.note ? `: ${e.note}` : ""}
                                  </p>
                                ))}
                                {englishRequirements.length > 2 && (
                                  <p className="text-xs text-purple-600 dark:text-purple-400">
                                    +{englishRequirements.length - 2} more
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">N/A</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Required Documents */}
                      {documentRequirements.length > 0 && (
                        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="font-semibold text-sm text-purple-900 dark:text-purple-100">
                              Required Documents ({documentRequirements.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {documentRequirements.map((doc, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal"
                              >
                                {doc.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
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
