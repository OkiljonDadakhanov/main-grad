"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UniversitiesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UniversitiesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: UniversitiesPaginationProps) {
  // Don't show pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always include last page if more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => Number(a) - Number(b));

    // Add dots where there are gaps
    let prev = 0;
    for (const page of uniqueRange) {
      if (typeof page === "number") {
        if (page - prev > 1) {
          rangeWithDots.push("...");
        }
        rangeWithDots.push(page);
        prev = page;
      }
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 px-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <Button
            key={`page-${index}`}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
            className={`min-w-[40px] h-10 ${
              page === currentPage
                ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                : typeof page === "number"
                ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                : "border-transparent bg-transparent cursor-default hover:bg-transparent"
            }`}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 px-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
