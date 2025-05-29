import Image from "next/image"
import { Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const team = [
  {
    name: "Dr. Aziz Karimov",
    role: "Founder & CEO",
    bio: "Former Korean government scholarship recipient with PhD from Seoul National University. 10+ years experience in international education.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    email: "aziz@studyinkorea.uz",
  },
  {
    name: "Sarah Kim",
    role: "Director of University Relations",
    bio: "Korean education expert with extensive network across Korean universities. Fluent in Korean, English, and Russian.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    email: "sarah@studyinkorea.uz",
  },
  {
    name: "Dilshod Rakhimov",
    role: "Student Success Manager",
    bio: "KAIST graduate who helps students navigate academic and cultural transitions. Specializes in STEM programs.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    email: "dilshod@studyinkorea.uz",
  },
  {
    name: "Minhee Park",
    role: "Scholarship Coordinator",
    bio: "Former Korean government official with deep knowledge of scholarship programs and funding opportunities.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    email: "minhee@studyinkorea.uz",
  },
]

export function OurTeam() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our diverse team combines Korean education expertise with deep understanding of Uzbek student needs and
            aspirations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="p-2">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
