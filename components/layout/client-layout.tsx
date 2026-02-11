"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import SplashScreen from "@/components/layout/splash-screen-loading"
import { I18nProvider } from "@/lib/i18n"
import { GoogleOAuthWrapper } from "@/components/providers/google-oauth-provider"

const hideLayoutOnExact = [
  "/register",
  "/register-student",
  "/register-university",
  "/register-university/terms",
  "/success",
  "/login",
  "/login/student",
  "/login/university",
  "/login/reset-password",
  "/login/reset-confirm",
  "/login/oneid/callback",
]

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Migrate tokens from localStorage to cookies so middleware can read them
  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("access_token")
      if (token && !document.cookie.split("; ").some((c) => c.startsWith("access_token="))) {
        document.cookie = "access_token=" + token + "; path=/; max-age=86400; SameSite=Lax"
      }
    } catch {
      // Ignore localStorage errors (SSR, private browsing, etc.)
    }
  }, [])

  const hideLayout =
    hideLayoutOnExact.includes(pathname) || pathname.startsWith("/student")

  return (
    <>
      <SplashScreen />
      <GoogleOAuthWrapper>
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              {!hideLayout && <Navbar />}
              <main className="flex-1">{children}</main>
              {!hideLayout && <Footer />}
            </div>
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
      </GoogleOAuthWrapper>
    </>
  )
}
