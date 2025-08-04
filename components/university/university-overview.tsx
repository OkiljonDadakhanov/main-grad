"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UniversityOverviewProps {
  university: any;
}

export function UniversityOverview({ university }: UniversityOverviewProps) {
  const campus = university.campus_information;

  const stats = {
    students: parseInt(campus?.graduates_total || "0"),
    employed: parseInt(campus?.graduates_employed || "0"),
    graduationRate:
      campus?.graduates_total && campus?.graduates_employed
        ? `${Math.round(
            (parseInt(campus.graduates_employed) /
              parseInt(campus.graduates_total)) *
              100
          )}%`
        : "N/A",
    employmentRate: "N/A",
    programs: university.programmes?.length || 0,
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {campus?.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Rankings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Korean Ranking</p>
              <p className="text-2xl font-bold text-purple-900">
                #{campus?.ranking_local || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Global Ranking</p>
              <p className="text-2xl font-bold text-purple-900">
                #{campus?.ranking_global || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Total Graduates</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.students.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Employed Graduates</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.employed.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Programs Offered</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.programs}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Graduation Rate</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.graduationRate}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Employment Rate</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.employmentRate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
