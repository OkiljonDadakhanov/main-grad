export interface AcademicProgram {
  id: number;
  name: string;
  field_of_study: string;
  degreeType: string;
  about_program: string;
  contractPrice: string;
  platformApplicationFee: string;
  start_date: string;
  end_date: string;
  results_announcement_date?: string;
  requirements: {
    id: number;
    requirementType: string;
    label: string;
    required: boolean;
    note?: string | null;
  }[];
  // etc.
}

export type AcademicProgramFormData = Omit<AcademicProgram, "id">;

export const CATEGORIES = [
  "Languages",
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Arts",
  "Social Sciences",
  "Natural Sciences",
  "Mathematics",
];

export const DEGREE_TYPES = [
  "Bachelor",
  "Master",
  "PhD",
  "Certificate",
  "Diploma",
];

export const DOCUMENT_TYPES = [
  "Passport",
  "Diploma",
  "Transcript",
  "CV",
  "Motivation Letter",
  "Recommendation Letter",
  "Language Certificate",
  "Medical Certificate",
];
