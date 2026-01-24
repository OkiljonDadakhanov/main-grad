// components/home/hero-section.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";
import { TashkentSeoulClock } from "./tashkent-seoul-clock";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, GraduationCap, Building2, Award, Users } from "lucide-react";

export function HeroSection() {
  const { t } = useI18n();

  const stats = [
    { label: t("landing.hero.stats.universities"), value: "50+", icon: Building2 },
    { label: t("landing.hero.stats.programs"), value: "500+", icon: GraduationCap },
    { label: t("landing.hero.stats.scholarships"), value: "200+", icon: Award },
    { label: t("landing.hero.stats.students"), value: "2,500+", icon: Users },
  ];

  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-[90vh] lg:min-h-[85vh]">
      {/* Background with modern gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[url('/images/main.jpg')] bg-cover bg-center scale-105"
          aria-hidden="true"
        />
        {/* Modern gradient overlay */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(135deg, rgba(88, 28, 135, 0.85) 0%, rgba(30, 64, 175, 0.75) 50%, rgba(15, 23, 42, 0.9) 100%)",
          }}
        />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Main content */}
          <div className="text-center text-white">
            {/* Clock - hidden on mobile */}
            <div className="mb-6 hidden md:flex w-full justify-center">
              <TashkentSeoulClock />
            </div>

            {/* Badge */}
            <div className="mb-4 sm:mb-5 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t("landing.hero.badge")}
              </span>
            </div>

            {/* Title */}
            <h1 className="mx-auto max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              {t("landing.hero.title")}
              <span className="block mt-2 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                {t("landing.hero.titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mx-auto mt-8 sm:mt-10 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto group bg-white text-purple-900 hover:bg-gray-100 shadow-lg shadow-purple-900/20 font-semibold px-6"
                asChild
              >
                <Link href="/universities" className="flex items-center gap-2">
                  {t("landing.hero.exploreBtn")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm font-medium px-6"
                asChild
              >
                <Link href="/application-process">{t("landing.hero.howToApplyBtn")}</Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mt-10 sm:mt-12 w-full max-w-2xl">
              <div className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl shadow-black/20 border border-white/20">
                <SearchBar />
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-12 sm:mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 sm:p-5 text-center transition-all hover:bg-white/15 hover:border-white/20"
                  >
                    <div className="mb-2 flex justify-center">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white/90" />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {item.value}
                    </p>
                    <p className="text-xs sm:text-sm text-white/70 font-medium">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
    </section>
  );
}
