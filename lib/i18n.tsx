"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authFetch, BASE_URL } from "./auth";

// Import all translations
import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import ru from "@/messages/ru.json";
import uz from "@/messages/uz.json";

type Messages = typeof en;

const messages: Record<string, Messages> = { en, ko, ru, uz };

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's language preference on mount
  useEffect(() => {
    if (!mounted) return;

    const fetchLanguage = async () => {
      try {
        // First check localStorage for saved preference
        const savedLocale = localStorage.getItem("preferred_language");
        if (savedLocale && messages[savedLocale]) {
          setLocaleState(savedLocale);
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await authFetch(`${BASE_URL}/api/settings/language/`);
        if (res.ok) {
          const data = await res.json();
          if (data.preferred_language && messages[data.preferred_language]) {
            setLocaleState(data.preferred_language);
            localStorage.setItem("preferred_language", data.preferred_language);
          }
        }
      } catch (err) {
        console.error("Error fetching language preference:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguage();
  }, [mounted]);

  const setLocale = useCallback(async (newLocale: string) => {
    if (!messages[newLocale]) return;

    setLocaleState(newLocale);

    // Always save to localStorage for persistence
    localStorage.setItem("preferred_language", newLocale);

    // Save to API if authenticated
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await authFetch(`${BASE_URL}/api/settings/language/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferred_language: newLocale }),
        });
      } catch (err) {
        console.error("Error saving language preference:", err);
      }
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: unknown = messages[locale];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          // Fallback to English if key not found
          value = messages.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === "object" && fallbackKey in value) {
              value = (value as Record<string, unknown>)[fallbackKey];
            } else {
              return key; // Return key if not found in English either
            }
          }
          break;
        }
      }

      return typeof value === "string" ? value : key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  // Return default values if context is not yet available (SSR/hydration)
  if (!context) {
    return {
      locale: "en",
      setLocale: () => {},
      t: (key: string) => {
        const keys = key.split(".");
        let value: unknown = messages.en;
        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = (value as Record<string, unknown>)[k];
          } else {
            return key;
          }
        }
        return typeof value === "string" ? value : key;
      },
      isLoading: true,
    };
  }
  return context;
}

export function useTranslations(namespace?: string) {
  const { t, locale } = useI18n();

  const translate = useCallback(
    (key: string): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return t(fullKey);
    },
    [t, namespace]
  );

  return translate;
}

export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
];
