"use client"

// EssaysSection is now deprecated - all program requirements including motivation letters
// are handled by ProgramRequirements component

interface EssaysSectionProps {
  university?: any
  readinessData?: any
  uploadedMotivationLetter?: File | null
  onMotivationLetterChange?: (file: File | null) => void
}

export default function EssaysSection(_props: EssaysSectionProps) {
  // All program requirements (including motivation letter) are now shown in ProgramRequirements
  return null
}
