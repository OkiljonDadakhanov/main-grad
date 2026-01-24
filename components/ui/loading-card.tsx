"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingCardProps {
  lines?: number
  showHeader?: boolean
  showImage?: boolean
  className?: string
}

export function LoadingCard({
  lines = 3,
  showHeader = true,
  showImage = false,
  className = "",
}: LoadingCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {showImage && (
        <Skeleton className="h-48 w-full rounded-none" />
      )}
      {showHeader && (
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
      )}
      <CardContent className={showHeader ? "pt-0" : "pt-6"}>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function LoadingGrid({
  count = 6,
  columns = 3,
  showImage = false,
}: {
  count?: number
  columns?: 2 | 3 | 4
  showImage?: boolean
}) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} showImage={showImage} />
      ))}
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}

export function LoadingProfile() {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingCard lines={4} />
        <LoadingCard lines={4} />
      </div>
    </div>
  )
}

export function LoadingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </Card>
      ))}
    </div>
  )
}
