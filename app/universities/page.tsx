"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { UniversitiesHero } from "@/components/universities/universities-hero"
import { UniversitiesFilter } from "@/components/universities/universities-filter"
import { UniversitiesGrid } from "@/components/universities/universities-grid"
import { UniversitiesPagination } from "@/components/universities/universities-pagination"

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRanking, setSelectedRanking] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (filters: {
    city: string
    type: string
    ranking: string
  }) => {
    setSelectedCity(filters.city)
    setSelectedType(filters.type)
    setSelectedRanking(filters.ranking)
    setCurrentPage(1)
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <UniversitiesHero onSearch={handleSearch} />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <UniversitiesFilter
                onFilterChange={handleFilterChange}
                selectedCity={selectedCity}
                selectedType={selectedType}
                selectedRanking={selectedRanking}
              />
            </div>

            {/* Universities Grid */}
            <div className="lg:w-3/4">
              <UniversitiesGrid
                searchQuery={searchQuery}
                selectedCity={selectedCity}
                selectedType={selectedType}
                selectedRanking={selectedRanking}
                currentPage={currentPage}
              />

              <UniversitiesPagination currentPage={currentPage} totalPages={12} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
