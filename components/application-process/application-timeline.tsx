import { CalendarDays } from "lucide-react"

export default function ApplicationTimeline() {
  const springTimeline = [
    { month: "July-August", activity: "Research universities and programs" },
    { month: "September", activity: "Prepare and take language proficiency tests" },
    { month: "October", activity: "Gather and prepare application documents" },
    { month: "November", activity: "Submit applications (deadlines vary by university)" },
    { month: "December", activity: "Receive admission results" },
    { month: "January", activity: "Apply for visa and scholarships" },
    { month: "February", activity: "Prepare for departure and secure housing" },
    { month: "March", activity: "Arrive in Korea and begin studies" },
  ]

  const fallTimeline = [
    { month: "January-February", activity: "Research universities and programs" },
    { month: "March", activity: "Prepare and take language proficiency tests" },
    { month: "April", activity: "Gather and prepare application documents" },
    { month: "May", activity: "Submit applications (deadlines vary by university)" },
    { month: "June", activity: "Receive admission results" },
    { month: "July", activity: "Apply for visa and scholarships" },
    { month: "August", activity: "Prepare for departure and secure housing" },
    { month: "September", activity: "Arrive in Korea and begin studies" },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Timeline</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Korean universities typically have two intake periods: Spring (March) and Fall (September). Plan your
            application according to these timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spring Semester Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <div className="flex items-center">
                <CalendarDays className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">Spring Semester (March) Timeline</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {springTimeline.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="w-1/3 font-medium text-purple-900">{item.month}</div>
                    <div className="w-2/3 text-gray-700">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fall Semester Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <div className="flex items-center">
                <CalendarDays className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">Fall Semester (September) Timeline</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {fallTimeline.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="w-1/3 font-medium text-purple-900">{item.month}</div>
                    <div className="w-2/3 text-gray-700">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p className="font-medium">Important Note:</p>
          <p>
            Application deadlines vary by university. Always check the specific deadlines for your chosen universities
            and prepare to submit your applications at least 1-2 weeks before the deadline to allow time for any
            unexpected issues.
          </p>
        </div>
      </div>
    </section>
  )
}
