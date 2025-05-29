// components/home/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center mix-blend-overlay opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Your Path from Uzbekistan to Korean Universities
        </h1>

        <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto">
          Discover top Korean universities, scholarships, and programs specifically for Uzbek students
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-white text-purple-900 hover:bg-white/90 min-w-[180px]"
            asChild
          >
            <Link href="/universities">Explore Universities</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10 min-w-[180px]"
            asChild
          >
            <Link href="/application-process">How to Apply</Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg mb-12 max-w-2xl mx-auto w-full">
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Universities", value: "50+" },
            { label: "Programs", value: "500+" },
            { label: "Scholarships", value: "200+" },
            { label: "Uzbek Students", value: "2,500+" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center"
            >
              <p className="text-sm font-medium mb-1">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
