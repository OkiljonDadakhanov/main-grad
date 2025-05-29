import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    number: "2,500+",
    label: "Uzbek Students Placed",
    description: "Successfully admitted to Korean universities",
  },
  {
    number: "50+",
    label: "Partner Universities",
    description: "Top-ranked Korean institutions",
  },
  {
    number: "85%",
    label: "Scholarship Success Rate",
    description: "Students receiving financial aid",
  },
  {
    number: "95%",
    label: "Visa Approval Rate",
    description: "Successful visa applications",
  },
  {
    number: "200+",
    label: "Available Scholarships",
    description: "Funding opportunities for Uzbek students",
  },
  {
    number: "24/7",
    label: "Student Support",
    description: "Round-the-clock assistance",
  },
]

export function AboutStats() {
  return (
    <section className="py-16 bg-purple-900 text-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            These numbers represent real students whose lives have been transformed through Korean education
            opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <div className="text-sm text-purple-100">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
