import PersonalInfoForm from "@/components/student-dashboard/personal-info-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PersonalInformationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Personal Information</h1>
        <p className="text-sm text-gray-500">Manage your personal details and contact information.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Information</CardTitle>
          <CardDescription>Keep your personal details up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm />
        </CardContent>
      </Card>
    </div>
  )
}
