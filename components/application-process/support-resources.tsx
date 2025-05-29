import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquareText, Phone, FileText, Video, Users, BookOpen } from "lucide-react"

export default function SupportResources() {
  const resources = [
    {
      title: "Free Consultation",
      description:
        "Schedule a one-on-one consultation with our education advisors who specialize in Korean university admissions.",
      icon: <MessageSquareText className="h-8 w-8 text-purple-600" />,
      link: "#",
      linkText: "Book Consultation",
    },
    {
      title: "Document Review",
      description:
        "Get expert feedback on your application documents before submission to ensure they meet Korean university standards.",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      link: "#",
      linkText: "Submit Documents",
    },
    {
      title: "Virtual Info Sessions",
      description:
        "Join our weekly webinars about Korean university applications, featuring admissions officers from partner universities.",
      icon: <Video className="h-8 w-8 text-purple-600" />,
      link: "#",
      linkText: "View Schedule",
    },
    {
      title: "Student Community",
      description:
        "Connect with current Uzbek students in Korea and alumni who can share their experiences and advice.",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      link: "#",
      linkText: "Join Community",
    },
    {
      title: "Application Guides",
      description:
        "Access detailed guides for specific universities and programs, including sample documents and templates.",
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      link: "#",
      linkText: "Browse Guides",
    },
    {
      title: "24/7 Helpline",
      description: "Get immediate assistance for urgent application questions through our dedicated helpline.",
      icon: <Phone className="h-8 w-8 text-purple-600" />,
      link: "#",
      linkText: "Get Help",
    },
  ]

  return (
    <section className="py-16 bg-gray-50" id="support-resources">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Resources</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            You don't have to navigate the application process alone. Take advantage of our comprehensive support
            services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="mb-4">{resource.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{resource.title}</h3>
              <p className="text-gray-700 mb-4">{resource.description}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={resource.link}>{resource.linkText}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-purple-700 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Personalized Assistance?</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our team of education consultants specializes in helping Uzbek students navigate the Korean university
            application process.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="tel:+998901234567">
                <Phone className="h-5 w-5 mr-2" />
                +998 90 123 4567
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
