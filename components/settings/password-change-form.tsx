"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCustomToast } from "@/components/custom-toast"
import { authFetch, BASE_URL } from "@/lib/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  })

type PasswordFormData = z.infer<typeof passwordSchema>

type PasswordFieldName = "old_password" | "new_password" | "confirm_password"

const FIELD_NAMES: PasswordFieldName[] = ["old_password", "new_password", "confirm_password"]

function firstMessage(value: unknown): string | null {
  if (typeof value === "string") return value
  if (Array.isArray(value) && value.length > 0) return firstMessage(value[0])
  return null
}

export function PasswordChangeForm() {
  const { success, error: errorToast } = useCustomToast()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const response = await authFetch(`${BASE_URL}/api/settings/password/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        success("Password updated", "Your password has been successfully updated.")
        reset()
        return
      }

      let body: unknown = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (body && typeof body === "object") {
        const record = body as Record<string, unknown>
        let toastMessage: string | null = null

        for (const field of FIELD_NAMES) {
          const message = firstMessage(record[field])
          if (message) {
            setError(field, { type: "server", message })
            if (!toastMessage) toastMessage = message
          }
        }

        if (!toastMessage) {
          const detail = firstMessage(record.detail) ?? firstMessage(record.non_field_errors)
          if (detail) toastMessage = detail
        }

        errorToast("Failed to update password", toastMessage ?? undefined)
        return
      }

      errorToast("Failed to update password")
    } catch {
      errorToast("Failed to update password")
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Change Password</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="oldPassword">
            Old password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              className="mt-1 pr-10"
              {...register("old_password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.old_password && (
            <p className="text-red-500 text-sm mt-1">{errors.old_password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword">
            New password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              className="mt-1 pr-10"
              {...register("new_password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            Confirm password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="mt-1 pr-10"
              {...register("confirm_password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-900 hover:bg-purple-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </div>
  )
}
