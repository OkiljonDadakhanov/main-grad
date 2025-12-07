"use client"

import ProgramSelector from "@/components/ProgramSelector"
import DocumentsSelector from "@/components/DocumentsSelector"
import EssaysSection from "@/components/EssaysSection"
import ProgramRequirements from "@/components/ProgramRequirements"
import ApplicationPreview from "@/components/ApplicationPreview"

export default function ApplySections({
  university,
  selectedProgram,
  setSelectedProgram,
  includeDocuments,
  setIncludeDocuments,
  documentStatus,
  motivation,
  setMotivation,
  whyThisUniversity,
  setWhyThisUniversity,
  selectedProgramObj,
  uploadedDocs,
  handleFileUpload,
  missingRequirements,
  showPreview,
}: any) {
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
        motivation={motivation}
        setMotivation={setMotivation}
        whyThisUniversity={whyThisUniversity}
        setWhyThisUniversity={setWhyThisUniversity}
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
          ✅ All required documents are already uploaded.
        </p>
      )}

      {showPreview && (
        <ApplicationPreview
          program={selectedProgramObj}
          motivation={motivation}
          whyThisUniversity={whyThisUniversity}
          includeDocuments={includeDocuments}
        />
      )}
    </>
  )
}
