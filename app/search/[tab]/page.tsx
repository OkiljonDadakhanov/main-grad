"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Award, Loader2, AlertCircle } from "lucide-react";
import { BASE_URL } from "@/lib/auth";
import { ResultCard } from "@/components/search/result-card";
import type {
  University,
  ProgrammeWithUniversity,
  ScholarshipListItem,
} from "@/types/university";

type Tab = "university" | "program" | "scholarship";

const TAB_TITLES: Record<Tab, string> = {
  university: "Universities",
  program: "Programs",
  scholarship: "Scholarships",
};

const TAB_SUBTITLES: Record<Tab, string> = {
  university: "Universities matching your search criteria",
  program: "Academic programs matching your preferences",
  scholarship: "Scholarship opportunities for you",
};

function isTab(value: string | undefined): value is Tab {
  return value === "university" || value === "program" || value === "scholarship";
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const tab = (params?.tab as string) || "";

  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<ProgrammeWithUniversity[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      if (!isTab(tab)) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const query = new URLSearchParams(searchParams.toString());

      try {
        if (tab === "scholarship") {
          const res = await fetch(`${BASE_URL}/api/scholarships/?${query}`, { signal });
          if (!res.ok) throw new Error(`Failed to load scholarships (${res.status})`);
          const data: ScholarshipListItem[] = await res.json();
          setScholarships(Array.isArray(data) ? data : []);
        } else {
          const res = await fetch(`${BASE_URL}/api/auth/universities/?${query}`, {
            signal,
          });
          if (!res.ok) throw new Error(`Failed to load universities (${res.status})`);
          const data: University[] = await res.json();
          const list = Array.isArray(data) ? data : [];
          setUniversities(list);

          if (tab === "program") {
            const allPrograms: ProgrammeWithUniversity[] = [];
            list.forEach((uni) => {
              uni.programmes?.forEach((prog) => {
                allPrograms.push({
                  ...prog,
                  university_id: uni.id,
                  university_name: uni.university_name,
                });
              });
            });
            setPrograms(allPrograms);
          }
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        console.error("Search [tab] fetch error:", err);
        setError("We couldn't load these results. Please try again.");
        setUniversities([]);
        setPrograms([]);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    },
    [tab, searchParams],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!isTab(tab)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Unknown search category
          </h3>
          <Button variant="outline" asChild>
            <Link href="/search">Back to search</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-2">
            Search Results: <span className="capitalize">{TAB_TITLES[tab]}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{TAB_SUBTITLES[tab]}</p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => fetchData()} />
        ) : (
          <ResultGrid tab={tab} universities={universities} programs={programs} scholarships={scholarships} />
        )}
      </div>
    </section>
  );
}

function ResultGrid({
  tab,
  universities,
  programs,
  scholarships,
}: {
  tab: Tab;
  universities: University[];
  programs: ProgrammeWithUniversity[];
  scholarships: ScholarshipListItem[];
}) {
  if (tab === "university") {
    if (universities.length === 0) {
      return (
        <Empty
          icon={GraduationCap}
          message="No universities found matching your filters."
          ctaLabel="Browse All Universities"
          ctaHref="/universities"
        />
      );
    }
    return (
      <Grid>
        {universities.map((uni) => (
          <ResultCard key={`uni-${uni.id}`} variant="university" data={uni} />
        ))}
      </Grid>
    );
  }

  if (tab === "program") {
    if (programs.length === 0) {
      return (
        <Empty
          icon={BookOpen}
          message="No programs found matching your filters."
          ctaLabel="Adjust Search Filters"
          ctaHref="/"
        />
      );
    }
    return (
      <Grid>
        {programs.map((prog) => (
          <ResultCard
            key={`prog-${prog.university_id ?? "x"}-${prog.id}`}
            variant="program"
            data={prog}
          />
        ))}
      </Grid>
    );
  }

  if (scholarships.length === 0) {
    return (
      <Empty
        icon={Award}
        message="No scholarships found matching your filters."
        ctaLabel="Browse Universities"
        ctaHref="/universities"
      />
    );
  }
  return (
    <Grid>
      {scholarships.map((s) => (
        <ResultCard key={`sch-${s.id}`} variant="scholarship" data={s} />
      ))}
    </Grid>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
  );
}

function Empty({
  icon: Icon,
  message,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ElementType;
  message: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
      <Button variant="outline" className="mt-4 dark:border-gray-700" asChild>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Couldn&apos;t load results
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">{message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
