"use client"

import ProgramSelector from "@/components/ProgramSelector"
import DocumentsSelector from "@/components/DocumentsSelector"
import EssaysSection from "@/components/EssaysSection"
import ProgramRequirements from "@/components/ProgramRequirements"
import ApplicationPreview from "@/components/ApplicationPreview"

interface ApplySectionsProps {
  university: any
  selectedProgram: string
  setSelectedProgram: (program: string) => void
  includeDocuments: Record<string, boolean>
  setIncludeDocuments: (docs: Record<string, boolean>) => void
  documentStatus: any
  readinessData?: any
  selectedProgramObj: any
  uploadedDocs: Record<string, File>
  handleFileUpload: (docName: string, file: File | null) => void
  missingRequirements: any[]
  showPreview: boolean
}

export default function ApplySections({
  university,
  selectedProgram,
  setSelectedProgram,
  includeDocuments,
  setIncludeDocuments,
  documentStatus,
  readinessData,
  selectedProgramObj,
  uploadedDocs,
  handleFileUpload,
  missingRequirements,
  showPreview,
}: ApplySectionsProps) {
  return (
    <>
      <ProgramSelector
        university={university}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
      />

      <DocumentsSelector
        includeDocuments={includeDocuments}
        setIncludeDocuments={setIncludeDocuments}
        documentStatus={documentStatus}
        programmeId={selectedProgram || null}
      />

      <EssaysSection
        university={university}
        readinessData={readinessData}
      />

      <ProgramRequirements
        selectedProgramObj={selectedProgramObj}
        uploadedDocs={uploadedDocs}
        handleFileUpload={handleFileUpload}
        missingRequirements={missingRequirements}
        programmeId={selectedProgram || null}
      />

      {missingRequirements.length === 0 && (
        <p className="text-green-600 font-medium">
          All required documents are already uploaded.
        </p>
      )}

      {showPreview && (
        <ApplicationPreview
          program={selectedProgramObj}
          readinessData={readinessData}
          includeDocuments={includeDocuments}
        />
      )}
    </>
  )
}
