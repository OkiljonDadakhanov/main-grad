"use client"

import type { ReactNode } from "react"
import SplashScreen from "./splash-screen-loading"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      

      <div className="flex">
        <SplashScreen />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
