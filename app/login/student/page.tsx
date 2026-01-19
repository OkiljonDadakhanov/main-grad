"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomToast } from "@/components/custom-toast";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";
import { GoogleLoginButton } from "@/components/auth/google-login-button";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useCustomToast();

  // Get redirect URL from query params
  const redirectUrl = searchParams.get("redirect") || "/student/profile";

  const handleEmailLogin = async () => {
    if (!email || !password) {
      error("Email va parolni kiriting.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data?.detail === "string" ? data.detail : "Kirishda xatolik.";
        error(msg);
        return;
      }
      saveAuthToStorage(data);
      localStorage.setItem("account_type", "student");
      success("Muvaffaqiyatli kirdingiz.");
      router.push(redirectUrl);
    } catch {
      error("Server xatosi. Keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
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
            <Button onClick={handleEmailLogin} className="w-full" disabled={loading}>
              {loading ? "Kirilmoqda..." : "Email bilan kirish"}
            </Button>
            <div className="text-center text-gray-600 text-sm">or</div>
            <Button
              onClick={handleOneIdLogin}
              variant="outline"
              className="w-full"
            >
              Login with OneID
            </Button>
            <div className="text-center text-gray-600 text-sm">or</div>
            <GoogleLoginButton />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
