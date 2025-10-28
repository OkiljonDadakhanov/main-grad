"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface UniversityDetails {
  id: string
  name: string
  programs: string[]
  requiredDocuments: string[]
}

const mockUniversityData: Record<string, UniversityDetails> = {
  "seoul-national": {
    id: "seoul-national",
    name: "Seoul National University",
    programs: ["MSc in Artificial Intelligence", "MSc in Computer Science", "PhD in Robotics", "MBA"],
    requiredDocuments: [
      "Personal Statement (specific to SNU)",
      "Study Plan",
      "Research Proposal (for PhD programs)",
      "Portfolio (for design programs)",
    ],
  },
  kaist: {
    id: "kaist",
    name: "KAIST",
    programs: ["PhD in Robotics", "MSc in Data Science", "MSc in Electrical Engineering"],
    requiredDocuments: ["Research Proposal", "Study Plan", "Professor Recommendation (if applicable)"],
  },
}

export default function ApplyToUniversityPage({ params }: { params: { universityId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const university = mockUniversityData[params.universityId]

  const [selectedProgram, setSelectedProgram] = useState("")
  const [motivation, setMotivation] = useState("")
  const [whyThisUniversity, setWhyThisUniversity] = useState("")
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({})
  const [includeDocuments, setIncludeDocuments] = useState({
    personalInfo: true,
    education: true,
    certificates: true,
    family: true,
    applicationDocs: true,
    financialDocs: true,
  })

  if (!university) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">University not found</p>
            <Link href="/student/browse-universities">
              <Button className="mt-4 bg-transparent" variant="outline">
                Back to Browse
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleFileUpload = (docName: string, file: File | null) => {
    if (file) {
      setUploadedDocs((prev) => ({ ...prev, [docName]: file }))
    }
  }

  const handleSubmitApplication = () => {
    if (!selectedProgram) {
      toast({
        title: "Error",
        description: "Please select a program",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would submit to the backend
    // TODO: Implement actual API call for application submission

    toast({
      title: "Application Submitted!",
      description: `Your application to ${university.name} has been submitted successfully.`,
      variant: "success",
    })

    // Redirect to My Applications
    setTimeout(() => {
      router.push("/student/my-applications")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/student/browse-universities">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Apply to {university.name}</h1>
          <p className="text-sm text-gray-500">Complete your application using your pre-filled profile information</p>
        </div>
      </div>

      {/* Program Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Program</CardTitle>
          <CardDescription>Choose the program you want to apply for</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger>
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              {university.programs.map((program) => (
                <SelectItem key={program} value={program}>
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Documents from Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Include Documents from Your Profile</CardTitle>
          <CardDescription>Select which documents from your profile to include in this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="personalInfo"
              checked={includeDocuments.personalInfo}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, personalInfo: checked as boolean }))
              }
            />
            <label
              htmlFor="personalInfo"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Personal Information & Documents (Passport, Medical Reports, etc.)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="education"
              checked={includeDocuments.education}
              onCheckedChange={(checked) => setIncludeDocuments((prev) => ({ ...prev, education: checked as boolean }))}
            />
            <label
              htmlFor="education"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Educational Information (Diplomas, Transcripts)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="certificates"
              checked={includeDocuments.certificates}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, certificates: checked as boolean }))
              }
            />
            <label
              htmlFor="certificates"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Certificates (Language, Professional)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="family"
              checked={includeDocuments.family}
              onCheckedChange={(checked) => setIncludeDocuments((prev) => ({ ...prev, family: checked as boolean }))}
            />
            <label
              htmlFor="family"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Family Information & Documents
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="applicationDocs"
              checked={includeDocuments.applicationDocs}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, applicationDocs: checked as boolean }))
              }
            />
            <label
              htmlFor="applicationDocs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              General Application Documents (Personal Statement, Recommendation Letters)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="financialDocs"
              checked={includeDocuments.financialDocs}
              onCheckedChange={(checked) =>
                setIncludeDocuments((prev) => ({ ...prev, financialDocs: checked as boolean }))
              }
            />
            <label
              htmlFor="financialDocs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Financial Documents (Bank Statements, Sponsor Letters)
            </label>
          </div>
        </CardContent>
      </Card>

      {/* University-Specific Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Application Essays</CardTitle>
          <CardDescription>Answer these questions specifically for {university.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="motivation">
              Why do you want to pursue this program? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivation"
              placeholder="Explain your motivation and goals..."
              rows={5}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
            <p className="text-xs text-gray-500">{motivation.length} / 1000 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whyUniversity">
              Why {university.name}? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="whyUniversity"
              placeholder={`Explain why you chose ${university.name} specifically...`}
              rows={5}
              value={whyThisUniversity}
              onChange={(e) => setWhyThisUniversity(e.target.value)}
            />
            <p className="text-xs text-gray-500">{whyThisUniversity.length} / 1000 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* University-Specific Documents */}
      <Card>
        <CardHeader>
          <CardTitle>University-Specific Documents</CardTitle>
          <CardDescription>Upload additional documents required by {university.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {university.requiredDocuments.map((docName) => (
            <div key={docName} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{docName}</p>
                  {uploadedDocs[docName] && <p className="text-xs text-gray-500">{uploadedDocs[docName].name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadedDocs[docName] ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Label htmlFor={docName} className="cursor-pointer">
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload</span>
                    </div>
                    <Input
                      id={docName}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(docName, e.target.files?.[0] || null)}
                    />
                  </Label>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Before submitting:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Review all information in your profile sections</li>
                  <li>Ensure all required documents are uploaded</li>
                  <li>Double-check your essays for errors</li>
                  <li>Make sure you selected the correct program</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/student/browse-universities" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmitApplication} className="flex-1 bg-purple-600 hover:bg-purple-700">
              Submit Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
