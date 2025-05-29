import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, GraduationCap, Users } from "lucide-react"

const universities = [
  {
    id: "newuu",
    name: "New Uzbekistan University",
    location: "Tashkent, Uzbekistan",
    image: "/placeholder.svg?height=300&width=400",
    programs: 24,
    students: 5000,
    featured: true,
    categories: ["Engineering", "Computer Science", "Business"],
  },
  {
    id: "seoul-national",
    name: "Seoul National University",
    location: "Seoul, South Korea",
    image: "/placeholder.svg?height=300&width=400",
    programs: 68,
    students: 28000,
    featured: true,
    categories: ["Medicine", "Engineering", "Arts"],
  },
  {
    id: "korea-university",
    name: "Korea University",
    location: "Seoul, South Korea",
    image: "/placeholder.svg?height=300&width=400",
    programs: 55,
    students: 25000,
    featured: false,
    categories: ["Business", "Science", "Humanities"],
  },
  {
    id: "tashkent-tech",
    name: "Tashkent Technical University",
    location: "Tashkent, Uzbekistan",
    image: "/placeholder.svg?height=300&width=400",
    programs: 32,
    students: 15000,
    featured: false,
    categories: ["Engineering", "Technology", "Science"],
  },
]

export function FeaturedUniversities() {
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-purple-900 mb-2">Featured Universities</h2>
            <p className="text-gray-600">Discover top universities in Korea and Uzbekistan</p>
          </div>
          <Button variant="outline" className="hidden md:flex" asChild>
            <Link href="/universities">
              View All Universities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {universities.map((university) => (
            <Card key={university.id} className="overflow-hidden border hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={university.image || "/placeholder.svg"}
                  alt={university.name}
                  className="w-full h-full object-cover"
                />
                {university.featured && <Badge className="absolute top-2 right-2 bg-purple-600">Featured</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 text-purple-900">{university.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{university.location}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {university.categories.map((category) => (
                    <Badge key={category} variant="outline" className="bg-purple-50">
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    <span>{university.programs} Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{university.students.toLocaleString()} Students</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-900 hover:bg-purple-800" asChild>
                  <Link href={`/universities/${university.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/universities">
              View All Universities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
