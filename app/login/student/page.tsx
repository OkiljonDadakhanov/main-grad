"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomToast } from "@/components/custom-toast";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Mail, Lock, ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useCustomToast();

  const redirectUrl = searchParams.get("redirect") || "/student/profile";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error("Email va parolni kiriting.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          typeof data?.detail === "string" ? data.detail : "Kirishda xatolik.";
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
    const state = encodeURIComponent("random_state_string");
    const scope = encodeURIComponent("openid profile email");

    const url = `https://sso.gov.uz/sso/oauth/Authorization.do?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = url;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login options
        </Link>

        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Student Login
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="student@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <GoogleLoginButton />

            <Button
              onClick={handleOneIdLogin}
              variant="outline"
              className="w-full h-12 text-base font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              type="button"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Login with OneID
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Register now
          </Link>
        </p>
      </div>
    </main>
  );
}
