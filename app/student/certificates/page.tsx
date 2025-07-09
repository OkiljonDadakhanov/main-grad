"use client";

import CertificateItem from "@/components/student-dashboard/certificate-item";
import UploadCertificateModal from "@/components/student-dashboard/upload-certificate-modal";
import EditCertificateModal from "@/components/student-dashboard/edit-certificate-modal"; // New import
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export interface CertificateEntry {
  id: string;
  name: string;
  type: string; // e.g., Language Proficiency, Academic Transcript, Award
  issueDate: string;
  fileUrl?: string; // Placeholder for actual file URL
  fileName?: string;
  description?: string;
}

const mockCertificates: CertificateEntry[] = [
  {
    id: "cert1",
    name: "TOPIK Level 5",
    type: "Language Proficiency (TOPIK, IELTS, TOEFL)",
    issueDate: "2023-11-15",
    fileName: "topik_level_5.pdf",
    description: "Test of Proficiency in Korean, achieved Level 5.",
  },
  {
    id: "cert2",
    name: "Bachelor's Degree Transcript",
    type: "Academic Transcript (School, College, University)",
    issueDate: "2020-06-30",
    fileName: "bachelors_transcript.pdf",
  },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] =
    useState<CertificateEntry[]>(mockCertificates);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state
  const [editingCertificate, setEditingCertificate] =
    useState<CertificateEntry | null>(null); // New state

  const handleAddCertificate = (
    newCertData: Omit<CertificateEntry, "id" | "fileUrl" | "fileName"> & {
      file?: FileList;
    }
  ) => {
    const newCert: CertificateEntry = {
      ...newCertData,
      id: `cert${Date.now()}`,
      fileName: newCertData.file?.[0]?.name,
      // fileUrl would be set after actual upload in a real app
    };
    setCertificates((prev) => [...prev, newCert]);
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((cert) => cert.id !== id));
  };

  const handleOpenEditModal = (certificate: CertificateEntry) => {
    // New handler
    setEditingCertificate(certificate);
    setIsEditModalOpen(true);
  };

  const handleUpdateCertificate = (updatedCertificate: CertificateEntry) => {
    // New handler
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === updatedCertificate.id ? updatedCertificate : cert
      )
    );
    setEditingCertificate(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Certificates & Documents
          </h1>
          <p className="text-sm text-gray-500">
            Manage your uploaded certificates and important documents.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Upload New Certificate
        </Button>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateItem
              key={cert.id}
              certificate={cert}
              onDelete={handleDeleteCertificate}
              onEdit={handleOpenEditModal} // Pass edit handler
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No certificates uploaded yet. Click "Upload New Certificate" to
              add one.
            </p>
          </CardContent>
        </Card>
      )}

      <UploadCertificateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCertificate={handleAddCertificate}
      />
      {editingCertificate && (
        <EditCertificateModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCertificate(null);
          }}
          onUpdateCertificate={handleUpdateCertificate}
          certificate={editingCertificate}
        />
      )}
    </div>
  );
}
