"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search, GraduationCap, FileText, Plane, School } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const stepKeys = ["find", "choose", "prepare", "visa", "begin"] as const;
const stepIcons = [Search, GraduationCap, FileText, Plane, School];

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-4">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {stepKeys.map((stepKey, index) => {
            const Icon = stepIcons[index];
            return (
              <Card key={stepKey} className="border-0 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-purple-900 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                    {t(`landing.howItWorks.steps.${stepKey}.title`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(`landing.howItWorks.steps.${stepKey}.description`)}
                  </p>
                  <div className="mt-4 text-sm font-medium text-purple-900 dark:text-purple-400">
                    {t("landing.howItWorks.step")} {index + 1}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
