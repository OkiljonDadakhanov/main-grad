"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomToast } from "@/components/custom-toast";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { AuthControls } from "@/components/auth/auth-controls";
import { useI18n } from "@/lib/i18n";
import { Mail, Lock, User, Phone, ArrowLeft, Loader2, GraduationCap } from "lucide-react";

interface RegisterForm {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
}

export default function RegisterStudentPage() {
  const router = useRouter();
  const { success, error } = useCustomToast();
  const { t } = useI18n();
  const [form, setForm] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      error(t("auth.studentRegister.fillAllFields"));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      error(t("auth.studentRegister.invalidEmail"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register/student/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data?.detail === "string" ? data.detail : t("auth.studentRegister.registerError");
        error(msg);
        return;
      }

      saveAuthToStorage(data);
      success(t("auth.studentRegister.registerSuccess"));
      router.push("/login/student");
    } catch {
      error(t("auth.studentRegister.serverError"));
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8">
      <AuthControls />
      <div className="w-full max-w-md">
        <Link
          href="/register"
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
              {t("auth.studentRegister.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {t("auth.studentRegister.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("auth.studentRegister.firstName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder={t("auth.studentRegister.firstName")}
                    value={form.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("auth.studentRegister.lastName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder={t("auth.studentRegister.lastName")}
                    value={form.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("auth.studentRegister.phone")}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={t("auth.studentRegister.phone")}
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("auth.studentRegister.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={t("auth.studentRegister.emailPlaceholder")}
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("auth.studentRegister.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={t("auth.studentRegister.passwordPlaceholder")}
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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
                  {t("auth.studentRegister.registering")}
                </>
              ) : (
                t("auth.studentRegister.register")
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                {t("auth.studentRegister.or")}
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
          {t("auth.studentRegister.haveAccount")}{" "}
          <Link
            href="/login/student"
            className="text-primary hover:underline font-medium"
          >
            {t("auth.studentRegister.login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
