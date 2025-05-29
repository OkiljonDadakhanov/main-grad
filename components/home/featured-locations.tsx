import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const locations = [
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    description:
      "Discover top universities in Seoul, South Korea's vibrant capital city blending tradition and innovation with world-class education.",
    image: "/placeholder.svg?height=400&width=600",
    universities: 25,
    programs: 350,
  },
  {
    id: "busan",
    name: "Busan",
    country: "South Korea",
    description:
      "Explore educational opportunities in Busan, South Korea's second-largest city with beautiful beaches, mountains, and excellent universities.",
    image: "/placeholder.svg?height=400&width=600",
    universities: 12,
    programs: 180,
  },
]

export function FeaturedLocations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">Featured Locations in Korea</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore top Korean universities in these major cities, offering world-class education and unique cultural
            experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden border-0 shadow-lg">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{location.name}</h3>
                  <p>{location.country}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{location.description}</p>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Universities</p>
                    <p className="text-xl font-bold text-purple-900">{location.universities}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Programs</p>
                    <p className="text-xl font-bold text-purple-900">{location.programs}</p>
                  </div>
                </div>
                <Button className="w-full bg-purple-900 hover:bg-purple-800" asChild>
                  <Link href={`/locations/${location.id}`}>
                    Explore Universities <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
