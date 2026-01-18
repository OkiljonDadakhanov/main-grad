"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"

export function PopularPrograms() {
  const popularPrograms = [
    {
      id: 1,
      name: "Computer Science",
      category: "Engineering & Technology",
      universities: 25,
      students: 450,
      duration: "4 years",
      trend: "+15%",
      description: "Learn cutting-edge programming, AI, and software development skills.",
    },
    {
      id: 2,
      name: "Business Administration",
      category: "Business & Economics",
      universities: 30,
      students: 380,
      duration: "4 years",
      trend: "+12%",
      description: "Develop leadership and management skills for global business.",
    },
    {
      id: 3,
      name: "Korean Language & Literature",
      category: "Languages & Literature",
      universities: 20,
      students: 320,
      duration: "4 years",
      trend: "+25%",
      description: "Master Korean language and explore rich Korean culture and literature.",
    },
    {
      id: 4,
      name: "International Relations",
      category: "Social Sciences",
      universities: 18,
      students: 280,
      duration: "4 years",
      trend: "+18%",
      description: "Study global politics, diplomacy, and international cooperation.",
    },
    {
      id: 5,
      name: "Mechanical Engineering",
      category: "Engineering & Technology",
      universities: 22,
      students: 350,
      duration: "4 years",
      trend: "+10%",
      description: "Design and develop mechanical systems and advanced manufacturing.",
    },
    {
      id: 6,
      name: "Medicine",
      category: "Medicine & Health Sciences",
      universities: 12,
      students: 180,
      duration: "6 years",
      trend: "+8%",
      description: "Train to become a medical doctor with world-class education.",
    },
  ]

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Most Popular Programs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          These programs are highly sought after by Uzbek students studying in Korea
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularPrograms.map((program) => (
          <Link key={program.id} href={`/programs/${program.id}`} className="block">
            <Card className="hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {program.trend}
                  </Badge>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {program.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">{program.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {program.students} Uzbek students enrolled
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {program.duration} program
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    Available at {program.universities} universities
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
