// app/login/page.tsx - Role selection
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginRoleSelector() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4 py-16">
      <div className="max-w-md w-full">
        <Card className="bg-white text-black shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Login As</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              onClick={() => router.push("/login/student")}
              className="w-full"
            >
              Student
            </Button>
            <Button
              onClick={() => router.push("/login/university")}
              className="w-full"
            >
              University
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
