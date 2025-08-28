import { Card, CardContent } from "@/components/ui/card";
import { Search, GraduationCap, FileText, Plane, School } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your University",
    description:
      "Browse through our comprehensive list of Korean universities and find the perfect match for your academic goals.",
  },
  {
    icon: GraduationCap,
    title: "Choose a Program",
    description:
      "Explore various academic programs offered by Korean universities that align with your career aspirations.",
  },
  {
    icon: FileText,
    title: "Prepare Documents",
    description:
      "Get detailed information about required documents and application procedures for Uzbek students.",
  },
  {
    icon: Plane,
    title: "Apply for Visa",
    description:
      "Learn about the Korean student visa process specifically for Uzbek citizens and prepare accordingly.",
  },
  {
    icon: School,
    title: "Begin Your Journey",
    description:
      "Start your academic journey in Korea with comprehensive support and resources for Uzbek students.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your step-by-step guide to studying in Korea as an Uzbek student
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-purple-900" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-4 text-sm font-medium text-purple-900">
                  Step {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
