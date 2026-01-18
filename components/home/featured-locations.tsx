"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, GraduationCap, BookOpen } from "lucide-react";
import { BASE_URL } from "@/lib/auth";

interface University {
  city: string;
  programmes: any[];
}

interface LocationData {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  universities: number;
  programs: number;
}

// URL slug generator
const createSlug = (text: string): string => {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Image filename generator with fallback
const getImagePath = (cityName: string): string => {
  const normalized = cityName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const cityMap: Record<string, string> = {
    "Sejong City": "Sejong",
    "Sejong": "Sejong",
    "Gwangju": "Gwangju",
    "Busan": "Busan",
    "Seoul": "Seoul",
    "Incheon": "Incheon",
    "Daegu": "Daegu",
    "Daejeon": "Daejeon",
    "Ulsan": "Ulsan",
    "Gyeonggi": "Gyeonggi",
    "Gangwon": "Gangwon",
    "Chungcheong": "Chungcheong",
    "Jeolla": "Jeolla",
    "Gyeongsang": "Gyeongsang",
    "Jeju": "Jeju"
  };

  if (cityMap[normalized]) {
    return `/images/cities/${cityMap[normalized]}.jpg`;
  }

  const firstWord = normalized.split(" ")[0];
  const formatted = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  return `/images/cities/${formatted}.jpg`;
};

// Check if image exists
const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export function FeaturedLocations() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageStatuses, setImageStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all universities from backend API
        const response = await fetch(`${BASE_URL}/api/auth/universities/`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const locationMap = new Map<string, LocationData>();

        // Group universities by city
        data.forEach((university: University) => {
          const cityName = (university.city || "Unknown").trim();
          if (cityName === "Unknown") return; // Skip unknown cities
          
          const citySlug = createSlug(cityName);
          const programCount = university.programmes?.length || 0;

          if (locationMap.has(citySlug)) {
            const existing = locationMap.get(citySlug)!;
            existing.universities += 1;
            existing.programs += programCount;
          } else {
            locationMap.set(citySlug, {
              id: citySlug,
              name: cityName,
              country: "South Korea",
              description: `Discover world-class universities and academic programs in ${cityName}, one of Korea's premier educational destinations.`,
              image: getImagePath(cityName),
              universities: 1,
              programs: programCount,
            });
          }
        });

        // Sort locations by number of universities (descending)
        const locationsArray = Array.from(locationMap.values())
          .sort((a, b) => b.universities - a.universities);
        
        // Check image availability for all locations
        const imageChecks = await Promise.all(
          locationsArray.map(async (loc) => {
            const exists = await checkImageExists(loc.image);
            return { id: loc.id, exists };
          })
        );

        const statusMap: Record<string, boolean> = {};
        imageChecks.forEach(check => {
          statusMap[check.id] = check.exists;
        });

        setImageStatuses(statusMap);
        setLocations(locationsArray);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (locations.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Locations Found</h3>
            <p className="text-gray-600">Unable to load location data at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-900 mb-4">
            Study Destinations in South Korea
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore prestigious universities across Korea's vibrant cities, each offering unique academic excellence and cultural experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location) => {
            const imageExists = imageStatuses[location.id];
            const imageSrc = imageExists ? location.image : "/images/cities/default.jpg";

            return (
              <Link key={location.id} href={`/locations/${location.id}`} className="block">
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:border-purple-300 transition-all duration-300 cursor-pointer h-full">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                    {imageExists ? (
                      <img
                        src={imageSrc}
                        alt={`${location.name} cityscape`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200">
                        <MapPin className="h-24 w-24 text-purple-400 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-3xl font-bold mb-1 drop-shadow-lg">
                        {location.name}
                      </h3>
                      <p className="text-sm opacity-90 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.country}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {location.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Universities</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {location.universities}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Programs</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {location.programs}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}