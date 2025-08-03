import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
)

export default function ProfileDetails() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My profile</h2>
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Student" />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-gray-800">SHOXBEK SHUKURULLOYEV</h3>
        </div>

        <div className="bg-white p-6 rounded-lg border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem label="Telephone number" value="-" />
            <InfoItem label="Additional phone number" value="-" />
            <InfoItem label="Email address" value="-" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Passport information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem label="Passport or ID card number" value="AD3334344" />
            <InfoItem label="Date of birth" value="-" />
            <InfoItem label="Gender" value="-" />
          </div>
        </div>
      </div>
    </div>
  )
}
