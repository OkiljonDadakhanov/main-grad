"use client";

import AddFamilyMemberModal from "@/components/student-dashboard/add-family-member-modal";
import EditFamilyMemberModal from "@/components/student-dashboard/edit-family-member-modal"; // New import
import FamilyMemberCard from "@/components/student-dashboard/family-member-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  occupation?: string;
  contactNumber?: string;
}

const mockFamilyData: FamilyMember[] = [
  {
    id: "fam1",
    fullName: "Akbar Shukurulloyev",
    relationship: "Father",
    dateOfBirth: "1970-01-20",
    occupation: "Engineer",
    contactNumber: "+998901112233",
  },
  {
    id: "fam2",
    fullName: "Dilfuza Shukurulloyeva",
    relationship: "Mother",
    dateOfBirth: "1975-07-10",
    occupation: "Teacher",
    contactNumber: "+998904445566",
  },
];

export default function MyFamilyPage() {
  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>(mockFamilyData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state
  const [editingFamilyMember, setEditingFamilyMember] =
    useState<FamilyMember | null>(null); // New state

  const handleAddMember = (newMember: Omit<FamilyMember, "id">) => {
    setFamilyMembers((prev) => [
      ...prev,
      { ...newMember, id: `fam${Date.now()}` },
    ]);
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

      {familyMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyMembers.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              onDelete={handleDeleteMember}
              onEdit={handleOpenEditModal} // Pass edit handler
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
