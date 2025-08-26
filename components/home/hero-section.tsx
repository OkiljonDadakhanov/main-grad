// components/home/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";
import { TashkentSeoulClock } from "./tashkent-seoul-clock";

export function HeroSection() {
  return (
    <section className="relative flex items-center justify-center  overflow-hidden">
      {/* Background: vivid photo with subtle gradient + radial glow (no blur) */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[url('/images/main.jpg')] bg-cover bg-center"
          aria-hidden
        />
        {/* Soft color overlay for readability */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(120deg, rgba(51, 0, 102, 0.65) 0%, rgba(10, 37, 99, 0.55) 100%)",
          }}
        />
        {/* Radial glow to draw focus to center */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 50% at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 70%)",
          }}
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            boxShadow: "inset 0 0 120px rgba(0,0,0,0.35)",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl text-center text-white">
          {/* Clock */}
          <div className="mb-6 flex w-full justify-center">
            <TashkentSeoulClock />
          </div>

          {/* Eyebrow / badge */}
          <div className="mb-4 flex items-center justify-center">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              Study in Korea · Tailored for Uzbekistan
            </span>
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Your Path from Uzbekistan to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
              Top Korean Universities
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-white/90 md:mt-6 md:text-lg">
            Discover universities, programs, and scholarships—curated for Uzbek
            students. Learn exactly how to apply and succeed.
          </p>

          {/* CTA Buttons */}
          <div className="mx-auto mt-8 flex max-w-lg flex-col items-center justify-center gap-3 sm:flex-row md:mt-10">
            <Button
              size="lg"
              className="min-w-[190px] bg-white text-purple-900 hover:bg-white/90"
              asChild
            >
              <Link href="/universities">Explore Universities</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="min-w-[190px] border-white/60 bg-white/90 text-purple-900 hover:bg-white"
              asChild
            >
              <Link href="/application-process">How to Apply</Link>
            </Button>
          </div>

          {/* Search Bar: crisp card (no blur), high contrast */}
          <div className="mx-auto mt-10 w-full max-w-2xl rounded-xl border border-white/30 bg-white/90 p-5 shadow-lg md:mt-12">
            <SearchBar />
          </div>

          {/* Stats: clean cards with light transparency, no blur */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:mt-12 md:grid-cols-4">
            {[
              { label: "Universities", value: "50+" },
              { label: "Programs", value: "500+" },
              { label: "Scholarships", value: "200+" },
              { label: "Uzbek Students", value: "2,500+" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/30 bg-white/85 p-4 text-center shadow-md"
              >
                <p className="mb-1 text-sm font-medium text-purple-900/80">
                  {item.label}
                </p>
                <p className="text-2xl font-extrabold text-purple-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Helper text */}
          <p className="mx-auto mt-6 max-w-xl text-xs text-white/80">
            Up-to-date entries are added regularly. Start with a program search,
            then follow our step-by-step guide.
          </p>
        </div>
      </div>
    </section>
  );
}
