"use client"

import type { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      

      <div className="flex">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
