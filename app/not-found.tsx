"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4">
      <Card className="bg-white text-black shadow-xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>
          <Link href="/">
            <Button variant="default">Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
