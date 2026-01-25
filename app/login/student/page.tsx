"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomToast } from "@/components/custom-toast";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { AuthControls } from "@/components/auth/auth-controls";
import { Mail, Lock, ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useCustomToast();
  const { t } = useI18n();

  const redirectUrl = searchParams.get("redirect") || "/student/profile";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error(t("auth.studentLogin.enterEmailPassword"));
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
          typeof data?.detail === "string" ? data.detail : t("auth.studentLogin.loginError");
        error(msg);
        return;
      }
      saveAuthToStorage(data);
      localStorage.setItem("account_type", "student");
      success(t("auth.studentLogin.loginSuccess"));
      router.push(redirectUrl);
    } catch {
      error(t("auth.studentLogin.serverError"));
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
      <AuthControls />
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("auth.login.backToOptions")}
        </Link>

        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("auth.studentLogin.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {t("auth.studentLogin.subtitle")}
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("auth.studentLogin.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={t("auth.studentLogin.emailPlaceholder")}
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
                {t("auth.studentLogin.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={t("auth.studentLogin.passwordPlaceholder")}
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
                  {t("auth.studentLogin.signingIn")}
                </>
              ) : (
                t("auth.studentLogin.signIn")
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                {t("auth.studentLogin.orContinueWith")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <GoogleLoginButton />

            <button
              onClick={handleOneIdLogin}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#5B4BF5] hover:bg-[#4A3CE0] transition-colors text-white font-medium"
              type="button"
            >
              <span>{t("auth.studentLogin.oneIdLogin")}</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {t("auth.studentLogin.noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            {t("auth.studentLogin.registerNow")}
          </Link>
        </p>
      </div>
    </main>
  );
}
