import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  Bus,
  Utensils,
  HeartPulse,
  ShoppingBag,
  Users,
  GraduationCap as GraduationCap,
  Wallet,
  Wifi,
  Globe,
  Sparkles,
  ShieldCheck,
  Languages,
  Phone,
  MapPin,
  HeartHandshake,
  BookOpen,
  Timer,
  ThumbsUp,
  Briefcase,
  CalendarDays,
  Landmark,
  Radio,
} from "lucide-react";
import { TashkentSeoulClock } from "@/components/home/tashkent-seoul-clock";

// ===================
// Page Metadata (SEO)
// ===================
export const metadata: Metadata = {
  title: "Living in Korea · Life Guide for Uzbek Students | GradAbroad",
  description:
    "Your friendly guide to student life in Korea: housing, transport, food, healthcare, banking, SIM, apps, part-time work, culture, and weekend ideas — all tailored for Uzbek students.",
  openGraph: {
    title: "Living in Korea · Life Guide for Uzbek Students | GradAbroad",
    description:
      "Everything you need to thrive in Korea — practical tips, budgets, culture, and step-by-step setup. Built for Uzbek students.",
    url: "https://gradabroad.net/living-in-korea",
    siteName: "GradAbroad",
    images: [
      {
        url: "/images/seoul-night.jpg",
        width: 1200,
        height: 630,
        alt: "Seoul skyline at night",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Living in Korea · Life Guide for Uzbek Students | GradAbroad",
    description:
      "Housing, transport, food, healthcare, banking, SIM, apps, part-time work, culture, and more — tailored for Uzbek students.",
    images: ["/images/seoul-night.jpg"],
  },
};

// ==============
// Helper Blocks
// ==============
const quickFacts = [
  { label: "Safe & Modern", icon: ShieldCheck },
  { label: "World-class Transit", icon: Bus },
  { label: "Student Discounts", icon: Wallet },
  { label: "Fast Internet", icon: Wifi },
  { label: "Cultural Festivals", icon: Sparkles },
  { label: "Global Campus Life", icon: Users },
];

const livingCards = [
  {
    title: "Accommodation",
    icon: Home,
    desc: "Most freshmen start in dorms; seniors often move to one-room studios near campus. Expect ~ $250–$600/month depending on city and amenities.",
  },
  {
    title: "Transportation",
    icon: Bus,
    desc: "Korea’s metro & bus networks are fast, clean, and bilingual. Grab a T-money card for seamless transfers and small shop payments.",
  },
  {
    title: "Food",
    icon: Utensils,
    desc: "Campus cafeterias cost ~$3–$5 per meal. Convenience stores and street food are everywhere. Halal options are growing in Seoul & Busan.",
  },
  {
    title: "Healthcare",
    icon: HeartPulse,
    desc: "Register for National Health Insurance (NHI) after arrival. University hospitals offer top care; insurance covers a large share of costs.",
  },
  {
    title: "Daily Expenses",
    icon: ShoppingBag,
    desc: "Monthly student budgets typically range $400–$700 including food, transit, and essentials. Track spending to unlock more savings.",
  },
  {
    title: "Culture & Community",
    icon: Users,
    desc: "Find Uzbek student groups, language exchanges, and hobby clubs. Join festivals, K-pop/K-drama tours, and local volunteering.",
  },
];

const setupSteps = [
  {
    title: "Day 1–3: SIM & Payments",
    icon: Phone,
    points: [
      "Get a prepaid SIM/eSIM for immediate data & maps.",
      "Top up T-money card (metro/bus, convenience stores).",
    ],
  },
  {
    title: "Day 3–7: Address & Banking",
    icon: Landmark,
    points: [
      "Confirm your dorm/lease details and mailing address.",
      "Open a KRW bank account for tuition/living expenses.",
    ],
  },
  {
    title: "Within 14 Days: ARC",
    icon: Globe,
    points: [
      "Book immigration appointment for Alien Registration Card (ARC).",
      "ARC enables NHI enrollment, long-term phone plans, travel visas.",
    ],
  },
  {
    title: "Week 2–4: Insurance & Campus",
    icon: HeartPulse,
    points: [
      "Enroll in NHI through university guidance.",
      "Explore campus clubs, mentorship, and part-time options.",
    ],
  },
];

const mustHaveApps = [
  {
    title: "Naver/ Kakao Maps",
    icon: MapPin,
    note: "Navigation & transit routes",
  },
  { title: "KakaoTalk", icon: Radio, note: "Messaging & campus groups" },
  { title: "Papago", icon: Languages, note: "Live translation (UZ → EN/KR)" },
  {
    title: "Coupang/Market Kurly",
    icon: ShoppingBag,
    note: "Groceries & essentials",
  },
  { title: "Subway (Seoul/Busan)", icon: Bus, note: "Live metro schedules" },
  { title: "Baedal Minjok/Yogiyo", icon: Utensils, note: "Food delivery" },
];

const costSnapshot = [
  { label: "Dorm Room", value: "$150–$350/mo" },
  { label: "Studio (1-room)", value: "$350–$600/mo" },
  { label: "Cafeteria Meal", value: "$3–$5" },
  { label: "Metro Fare", value: "$1–$1.5" },
  { label: "Monthly Transit", value: "$40–$60" },
  { label: "Mobile Plan", value: "$15–$30/mo" },
];

const faqs = [
  {
    q: "Is part-time work allowed for D-2 students?",
    a: "Yes. After receiving your ARC, apply for part-time permission through your university and local immigration office. Most roles are on-campus or in service sectors. Keep grades strong and hours within legal limits.",
  },
  {
    q: "How do I find halal food?",
    a: "Seoul, Busan, and university districts offer halal spots; many chain restaurants publish ingredients in English. Look for halal marts and mosque districts, and join student groups for recommendations.",
  },
  {
    q: "Do I need Korean language skills?",
    a: "Many programs are in English, but basic Korean boosts daily life, part-time work chances, and friendships. Universities and city centers offer affordable Korean classes.",
  },
  {
    q: "How safe is Korea?",
    a: "Korea is consistently ranked very safe. Use normal city awareness, follow transit etiquette, and save emergency numbers (112 police, 119 fire/medical).",
  },
];

// ======
// Page
// ======
export default function LivingInKoreaPage() {
  return (
    <main className="relative overflow-hidden">
      {/* HERO — mirrors your site’s hero aesthetic */}
      <section className="relative flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[url('/images/seoul-night.jpg')] bg-cover bg-center"
            aria-hidden
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(120deg, rgba(51, 0, 102, 0.65) 0%, rgba(10, 37, 99, 0.55) 100%)",
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

        <div className="relative z-10 w-full px-6 py-20 md:py-28 text-center text-white">
          {/* Clock strip */}
          <div className="mb-6 flex w-full justify-center">
            <TashkentSeoulClock />
          </div>

          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              Life in Korea · Made Easy for Uzbek Students
            </span>
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Live, Learn, and Thrive in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
              South Korea
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-white/90 md:mt-6 md:text-lg">
            Your upbeat, practical guide to housing, transport, food,
            healthcare, and everything campus — with tips to save money and make
            friends fast.
          </p>

          {/* CTAs */}
          <div className="mx-auto mt-8 flex max-w-lg flex-col items-center justify-center gap-3 sm:flex-row md:mt-10">
            <Button
              size="lg"
              className="min-w-[190px] bg-white text-purple-900 hover:bg-white/90"
              asChild
            >
              <Link href="/universities">Explore Universities</Link>
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="min-w-[190px] border-white/60 bg-white/90 text-purple-900 hover:bg-white"
              asChild
            >
              <Link href="/scholarships">Find Scholarships</Link>
            </Button> */}
          </div>

          {/* Quick stats/cards */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:mt-12 md:grid-cols-6">
            {quickFacts.map((q) => (
              <div
                key={q.label}
                className="rounded-lg border border-white/30 bg-white/85 p-3 text-center shadow-md"
              >
                <q.icon className="mx-auto mb-2 h-5 w-5 text-purple-900/90" />
                <p className="text-xs font-medium text-purple-900/80">
                  {q.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Core living categories */}
          <h2 className="text-3xl font-bold text-purple-900 text-center">
            What Life Looks Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {livingCards.map((item) => (
              <Card key={item.title} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <item.icon className="h-6 w-6" /> {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">{item.desc}</CardContent>
              </Card>
            ))}
          </div>

          {/* Cost snapshot */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Wallet className="h-6 w-6" /> Cost of Living Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {costSnapshot.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-lg border border-purple-200/70 bg-white p-4 text-center"
                  >
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {c.label}
                    </p>
                    <p className="text-base font-semibold text-purple-900 mt-1">
                      {c.value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Tip: cooking at home, campus cafeterias, and transit passes make
                student budgets go further.
              </p>
            </CardContent>
          </Card>

          {/* First 14 days setup */}
          <h3 className="text-2xl font-bold text-purple-900">
            First 14 Days — Smooth Setup
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {setupSteps.map((s) => (
              <Card key={s.title} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <s.icon className="h-6 w-6" /> {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Must-have apps */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Wifi className="h-6 w-6" /> Must-Have Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {mustHaveApps.map((a) => (
                  <div
                    key={a.title}
                    className="rounded-lg border border-purple-200/70 bg-white p-4 text-center"
                  >
                    <a.icon className="mx-auto mb-2 h-5 w-5 text-purple-900/90" />
                    <p className="text-sm font-medium text-purple-900">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-600">{a.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Positive advantages & campus life */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Friendly, Safe, and Efficient",
                icon: ThumbsUp,
                text: "Korea’s cities are welcoming and well-organized. Signs are bilingual, campuses have international support centers, and locals appreciate polite effort in Korean.",
              },
              {
                title: "Grow Your Career",
                icon: Briefcase,
                text: "Join research labs, industry fairs, and field trips. Many universities host career days with global companies and alumni mentorship.",
              },
              {
                title: "Endless Things To Do",
                icon: CalendarDays,
                text: "From cherry blossoms to lantern festivals, there’s always something happening. Hike, explore palaces, or surf in Busan on weekends.",
              },
            ].map((b) => (
              <Card key={b.title} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <b.icon className="h-6 w-6" /> {b.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">{b.text}</CardContent>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <BookOpen className="h-6 w-6" /> FAQs for Uzbek Students
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-lg border border-purple-200/70 bg-white p-4"
                >
                  <p className="font-semibold text-purple-900">{f.q}</p>
                  <p className="text-gray-700 mt-1">{f.a}</p>
                </div>
              ))}
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-900"
                >
                  Part-Time Rules
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-900"
                >
                  Halal Options
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-900"
                >
                  ARC & Insurance
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* CTA band */}
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 text-center md:flex-row md:text-left">
              <div>
                <p className="text-lg font-semibold text-purple-900">
                  Ready to make Korea your second home?
                </p>
                <p className="text-gray-700">
                  Compare programs, secure scholarships, and follow our
                  step-by-step application guide.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-purple-900 hover:bg-purple-800">
                  <Link href="/universities">Explore Universities</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-purple-300 text-purple-900 hover:bg-purple-50"
                >
                  <Link href="/application-process">Application Guide</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-purple-300 text-purple-900 hover:bg-purple-50"
                >
                  <Link href="/visa-requirements">Visa Requirements</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
