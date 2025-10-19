"use client";

import AddFamilyMemberModal from "@/components/student-dashboard/add-family-member-modal";
import EditFamilyMemberModal from "@/components/student-dashboard/edit-family-member-modal"; // New import
import FamilyMemberCard from "@/components/student-dashboard/family-member-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { BASE_URL, authFetch } from "@/lib/auth";

// API Response interfaces
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

// Local interface for component usage
export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  occupation?: string;
  contactNumber?: string;
  passportCopyUrl?: string;
  passportFile?: File; // Add file for upload
}

// API functions

// Transform API response to local format
const transformApiResponse = (apiMember: FamilyMemberResponse): FamilyMember => ({
  id: apiMember.id.toString(),
  fullName: apiMember.full_name,
  relationship: apiMember.relation,
  dateOfBirth: apiMember.date_of_birth,
  occupation: apiMember.occupation,
  contactNumber: apiMember.phone_number,
  passportCopyUrl: apiMember.signed_file_url || undefined,
});

// Transform local format to API request format
const transformToApiRequest = (member: Omit<FamilyMember, "id">) => ({
  full_name: member.fullName,
  relation: member.relationship,
  date_of_birth: member.dateOfBirth,
  phone_number: member.contactNumber || "",
  occupation: member.occupation || "",
});

const fetchFamilyMembers = async (): Promise<FamilyMember[]> => {
  const response = await authFetch(`${BASE_URL}/api/family/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch family members: ${response.statusText}`);
  }
  const apiMembers: FamilyMemberResponse[] = await response.json();
  return apiMembers.map(transformApiResponse);
};

const addFamilyMember = async (member: Omit<FamilyMember, "id">): Promise<FamilyMember> => {
  // Check if there's a file to upload
  if (member.passportFile) {
    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('full_name', member.fullName);
    formData.append('relation', member.relationship);
    formData.append('date_of_birth', member.dateOfBirth);
    formData.append('phone_number', member.contactNumber || '');
    formData.append('occupation', member.occupation || '');
    formData.append('file', member.passportFile);

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
    // Use JSON for requests without files
    const apiRequest = transformToApiRequest(member);
    const response = await authFetch(`${BASE_URL}/api/family/`, {
      method: "POST",
      body: JSON.stringify(apiRequest),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to add family member: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    const apiResponse: FamilyMemberResponse = await response.json();
    return transformApiResponse(apiResponse);
  }
};

export default function MyFamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load family members on component mount
  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const members = await fetchFamilyMembers();
        setFamilyMembers(members);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load family members");
        console.error("Error loading family members:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, []);

  const handleAddMember = async (newMember: Omit<FamilyMember, "id">) => {
    try {
      setError(null);
      console.log("Adding family member:", newMember);
      const addedMember = await addFamilyMember(newMember);
      console.log("Successfully added family member:", addedMember);
      setFamilyMembers((prev) => [...prev, addedMember]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add family member";
      setError(errorMessage);
      console.error("Error adding family member:", err);
    }
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleOpenEditModal = (member: FamilyMember) => {
    // New handler
    setEditingFamilyMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    // New handler
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setEditingFamilyMember(null);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              My Family Information
            </h1>
            <p className="text-sm text-gray-500">
              Manage your family members' details if required for applications.
            </p>
          </div>
        </div>
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Loading family members...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Family Information
          </h1>
          <p className="text-sm text-gray-500">
            Manage your family members' details if required for applications.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Family Member
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              {error}
            </p>
          </CardContent>
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
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No family members added yet. Click "Add Family Member" to get
              started.
            </p>
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
