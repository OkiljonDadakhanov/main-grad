"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EssaysSection({ university, motivation, setMotivation, whyThisUniversity, setWhyThisUniversity }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Essays</CardTitle>
        <CardDescription>Answer these questions for {university.university_name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="motivation">Why do you want to pursue this program? *</Label>
          <Textarea id="motivation" rows={5} value={motivation} onChange={(e) => setMotivation(e.target.value)} />
          <p className="text-xs text-gray-500">{motivation.length} / 1000 characters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whyUni">Why {university.university_name}? *</Label>
          <Textarea id="whyUni" rows={5} value={whyThisUniversity} onChange={(e) => setWhyThisUniversity(e.target.value)} />
          <p className="text-xs text-gray-500">{whyThisUniversity.length} / 1000 characters</p>
        </div>
      </CardContent>
    </Card>
  )
}
