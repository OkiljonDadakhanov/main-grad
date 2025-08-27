"use client"
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import SplashScreen from "@/components/layout/splash-screen-loading";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideLayoutOn = ["/register-university", "/success", "/login", "/login/student", "/login/university", "/register-university/terms", "/login/reset-password", "/login/reset-confirm"  ];
  const hideLayout = hideLayoutOn.includes(pathname);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SplashScreen />
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex flex-col min-h-screen">
            {!hideLayout && <Navbar />}
            <main className="flex-1">{children}</main>
            {!hideLayout && <Footer />}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
