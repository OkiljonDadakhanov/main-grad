"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { useCustomToast } from "@/components/custom-toast";
import { authFetch, BASE_URL } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

interface PersonalDocument {
  id: string;
  doc_type: string;
  file_name: string;
  file_url: string;
  signed_file_url?: string;
  uploaded_at: string;
  status: string;
}

interface DocumentType {
  key: string;
  name: string;
  required: boolean;
}

const DOCUMENT_TYPES: DocumentType[] = [
  { key: "passport_copy", name: "Passport Copy", required: true },
  { key: "passport_photo", name: "Passport-size Photo", required: true },
  {
    key: "medical_exam_report",
    name: "Medical Examination Report",
    required: true,
  },
  {
    key: "national_id_or_birth_certificate",
    name: "National ID Card / Birth Certificate",
    required: true,
  },
  {
    key: "apostille_birth_certificate",
    name: "Apostille Birth Certificate",
    required: false,
  },
];

export default function PersonalDocuments() {
  const { success, error } = useCustomToast();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${BASE_URL}/api/personal-documents/`);
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      const list: unknown = data.results ?? data ?? [];
      const normalized = (Array.isArray(list) ? list : []).map((item: any) => {
        const fileUrl = item.file ?? item.file_url ?? "";
        const originalName =
          item.original_file_name || // if backend ever adds it
          item.file_name ||
          (item.file &&
            item.file.includes("_") &&
            item.file.split("_").slice(1).join("_")) || // strip timestamp prefix
          decodeURIComponent(
            fileUrl.split("/").pop()?.split("?")[0] || "Uploaded Document"
          );

        // Clean up weird prefixes like "20251101084132-..." or random hashes
        const cleanedName = originalName
          .replace(/^[0-9]{12,}-/, "") // remove timestamp prefix
          .replace(/_[a-z0-9]{5,}\./, ".") // remove random hashes before extension
          .replace(/_/g, "-") // make more readable
          .trim();

        return {
          id: String(item.id),
          doc_type: item.doc_type ?? "",
          file_name: cleanedName,
          file_url: fileUrl,
          signed_file_url: item.signed_file_url ?? item.file_url ?? "",
          uploaded_at: item.uploaded_at ?? new Date().toISOString(),
          status: item.status ?? "uploaded",
        };
      });

      setDocuments(normalized);
    } catch (err) {
      console.error("Error loading documents:", err);
      error(t("documents.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (docType: string, file: File | null) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [docType]: true }));
    try {
      const formData = new FormData();
      formData.append("doc_type", docType);
      formData.append("file", file);

      const response = await authFetch(`${BASE_URL}/api/personal-documents/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        success(`${docType.replaceAll("_", " ")} ${t("documents.uploadSuccess")}`);
        await loadDocuments();
      } else {
        const errData = await response.json().catch(() => ({}));
        error(errData.error || t("documents.uploadFailed"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      error(t("documents.uploadFailed"));
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await authFetch(
        `${BASE_URL}/api/personal-documents/${id}/`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        success(t("documents.deleteSuccess"));
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      } else {
        error(t("documents.deleteFailed"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      error(t("documents.deleteFailed"));
    }
  };

  const getDocumentForType = (key: string) =>
    documents.find((doc) => doc.doc_type === key);

  const handleViewDocument = async (docId: string) => {
    setDownloading(docId);
    try {
      const response = await authFetch(`${BASE_URL}/api/personal-documents/${docId}/`);
      if (response.ok) {
        const data = await response.json();
        if (data.signed_file_url) {
          window.open(data.signed_file_url, "_blank");
        } else {
          error("Could not get document URL");
        }
      } else {
        error("Failed to get document");
      }
    } catch (err) {
      console.error("View error:", err);
      error("Failed to open document");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("documents.requiredDocuments")}</CardTitle>
          <CardDescription>
            {t("documents.requiredDocsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">{t("common.loading")}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("documents.requiredDocuments")}</CardTitle>
        <CardDescription>
          {t("documents.manageDocsDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {DOCUMENT_TYPES.map((docType) => {
          const uploaded = getDocumentForType(docType.key);
          const isUploading = uploading[docType.key];

          return (
            <div
              key={docType.key}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                uploaded ? "cursor-pointer hover:bg-purple-50" : ""
              } ${downloading === uploaded?.id ? "opacity-50" : ""}`}
              onClick={() => uploaded && handleViewDocument(uploaded.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <FileText className="h-5 w-5 text-gray-500 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {docType.name}
                    {docType.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>

                  {uploaded ? (
                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                      <p className="truncate max-w-xs">
                        {uploaded.file_name || "Uploaded document"}
                      </p>
                      <p>
                        Uploaded:{" "}
                        {new Date(uploaded.uploaded_at).toLocaleDateString()}
                      </p>
                      <p className="capitalize">Status: {uploaded.status}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">
                      {t("common.notUploaded")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {uploaded ? (
                  <>
                    {downloading === uploaded.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(uploaded.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Label
                    htmlFor={docType.key}
                    className="cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-white transition-colors ${
                        isUploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{t("common.uploading")}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>{t("common.upload")}</span>
                        </>
                      )}
                    </div>
                    <Input
                      id={docType.key}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading}
                      onChange={(e) =>
                        handleFileUpload(
                          docType.key,
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </Label>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
