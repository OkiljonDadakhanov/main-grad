import ProfileBanner from "@/components/student-dashboard/profile-banner";
import ProfileDetails from "@/components/student-dashboard/profile-details";

export default function MyProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileBanner />
      <ProfileDetails />
    </div>
  );
}
