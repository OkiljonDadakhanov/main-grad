"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ContactFAQ() {
  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our emergency line.",
    },
    {
      question: "Can I schedule a consultation?",
      answer:
        "Yes! You can schedule a free consultation with our education counselors. Contact us to book an appointment at either our Tashkent or Seoul office.",
    },
    {
      question: "Do you provide services in Uzbek language?",
      answer: "Our team is fluent in Uzbek, Korean, Russian, and English to better serve our students.",
    },
    {
      question: "What documents should I prepare for consultation?",
      answer:
        "Please bring your academic transcripts, passport, language test scores (if any), and any specific questions about universities or programs you're interested in.",
    },
    {
      question: "Is there a fee for your consultation services?",
      answer:
        "Initial consultations are completely free. We only charge for premium services like application assistance and document preparation.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
