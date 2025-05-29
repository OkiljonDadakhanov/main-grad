import { FileCheck, AlertCircle } from "lucide-react"

export default function RequiredDocuments() {
  const documents = [
    {
      name: "Application Form",
      koreanName: "지원서",
      description: "The official application form provided by the university, completed in English or Korean.",
      notes: "Most universities provide online application systems.",
    },
    {
      name: "Academic Transcripts",
      koreanName: "성적증명서",
      description: "Official academic records from your high school or previous university.",
      notes: "Must be translated into Korean or English and notarized.",
    },
    {
      name: "Diploma or Certificate of Expected Graduation",
      koreanName: "졸업증명서 또는 졸업예정증명서",
      description: "Proof that you have completed or will complete your previous level of education.",
      notes: "Must be translated into Korean or English and notarized.",
    },
    {
      name: "Language Proficiency Certificate",
      koreanName: "언어능력 증명서",
      description: "TOPIK (Test of Proficiency in Korean) or English proficiency test results (TOEFL/IELTS).",
      notes: "Requirements vary by university and program.",
    },
    {
      name: "Letter of Recommendation",
      koreanName: "추천서",
      description: "1-2 letters from professors or academic advisors who know your academic abilities.",
      notes: "Should be written in English or Korean on official letterhead.",
    },
    {
      name: "Personal Statement/Study Plan",
      koreanName: "자기소개서/학업계획서",
      description: "Essay explaining your motivation, academic goals, and future plans.",
      notes: "Usually 1-2 pages, focused on your academic interests and career goals.",
    },
    {
      name: "Copy of Passport",
      koreanName: "여권 사본",
      description: "Clear copy of your passport identification page.",
      notes: "Must be valid for at least 6 months beyond your intended stay.",
    },
    {
      name: "ID Photos",
      koreanName: "증명사진",
      description: "Recent passport-sized photos (3.5cm x 4.5cm) with white background.",
      notes: "Usually 3-8 photos are required, depending on the university.",
    },
    {
      name: "Financial Statement",
      koreanName: "재정능력 증명서",
      description: "Bank statement showing sufficient funds to cover tuition and living expenses.",
      notes: "Usually requires minimum $10,000-$20,000 USD equivalent.",
    },
    {
      name: "Health Certificate/Medical Report",
      koreanName: "건강진단서",
      description: "Medical examination results including TB test for some universities.",
      notes: "Must be from an authorized hospital, usually valid for 3 months.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Required Documents</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Prepare these essential documents for your Korean university application. All documents must be either in
            Korean or English.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <FileCheck className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {doc.name} <span className="text-sm font-normal text-gray-500">({doc.koreanName})</span>
                  </h3>
                  <p className="text-gray-700 mb-3">{doc.description}</p>
                  <div className="bg-purple-50 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-purple-800">{doc.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">Document Authentication</h3>
          <p className="text-blue-700 mb-4">
            Most official documents require authentication through one of these methods:
          </p>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>
                <strong>Apostille:</strong> For countries that are part of the Hague Convention (Uzbekistan joined in
                2011)
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>
                <strong>Consular Authentication:</strong> Documents can be authenticated at the Korean Embassy in
                Tashkent
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>
                <strong>Notarization:</strong> Some documents may only require notarization by a certified notary
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
