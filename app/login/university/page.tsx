"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCustomToast } from "@/components/custom-toast";
import {
  BASE_URL,
  UNIVERSITY_DASHBOARD_URL,
  saveAuthToStorage,
} from "@/lib/auth";
import { Mail, Lock, ArrowLeft, Loader2, Building2 } from "lucide-react";
import Link from "next/link";

export default function UniversityLoginPage() {
  const router = useRouter();
  const { success, error } = useCustomToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
          error(
            "Your university account is not verified yet. Please contact support."
          );
        } else if (errorData.detail) {
          error(errorData.detail);
        } else {
          error("Login failed. Please check your credentials.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.account_type !== "university") {
        error(
          "This login is for university accounts only. Please use the student login."
        );
        setLoading(false);
        return;
      }

      saveAuthToStorage(data);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("account_type", data.account_type);
      if (data.university_id) {
        localStorage.setItem("university_id", String(data.university_id));
      }

      success("Login successful!");

      window.location.href = `${UNIVERSITY_DASHBOARD_URL}/profile?token=${data.access}&refresh=${data.refresh}`;
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              University Login
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Sign in to manage your institution
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="university@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email and we&apos;ll send you a reset link.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 h-12"
                          disabled={resetting}
                        />
                      </div>
                      <Button
                        onClick={handleResetPassword}
                        disabled={resetting || !resetEmail}
                        className="w-full h-12"
                      >
                        {resetting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700"
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
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Want to list your university?{" "}
          <Link
            href="/register-university"
            className="text-emerald-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
