import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { OurStory } from "@/components/about/our-story"
import { OurMission } from "@/components/about/our-mission"
import { AboutStats } from "@/components/about/about-stats"
import { OurTeam } from "@/components/about/our-team"
import { WhyChooseUs } from "@/components/about/why-choose-us"
import { AboutCTA } from "@/components/about/about-cta"

export const metadata: Metadata = {
  title: "About Us - Graduate in Korea",
  description:
    "Learn about our mission to connect Uzbek students with top Korean universities and educational opportunities.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <OurStory />
      <OurMission />
      <AboutStats />
      <WhyChooseUs />
      <OurTeam />
      <AboutCTA />
    </div>
  )
}
