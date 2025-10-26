"use client"

import AddEducationModal from "@/components/student-dashboard/add-education-modal"
import EditEducationModal from "@/components/student-dashboard/edit-education-modal"
import EducationItem from "@/components/student-dashboard/education-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Upload, FileText, ExternalLink } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

export interface EducationEntry {
  id: string
  student_id: number
  type: string
  institution: string
  degree: string
  fieldOfStudy: string
  country: string
  city: string
  startDate: string
  endDate: string
  graduationYear?: number
  gpa?: string
  description?: string
  extra: Record<string, unknown>
  files: unknown[]
  created_at: string
  updated_at: string
}

interface EducationFileItem {
  id: string
  file_url: string
  file_name?: string
  created_at?: string
}

export default function EducationalInformationPage() {
  const { success, error } = useCustomToast()
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEducationEntry, setEditingEducationEntry] = useState<EducationEntry | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [filesByEducationId, setFilesByEducationId] = useState<Record<string, EducationFileItem[]>>({})
  const [uploadingFor, setUploadingFor] = useState<Record<string, boolean>>({})

  const hasEntries = useMemo(() => educationEntries.length > 0, [educationEntries])

  useEffect(() => {
    void loadEducations()
  }, [])

  async function loadEducations() {
    try {
      setLoading(true)
      const response = await authFetch(`${BASE_URL}/api/educations/`)
      if (!response.ok) throw new Error("Failed to load educations")
      const list: unknown = await response.json()
      const items = Array.isArray(list) ? list : []
      const normalized: EducationEntry[] = items.map((item: any) => ({
        id: String(item.id),
        student_id: item.student_id ?? 0,
        type: item.type ?? "secondary",
        institution: item.institution_name ?? "",
        degree: item.degree ?? "",
        fieldOfStudy: item.field_of_study ?? "",
        country: item.country ?? "",
        city: item.city ?? "",
        startDate: item.start_date ?? "",
        endDate: item.end_date ?? "",
        graduationYear: item.graduation_year ?? undefined,
        gpa: item.gpa != null ? String(item.gpa) : undefined,
        description: item.description ?? "",
        extra: item.extra ?? {},
        files: item.files ?? [],
        created_at: item.created_at ?? "",
        updated_at: item.updated_at ?? "",
      }))
      setEducationEntries(normalized)
      // Load files for each education in parallel
      await Promise.all(
        normalized.map((e) => loadEducationFiles(e.id))
      )
    } catch (e) {
      error("Failed to load educational information")
    } finally {
      setLoading(false)
    }
  }

  async function loadEducationFiles(educationId: string) {
    try {
      const res = await authFetch(`${BASE_URL}/api/educations/${educationId}/files/`)
      if (!res.ok) throw new Error("Failed to load files")
      const list: unknown = await res.json()
      const items = Array.isArray(list) ? list : []
      const normalized: EducationFileItem[] = items.map((f: any) => ({
        id: String(f.id),
        file_url: f.file_url ?? f.url ?? "",
        file_name: f.file_name ?? f.name ?? undefined,
        created_at: f.created_at ?? undefined,
      }))
      setFilesByEducationId((prev) => ({ ...prev, [educationId]: normalized }))
    } catch {
      // ignore item-level errors
    }
  }

  const handleOpenEditModal = (entry: EducationEntry) => {
    setEditingEducationEntry(entry)
    setIsEditModalOpen(true)
  }

  async function handleDeleteEducation(id: string) {
    try {
      const res = await authFetch(`${BASE_URL}/api/educations/${id}/`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      success("Education deleted")
      await loadEducations()
    } catch {
      error("Failed to delete education")
    }
  }

  async function handleFileUpload(educationId: string, file: File | null) {
    if (!file) return
    try {
      setUploadingFor((prev) => ({ ...prev, [educationId]: true }))
      const form = new FormData()
      form.append("file", file)
      const res = await authFetch(`${BASE_URL}/api/educations/${educationId}/files/`, {
        method: "POST",
        body: form,
      })
      if (!res.ok) throw new Error()
      success("File uploaded")
      await loadEducationFiles(educationId)
    } catch {
      error("Failed to upload file")
    } finally {
      setUploadingFor((prev) => ({ ...prev, [educationId]: false }))
    }
  }

  async function handleDeleteFile(fileId: string, educationId: string) {
    try {
      const res = await authFetch(`${BASE_URL}/api/educations/files/${fileId}/`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      success("File deleted")
      await loadEducationFiles(educationId)
    } catch {
      error("Failed to delete file")
    }
  }

  const getDisplayName = (file: EducationFileItem) => {
    if (file.file_name) return file.file_name
    // Extract filename from URL
    try {
      const url = new URL(file.file_url)
      const pathname = url.pathname
      const filename = pathname.split('/').pop()
      return filename || 'Document'
    } catch {
      return 'Document'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Educational Information</h1>
          <p className="text-sm text-gray-500">
            Manage your academic background and upload diploma/attestat and apostille translation documents.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Education
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading educational information...</p>
          </CardContent>
        </Card>
      ) : hasEntries ? (
        <div className="space-y-4">
          {educationEntries.map((entry) => (
            <Card key={entry.id} className="border border-gray-200 shadow-sm">
              <CardContent className="pt-6 space-y-3">
                <EducationItem
                  entry={entry}
                  onDelete={handleDeleteEducation}
                  onEdit={handleOpenEditModal}
                />

                <div className="mt-4 border-t pt-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Educational Documents</h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`file-${entry.id}`} className="cursor-pointer">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${uploadingFor[entry.id] ? "bg-gray-400 text-white cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"}`}>
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">{uploadingFor[entry.id] ? "Uploading..." : "Upload File"}</span>
                      </div>
                      <Input id={`file-${entry.id}`} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" disabled={!!uploadingFor[entry.id]} onChange={(e) => handleFileUpload(entry.id, e.target.files?.[0] || null)} />
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {(filesByEducationId[entry.id] || []).length === 0 ? (
                      <p className="text-xs text-gray-400">No files uploaded.</p>
                    ) : (
                      (filesByEducationId[entry.id] || []).map((f) => (
                        <div key={f.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{getDisplayName(f)}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={() => window.open(f.file_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteFile(f.id, entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
        onCreated={async () => {
          await loadEducations()
          setIsAddModalOpen(false)
        }}
      />
      {editingEducationEntry && (
        <EditEducationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingEducationEntry(null)
          }}
          onUpdated={async () => {
            await loadEducations()
            setIsEditModalOpen(false)
            setEditingEducationEntry(null)
          }}
          educationEntry={editingEducationEntry}
        />
      )}
    </div>
  )
}