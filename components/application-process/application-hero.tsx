import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ApplicationHero() {
  return (
    <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Your Complete Guide to Korean University Applications
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Follow our proven 8-step process designed specifically for Uzbek students to successfully apply and get accepted to top Korean universities.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button asChild size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
            <Link href="#application-steps">
              View Application Steps
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="#support-resources">
              Get Application Support
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">95%</div>
            <p className="text-sm opacity-90">Visa Approval Rate</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">2,500+</div>
            <p className="text-sm opacity-90">Uzbek Students Placed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">50+</div>
            <p className="text-sm opacity-90">Partner Universities</p>
          </div>
        </div>
      </div>
    </section>
  )
}
