
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import React from "react"

export default function ProgramSelector({ university, selectedProgram, setSelectedProgram }: any) {
  const selectedProgramObj = university?.programmes.find((p: any) => String(p.id) === selectedProgram)

  const renderDescription = (text: string) => {
    const paragraphs = text.split(/\r?\n/).filter(Boolean)
    return (
      <div className="mt-3 space-y-2 text-sm text-gray-700 leading-relaxed">
        {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Program</CardTitle>
        <CardDescription>Choose the program you want to apply for</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
          <SelectTrigger><SelectValue placeholder="Select a program" /></SelectTrigger>
          <SelectContent>
            {university.programmes.filter((p: any) => p.active).map((p: any) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name} ({p.degreeType})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProgramObj && (
          <>
            {renderDescription(selectedProgramObj.about_program)}
            {selectedProgramObj.contractPrice && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-semibold text-purple-900">Contract Price</p>
                <p className="text-lg font-bold text-purple-600">
                  ${parseFloat(selectedProgramObj.contractPrice).toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
