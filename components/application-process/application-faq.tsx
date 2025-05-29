import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ApplicationFaq() {
  const faqs = [
    {
      question: "How much does it cost to study in Korea?",
      answer:
        "Tuition fees at Korean universities typically range from $2,000 to $10,000 per year, depending on the university and program. Public universities are generally less expensive than private ones. Living expenses in Korea range from $500 to $1,000 per month, depending on the city and lifestyle. Seoul is the most expensive city, while regional cities like Busan or Daejeon are more affordable.",
    },
    {
      question: "Do I need to know Korean to study in Korea?",
      answer:
        "It depends on your program. Many Korean universities offer programs taught entirely in English, especially at the graduate level and in fields like business, engineering, and international studies. For these programs, English proficiency (TOEFL/IELTS) is required instead of Korean. However, for most undergraduate programs and programs taught in Korean, you'll need to demonstrate Korean proficiency through the TOPIK test (usually level 3 or higher).",
    },
    {
      question: "What scholarships are available for Uzbek students?",
      answer:
        "Several scholarship options are available: 1) Korean Government Scholarship Program (KGSP) - Covers tuition, living expenses, and airfare, 2) University scholarships - Many universities offer merit-based scholarships covering 30-100% of tuition, 3) Uzbekistan-Korea cooperation scholarships - Special programs based on bilateral agreements, 4) External scholarships from organizations and foundations. We recommend applying for multiple scholarship opportunities to increase your chances.",
    },
    {
      question: "How long does the visa process take?",
      answer:
        "After receiving your acceptance letter and Certificate of Admission from a Korean university, the visa application process typically takes 2-4 weeks. We recommend applying for your visa at least 6 weeks before your planned departure to allow time for any potential delays. The D-2 student visa is usually valid for 6 months to 2 years, depending on your program length.",
    },
    {
      question: "Can I work while studying in Korea?",
      answer:
        "Yes, international students can work part-time with permission from their university and the immigration office. You can work up to 20 hours per week during semesters and full-time during official breaks. You must have completed at least 6 months of studies before applying for work permission. Common jobs for international students include language teaching, translation, restaurant work, and on-campus positions.",
    },
    {
      question: "What is the acceptance rate for Uzbek students?",
      answer:
        "Acceptance rates vary widely depending on the university and program. Top universities like Seoul National University, Korea University, and Yonsei University have acceptance rates of 10-30% for international students. Mid-tier universities have acceptance rates of 40-70%. Factors affecting acceptance include academic background, language proficiency, and the competitiveness of your chosen program.",
    },
    {
      question: "Do Korean universities accept Uzbek diplomas?",
      answer:
        "Yes, Korean universities accept Uzbek diplomas and academic credentials. However, all documents must be properly authenticated through apostille or consular legalization and translated into Korean or English by a certified translator. Some universities may require additional verification through credential evaluation services.",
    },
    {
      question: "Can I transfer to a Korean university from an Uzbek university?",
      answer:
        "Yes, it's possible to transfer credits from an Uzbek university to a Korean university, typically after completing at least one year of study. The number of transferable credits varies by university and program. You'll need to provide detailed course descriptions and syllabi from your previous studies. Some credits may not transfer, especially for major-specific courses.",
    },
    {
      question: "What are the housing options for international students?",
      answer:
        "Most Korean universities offer on-campus dormitories for international students, which is the most affordable option (approximately $300-600 per semester). Off-campus options include goshiwons (small studio rooms), one-room apartments, and shared housing. Housing in Seoul is more expensive than in other cities. Many universities provide housing assistance services for international students.",
    },
    {
      question: "Is there a Uzbek community in Korean universities?",
      answer:
        "Yes, there is a growing Uzbek student community in Korea. Many universities have Uzbek student associations that organize cultural events, provide mentorship, and help new students adjust to life in Korea. There are approximately 2,500+ Uzbek students currently studying in Korea, with the largest communities at universities in Seoul, Busan, and Daejeon.",
    },
    {
      question: "What happens if my application is rejected?",
      answer:
        "If your application is rejected, you can: 1) Apply to other universities for the same intake period, 2) Improve your profile and reapply for the next intake, 3) Consider language preparation programs that offer conditional admission, 4) Consult with our advisors to identify areas for improvement. Many successful students were not accepted on their first attempt but succeeded after strengthening their applications.",
    },
    {
      question: "How can I prepare for studying in Korea?",
      answer:
        "To prepare for studying in Korea: 1) Learn basic Korean phrases and cultural norms, 2) Research your university and surrounding area, 3) Connect with current Uzbek students at your university, 4) Prepare appropriate clothing for Korean weather (especially winter), 5) Familiarize yourself with Korean banking and transportation systems, 6) Download useful apps like Kakao Maps, Papago translator, and Naver Dictionary, 7) Attend pre-departure orientations offered by our center.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about applying to Korean universities as an Uzbek student.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <p className="text-gray-700 mb-4">Still have questions about the application process?</p>
          <Button asChild className="bg-purple-700 hover:bg-purple-800">
            <Link href="/contact">Contact Our Admissions Advisors</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
