"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();

  const uid = params?.uid as string;
  const token = params?.token as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!uid || !token) {
      setMessage("Reset link is invalid or expired.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.gradabroad.net/api/auth/password-reset/confirm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            new_password1: newPassword,
            new_password2: confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.detail || "Reset failed");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Reset error:", error);
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full space-y-6 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <Input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleReset} className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}
      </div>
    </section>
  );
}
