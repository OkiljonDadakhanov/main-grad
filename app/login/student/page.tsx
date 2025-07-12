"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = () => {
    // Implement login logic
  };

  const handleOneIdLogin = () => {
    const clientId = "gradabroadltd";
    const redirectUri = encodeURIComponent(
      "https://gradabroad.net/login/oneid/callback"
    );
    const state = encodeURIComponent("random_state_string"); // replace with generated state if needed
    const scope = encodeURIComponent("openid profile email");

    const url = `https://sso.gov.uz/sso/oauth/Authorization.do?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = url;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4 py-16">
      <div className="max-w-md w-full">
        <Card className="bg-white text-black">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Student Login</CardTitle>
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
            <Button onClick={handleEmailLogin} className="w-full">
              Login with Email
            </Button>
            <div className="text-center text-gray-600 text-sm">or</div>
            <Button
              onClick={handleOneIdLogin}
              variant="outline"
              className="w-full"
            >
              Login with OneID 
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
