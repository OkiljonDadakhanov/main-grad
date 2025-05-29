"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold">Tashkent Office</h4>
              <p className="text-gray-600">Yunusabad District, Tashkent 100084, Uzbekistan</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold">Seoul Office</h4>
              <p className="text-gray-600">Gangnam-gu, Seoul 06292, South Korea</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold">Phone Numbers</h4>
              <p className="text-gray-600">Uzbekistan: +998 71 123 45 67</p>
              <p className="text-gray-600">Korea: +82 2 123 4567</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold">Email Addresses</h4>
              <p className="text-gray-600">General: info@studyinkorea.uz</p>
              <p className="text-gray-600">Support: support@studyinkorea.uz</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold">Office Hours</h4>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Live Chat</h4>
                <p className="text-sm text-blue-700">Available 24/7 for instant support</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Emergency Line</h4>
                <p className="text-sm text-green-700">+998 90 123 45 67 (24/7)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
