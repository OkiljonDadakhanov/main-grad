"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

// Mock data - in a real app, this would come from an API
const galleryImages = [
  {
    id: 1,
    title: "Main Campus Building",
    description: "The main administrative and academic building of the university",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 2,
    title: "Library",
    description: "Modern library with extensive collection of books and digital resources",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 3,
    title: "Student Center",
    description: "A hub for student activities and social gatherings",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 4,
    title: "Science Laboratory",
    description: "State-of-the-art laboratory for scientific research and experiments",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 5,
    title: "Sports Complex",
    description: "Modern sports facilities for various athletic activities",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: 6,
    title: "Dormitories",
    description: "Comfortable student housing facilities on campus",
    image: "/placeholder.svg?height=600&width=800",
  },
]

interface UniversityGalleryProps {
  universityId: string
}

export function UniversityGallery({ universityId }: UniversityGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null)

  const handlePrevious = () => {
    if (!selectedImage) return
    const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
    setSelectedImage(galleryImages[prevIndex])
  }

  const handleNext = () => {
    if (!selectedImage) return
    const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % galleryImages.length
    setSelectedImage(galleryImages[nextIndex])
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Gallery</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-md border cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-video relative">
                  <img
                    src={image.image || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-purple-900">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Viewer Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white z-10 hover:bg-black/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex items-center justify-center p-4 h-[80vh]">
              {selectedImage && (
                <img
                  src={selectedImage.image || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white hover:bg-black/20"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white hover:bg-black/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {selectedImage && (
            <div className="bg-white p-4">
              <h3 className="text-xl font-bold text-purple-900">{selectedImage.title}</h3>
              <p className="text-gray-600">{selectedImage.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
