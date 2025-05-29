"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Computer,
  Stethoscope,
  Building,
  Palette,
  Calculator,
  Globe,
  Briefcase,
  Atom,
  Languages,
  Wrench,
  Music,
  Leaf,
} from "lucide-react"
import Link from "next/link"

export function CategoriesGrid() {
  const categories = [
    {
      id: "engineering",
      name: "Engineering & Technology",
      nameKorean: "공학 및 기술",
      icon: Computer,
      description: "Computer Science, Electrical Engineering, Mechanical Engineering, and more",
      programs: 85,
      universities: 35,
      color: "bg-blue-500",
    },
    {
      id: "medicine",
      name: "Medicine & Health Sciences",
      nameKorean: "의학 및 보건과학",
      icon: Stethoscope,
      description: "Medicine, Nursing, Pharmacy, Dentistry, and Health Sciences",
      programs: 45,
      universities: 20,
      color: "bg-red-500",
    },
    {
      id: "business",
      name: "Business & Economics",
      nameKorean: "경영 및 경제학",
      icon: Briefcase,
      description: "Business Administration, Economics, Finance, Marketing",
      programs: 65,
      universities: 40,
      color: "bg-green-500",
    },
    {
      id: "arts",
      name: "Arts & Design",
      nameKorean: "예술 및 디자인",
      icon: Palette,
      description: "Fine Arts, Design, Fashion, Animation, Digital Media",
      programs: 40,
      universities: 25,
      color: "bg-purple-500",
    },
    {
      id: "science",
      name: "Natural Sciences",
      nameKorean: "자연과학",
      icon: Atom,
      description: "Physics, Chemistry, Biology, Mathematics, Environmental Science",
      programs: 55,
      universities: 30,
      color: "bg-orange-500",
    },
    {
      id: "social",
      name: "Social Sciences",
      nameKorean: "사회과학",
      icon: Globe,
      description: "Psychology, Sociology, Political Science, International Relations",
      programs: 50,
      universities: 35,
      color: "bg-teal-500",
    },
    {
      id: "language",
      name: "Languages & Literature",
      nameKorean: "언어 및 문학",
      icon: Languages,
      description: "Korean Language, English Literature, Translation Studies",
      programs: 30,
      universities: 25,
      color: "bg-indigo-500",
    },
    {
      id: "architecture",
      name: "Architecture & Construction",
      nameKorean: "건축 및 건설",
      icon: Building,
      description: "Architecture, Urban Planning, Civil Engineering, Interior Design",
      programs: 25,
      universities: 20,
      color: "bg-gray-500",
    },
    {
      id: "agriculture",
      name: "Agriculture & Life Sciences",
      nameKorean: "농업 및 생명과학",
      icon: Leaf,
      description: "Agriculture, Biotechnology, Food Science, Veterinary Medicine",
      programs: 35,
      universities: 15,
      color: "bg-lime-500",
    },
    {
      id: "music",
      name: "Music & Performing Arts",
      nameKorean: "음악 및 공연예술",
      icon: Music,
      description: "Music, Dance, Theater, Film Studies, Broadcasting",
      programs: 20,
      universities: 15,
      color: "bg-pink-500",
    },
    {
      id: "mathematics",
      name: "Mathematics & Statistics",
      nameKorean: "수학 및 통계학",
      icon: Calculator,
      description: "Pure Mathematics, Applied Mathematics, Statistics, Data Science",
      programs: 25,
      universities: 20,
      color: "bg-cyan-500",
    },
    {
      id: "technology",
      name: "Applied Technology",
      nameKorean: "응용기술",
      icon: Wrench,
      description: "Industrial Technology, Manufacturing, Quality Control",
      programs: 30,
      universities: 18,
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Study Fields</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from a wide range of academic disciplines offered by top Korean universities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${category.color} p-3 rounded-lg text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.nameKorean}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{category.description}</p>

                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">{category.programs} Programs</Badge>
                  <Badge variant="outline">{category.universities} Universities</Badge>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/categories/${category.id}`}>Explore Programs</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
