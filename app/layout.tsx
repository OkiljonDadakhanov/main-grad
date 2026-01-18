"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import SplashScreen from "@/components/layout/splash-screen-loading"
import { I18nProvider } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()

  // 🔥 Hide layout for certain pages or route groups
  const hideLayoutOnExact = [
    "/register-university",
    "/success",
    "/login",
    "/login/student",
    "/login/university",
    "/register-university/terms",
    "/login/reset-password",
    "/login/reset-confirm",
  ]

  // ✅ Check if current path is exactly in list OR starts with /student
  const hideLayout =
    hideLayoutOnExact.includes(pathname) || pathname.startsWith("/student")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SplashScreen />
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
      </body>
    </html>
  )
}
