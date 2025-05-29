import { Target, Heart, Globe, Users } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To make Korean higher education accessible to every ambitious Uzbek student by providing comprehensive guidance and support throughout their academic journey.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "We believe in integrity, excellence, and cultural bridge-building. Every student deserves equal opportunity to pursue their dreams regardless of their background.",
  },
  {
    icon: Globe,
    title: "Our Vision",
    description:
      "To become the premier platform connecting Central Asian students with Korean educational excellence, fostering international understanding and cooperation.",
  },
  {
    icon: Users,
    title: "Our Community",
    description:
      "We've built a supportive community of students, alumni, and education experts who share knowledge and experiences to help each other succeed.",
  },
]

export function OurMission() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are driven by a simple yet powerful mission: to open doors to world-class Korean education for every
            Uzbek student with the ambition to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <value.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
