import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UniversityOverviewProps {
  university: any // In a real app, you would use a proper type
}

export function UniversityOverview({ university }: UniversityOverviewProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{university.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {university.categories.map((category: string) => (
              <Badge key={category} variant="outline" className="bg-purple-50">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Rankings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Korean Ranking</p>
              <p className="text-2xl font-bold text-purple-900">#{university.rankings.korean}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Global Ranking</p>
              <p className="text-2xl font-bold text-purple-900">{university.rankings.global}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-purple-900">{university.statistics.students.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">International Students</p>
              <p className="text-2xl font-bold text-purple-900">
                {university.statistics.internationalStudents.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Faculty Members</p>
              <p className="text-2xl font-bold text-purple-900">{university.statistics.faculty.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Programs Offered</p>
              <p className="text-2xl font-bold text-purple-900">{university.statistics.programs}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Graduation Rate</p>
              <p className="text-2xl font-bold text-purple-900">{university.statistics.graduationRate}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Employment Rate</p>
              <p className="text-2xl font-bold text-purple-900">{university.statistics.employmentRate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Facilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {university.facilities.map((facility: string) => (
              <div key={facility} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-600 mr-2"></div>
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Uzbek Student Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Uzbek Students</p>
              <p className="text-2xl font-bold text-purple-900">{university.uzbekStudents || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Uzbek Student Association</p>
              <p className="text-lg font-medium text-purple-900">
                {university.uzbekAssociation ? "Available" : "Not Available"}
              </p>
            </div>
          </div>
          {university.uzbekSupport && (
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Special Support for Uzbek Students</p>
              <p className="text-gray-700">{university.uzbekSupport}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
