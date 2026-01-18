"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCustomToast } from "@/components/custom-toast";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";

export default function UniversityLoginPage() {
  const router = useRouter();
  const { success, error } = useCustomToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.non_field_errors?.includes("University not verified")) {
          error("Your university account is not verified yet. Please contact support.");
        } else if (errorData.detail) {
          error(errorData.detail);
        } else {
          error("Login failed. Please check your credentials.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Verify this is a university account
      if (data.account_type !== "university") {
        error("This login is for university accounts only. Please use the student login.");
        setLoading(false);
        return;
      }

      // Save auth tokens using the shared auth utility
      saveAuthToStorage(data);
      // Also save for legacy compatibility
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("account_type", data.account_type);
      if (data.university_id) {
        localStorage.setItem("university_id", String(data.university_id));
      }

      success("Login successful!");

      // Redirect to university dashboard if configured, otherwise stay in app
      const universityDashboardUrl = process.env.NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL;
      if (universityDashboardUrl) {
        window.location.href = `${universityDashboardUrl}/profile?token=${data.access}&refresh=${data.refresh}`;
      } else {
        // Fallback: redirect to home with success state
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetting(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        error(errorData.detail || "Reset failed");
        return;
      }

      router.push("/login/reset-confirm");
    } catch (err) {
      console.error("Reset error:", err);
      error("An unexpected error occurred");
    } finally {
      setResetting(false);
    }
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
              disabled={loading}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your email and we’ll send you a reset link.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={resetting}
                    />
                    <Button
                      onClick={handleResetPassword}
                      disabled={resetting || !resetEmail}
                      className="w-full"
                    >
                      {resetting ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
