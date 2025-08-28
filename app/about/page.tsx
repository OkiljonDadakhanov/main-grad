

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Globe,
  Users,
  Rocket,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Graduate in Korea",
  description:
    "Learn about our mission to connect Uzbek students with top Korean universities and educational opportunities.",
};

export default function AboutUsPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[url('/images/main.jpg')] bg-cover bg-center"
            aria-hidden
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(120deg, rgba(51,0,102,0.65) 0%, rgba(10,37,99,0.55) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.35)" }}
          />
        </div>

        <div className="relative z-10 w-full px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
              Building Bridges Between
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                Uzbekistan and Korea
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-white/90">
              GradAbroad is more than a platform—it’s a movement empowering
              Uzbek youth with knowledge, opportunity, and global vision.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story + Mission */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <GraduationCap className="h-6 w-6" /> Our Story
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4">
                <p>
                  Founded in <b>2023</b>, GradAbroad began with one vision: to
                  simplify the study-abroad process for Uzbek students. Our
                  founders personally faced the challenges of applying
                  overseas—complex procedures, scattered information, and
                  limited support.
                </p>
                <p>
                  Today, GradAbroad is the leading digital gateway for
                  Uzbekistan–Korea education cooperation, officially recognized
                  by the Ministry of Preschool and School Education of
                  Uzbekistan and supported by Korean partners.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Globe className="h-6 w-6" /> Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Provide equal access to authentic information about Korean
                    universities, programs, and scholarships.
                  </li>
                  <li>
                    Simplify applications with OneID integration for speed and
                    transparency.
                  </li>
                  <li>
                    Build a trusted environment for direct student–university
                    interaction.
                  </li>
                  <li>
                    Expand cooperation in education, culture, and youth
                    development.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Innovation & Tech */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-purple-900 text-center mb-12">
            Innovation & Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Rocket,
                title: "Centralized Applications",
                desc: "Apply to multiple universities with a single profile.",
              },
              {
                icon: Users,
                title: "Smart Notifications",
                desc: "SMS & email reminders keep applicants on track.",
              },
              {
                icon: ShieldCheck,
                title: "Data Transparency",
                desc: "Track every stage of the admission process.",
              },
              {
                icon: Star,
                title: "Fraud Prevention",
                desc: "Official registration prevents risks from unverified agents.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-purple-900" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We proudly collaborate with institutions committed to supporting
            Uzbek students.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Korean Education Center in Uzbekistan",
              "Ministry of Preschool and School Education of Uzbekistan",
              "Partner Universities in Korea",
            ].map((partner) => (
              <Card key={partner} className="border-0 shadow-md">
                <CardContent className="p-6 text-purple-900 font-medium">
                  {partner}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
            Why Choose GradAbroad?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Secure & Reliable",
                desc: "Your data is fully protected.",
              },
              {
                title: "Time-Saving",
                desc: "Apply to several universities through one interface.",
              },
              {
                title: "Multi-Language",
                desc: "English and Korean support available.",
              },
              {
                title: "Direct Communication",
                desc: "Get responses directly from universities.",
              },
              {
                title: "Fair & Transparent",
                desc: "No hidden costs, no unreliable intermediaries.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-purple-900 mb-6">
            Looking Ahead
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Education is the foundation of the future. GradAbroad is committed
            to:
          </p>
          <ul className="mt-6 space-y-3 text-gray-700 max-w-2xl mx-auto text-left">
            <li>
              • Creating scholarship funds and exchange programs for Uzbek
              youth.
            </li>
            <li>
              • Introducing AI-powered features for document checking,
              translation, and application matching.
            </li>
            <li>
              • Supporting graduates in career development and alumni networking
              between Uzbekistan and Korea.
            </li>
          </ul>
          <div className="mt-8">
            <button className="px-6 py-3 rounded-lg bg-purple-900 text-white font-semibold hover:bg-purple-800 inline-flex items-center gap-2">
              Join the Movement <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
