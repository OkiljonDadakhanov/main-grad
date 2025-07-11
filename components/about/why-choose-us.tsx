import { CheckCircle, Clock, Shield, Award, Users, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Proven Track Record",
    description: "Over 2,500 successful placements with a 95% visa approval rate",
  },
  {
    icon: Clock,
    title: "End-to-End Support",
    description: "From university selection to visa approval and arrival in Korea",
  },
  {
    icon: Shield,
    title: "Trusted Partnerships",
    description: "Official partnerships with 50+ top Korean universities",
  },
  {
    icon: Award,
    title: "Scholarship Expertise",
    description: "85% of our students receive scholarships or financial aid",
  },
  {
    icon: Users,
    title: "Alumni Network",
    description: "Connect with successful Uzbek graduates working in Korea",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Multilingual support in Uzbek, Korean, Russian, and English",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Graduate in Korea?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just a platform – we're your dedicated partners in achieving your Korean education dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
