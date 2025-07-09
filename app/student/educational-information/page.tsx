"use client"

import AddEducationModal from "@/components/student-dashboard/add-education-modal"
import EditEducationModal from "@/components/student-dashboard/edit-education-modal" // New import
import EducationItem from "@/components/student-dashboard/education-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

const mockEducationData: EducationEntry[] = [
  {
    id: "edu1",
    institution: "Tashkent University of Information Technologies",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    startDate: "2016-09-01",
    endDate: "2020-06-30",
    gpa: "3.8/4.0",
    description: "Graduated with honors, specialized in software development.",
  },
  {
    id: "edu2",
    institution: "Academic Lyceum under Westminster International University in Tashkent",
    degree: "High School Diploma",
    fieldOfStudy: "Exact Sciences",
    startDate: "2013-09-01",
    endDate: "2016-06-30",
    description: "Focused on Mathematics and Physics.",
  },
]

export default function EducationalInformationPage() {
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(mockEducationData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // New state
  const [editingEducationEntry, setEditingEducationEntry] = useState<EducationEntry | null>(null) // New state

  const handleAddEducation = (newEntry: Omit<EducationEntry, "id">) => {
    setEducationEntries((prev) => [...prev, { ...newEntry, id: `edu${Date.now()}` }]) // Use Date.now() for unique ID
  }

  const handleDeleteEducation = (id: string) => {
    setEducationEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const handleOpenEditModal = (entry: EducationEntry) => {
    // New handler
    setEditingEducationEntry(entry)
    setIsEditModalOpen(true)
  }

  const handleUpdateEducation = (updatedEntry: EducationEntry) => {
    // New handler
    setEducationEntries((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)))
    setEditingEducationEntry(null)
    setIsEditModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Educational Information</h1>
          <p className="text-sm text-gray-500">Manage your academic background and qualifications.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Education
        </Button>
      </div>

      {educationEntries.length > 0 ? (
        <div className="space-y-4">
          {educationEntries.map((entry) => (
            <EducationItem
              key={entry.id}
              entry={entry}
              onDelete={handleDeleteEducation}
              onEdit={handleOpenEditModal} // Pass edit handler
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No educational information added yet. Click "Add New Education" to get started.
            </p>
          </CardContent>
        </Card>
      )}

      <AddEducationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEducation={handleAddEducation}
      />
      {editingEducationEntry && ( // Conditionally render Edit Modal
        <EditEducationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingEducationEntry(null)
          }}
          onUpdateEducation={handleUpdateEducation}
          educationEntry={editingEducationEntry}
        />
      )}
    </div>
  )
}
