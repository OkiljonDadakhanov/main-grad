import { LightbulbIcon } from "lucide-react"

export default function ApplicationTips() {
  const tips = [
    {
      title: "Start Early",
      description:
        "Begin your preparation at least 1 year before your intended start date. This gives you ample time to research universities, prepare for language tests, and gather all required documents.",
      icon: "⏱️",
    },
    {
      title: "Focus on Language Preparation",
      description:
        "Korean universities place high importance on language proficiency. Invest time in achieving at least TOPIK level 3 or IELTS 5.5 (depending on your program's language of instruction).",
      icon: "🗣️",
    },
    {
      title: "Apply to Multiple Universities",
      description:
        "Don't put all your eggs in one basket. Apply to 3-5 universities with varying levels of competitiveness to increase your chances of acceptance.",
      icon: "🎯",
    },
    {
      title: "Tailor Your Personal Statement",
      description:
        "Customize your personal statement for each university, highlighting why you're interested in that specific institution and program. Research the university's strengths and values.",
      icon: "📝",
    },
    {
      title: "Secure Strong Recommendations",
      description:
        "Choose recommenders who know you well academically. Provide them with your resume and academic goals to help them write detailed, personalized recommendations.",
      icon: "👨‍🏫",
    },
    {
      title: "Prepare for Interviews",
      description:
        "Some universities conduct interviews as part of the admission process. Practice common interview questions and be prepared to discuss your academic interests and career goals.",
      icon: "🎤",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Expert Application Tips</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Increase your chances of acceptance with these proven strategies from our education consultants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-3xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">{tip.title}</h3>
              <p className="text-gray-700">{tip.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-purple-100 rounded-xl p-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/6 flex justify-center mb-4 md:mb-0">
            <LightbulbIcon className="h-16 w-16 text-purple-600" />
          </div>
          <div className="md:w-5/6">
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Pro Tip: Korean Language Skills</h3>
            <p className="text-purple-800">
              Even if your program is taught in English, demonstrating basic Korean language skills can significantly
              strengthen your application. It shows your commitment to adapting to Korean culture and succeeding in your
              studies. Consider taking at least basic Korean language courses before applying.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
