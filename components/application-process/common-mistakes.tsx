import { XCircle } from "lucide-react"

export default function CommonMistakes() {
  const mistakes = [
    {
      title: "Missing Application Deadlines",
      description:
        "Many students underestimate how long document preparation takes. Start gathering documents at least 3 months before deadlines.",
      solution:
        "Create a detailed timeline working backward from application deadlines. Set personal deadlines 2 weeks earlier than actual ones.",
    },
    {
      title: "Insufficient Language Preparation",
      description:
        "Applying with language scores below the minimum requirements or rushing language tests right before applications.",
      solution:
        "Begin language preparation at least 6 months before applications. Take practice tests regularly to track your progress.",
    },
    {
      title: "Improper Document Authentication",
      description:
        "Submitting documents without proper translation, notarization, or apostille as required by Korean universities.",
      solution:
        "Verify authentication requirements for each document with your specific university. Budget extra time for this process.",
    },
    {
      title: "Generic Personal Statements",
      description:
        "Writing one generic statement for all universities without addressing specific programs or university strengths.",
      solution:
        "Research each university thoroughly and customize at least 30% of your statement for each application.",
    },
    {
      title: "Underestimating Financial Requirements",
      description:
        "Not preparing sufficient financial documentation or underestimating the funds needed for tuition and living expenses.",
      solution:
        "Prepare financial documents showing at least 20% more than the minimum required amount to provide a safety margin.",
    },
    {
      title: "Applying Only to Top Universities",
      description:
        "Focusing only on the most prestigious universities without considering admission difficulty and program fit.",
      solution:
        "Apply to a mix of universities: 1-2 reach schools, 2-3 target schools, and 1-2 safety schools that still meet your needs.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn from others' experiences and avoid these frequent pitfalls in the Korean university application
            process.
          </p>
        </div>

        <div className="space-y-6">
          {mistakes.map((mistake, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-red-50 p-6 md:w-1/3">
                  <div className="flex items-start">
                    <XCircle className="h-6 w-6 text-red-500 mr-2 flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-semibold text-red-800">{mistake.title}</h3>
                  </div>
                  <p className="mt-3 text-red-700">{mistake.description}</p>
                </div>
                <div className="bg-green-50 p-6 md:w-2/3">
                  <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                  <p className="text-green-700">{mistake.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
