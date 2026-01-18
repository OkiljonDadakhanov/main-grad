"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap, BookOpen, Award, MapPin, Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/auth";

interface Programme {
  id: number;
  programme_name: string;
  degree_type: string;
  category: string;
  tuition_fee?: string;
  university_name?: string;
}

interface University {
  id: number;
  university_name: string;
  city: string;
  logo_url?: string;
  types_of_schools?: string;
  classification?: string;
  programmes?: Programme[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);

  // Fetch all universities from backend once
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/universities/`);
      if (res.ok) {
        const data = await res.json();
        setAllUniversities(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter universities based on search query
  const filteredUniversities = useMemo(() => {
    if (!query.trim()) return allUniversities;
    const q = query.toLowerCase();
    return allUniversities.filter(
      (uni) =>
        uni.university_name?.toLowerCase().includes(q) ||
        uni.city?.toLowerCase().includes(q) ||
        uni.types_of_schools?.toLowerCase().includes(q) ||
        uni.classification?.toLowerCase().includes(q)
    );
  }, [allUniversities, query]);

  // Extract and filter programs from universities
  const filteredPrograms = useMemo(() => {
    const allPrograms: Programme[] = [];
    const uniSource = query.trim() ? filteredUniversities : allUniversities;

    uniSource.forEach((uni) => {
      if (uni.programmes) {
        uni.programmes.forEach((prog) => {
          // If there's a query, filter programs too
          if (query.trim()) {
            const q = query.toLowerCase();
            if (
              prog.programme_name?.toLowerCase().includes(q) ||
              prog.category?.toLowerCase().includes(q) ||
              prog.degree_type?.toLowerCase().includes(q) ||
              uni.university_name?.toLowerCase().includes(q)
            ) {
              allPrograms.push({
                ...prog,
                university_name: uni.university_name,
              });
            }
          } else {
            allPrograms.push({
              ...prog,
              university_name: uni.university_name,
            });
          }
        });
      }
    });
    return allPrograms;
  }, [allUniversities, filteredUniversities, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL without reload
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
  };

  const totalResults = filteredUniversities.length + filteredPrograms.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Search Header */}
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

      {/* Results */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
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
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
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
                      {filteredUniversities.slice(0, 6).map((uni) => (
                        <UniversityCard key={uni.id} university={uni} />
                      ))}
                    </div>
                    {filteredUniversities.length > 6 && (
                      <Button variant="link" onClick={() => setActiveTab("universities")} className="mt-2">
                        View all {filteredUniversities.length} universities →
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
                      {filteredPrograms.slice(0, 6).map((prog, index) => (
                        <ProgramCard key={`${prog.id}-${index}`} program={prog} />
                      ))}
                    </div>
                    {filteredPrograms.length > 6 && (
                      <Button variant="link" onClick={() => setActiveTab("programs")} className="mt-2">
                        View all {filteredPrograms.length} programs →
                      </Button>
                    )}
                  </div>
                )}

                {totalResults === 0 && query && (
                  <div className="text-center py-16">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No results found</h3>
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredUniversities.map((uni) => (
                    <UniversityCard key={uni.id} university={uni} />
                  ))}
                </div>
                {filteredUniversities.length === 0 && (
                  <EmptyState icon={GraduationCap} message="No universities found" />
                )}
              </TabsContent>

              <TabsContent value="programs">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPrograms.map((prog, index) => (
                    <ProgramCard key={`${prog.id}-${index}`} program={prog} />
                  ))}
                </div>
                {filteredPrograms.length === 0 && (
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

function UniversityCard({ university }: { university: University }) {
  return (
    <Link href={`/universities/${university.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-900 dark:border-gray-800 group">
        {university.logo_url && (
          <div className="h-32 bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center">
            <img
              src={university.logo_url}
              alt={university.university_name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold line-clamp-2 text-purple-900 dark:text-purple-300">
            {university.university_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {university.city && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {university.city}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {university.types_of_schools && (
              <Badge variant="outline" className="text-xs">
                {university.types_of_schools}
              </Badge>
            )}
            {university.classification && (
              <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20">
                {university.classification}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProgramCard({ program }: { program: Programme }) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
          <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <CardTitle className="text-base font-semibold line-clamp-2">{program.programme_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {program.university_name && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{program.university_name}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {program.degree_type && (
            <Badge variant="outline" className="text-xs">
              {program.degree_type}
            </Badge>
          )}
          {program.category && (
            <Badge className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" variant="outline">
              {program.category}
            </Badge>
          )}
        </div>
        {program.tuition_fee && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tuition: {program.tuition_fee}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-12">
      <Icon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
