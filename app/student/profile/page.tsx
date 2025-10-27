"use client";

import { useEffect, useState } from "react";
import ProfileBanner from "@/components/student-dashboard/profile-banner";
import { useRouter } from "next/navigation";
import { BASE_URL, authFetch, getAccessTokenFromStorage } from "@/lib/auth";

interface MeProfileResponse {
  full_name: string;
  phone_number: string;
  additional_phone: string;
  email: string;
  passport_number: string | null;
  date_of_birth: string | null;
  gender: string;
}

interface PersonalInfoResponse {
  emergency_phone: string | null;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MeProfileResponse | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="min-h-[300px] flex items-center justify-center">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileBanner />
      {/* Simple inline details instead of old static component */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Full name</p>
            <p className="font-medium text-gray-800">{profile?.full_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telephone number</p>
            <p className="font-medium text-gray-800">{profile?.phone_number || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Emergency phone</p>
            <p className="font-medium text-gray-800">{personalInfo?.emergency_phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email address</p>
            <p className="font-medium text-gray-800">{profile?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport number</p>
            <p className="font-medium text-gray-800">{profile?.passport_number || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of birth</p>
            <p className="font-medium text-gray-800">{profile?.date_of_birth || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-gray-800">{profile?.gender || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
