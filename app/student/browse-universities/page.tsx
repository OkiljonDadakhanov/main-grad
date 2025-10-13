"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface University {
  id: string
  name: string
  location: string
  country: string
  ranking: number
  programs: number
  tuitionRange: string
  image: string
  description: string
  acceptanceRate: string
}

const mockUniversities: University[] = [
  {
    id: "seoul-national",
    name: "Seoul National University",
    location: "Seoul",
    country: "South Korea",
    ranking: 36,
    programs: 120,
    tuitionRange: "$5,000 - $8,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Leading research university in South Korea with world-class programs",
    acceptanceRate: "15%",
  },
  {
    id: "kaist",
    name: "KAIST",
    location: "Daejeon",
    country: "South Korea",
    ranking: 42,
    programs: 85,
    tuitionRange: "$4,500 - $7,500",
    image: "/placeholder.svg?height=200&width=400",
    description: "Premier science and technology institution",
    acceptanceRate: "18%",
  },
  {
    id: "yonsei",
    name: "Yonsei University",
    location: "Seoul",
    country: "South Korea",
    ranking: 73,
    programs: 150,
    tuitionRange: "$6,000 - $9,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Prestigious private university with diverse programs",
    acceptanceRate: "20%",
  },
  {
    id: "korea-university",
    name: "Korea University",
    location: "Seoul",
    country: "South Korea",
    ranking: 79,
    programs: 140,
    tuitionRange: "$5,500 - $8,500",
    image: "/placeholder.svg?height=200&width=400",
    description: "Top-tier comprehensive research university",
    acceptanceRate: "22%",
  },
]

export default function BrowseUniversitiesPage() {
  const [universities] = useState<University[]>(mockUniversities)
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = countryFilter === "all" || uni.country === countryFilter
    return matchesSearch && matchesCountry
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Browse Universities</h1>
        <p className="text-sm text-gray-500">
          Explore universities and start your application journey. Your profile information will be used automatically.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="China">China</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUniversities.map((university) => (
          <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image src={university.image || "/placeholder.svg"} alt={university.name} fill className="object-cover" />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                #{university.ranking} QS Ranking
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{university.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {university.location}, {university.country}
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{university.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Programs</p>
                  <p className="text-sm font-semibold">{university.programs}+</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tuition/Year</p>
                  <p className="text-sm font-semibold">{university.tuitionRange}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Acceptance Rate</p>
                  <p className="text-sm font-semibold">{university.acceptanceRate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold">4.5</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/universities/${university.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Link href={`/student/apply/${university.id}`} className="flex-1">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Apply Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No universities found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
