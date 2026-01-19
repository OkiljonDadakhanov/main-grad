"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n"

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
  const { t } = useI18n()

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-2">{t("landing.news.title")}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t("landing.news.subtitle")}
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex dark:border-gray-700 dark:hover:bg-gray-800" asChild>
            <Link href="/news">
              {t("landing.news.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="block group">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-900 dark:bg-purple-700 text-white text-sm font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.date}</div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{item.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="dark:border-gray-700 dark:hover:bg-gray-800" asChild>
            <Link href="/news">{t("landing.news.viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
