"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactMap() {
  return (
    <Card className="mb-16">
      <CardHeader>
        <CardTitle>Our Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tashkent Office</h3>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Interactive Map - Tashkent Location</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Seoul Office</h3>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Interactive Map - Seoul Location</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
