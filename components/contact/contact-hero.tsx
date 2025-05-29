"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export function ContactHero() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Have questions about studying in Korea? Our expert team is here to help Uzbek students navigate their journey
          to Korean universities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <Phone className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-sm opacity-90">+998 71 123 45 67</p>
            <p className="text-sm opacity-90">+82 2 123 4567</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <Mail className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="text-sm opacity-90">info@studyinkorea.uz</p>
            <p className="text-sm opacity-90">support@studyinkorea.uz</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <MapPin className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="text-sm opacity-90">Tashkent, Uzbekistan</p>
            <p className="text-sm opacity-90">Seoul, South Korea</p>
          </div>
        </div>
      </div>
    </div>
  )
}
