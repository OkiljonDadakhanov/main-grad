"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, GraduationCap, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface UniversitiesGridProps {
  searchQuery: string
  selectedCity: string
  selectedType: string
  selectedRanking: string
  currentPage: number
}

export function UniversitiesGrid({
  searchQuery,
  selectedCity,
  selectedType,
  selectedRanking,
  currentPage,
}: UniversitiesGridProps) {
  // Mock data for Korean universities
  const universities = [
    {
      id: 1,
      name: "Seoul National University",
      nameKorean: "서울대학교",
      city: "Seoul",
      type: "National University",
      ranking: "Top 100",
      rating: 4.8,
      students: "28,000",
      programs: "200+",
      image: "/placeholder.svg?height=200&width=300",
      description: "Korea's most prestigious university, offering world-class education and research opportunities.",
      scholarships: true,
      englishPrograms: true,
    },
    {
      id: 2,
      name: "Yonsei University",
      nameKorean: "연세대학교",
      city: "Seoul",
      type: "Private University",
      ranking: "Top 200",
      rating: 4.7,
      students: "38,000",
      programs: "180+",
      image: "/placeholder.svg?height=200&width=300",
      description: "One of Korea's top private universities with strong international programs.",
      scholarships: true,
      englishPrograms: true,
    },
    {
      id: 3,
      name: "Korea University",
      nameKorean: "고려대학교",
      city: "Seoul",
      type: "Private University",
      ranking: "Top 200",
      rating: 4.6,
      students: "35,000",
      programs: "170+",
      image: "/placeholder.svg?height=200&width=300",
      description: "Historic university known for excellence in business and liberal arts.",
      scholarships: true,
      englishPrograms: true,
    },
    {
      id: 4,
      name: "KAIST",
      nameKorean: "한국과학기술원",
      city: "Daejeon",
      type: "Research University",
      ranking: "Top 100",
      rating: 4.9,
      students: "10,000",
      programs: "50+",
      image: "/placeholder.svg?height=200&width=300",
      description: "Leading science and technology university with cutting-edge research.",
      scholarships: true,
      englishPrograms: true,
    },
    {
      id: 5,
      name: "Pusan National University",
      nameKorean: "부산대학교",
      city: "Busan",
      type: "National University",
      ranking: "Top 500",
      rating: 4.4,
      students: "30,000",
      programs: "150+",
      image: "/placeholder.svg?height=200&width=300",
      description: "Major national university in Korea's second-largest city.",
      scholarships: true,
      englishPrograms: false,
    },
    {
      id: 6,
      name: "Hanyang University",
      nameKorean: "한양대학교",
      city: "Seoul",
      type: "Private University",
      ranking: "Top 200",
      rating: 4.5,
      students: "25,000",
      programs: "120+",
      image: "/placeholder.svg?height=200&width=300",
      description: "Renowned for engineering and technology programs.",
      scholarships: true,
      englishPrograms: true,
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{universities.length} Universities Found</h2>
        <div className="text-sm text-gray-600">Page {currentPage} of 12</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {universities.map((university) => (
          <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={university.image || "/placeholder.svg"} alt={university.name} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90">
                  {university.ranking}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{university.name}</h3>
                  <p className="text-gray-600 text-sm">{university.nameKorean}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{university.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {university.city}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {university.students}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {university.programs}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{university.description}</p>

              <div className="flex gap-2 mb-4">
                <Badge variant="outline">{university.type}</Badge>
                {university.scholarships && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Scholarships
                  </Badge>
                )}
                {university.englishPrograms && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    English Programs
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/universities/${university.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" className="flex-1">
                  Compare
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
