import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, GraduationCap, Users, Globe, Mail, Phone } from "lucide-react"
import { UniversityOverview } from "@/components/university/university-overview"
import { UniversityPrograms } from "@/components/university/university-programs"
import { UniversityScholarships } from "@/components/university/university-scholarships"
import { UniversityGallery } from "@/components/university/university-gallery"
import { UniversityFAQs } from "@/components/university/university-faqs"

// Mock data - in a real app, this would come from an API
const university = {
  id: "newuu",
  name: "New Uzbekistan University",
  location: "Tashkent, Uzbekistan",
  type: "Public",
  established: "2020",
  accreditation: "Ministry of Higher Education, Uzbekistan",
  website: "https://newuu.uz",
  email: "info@newuu.uz",
  phone: "+998 71 123 4567",
  address: "1A, Mirzo Ulugbek district, Tashkent city",
  description:
    "New Uzbekistan University (NewUU) is Uzbekistan's first comprehensive research university where research and education are integrated. Located at the heart of greater Central Asia, we are building the nation's premier institution as the country embarks to conclude its first decade of political and market economy reforms.",
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  rankings: {
    national: 10,
    global: "-",
  },
  statistics: {
    students: 5000,
    internationalStudents: 800,
    faculty: 350,
    programs: 24,
    graduationRate: "85%",
    employmentRate: "92%",
  },
  facilities: ["Modern Laboratories", "Library", "Sports Complex", "Student Housing", "Cafeteria", "Computer Labs"],
  categories: ["Engineering", "Computer Science", "Business", "Humanities"],
}

export default function UniversityPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the university data based on the ID
  // const university = await getUniversity(params.id)

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-80 bg-purple-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${university.images[0]})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-end pb-8">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{university.name}</h1>
            <div className="flex items-center text-gray-200">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{university.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-white border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <UniversityOverview university={university} />
              </TabsContent>
              <TabsContent value="programs">
                <UniversityPrograms universityId={university.id} />
              </TabsContent>
              <TabsContent value="scholarships">
                <UniversityScholarships universityId={university.id} />
              </TabsContent>
              <TabsContent value="gallery">
                <UniversityGallery universityId={university.id} />
              </TabsContent>
              <TabsContent value="faqs">
                <UniversityFAQs universityId={university.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="space-y-6 sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-purple-900">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Type</p>
                        <p className="text-gray-600">{university.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Established</p>
                        <p className="text-gray-600">{university.established}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Students</p>
                        <p className="text-gray-600">{university.statistics.students.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          {university.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-purple-900">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${university.email}`} className="text-purple-600 hover:underline">
                          {university.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href={`tel:${university.phone}`} className="text-purple-600 hover:underline">
                          {university.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{university.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-purple-900 hover:bg-purple-800" size="lg">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
