"use client"

import CertificateItem from "@/components/student-dashboard/certificate-item"
import UploadCertificateModal from "@/components/student-dashboard/upload-certificate-modal"
import EditCertificateModal from "@/components/student-dashboard/edit-certificate-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { authFetch, BASE_URL } from "@/lib/auth"
import { useCustomToast } from "@/components/custom-toast"

export interface CertificateEntry {
  id: string
  name: string
  type: string
  issueDate: string
  fileUrl?: string
  fileName?: string
  description?: string
  score?: number
  language?: string
  certificate?: string
}

export interface NewCertificateData {
  name: string
  type: string
  issueDate: string
  description?: string
  file?: File[]
  score?: number
  language?: string
  certificate?: string
}

export default function CertificatesPage() {
  const { success, error } = useCustomToast()
  const [languageCertificates, setLanguageCertificates] = useState<CertificateEntry[]>([])
  const [importantCertificates, setImportantCertificates] = useState<CertificateEntry[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<CertificateEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const allCertificates = useMemo(() => [...languageCertificates, ...importantCertificates], [languageCertificates, importantCertificates])

  useEffect(() => {
    setMounted(true)
    void loadCertificates()
  }, [])

  async function loadCertificates() {
    try {
      setLoading(true)
      await Promise.all([
        loadLanguageCertificates(),
        loadImportantCertificates()
      ])
    } catch (e) {
      error("Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }

  async function loadLanguageCertificates() {
    try {
      const response = await authFetch(`${BASE_URL}/api/certificates/language/`)
      if (!response.ok) throw new Error("Failed to load language certificates")
      const list: unknown = await response.json()
      const items = Array.isArray(list) ? list : []
      const normalized: CertificateEntry[] = items.map((item: any) => ({
        id: String(item.id),
        name: item.name || `${item.certificate || 'Language'} Certificate`,
        type: "Language Proficiency",
        issueDate: item.issue_date || "",
        fileUrl: item.file_url || item.file,
        fileName: item.file_name || item.file?.split('/').pop(),
        description: item.description || "",
        score: item.score || item.score_or_level,
        language: item.language,
        certificate: item.certificate,
      }))
      setLanguageCertificates(normalized)
    } catch (e) {
      console.error("Error loading language certificates:", e)
    }
  }

  async function loadImportantCertificates() {
    try {
      const response = await authFetch(`${BASE_URL}/api/certificates/important/`)
      if (!response.ok) throw new Error("Failed to load important certificates")
      const list: unknown = await response.json()
      const items = Array.isArray(list) ? list : []
      const normalized: CertificateEntry[] = items.map((item: any) => ({
        id: String(item.id),
        name: item.title || item.name || "Important Certificate",
        type: item.type || "Important Document",
        issueDate: item.issue_date || "",
        fileUrl: item.file_url || item.file,
        fileName: item.file_name || item.file?.split('/').pop(),
        description: item.description || "",
      }))
      setImportantCertificates(normalized)
    } catch (e) {
      console.error("Error loading important certificates:", e)
    }
  }

  const handleOpenEditModal = (certificate: CertificateEntry) => {
    setEditingCertificate(certificate)
    setIsEditModalOpen(true)
  }

  async function handleDeleteCertificate(id: string, type: 'language' | 'important') {
    try {
      const endpoint = type === 'language' 
        ? `${BASE_URL}/api/certificates/language/${id}/`
        : `${BASE_URL}/api/certificates/important/${id}/`
      
      const response = await authFetch(endpoint, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete certificate")
      
      success("Certificate deleted")
      await loadCertificates()
    } catch (e) {
      error("Failed to delete certificate")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Certificates & Documents</h1>
          <p className="text-sm text-gray-500">Manage your uploaded certificates and important documents.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Upload New Certificate
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading certificates...</p>
          </CardContent>
        </Card>
      ) : allCertificates.length > 0 ? (
        <div className="space-y-6">
          {/* Language Certificates Section */}
          {languageCertificates.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Language Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languageCertificates.map((cert) => (
                  <CertificateItem
                    key={cert.id}
                    certificate={cert}
                    onDelete={(id) => handleDeleteCertificate(id, 'language')}
                    onEdit={handleOpenEditModal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Important Certificates Section */}
          {importantCertificates.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {importantCertificates.map((cert) => (
                  <CertificateItem
                    key={cert.id}
                    certificate={cert}
                    onDelete={(id) => handleDeleteCertificate(id, 'important')}
                    onEdit={handleOpenEditModal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No certificates uploaded yet. Click "Upload New Certificate" to add one.
            </p>
          </CardContent>
        </Card>
      )}

      <UploadCertificateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={async () => {
          await loadCertificates()
          setIsAddModalOpen(false)
        }}
      />
      {editingCertificate && (
        <EditCertificateModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingCertificate(null)
          }}
          onUpdated={async () => {
            await loadCertificates()
            setIsEditModalOpen(false)
            setEditingCertificate(null)
          }}
          certificate={editingCertificate}
        />
      )}
    </div>
  )
}