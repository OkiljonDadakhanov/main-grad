"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomToast } from "@/components/custom-toast";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { AuthControls } from "@/components/auth/auth-controls";
import { useI18n } from "@/lib/i18n";

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

  const handleSubmit = async () => {
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

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4 py-16 relative">
      <AuthControls />

      {/* Header with logo */}
      <Link href="/" className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Grad<span className="text-purple-200">Abroad</span>
        </h1>
      </Link>

      <div className="max-w-md w-full">
        <Card className="bg-white dark:bg-slate-800 text-black dark:text-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t("auth.studentRegister.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder={t("auth.studentRegister.firstName")}
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
            <Input
              placeholder={t("auth.studentRegister.lastName")}
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
            <Input
              placeholder={t("auth.studentRegister.phone")}
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              placeholder={t("auth.studentRegister.email")}
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              placeholder={t("auth.studentRegister.password")}
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button disabled={loading} onClick={handleSubmit} className="w-full">
              {loading ? t("auth.studentRegister.registering") : t("auth.studentRegister.register")}
            </Button>

            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">{t("auth.studentRegister.or")}</div>
            <GoogleLoginButton />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              {t("auth.studentRegister.haveAccount")}{" "}
              <Link
                href="/login/student"
                className="text-purple-700 dark:text-purple-400 font-medium hover:underline"
              >
                {t("auth.studentRegister.login")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
