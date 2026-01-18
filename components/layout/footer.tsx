"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800 transition-colors duration-300">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300">
              {t("landing.footer.title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("landing.footer.description")}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook" className="hover:bg-gray-200 dark:hover:bg-gray-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter" className="hover:bg-gray-200 dark:hover:bg-gray-800">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram" className="hover:bg-gray-200 dark:hover:bg-gray-800">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="YouTube" className="hover:bg-gray-200 dark:hover:bg-gray-800">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-4">{t("landing.footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/universities"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.universities")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.categories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.faqs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-4">{t("landing.footer.information")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/application-process"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.applicationProcess")}
                </Link>
              </li>
              <li>
                <Link
                  href="/visa-requirements"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.visaRequirements")}
                </Link>
              </li>
              <li>
                <Link
                  href="/living-costs"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.livingCosts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/scholarships"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors"
                >
                  {t("landing.footer.scholarships")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-4">{t("landing.footer.contact")}</h4>
            <address className="not-italic text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <p>
                100011, Republic of Uzbekistan, Tashkent city, Shaykhontohur
                District, Navoi Street, Building 2A
              </p>
              <p>Email: gradabroadltd@gmail.com</p>
              <p>Phone: (71) 202 09 09</p>
            </address>
          </div>
        </div>

        <div className="border-t dark:border-gray-800 mt-12 pt-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} {t("landing.footer.title")}. {t("landing.footer.copyright")}
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-purple-900 dark:hover:text-purple-300 transition-colors">
              {t("landing.footer.privacyPolicy")}
            </Link>
            <Link href="/terms-of-service" className="hover:text-purple-900 dark:hover:text-purple-300 transition-colors">
              {t("landing.footer.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
