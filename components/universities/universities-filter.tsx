"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface UniversitiesFilterProps {
  onFilterChange: (filters: { city: string; type: string; ranking: string }) => void
  selectedCity: string
  selectedType: string
  selectedRanking: string
}

export function UniversitiesFilter({
  onFilterChange,
  selectedCity,
  selectedType,
  selectedRanking,
}: UniversitiesFilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      city: key === "city" ? value : selectedCity,
      type: key === "type" ? value : selectedType,
      ranking: key === "ranking" ? value : selectedRanking,
    }
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    onFilterChange({ city: "", type: "", ranking: "" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Filters
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">City</Label>
          <Select value={selectedCity} onValueChange={(value) => handleFilterChange("city", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seoul">Seoul</SelectItem>
              <SelectItem value="busan">Busan</SelectItem>
              <SelectItem value="incheon">Incheon</SelectItem>
              <SelectItem value="daegu">Daegu</SelectItem>
              <SelectItem value="daejeon">Daejeon</SelectItem>
              <SelectItem value="gwangju">Gwangju</SelectItem>
              <SelectItem value="ulsan">Ulsan</SelectItem>
              <SelectItem value="suwon">Suwon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* University Type */}
        <div>
          <Label className="text-sm font-medium mb-2 block">University Type</Label>
          <Select value={selectedType} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National University</SelectItem>
              <SelectItem value="private">Private University</SelectItem>
              <SelectItem value="research">Research University</SelectItem>
              <SelectItem value="technical">Technical University</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ranking */}
        <div>
          <Label className="text-sm font-medium mb-2 block">World Ranking</Label>
          <Select value={selectedRanking} onValueChange={(value) => handleFilterChange("ranking", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select ranking" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top100">Top 100</SelectItem>
              <SelectItem value="top200">Top 200</SelectItem>
              <SelectItem value="top500">Top 500</SelectItem>
              <SelectItem value="top1000">Top 1000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Program Features */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Program Features</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="english" />
              <Label htmlFor="english" className="text-sm">
                English Programs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="scholarship" />
              <Label htmlFor="scholarship" className="text-sm">
                Scholarships Available
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dormitory" />
              <Label htmlFor="dormitory" className="text-sm">
                Dormitory Available
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exchange" />
              <Label htmlFor="exchange" className="text-sm">
                Exchange Programs
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
