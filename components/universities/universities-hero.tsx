"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, GraduationCap } from "lucide-react"

interface UniversitiesHeroProps {
  onSearch: (query: string) => void
}

export function UniversitiesHero({ onSearch }: UniversitiesHeroProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Korean Universities</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Explore over 50 top Korean universities offering world-class education and opportunities for Uzbek students
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search universities, programs, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-gray-900"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Search
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <GraduationCap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm opacity-90">Universities</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm opacity-90">Major Cities</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <GraduationCap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm opacity-90">Programs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
