// components/home/hero-section.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";
import { TashkentSeoulClock } from "./tashkent-seoul-clock";
import { useI18n } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useI18n();

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

      <div className="relative z-10 w-full px-4 sm:px-6 py-12 sm:py-16 md:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl text-center text-white">
          {/* Clock - hidden on very small screens */}
          <div className="mb-4 sm:mb-6 hidden sm:flex w-full justify-center">
            <TashkentSeoulClock />
          </div>

          {/* Eyebrow / badge */}
          <div className="mb-3 sm:mb-4 flex items-center justify-center">
            <span className="rounded-full border border-white/30 bg-white/10 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium tracking-wide">
              {t("landing.hero.badge")}
            </span>
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
            {t("landing.hero.title")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
              {t("landing.hero.titleHighlight")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-3 sm:mt-5 md:mt-6 max-w-2xl text-pretty text-sm sm:text-base md:text-lg text-white/90 px-2">
            {t("landing.hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="mx-auto mt-6 sm:mt-8 md:mt-10 flex max-w-lg flex-col items-center justify-center gap-2 sm:gap-3 sm:flex-row px-2">
            <Button
              size="lg"
              className="w-full sm:w-auto sm:min-w-[190px] bg-white text-purple-900 hover:bg-white/90 text-sm sm:text-base"
              asChild
            >
              <Link href="/universities">{t("landing.hero.exploreBtn")}</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto sm:min-w-[190px] border-white/60 bg-white/90 text-purple-900 hover:bg-white text-sm sm:text-base"
              asChild
            >
              <Link href="/application-process">{t("landing.hero.howToApplyBtn")}</Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 w-full max-w-2xl rounded-xl border border-white/30 bg-white/90 p-3 sm:p-4 md:p-5 shadow-lg">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 grid max-w-4xl grid-cols-2 gap-2 sm:gap-3 md:gap-4 md:grid-cols-4 px-2">
            {[
              { label: t("landing.hero.stats.universities"), value: "50+" },
              { label: t("landing.hero.stats.programs"), value: "500+" },
              { label: t("landing.hero.stats.scholarships"), value: "200+" },
              { label: t("landing.hero.stats.students"), value: "2,500+" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/30 bg-white/85 p-2.5 sm:p-3 md:p-4 text-center shadow-md"
              >
                <p className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs md:text-sm font-medium text-purple-900/80">
                  {item.label}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-purple-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Helper text */}
          <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-[10px] sm:text-xs text-white/80 px-4">
            {t("landing.hero.helperText")}
          </p>
        </div>
      </div>
    </section>
  );
}
