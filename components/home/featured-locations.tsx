"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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

// Robust slugger for URLs (Linux/Vercel safe)
function slugCity(input: string) {
  return input
    .normalize("NFKD")               // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")    // remove punctuation
    .replace(/\s+/g, "-")            // spaces -> dash
    .replace(/-+/g, "-");            // collapse dashes
}

// Function to get the correct image filename (preserving original casing)
function getImageFilename(cityName: string) {
  return cityName
    .normalize("NFKD")               // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9\s-]/g, "") // keep original case for letters
    .replace(/\s+/g, "")             // remove spaces (no dashes in filenames)
    .replace(/-+/g, "");             // remove dashes
}

export function FeaturedLocations() {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.gradabroad.net/api/auth/universities/");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        const map = new Map<string, LocationData>();

        data.forEach((uni: University) => {
          const rawCity = (uni.city || "Unknown").trim();
          const cityKey = slugCity(rawCity);         // slug as map key for URLs
          const imageFilename = getImageFilename(rawCity); // preserve casing for image

          if (!map.has(cityKey)) {
            map.set(cityKey, {
              id: cityKey,  // lowercase slug for URLs
              name: rawCity, // pretty label
              country: "South Korea",
              description: `Discover universities in ${rawCity}, a vibrant hub of education in Korea.`,
              image: `/images/cities/${imageFilename}.jpg`, // use original casing for image
              universities: 1,
              programs: uni.programmes?.length || 0,
            });
          } else {
            const existing = map.get(cityKey)!;
            existing.universities += 1;
            existing.programs += uni.programmes?.length || 0;
          }
        });

        setLocations(Array.from(map.values()));
      } catch (e) {
        console.error(e);
        setLocations([]);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            Featured Locations in Korea
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore top Korean universities in these major cities, offering
            world-class education and unique cultural experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden border-0 shadow-lg">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/cities/default.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{location.name}</h3>
                  <p>{location.country}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{location.description}</p>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Universities</p>
                    <p className="text-xl font-bold text-purple-900">
                      {location.universities}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Programs</p>
                    <p className="text-xl font-bold text-purple-900">
                      {location.programs}
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-purple-900 hover:bg-purple-800" asChild>
                  <Link href={`/locations/${location.id}`}>
                    Explore Universities <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}