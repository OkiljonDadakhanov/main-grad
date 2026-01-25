"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuthControls } from "@/components/auth/auth-controls";
import { useI18n } from "@/lib/i18n";

export default function LoginRoleSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const redirectParam = searchParams.get("redirect");
  const redirectQuery = redirectParam
    ? `?redirect=${encodeURIComponent(redirectParam)}`
    : "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <AuthControls />
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Grad<span className="text-primary">Abroad</span>
            </h1>
          </Link>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {t("auth.login.title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {t("auth.login.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push(`/login/student${redirectQuery}`)}
            className="group w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t("auth.login.student")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("auth.login.studentDesc")}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </button>

          <button
            onClick={() => router.push("/login/university")}
            className="group w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t("auth.login.university")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("auth.login.universityDesc")}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" />
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          {t("auth.login.noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            {t("auth.login.createOne")}
          </Link>
        </p>
      </div>
    </main>
  );
}
