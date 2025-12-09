"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function SubmitSection({ showPreview, handleCheckDocuments, handleSubmitApplication, submitting, checkingDocuments, selectedProgram }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Before submitting:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Review profile info</li>
                <li>Ensure all required documents are uploaded</li>
                <li>Check essays for clarity</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/student/browse-universities" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">Cancel</Button>
          </Link>
          {!showPreview ? (
            <Button
              onClick={handleCheckDocuments}
              disabled={submitting || checkingDocuments || !selectedProgram}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {checkingDocuments ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Checking...</> : "Check & Preview"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmitApplication}
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</> : "Submit Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
