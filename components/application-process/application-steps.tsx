import { CheckCircle } from "lucide-react"

export default function ApplicationSteps() {
  const steps = [
    {
      number: 1,
      title: "Research Korean Universities",
      description:
        "Explore universities based on your academic interests, location preferences, and budget. Consider university rankings, available programs, and scholarship opportunities.",
      tasks: [
        "Browse our university directory",
        "Compare programs and requirements",
        "Check scholarship availability",
        "Consider location and campus facilities",
      ],
    },
    {
      number: 2,
      title: "Prepare for Language Requirements",
      description:
        "Most Korean universities require either TOPIK (Test of Proficiency in Korean) or English proficiency tests like TOEFL/IELTS for international students.",
      tasks: [
        "Determine required language tests",
        "Register for TOPIK or TOEFL/IELTS",
        "Prepare using our language resources",
        "Aim for minimum TOPIK level 3 or IELTS 5.5",
      ],
    },
    {
      number: 3,
      title: "Gather Required Documents",
      description:
        "Collect and prepare all necessary documents, including academic records, language certificates, and identification documents.",
      tasks: [
        "Prepare academic transcripts",
        "Obtain recommendation letters",
        "Prepare personal statement",
        "Get documents translated to Korean/English",
      ],
    },
    {
      number: 4,
      title: "Submit Applications",
      description:
        "Apply to your chosen universities during their application periods, which typically occur twice a year for Spring (March) and Fall (September) semesters.",
      tasks: [
        "Complete online application forms",
        "Pay application fees",
        "Submit all required documents",
        "Follow up to confirm receipt",
      ],
    },
    {
      number: 5,
      title: "Receive Admission Results",
      description:
        "Universities will review your application and notify you of their decision, typically within 4-8 weeks after the application deadline.",
      tasks: [
        "Check email regularly",
        "Respond to any additional requests",
        "Prepare for possible interviews",
        "Receive admission letter",
      ],
    },
    {
      number: 6,
      title: "Apply for Visa",
      description:
        "Once accepted, apply for a D-2 Student Visa at the Korean Embassy or Consulate in Uzbekistan with your Certificate of Admission.",
      tasks: [
        "Prepare visa application documents",
        "Schedule visa interview",
        "Pay visa application fee",
        "Collect your visa",
      ],
    },
    {
      number: 7,
      title: "Prepare for Departure",
      description: "Make necessary arrangements for housing, travel, and finances before departing for Korea.",
      tasks: [
        "Secure housing arrangements",
        "Purchase flight tickets",
        "Prepare sufficient funds",
        "Pack essentials for Korean weather",
      ],
    },
    {
      number: 8,
      title: "Arrive in Korea",
      description:
        "Arrive in Korea before orientation and complete necessary registration procedures at your university and local authorities.",
      tasks: [
        "Attend university orientation",
        "Register at immigration office",
        "Open a Korean bank account",
        "Purchase health insurance",
      ],
    },
  ]

  return (
    <section className="py-16 bg-white" id="application-steps">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">8-Step Application Process</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Follow these steps carefully to ensure a smooth application process to Korean universities.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-purple-100 p-6 md:w-1/4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-700 text-white text-2xl font-bold mb-2">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-purple-900">{step.title}</h3>
                  </div>
                </div>
                <div className="p-6 md:w-3/4">
                  <p className="text-gray-700 mb-4">{step.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.tasks.map((task, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
