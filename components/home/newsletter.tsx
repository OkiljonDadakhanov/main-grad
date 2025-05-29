"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // In a real app, this would send the email to your API
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 bg-purple-900 text-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-white/80 mb-8">
            Subscribe to our newsletter to receive the latest updates about studying in Korea, new scholarships, and
            application deadlines
          </p>

          {subscribed ? (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
              <p>You'll now receive updates about Korean universities and opportunities for Uzbek students.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-purple-500"
              />
              <Button type="submit" className="bg-white text-purple-900 hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          )}

          <div className="mt-8 text-sm text-white/60">
            Available in <span className="font-medium text-white">O'zbek</span> •{" "}
            <span className="text-white/80">한국어</span> • <span className="text-white/80">Русский</span> •{" "}
            <span className="text-white/80">English</span>
          </div>
        </div>
      </div>
    </section>
  )
}
