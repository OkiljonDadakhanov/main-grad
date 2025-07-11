"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-600 to-green-800 text-white px-4">
      <div className="max-w-xl w-full">
        <Card className="shadow-2xl bg-white text-gray-900">
          <CardHeader className="flex flex-col items-center space-y-2 text-center">
            <CheckCircle size={48} className="text-green-600" />
            <CardTitle className="text-2xl font-bold">
              Registration Successful!
            </CardTitle>
            <p className="text-gray-500 text-sm">
              Thank you for registering your university on GradAbroad.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="text-md">
              <p className="mb-2">
                🎉 We're excited to have you on board. You will soon receive a
                confirmation email after our administrators review your
                submission.
              </p>
              <p className="text-sm text-gray-600">
                📩 Please check your inbox (and spam folder) for an email with
                your login credentials.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full">Go to Login Page</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
