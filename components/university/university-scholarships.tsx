"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, DollarSign, Award } from "lucide-react"

// Mock data - in a real app, this would come from an API
const scholarships = [
  {
    id: "merit-scholarship",
    name: "Merit-based Scholarship",
    type: "Merit",
    coverage: "Up to 100% tuition",
    eligibility: "Students with exceptional academic achievements",
    applicationDeadline: "March 15, 2024",
    description:
      "Merit-based scholarships are given on a competition basis for students who get high scores in the entrance examination. This scholarship is given for owing to each academic program for 1 year ONLY (for 1st year) according to a specific scheme.",
  },
  {
    id: "international-scholarship",
    name: "International Student Scholarship",
    type: "International",
    coverage: "50% tuition",
    eligibility: "International students with strong academic background",
    applicationDeadline: "April 1, 2024",
    description:
      "This scholarship is designed to support international students pursuing their education at our university. Recipients are selected based on academic merit, leadership potential, and financial need.",
  },
  {
    id: "research-scholarship",
    name: "Research Scholarship",
    type: "Research",
    coverage: "75% tuition + monthly stipend",
    eligibility: "Master's and PhD students with research potential",
    applicationDeadline: "May 1, 2024",
    description:
      "Available for Master's students who demonstrate exceptional research potential. Covers 75% of tuition fees and includes a monthly stipend for living expenses. Recipients are expected to assist with departmental research projects for 10 hours per week.",
  },
]

interface UniversityScholarshipsProps {
  universityId: string
}

export function UniversityScholarships({ universityId }: UniversityScholarshipsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter scholarships based on search
  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Scholarships</h2>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-6">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-2">
                          {scholarship.type}
                        </Badge>
                        <h3 className="text-xl font-bold text-purple-900 mb-2">{scholarship.name}</h3>
                        <p className="text-gray-600 mb-4">{scholarship.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">
                              <strong>Coverage:</strong> {scholarship.coverage}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">
                              <strong>Eligibility:</strong> {scholarship.eligibility}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">
                              <strong>Deadline:</strong> {scholarship.applicationDeadline}
                            </span>
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
                <p className="text-gray-500">No scholarships found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
