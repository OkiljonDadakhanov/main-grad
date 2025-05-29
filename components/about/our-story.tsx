import Image from "next/image"

export function OurStory() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Founded in 2020, Study in Korea began as a small initiative to help Uzbek students navigate the complex
                process of applying to Korean universities. What started as a passion project has grown into the leading
                platform connecting Uzbekistan and Korea's educational excellence.
              </p>
              <p>
                Our founders, having experienced the challenges of studying abroad firsthand, recognized the need for a
                comprehensive platform that could simplify the application process while providing authentic information
                about Korean universities.
              </p>
              <p>
                Today, we have successfully helped over 2,500 Uzbek students secure admissions to top Korean
                universities, with many receiving full scholarships and going on to build successful careers in Korea
                and beyond.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Uzbek students at Korean university"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
