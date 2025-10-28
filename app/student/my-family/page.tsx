"use client";

import AddFamilyMemberModal from "@/components/student-dashboard/add-family-member-modal";
import EditFamilyMemberModal from "@/components/student-dashboard/edit-family-member-modal";
import FamilyMemberCard from "@/components/student-dashboard/family-member-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { BASE_URL, authFetch } from "@/lib/auth";
import { useCustomToast } from "@/components/custom-toast";

export interface FamilyMemberResponse {
  id: number;
  student_id: number;
  full_name: string;
  relation: string;
  date_of_birth: string;
  phone_number: string;
  occupation: string;
  signed_file_url: string | null;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  occupation?: string;
  contactNumber?: string;
  passportCopyUrl?: string;
  passportFile?: File;
}

const transformApiResponse = (apiMember: FamilyMemberResponse): FamilyMember => ({
  id: apiMember.id.toString(),
  fullName: apiMember.full_name,
  relationship: apiMember.relation,
  dateOfBirth: apiMember.date_of_birth,
  occupation: apiMember.occupation,
  contactNumber: apiMember.phone_number,
  passportCopyUrl: apiMember.signed_file_url || undefined,
});

const transformToApiRequest = (member: Omit<FamilyMember, "id">) => ({
  full_name: member.fullName,
  relation: member.relationship,
  date_of_birth: member.dateOfBirth,
  phone_number: member.contactNumber || "",
  occupation: member.occupation || "",
});

// 🧭 API calls
const fetchFamilyMembers = async (): Promise<FamilyMember[]> => {
  const response = await authFetch(`${BASE_URL}/api/family/`);
  if (!response.ok) throw new Error(`Failed to fetch family members: ${response.statusText}`);
  const apiMembers: FamilyMemberResponse[] = await response.json();
  return apiMembers.map(transformApiResponse);
};

const addFamilyMember = async (member: Omit<FamilyMember, "id">): Promise<FamilyMember> => {
  if (member.passportFile) {
    const formData = new FormData();
    formData.append("full_name", member.fullName);
    formData.append("relation", member.relationship);
    formData.append("date_of_birth", member.dateOfBirth);
    formData.append("phone_number", member.contactNumber || "");
    formData.append("occupation", member.occupation || "");
    formData.append("passport_copy", member.passportFile);

    const response = await authFetch(`${BASE_URL}/api/family/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to add family member: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    const apiResponse: FamilyMemberResponse = await response.json();
    return transformApiResponse(apiResponse);
  } else {
    const apiRequest = transformToApiRequest(member);
    const response = await authFetch(`${BASE_URL}/api/family/`, {
      method: "POST",
      body: JSON.stringify(apiRequest),
    });
    if (!response.ok) throw new Error(`Failed to add family member`);
    const apiResponse: FamilyMemberResponse = await response.json();
    return transformApiResponse(apiResponse);
  }
};

const updateFamilyMember = async (member: FamilyMember): Promise<FamilyMember> => {
  const token = localStorage.getItem("access_token");

  if (member.passportFile) {
    const formData = new FormData();
    formData.append("full_name", member.fullName);
    formData.append("relation", member.relationship);
    formData.append("date_of_birth", member.dateOfBirth);
    formData.append("phone_number", member.contactNumber || "");
    formData.append("occupation", member.occupation || "");
    formData.append("passport_copy", member.passportFile);

    const response = await fetch(`${BASE_URL}/api/family/${member.id}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update family member: ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const apiResponse: FamilyMemberResponse = await response.json();
    return transformApiResponse(apiResponse);
  } else {
    const apiRequest = transformToApiRequest(member);
    const response = await fetch(`${BASE_URL}/api/family/${member.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequest),
    });

    if (!response.ok) throw new Error("Failed to update family member");
    const apiResponse: FamilyMemberResponse = await response.json();
    return transformApiResponse(apiResponse);
  }
};

// ✅ NEW: DELETE function
const deleteFamilyMember = async (id: string): Promise<void> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${BASE_URL}/api/family/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to delete family member: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }
};

// 🧱 Component
export default function MyFamilyPage() {
  const { success, error: errorToast, warning } = useCustomToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const members = await fetchFamilyMembers();
        setFamilyMembers(members);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load family members";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadFamilyMembers();
  }, []);

  const handleAddMember = async (newMember: Omit<FamilyMember, "id">) => {
    try {
      setError(null);
      const addedMember = await addFamilyMember(newMember);
      setFamilyMembers((prev) => [...prev, addedMember]);
      success("Family member added successfully");
      setIsAddModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add family member";
      setError(errorMessage);
      errorToast(errorMessage);
    }
  };

  // ✅ Updated Delete Handler
  const handleDeleteMember = async (id: string) => {
    const member = familyMembers.find(m => m.id === id);
    try {
      await deleteFamilyMember(id);
      setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
      success(`Family member ${member?.fullName || ""} deleted successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete family member";
      errorToast(errorMessage);
    }
  };

  const handleOpenEditModal = (member: FamilyMember) => {
    setEditingFamilyMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (updatedMember: FamilyMember) => {
    try {
      const saved = await updateFamilyMember(updatedMember);
      setFamilyMembers((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
      setIsEditModalOpen(false);
      setEditingFamilyMember(null);
      success("Family member updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update family member";
      errorToast(errorMessage);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500">
        Loading family members...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Family Information</h1>
          <p className="text-sm text-gray-500">Manage your family members' details if required for applications.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Family Member
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center text-red-600">{error}</CardContent>
        </Card>
      )}

      {familyMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyMembers.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              onDelete={handleDeleteMember}
              onEdit={handleOpenEditModal}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No family members added yet. Click "Add Family Member" to get started.
          </CardContent>
        </Card>
      )}

      <AddFamilyMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMember={handleAddMember}
      />

      {editingFamilyMember && (
        <EditFamilyMemberModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFamilyMember(null);
          }}
          onUpdateMember={handleUpdateMember}
          member={editingFamilyMember}
        />
      )}
    </div>
  );
}
