"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const testimonials = [
  {
    id: 1,
    name: "Aziza Karimova",
    university: "Seoul National University",
    program: "Computer Science",
    image: "/placeholder.svg?height=200&width=200",
    quote:
      "As an Uzbek student, I found the transition to studying in Korea much smoother than expected. The resources and support provided by this platform were invaluable in my journey.",
  },
  {
    id: 2,
    name: "Bobur Alimov",
    university: "Korea University",
    program: "Business Administration",
    image: "/placeholder.svg?height=200&width=200",
    quote:
      "The scholarship information on this platform helped me secure funding for my studies in Korea. I'm now pursuing my dream degree at one of Korea's top universities.",
  },
  {
    id: 3,
    name: "Dilnoza Rakhimova",
    university: "Yonsei University",
    program: "International Relations",
    image: "/placeholder.svg?height=200&width=200",
    quote:
      "From application to arrival, this platform guided me through every step of my journey from Tashkent to Seoul. I highly recommend it to all Uzbek students considering studying in Korea.",
  },
]

export function Testimonials() {
  const { t } = useI18n()
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const activeTestimonial = testimonials[activeIndex]

  return (
    <section className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-4">{t("landing.testimonials.title")}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.testimonials.subtitle")}
          </p>
        </div>

        <Card className="border-0 shadow-lg max-w-4xl mx-auto dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-purple-100 dark:ring-purple-900/30">
                <img
                  src={activeTestimonial.image || "/placeholder.svg"}
                  alt={activeTestimonial.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <div className="mb-4 text-purple-600 dark:text-purple-400">
                  <Quote className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-6">{activeTestimonial.quote}</p>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300">{activeTestimonial.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeTestimonial.program}, {activeTestimonial.university}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              <Button variant="outline" size="icon" onClick={prevTestimonial} className="dark:border-gray-700 dark:hover:bg-gray-800">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              {testimonials.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={`w-8 h-8 p-0 rounded-full transition-colors duration-200 ${
                    index === activeIndex ? "bg-purple-900 text-white dark:bg-purple-600" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button variant="outline" size="icon" onClick={nextTestimonial} className="dark:border-gray-700 dark:hover:bg-gray-800">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
