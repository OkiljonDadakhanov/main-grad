"use client";

import { useState, useEffect } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/components/custom-toast";
import { authenticateWithGoogle } from "@/lib/google-auth";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function GoogleLoginButton({
  onSuccess,
  redirectTo = "/student/profile",
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { success, error } = useCustomToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      error("Google bilan kirishda xatolik yuz berdi.");
      return;
    }

    setLoading(true);
    try {
      await authenticateWithGoogle(response.credential);
      success("Google orqali muvaffaqiyatli kirdingiz.");
      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google bilan kirishda xatolik.";
      error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    error("Google bilan kirishda xatolik yuz berdi.");
  };

  // Don't render during SSR/SSG
  if (!mounted) {
    return (
      <div className="w-full flex justify-center py-2">
        <div className="h-10 w-full max-w-[280px] bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center py-2">
        <div className="animate-pulse text-gray-500 text-sm">
          Yuklanmoqda...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
