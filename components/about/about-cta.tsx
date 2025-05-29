import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Korean Education Journey?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of Uzbek students who have successfully started their academic careers in Korea. Let us help
            you find the perfect university and program for your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" asChild>
              <Link href="/register">Start Your Application</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-900"
              asChild
            >
              <Link href="/universities">Browse Universities</Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-purple-100 mb-4">Have questions? We're here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="mailto:info@studyinkorea.uz" className="hover:text-yellow-400">
                📧 info@studyinkorea.uz
              </a>
              <a href="tel:+998901234567" className="hover:text-yellow-400">
                📞 +998 90 123 45 67
              </a>
              <a href="#" className="hover:text-yellow-400">
                💬 Telegram: @StudyInKoreaUZ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
