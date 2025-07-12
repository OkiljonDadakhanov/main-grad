"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function UniversityLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4 py-16">
      <div className="max-w-md w-full">
        <Card className="bg-white text-black">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              University Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
