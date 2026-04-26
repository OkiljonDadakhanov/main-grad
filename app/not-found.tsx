"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4">
      <Card className="bg-card text-card-foreground shadow-xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t("notFoundPage.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t("notFoundPage.description")}
          </p>
          <Link href="/">
            <Button variant="default">{t("notFoundPage.goHome")}</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
