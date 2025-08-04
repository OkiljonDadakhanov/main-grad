"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Image {
  id: number;
  image_url: string;
  description: string;
  uploaded_at: string;
  category?: string;
}

interface Category {
  id: number;
  name: string;
  images: Image[];
}

interface UniversityGalleryProps {
  gallery_categories?: Category[]; // optional to handle undefined safely
}

export function UniversityGallery({
  gallery_categories = [],
}: UniversityGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const allImages = gallery_categories.flatMap((category) =>
    category.images.map((img) => ({ ...img, category: category.name }))
  );

  const handlePrevious = () => {
    if (!selectedImage) return;
    const index = allImages.findIndex((img) => img.id === selectedImage.id);
    const prev = (index - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prev]);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const index = allImages.findIndex((img) => img.id === selectedImage.id);
    const next = (index + 1) % allImages.length;
    setSelectedImage(allImages[next]);
  };

  if (!allImages.length) return null;

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Gallery</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allImages.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-md border cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-video relative">
                  <img
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.description || "Gallery Image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-purple-900">
                    {image.category}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {image.description || "No description"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
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
                  src={selectedImage.image_url || "/placeholder.svg"}
                  alt={selectedImage.description || "Selected"}
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
              <h3 className="text-xl font-bold text-purple-900">
                {selectedImage.category}
              </h3>
              <p className="text-gray-600">
                {selectedImage.description || "No description"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
