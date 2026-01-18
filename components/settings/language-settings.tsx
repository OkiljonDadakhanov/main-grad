"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useI18n, SUPPORTED_LOCALES } from "@/lib/i18n"

export function LanguageSettings() {
  const { toast } = useToast()
  const { locale, setLocale, t } = useI18n()

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale)
    toast({
      title: t("common.success"),
      description: t("profile.saveSuccess"),
      variant: "success",
    })
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Language Settings</h3>

      <div className="space-y-6 max-w-md">
        <div>
          <p className="text-sm text-gray-500 mb-4">Select your preferred language for the interface</p>

          <RadioGroup value={locale} onValueChange={handleLanguageChange} className="space-y-3">
            {SUPPORTED_LOCALES.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                <Label htmlFor={`lang-${lang.code}`} className="flex items-center">
                  <span className="mr-2 text-xl">{lang.flag}</span>
                  {lang.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
