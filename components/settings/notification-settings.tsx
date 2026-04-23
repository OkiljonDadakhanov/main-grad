"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useCustomToast } from "@/components/custom-toast"
import { authFetch, BASE_URL } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

type NotificationField =
  | "email"
  | "app_updates"
  | "payments"
  | "marketing"
  | "system"

type NotificationState = Record<NotificationField, boolean>

const DEFAULT_STATE: NotificationState = {
  email: true,
  app_updates: true,
  payments: true,
  marketing: false,
  system: true,
}

const TOGGLES: {
  field: NotificationField
  id: string
  title: string
  description: string
}[] = [
  {
    field: "email",
    id: "emailNotifications",
    title: "Email Notifications",
    description: "Receive email notifications",
  },
  {
    field: "app_updates",
    id: "applicationUpdates",
    title: "Application Updates",
    description: "Get notified about application status changes",
  },
  {
    field: "payments",
    id: "paymentReminders",
    title: "Payment Reminders",
    description: "Receive reminders about upcoming payments",
  },
  {
    field: "marketing",
    id: "marketingEmails",
    title: "Marketing Emails",
    description: "Receive promotional emails and newsletters",
  },
  {
    field: "system",
    id: "systemUpdates",
    title: "System Updates",
    description: "Get notified about system updates and maintenance",
  },
]

function extractErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const record = body as Record<string, unknown>
  if (typeof record.detail === "string") return record.detail
  for (const value of Object.values(record)) {
    if (typeof value === "string") return value
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      return value[0] as string
    }
  }
  return null
}

export function NotificationSettings() {
  const { error: errorToast } = useCustomToast()
  const [settings, setSettings] = useState<NotificationState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [pendingField, setPendingField] = useState<NotificationField | null>(null)

  const loadSettings = async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const response = await authFetch(`${BASE_URL}/api/settings/notifications/`)
      if (!response.ok) throw new Error("Failed to load")
      const data = (await response.json()) as Partial<NotificationState>
      setSettings({
        email: Boolean(data.email),
        app_updates: Boolean(data.app_updates),
        payments: Boolean(data.payments),
        marketing: Boolean(data.marketing),
        system: Boolean(data.system),
      })
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleToggle = async (field: NotificationField) => {
    const previous = settings[field]
    const next = !previous
    setSettings((prev) => ({ ...prev, [field]: next }))
    setPendingField(field)

    try {
      const response = await authFetch(`${BASE_URL}/api/settings/notifications/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      })

      if (!response.ok) {
        let body: unknown = null
        try {
          body = await response.json()
        } catch {
          body = null
        }
        setSettings((prev) => ({ ...prev, [field]: previous }))
        errorToast(
          "Failed to update settings",
          extractErrorMessage(body) ?? undefined,
        )
      }
    } catch {
      setSettings((prev) => ({ ...prev, [field]: previous }))
      errorToast("Failed to update settings")
    } finally {
      setPendingField(null)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>

      <div className="space-y-6 max-w-md">
        {loading ? (
          <div className="space-y-4">
            {TOGGLES.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Couldn&apos;t load your notification settings. Please try again.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSettings}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {TOGGLES.map((toggle) => (
              <div
                key={toggle.id}
                className="flex items-center justify-between"
              >
                <div>
                  <Label htmlFor={toggle.id} className="text-base font-medium">
                    {toggle.title}
                  </Label>
                  <p className="text-sm text-gray-500">{toggle.description}</p>
                </div>
                <Switch
                  id={toggle.id}
                  checked={settings[toggle.field]}
                  disabled={pendingField === toggle.field}
                  onCheckedChange={() => handleToggle(toggle.field)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
