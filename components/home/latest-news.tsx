import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const news = [
  {
    id: 1,
    title: "New Scholarship Program for Uzbek Students Announced by Korean Government",
    excerpt:
      "The Korean government has announced a new scholarship program specifically for Uzbek students, offering 100 fully-funded positions for the upcoming academic year.",
    date: "May 10, 2023",
    image: "/placeholder.svg?height=300&width=500",
    category: "Scholarships",
  },
  {
    id: 2,
    title: "Seoul National University Opens Special Admission Track for Central Asian Students",
    excerpt:
      "Seoul National University has introduced a special admission track for students from Central Asia, including Uzbekistan, making it easier to gain admission to Korea's top university.",
    date: "April 25, 2023",
    image: "/placeholder.svg?height=300&width=500",
    category: "Admissions",
  },
  {
    id: 3,
    title: "Korea-Uzbekistan Education Forum to be Held in Tashkent",
    excerpt:
      "Representatives from top Korean universities will visit Tashkent next month for an education forum, providing Uzbek students with direct access to information about studying in Korea.",
    date: "April 12, 2023",
    image: "/placeholder.svg?height=300&width=500",
    category: "Events",
  },
]

export function LatestNews() {
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-purple-900 mb-2">Latest News</h2>
            <p className="text-gray-600">
              Stay updated with the latest news about studying in Korea for Uzbek students
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex" asChild>
            <Link href="/news">
              View All News <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-900 text-white text-sm font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                <Link
                  href={`/news/${item.id}`}
                  className="text-purple-900 font-medium inline-flex items-center hover:underline"
                >
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/news">View All News</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
