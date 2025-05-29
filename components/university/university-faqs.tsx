import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock data - in a real app, this would come from an API
const faqs = [
  {
    id: "faq-1",
    question: "What are the admission requirements for international students?",
    answer:
      "International students need to submit their academic transcripts, proof of English proficiency (TOEFL or IELTS), a personal statement, and letters of recommendation. Specific requirements may vary by program.",
  },
  {
    id: "faq-2",
    question: "Are there dormitories available for international students?",
    answer:
      "Yes, the university provides dormitory accommodations for international students. Rooms are typically shared, and facilities include common areas, kitchens, and laundry services. Early application is recommended as spaces are limited.",
  },
  {
    id: "faq-3",
    question: "What scholarships are available for international students?",
    answer:
      "We offer various scholarships for international students, including merit-based scholarships, need-based financial aid, and specific scholarships for students from certain countries. Check our scholarships section for more details.",
  },
  {
    id: "faq-4",
    question: "What is the academic calendar?",
    answer:
      "Our academic year consists of two semesters: Fall (September to December) and Spring (February to June). Some programs also offer summer sessions from July to August.",
  },
  {
    id: "faq-5",
    question: "How can I apply for a student visa?",
    answer:
      "After receiving your acceptance letter, you'll need to apply for a student visa at the nearest embassy or consulate. Required documents typically include your acceptance letter, proof of financial support, passport, and visa application forms.",
  },
  {
    id: "faq-6",
    question: "What support services are available for international students?",
    answer:
      "We provide comprehensive support services including orientation programs, academic advising, language support, cultural activities, and counseling services to help international students adjust to their new environment.",
  },
]

interface UniversityFAQsProps {
  universityId: string
}

export function UniversityFAQs({ universityId }: UniversityFAQsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-medium text-purple-900">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
