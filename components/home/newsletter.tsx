"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Newsletter() {
  const { t } = useI18n()
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
          <h2 className="text-3xl font-bold mb-4">{t("landing.newsletter.title")}</h2>
          <p className="text-lg text-white/80 mb-8">
            {t("landing.newsletter.subtitle")}
          </p>

          {subscribed ? (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{t("landing.newsletter.thankYou")}</h3>
              <p>{t("landing.newsletter.thankYouDesc")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder={t("landing.newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-purple-500"
              />
              <Button type="submit" className="bg-white text-purple-900 hover:bg-white/90">
                {t("landing.newsletter.subscribe")}
              </Button>
            </form>
          )}

          <div className="mt-8 text-sm text-white/60">
            {t("landing.newsletter.languages")} <span className="font-medium text-white">O'zbek</span> •{" "}
            <span className="text-white/80">한국어</span> • <span className="text-white/80">Русский</span> •{" "}
            <span className="text-white/80">English</span>
          </div>
        </div>
      </div>
    </section>
  )
}
