"use client"

import { GraduationCap, Users, BookOpen } from "lucide-react"

export function CategoriesHero() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Study Categories</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Explore diverse academic fields and find the perfect program for your career goals in Korean universities
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <GraduationCap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">15+</div>
            <div className="text-sm opacity-90">Study Fields</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm opacity-90">Programs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">2,500+</div>
            <div className="text-sm opacity-90">Uzbek Students</div>
          </div>
        </div>
      </div>
    </div>
  )
}
