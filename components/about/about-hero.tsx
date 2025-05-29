import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white py-20">
      <div className="absolute inset-0 bg-black/20" />
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bridging Dreams Between
            <span className="block text-yellow-400">Uzbekistan and Korea</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            We are dedicated to helping Uzbek students achieve their educational dreams 
            at Korea's most prestigious universities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" asChild>
              <Link href="/universities">Explore Universities</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
