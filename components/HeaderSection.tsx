"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HeaderSection({ universityName }: { universityName: string }) {
  return (
    <div className="flex items-center gap-4">
      <Link href="/student/browse-universities">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Apply to {universityName}</h1>
        <p className="text-sm text-gray-500">
          Complete your application using your pre-filled profile info
        </p>
      </div>
    </div>
  )
}
