"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, GraduationCap, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { BASE_URL } from "@/lib/auth";
import { ResultCard } from "@/components/search/result-card";
import type { University, ProgrammeWithUniversity } from "@/types/university";

const PAGE_SIZE = 6;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [universityLimit, setUniversityLimit] = useState(PAGE_SIZE);
  const [programLimit, setProgramLimit] = useState(PAGE_SIZE);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/universities/`, { signal });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data: University[] = await res.json();
      setAllUniversities(Array.isArray(data) ? data : []);
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      console.error("Search fetch error:", err);
      setError("We couldn't load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const filteredUniversities = useMemo(() => {
    if (!query.trim()) return allUniversities;
    const q = query.toLowerCase();
    return allUniversities.filter(
      (uni) =>
        uni.university_name?.toLowerCase().includes(q) ||
        uni.city?.toLowerCase().includes(q) ||
        uni.types_of_schools?.toLowerCase().includes(q) ||
        uni.classification?.toLowerCase().includes(q),
    );
  }, [allUniversities, query]);

  const filteredPrograms = useMemo<ProgrammeWithUniversity[]>(() => {
    const programs: ProgrammeWithUniversity[] = [];
    const uniSource = query.trim() ? filteredUniversities : allUniversities;
    const q = query.trim().toLowerCase();

    uniSource.forEach((uni) => {
      uni.programmes?.forEach((prog) => {
        const programName = (prog.programme_name ?? prog.name ?? "").toLowerCase();
        const matches =
          !q ||
          programName.includes(q) ||
          prog.category?.toLowerCase().includes(q) ||
          prog.degree_type?.toLowerCase().includes(q) ||
          uni.university_name?.toLowerCase().includes(q);

        if (matches) {
          programs.push({
            ...prog,
            university_id: uni.id,
            university_name: uni.university_name,
          });
        }
      });
    });
    return programs;
  }, [allUniversities, filteredUniversities, query]);

  // Reset visible counts when the query changes.
  useEffect(() => {
    setUniversityLimit(PAGE_SIZE);
    setProgramLimit(PAGE_SIZE);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
  };

  const totalResults = filteredUniversities.length + filteredPrograms.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-purple-900 dark:bg-purple-950 py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            Search Results
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search universities, programs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-white text-gray-900 border-0 h-12"
            />
            <Button type="submit" className="bg-white text-purple-900 hover:bg-gray-100 h-12 px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Couldn&apos;t load results
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">{error}</p>
            <Button onClick={() => fetchData()}>Try again</Button>
          </div>
        ) : (
          <>
            {query && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Found {totalResults} results for &quot;{query}&quot;
              </p>
            )}

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                <TabsTrigger value="universities">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Universities ({filteredUniversities.length})
                </TabsTrigger>
                <TabsTrigger value="programs">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Programs ({filteredPrograms.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {filteredUniversities.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                      Universities
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredUniversities.slice(0, universityLimit).map((uni) => (
                        <ResultCard key={`uni-${uni.id}`} variant="university" data={uni} />
                      ))}
                    </div>
                    {filteredUniversities.length > universityLimit && (
                      <Button
                        variant="link"
                        onClick={() =>
                          setUniversityLimit((n) =>
                            Math.min(n + PAGE_SIZE, filteredUniversities.length),
                          )
                        }
                        className="mt-2"
                      >
                        Show more universities ({filteredUniversities.length - universityLimit} remaining)
                      </Button>
                    )}
                  </div>
                )}

                {filteredPrograms.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                      Programs
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredPrograms.slice(0, programLimit).map((prog) => (
                        <ResultCard
                          key={programKey(prog)}
                          variant="program"
                          data={prog}
                        />
                      ))}
                    </div>
                    {filteredPrograms.length > programLimit && (
                      <Button
                        variant="link"
                        onClick={() =>
                          setProgramLimit((n) =>
                            Math.min(n + PAGE_SIZE, filteredPrograms.length),
                          )
                        }
                        className="mt-2"
                      >
                        Show more programs ({filteredPrograms.length - programLimit} remaining)
                      </Button>
                    )}
                  </div>
                )}

                {totalResults === 0 && query && (
                  <div className="text-center py-16">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                )}

                {!query && totalResults > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter a search term to filter results
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="universities">
                {filteredUniversities.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUniversities.map((uni) => (
                      <ResultCard key={`uni-${uni.id}`} variant="university" data={uni} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={GraduationCap} message="No universities found" />
                )}
              </TabsContent>

              <TabsContent value="programs">
                {filteredPrograms.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPrograms.map((prog) => (
                      <ResultCard
                        key={programKey(prog)}
                        variant="program"
                        data={prog}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={BookOpen} message="No programs found" />
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

// Stable key: a programme id is unique per university, but the same programme id can recur across
// universities (e.g. an "MBA" with id 1 in different schools), so we compose with university_id.
function programKey(prog: ProgrammeWithUniversity): string {
  return `prog-${prog.university_id ?? "x"}-${prog.id}`;
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-12">
      <Icon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
