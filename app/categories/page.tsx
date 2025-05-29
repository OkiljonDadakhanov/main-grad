"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { CategoriesHero } from "@/components/catagories/catagories-hero"
import { CategoriesGrid } from "@/components/catagories/catagories-grid"
import { PopularPrograms } from "@/components/catagories/popular-programs"

export default function CategoriesPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <CategoriesHero />
        <div className="container mx-auto px-4 py-16">
          <CategoriesGrid />
          <PopularPrograms />
        </div>
      </div>
    </AppLayout>
  )
}
