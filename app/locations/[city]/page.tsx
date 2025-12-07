// app/locations/[city]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BASE_URL } from "@/lib/auth";

// Allow dynamic rendering in production
export const dynamic = "force-dynamic";

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  // Convert slug back to city name format (e.g., "sejong-city" -> "Sejong City")
  const cityNameFormatted = city
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Use backend API with city filter
  const apiUrl = new URL(`${BASE_URL}/api/auth/universities/`);
  apiUrl.searchParams.append("city", cityNameFormatted);

  const res = await fetch(apiUrl.toString(), {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return notFound();
  }

  const filtered = await res.json();

  if (!Array.isArray(filtered) || filtered.length === 0) {
    return notFound();
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-purple-900 mb-6">
          {cityNameFormatted} Universities
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((uni: any) => (
            <Card key={uni.id} className="border-gray-200 shadow">
              <div className="flex items-center gap-4 p-4 border-b">
                <Image
                  src={uni.logo_url}
                  alt={uni.university_name}
                  width={80}
                  height={80}
                  className="object-contain rounded"
                />
                <div>
                  <h2 className="text-xl font-bold">{uni.university_name}</h2>
                  <p className="text-sm text-gray-500">
                    {uni.classification} · {uni.types_of_schools}
                  </p>
                  <p className="text-sm text-gray-600">{uni.address}</p>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-gray-700">
                  {uni.campus_information?.description?.slice(0, 180)}...
                </p>

                <div className="flex flex-wrap gap-2">
                  {uni.programmes?.slice(0, 3).map((prog: any) => (
                    <Badge
                      key={prog.id}
                      variant="outline"
                      className="bg-purple-50 text-purple-900"
                    >
                      {prog.name}
                    </Badge>
                  ))}
                </div>

                <Link
                  href={`/universities/${uni.id}`}
                  className="text-sm text-purple-800 font-medium underline"
                >
                  View Profile →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
