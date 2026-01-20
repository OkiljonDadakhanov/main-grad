"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ProfileBanner from "@/components/student-dashboard/profile-banner";
import { useRouter } from "next/navigation";
import { BASE_URL, authFetch, getAccessTokenFromStorage } from "@/lib/auth";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeProfileResponse {
  full_name: string;
  phone_number: string;
  additional_phone: string;
  email: string;
  passport_number: string | null;
  date_of_birth: string | null;
  gender: string;
  profile_picture_url: string | null;
}

interface PersonalInfoResponse {
  emergency_phone: string | null;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MeProfileResponse | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = getAccessTokenFromStorage();
    if (!token) {
      router.replace("/login/student");
      return;
    }
    const load = async () => {
      try {
        const [profileRes, personalInfoRes] = await Promise.all([
          authFetch(`${BASE_URL}/api/me/profile/`),
          authFetch(`${BASE_URL}/api/personal-information/`)
        ]);
        
        if (profileRes.status === 401) {
          router.replace("/login/student");
          return;
        }
        
        const profileData: MeProfileResponse = await profileRes.json();
        setProfile(profileData);
        
        if (personalInfoRes.ok) {
          const personalInfoData: PersonalInfoResponse = await personalInfoRes.json();
          setPersonalInfo(personalInfoData);
        }
      } catch {
        // fail silently for now
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      const res = await authFetch(`${BASE_URL}/api/me/profile/`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => prev ? { ...prev, profile_picture_url: data.profile_picture_url } : null);
      } else {
        alert("Failed to upload profile picture");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div className="min-h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileBanner />
      {/* Profile Picture Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            {profile?.profile_picture_url ? (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src={profile.profile_picture_url}
                  alt={profile.full_name || "Profile"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-2xl">
                {profile?.full_name ? getInitials(profile.full_name) : "S"}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {profile?.full_name || "Student"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{profile?.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </Button>
          </div>
        </div>
      </div>
      {/* Simple inline details instead of old static component */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">My profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Full name</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{profile?.full_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Telephone number</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{profile?.phone_number || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Emergency phone</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{personalInfo?.emergency_phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email address</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{profile?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Passport number</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{profile?.passport_number || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date of birth</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{profile?.date_of_birth || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{profile?.gender || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
