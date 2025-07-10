import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Our Trusted Partners
        </h1>
        <p className="text-lg md:text-xl mb-16 max-w-3xl mx-auto text-white/90">
          We proudly collaborate with leading institutions in Korea and
          Uzbekistan to build brighter futures through global education.
        </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center max-w-5xl mx-auto mb-20">
  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transition hover:scale-105 hover:bg-white/20 duration-300 shadow-xl flex flex-col">
    <div className="bg-white rounded-full p-4 w-40 h-40 flex items-center justify-center mx-auto mb-6">
      <Image
        src="/images/korea.png"
        alt="Korean Education Center"
        width={100}
        height={100}
        className="object-contain"
      />
    </div>
    <h3 className="text-2xl font-semibold mb-2 min-h-[56px] text-center">
      Korean Education Center
    </h3>
    <p className="text-base text-white/90 min-h-[72px] text-center">
      Supporting Korean language and cultural education throughout Uzbekistan.
    </p>
  </div>

  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transition hover:scale-105 hover:bg-white/20 duration-300 shadow-xl flex flex-col">
    <div className="bg-white rounded-full p-4 w-40 h-40 flex items-center justify-center mx-auto mb-6">
      <Image
        src="/images/preschool.png"
        alt="Ministry of Preschool and School Education"
        width={100}
        height={100}
        className="object-contain"
      />
    </div>
    <h3 className="text-2xl font-semibold mb-2 min-h-[56px] text-center">
      Ministry of Preschool and School Education
    </h3>
    <p className="text-base text-white/90 min-h-[72px] text-center">
      Collaborating to provide top-quality international opportunities for Uzbek students.
    </p>
  </div>
</div>



        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-800 hover:bg-gray-100 px-8 py-5 text-base font-semibold"
          >
            <Link href="/universities">Explore Universities</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-purple-800 hover:bg-white/10 px-8 py-5 text-base font-semibold"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
