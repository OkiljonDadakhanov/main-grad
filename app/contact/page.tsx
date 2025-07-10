"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactMap } from "@/components/contact/contact-map";
import { ContactFAQ } from "@/components/contact/contact-faq";

export default function ContactPage() {
  return (
    <AppLayout>
      <section className="w-full bg-gradient-to-b from-purple-700 to-purple-900 text-white min-h-screen py-24">
        <ContactHero />
      </section>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ContactForm />
            <ContactInfo />
          </div>

          <ContactMap />
          <ContactFAQ />
        </div>
      </div>
    </AppLayout>
  );
}
