"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, DollarSign, Clock, GraduationCap } from "lucide-react"

// Mock data - in a real app, this would come from an API
const programs = [
  {
    id: "cs-bachelor",
    name: "Bachelor of Computer Science",
    category: "Computer Science",
    degree: "Bachelor",
    duration: "4 years",
    language: "English",
    tuition: "$3,500 per year",
    applicationDeadline: "April 30, 2024",
    description:
      "This program provides a comprehensive foundation in computer science, covering programming, algorithms, data structures, software engineering, and more.",
  },
  {
    id: "data-science-master",
    name: "Master of Science in Data Science",
    category: "Computer Science",
    degree: "Master",
    duration: "2 years",
    language: "English",
    tuition: "$4,500 per year",
    applicationDeadline: "May 15, 2024",
    description:
      "This program focuses on advanced data analysis, machine learning, statistical methods, and big data technologies for solving complex problems.",
  },
  {
    id: "business-admin",
    name: "Bachelor of Business Administration",
    category: "Business",
    degree: "Bachelor",
    duration: "4 years",
    language: "English",
    tuition: "$3,200 per year",
    applicationDeadline: "April 30, 2024",
    description:
      "This program covers key business disciplines including management, marketing, finance, accounting, and entrepreneurship.",
  },
  {
    id: "mba",
    name: "Master of Business Administration",
    category: "Business",
    degree: "Master",
    duration: "1.5 years",
    language: "English",
    tuition: "$5,000 per year",
    applicationDeadline: "May 15, 2024",
    description:
      "This MBA program develops advanced business skills and knowledge for leadership roles in various industries.",
  },
  {
    id: "civil-engineering",
    name: "Bachelor of Civil Engineering",
    category: "Engineering",
    degree: "Bachelor",
    duration: "4 years",
    language: "English",
    tuition: "$3,800 per year",
    applicationDeadline: "April 30, 2024",
    description:
      "This program focuses on the design, construction, and maintenance of infrastructure projects and systems.",
  },
]

const categories = ["All", "Computer Science", "Business", "Engineering"]
const degrees = ["All", "Bachelor", "Master", "PhD"]

interface UniversityProgramsProps {
  universityId: string
}

export function UniversityPrograms({ universityId }: UniversityProgramsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDegree, setSelectedDegree] = useState("All")

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || program.category === selectedCategory
    const matchesDegree = selectedDegree === "All" || program.degree === selectedDegree
    return matchesSearch && matchesCategory && matchesDegree
  })

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Academic Programs</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Degree" />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <Card key={program.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                            {program.category}
                          </Badge>
                          <Badge variant="outline">{program.degree}</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-purple-900 mb-2">{program.name}</h3>
                        <p className="text-gray-600 mb-4">{program.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">{program.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">{program.language}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">{program.tuition}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">{program.applicationDeadline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Button className="bg-purple-900 hover:bg-purple-800">Apply Now</Button>
                        <Button variant="outline">Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No programs found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
