"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MapPin, Star, GraduationCap, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

interface University {
  id: number
  name: string
  location: string
  country: string
  ranking: string | null
  programs: number
  tuitionRange: string
  image: string | null
  logoUrl: string | null
  description: string
  classification: string
  website: string
  city: string
  isVerified: boolean
}

interface GalleryCategory {
  id: number
  name: string
  images: { id: number; image_url: string }[]
}

interface ApiUniversity {
  id: number
  logo: string | null
  logo_url: string | null
  website: string
  university_name: string
  types_of_schools: string
  classification: string
  address: string
  city: string
  zip_code: string
  is_verified: boolean
  campus_information: {
    ranking_global: string | null
    description: string | null
  } | null
  programmes: any[]
  gallery_categories?: GalleryCategory[]
}

export default function BrowseUniversitiesPage() {
  const { error } = useCustomToast()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [classificationFilter, setClassificationFilter] = useState("all")

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true)
        const response = await authFetch(`${BASE_URL}/api/auth/universities/`)
        if (!response.ok) throw new Error("Failed to fetch universities")

        const data: ApiUniversity[] = await response.json()

        const transformedUniversities: University[] = data.map((uni) => {
          const campusCategory = uni.gallery_categories?.find(
            (cat) => cat.name.toLowerCase() === "campus"
          )
          const campusImage =
            campusCategory?.images?.[0]?.image_url || uni.logo_url || null

          return {
            id: uni.id,
            name: uni.university_name,
            location: uni.city,
            country: "South Korea",
            ranking: uni.campus_information?.ranking_global || null,
            programs: uni.programmes?.length || 0,
            tuitionRange: "$0 - N/A",
            image: campusImage,
            logoUrl: uni.logo_url,
            description:
              uni.campus_information?.description ||
              "Leading educational institution in South Korea.",
            classification: uni.classification,
            website: uni.website,
            city: uni.city,
            isVerified: uni.is_verified,
          }
        })

        setUniversities(transformedUniversities)
      } catch (err) {
        console.error("Error fetching universities:", err)
        error("Failed to load universities. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUniversities()
  }, [])

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = cityFilter === "all" || uni.city === cityFilter
    const matchesClassification =
      classificationFilter === "all" || uni.classification === classificationFilter
    return matchesSearch && matchesCity && matchesClassification
  })

  const uniqueCities = Array.from(new Set(universities.map((u) => u.city))).filter(Boolean)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Browse Universities</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore universities and start your application journey. Your profile information will be used automatically.
          </p>
        </div>
        {/* Skeleton filters */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden dark:bg-gray-900 dark:border-gray-800">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Browse Universities</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore universities and start your application journey. Your profile information will be used automatically.
        </p>
      </div>

      {/* Filters */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search universities"
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger aria-label="Filter by city">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={classificationFilter} onValueChange={setClassificationFilter}>
              <SelectTrigger aria-label="Filter by type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="National">National</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUniversities.map((university) => (
          <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-800">
            <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
              {university.image ? (
                <Image
                  src={university.image}
                  alt={university.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                </div>
              )}
              {university.isVerified && (
                <div className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                  <Star className="h-3 w-3 fill-white" aria-hidden="true" />
                  Verified
                </div>
              )}
              {university.ranking && (
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow dark:text-gray-100">
                  Rank {university.ranking}
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{university.name}</h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
                {university.city}, {university.country}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                  {university.classification}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{university.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Programs</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{university.programs}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Type</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{university.classification}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/student/apply/${university.id}`} className="flex-1">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Apply Now</Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(`https://www.gradabroad.net/universities/${university.id}`, "_blank")
                  }
                >
                  Visit Website
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No universities found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
