import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InitialChip } from "@/components/ui/initial-chip";
import { MapPin, BookOpen, Award } from "lucide-react";
import type {
  University,
  ProgrammeWithUniversity,
  ScholarshipListItem,
} from "@/types/university";

type UniversityVariant = {
  variant: "university";
  data: University;
};

type ProgramVariant = {
  variant: "program";
  data: ProgrammeWithUniversity;
};

type ScholarshipVariant = {
  variant: "scholarship";
  data: ScholarshipListItem;
};

export type ResultCardProps =
  | UniversityVariant
  | ProgramVariant
  | ScholarshipVariant;

export function ResultCard(props: ResultCardProps) {
  if (props.variant === "university") return <UniversityResult uni={props.data} />;
  if (props.variant === "program") return <ProgramResult prog={props.data} />;
  return <ScholarshipResult scholarship={props.data} />;
}

function UniversityResult({ uni }: { uni: University }) {
  return (
    <Link href={`/universities/${uni.id}`} className="block h-full">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-900 dark:border-gray-800 group">
        <div className="h-32 bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center">
          {uni.logo_url ? (
            <img
              src={uni.logo_url}
              alt={uni.university_name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <InitialChip
              name={uni.university_name}
              className="w-16 h-16 text-2xl"
            />
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold line-clamp-2 text-purple-900 dark:text-purple-300">
            {uni.university_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {uni.city && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {uni.city}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {uni.types_of_schools && (
              <Badge variant="outline" className="text-xs">
                {uni.types_of_schools}
              </Badge>
            )}
            {uni.classification && (
              <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20">
                {uni.classification}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProgramResult({ prog }: { prog: ProgrammeWithUniversity }) {
  const programName = prog.programme_name ?? prog.name ?? "Untitled programme";
  const degree = prog.degree_type ?? prog.degreeType;

  return (
    <Card className="hover:shadow-lg transition-shadow h-full dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
          <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <CardTitle className="text-base font-semibold line-clamp-2">{programName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {prog.university_name && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{prog.university_name}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {degree && (
            <Badge variant="outline" className="text-xs">
              {degree}
            </Badge>
          )}
          {prog.category && (
            <Badge
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              variant="outline"
            >
              {prog.category}
            </Badge>
          )}
        </div>
        {prog.tuition_fee && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tuition: {prog.tuition_fee}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ScholarshipResult({ scholarship }: { scholarship: ScholarshipListItem }) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-2">
          <Award className="h-5 w-5 text-amber-600 dark:text-amber-300" />
        </div>
        <CardTitle className="text-base font-semibold line-clamp-2">
          {scholarship.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {scholarship.programme_name && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {scholarship.programme_name}
          </p>
        )}
        {scholarship.coverage && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {scholarship.coverage}
          </p>
        )}
        {scholarship.application_deadline && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Deadline: {scholarship.application_deadline}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
